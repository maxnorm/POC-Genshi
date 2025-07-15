// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {AccessManaged} from "./access/AccessManaged.sol";
import {Documents} from "./extensions/Documents.sol";
import {Attributes} from "./extensions/Attributes.sol";
import {ITemplateRegistry} from "./templates/ITemplateRegistry.sol";
import {ITemplate} from "./templates/ITemplate.sol";
import {Template_InvalidTemplateForNFT, Template_InvalidTemplateStatus} from "./templates/TemplateErrors.sol";
import {TokenAuthorized} from "./extensions/TokenAuthorized.sol";
import {Access_NotAuthorized} from "./access/AccessErrors.sol";

contract PieceNFT is ERC721, Documents, Attributes, AccessManaged, TokenAuthorized {
  ITemplateRegistry private immutable _templateRegistry;
  uint256 private _count;

  mapping(uint256 => ITemplate.TemplateView) private _templates;

  event MintedPiece(address indexed to, uint256 indexed tokenId);

  constructor(address templateRegistry, address accessManager) 
    ERC721("PieceNFT", "PIECE") 
    AccessManaged(accessManager)
  {
    _templateRegistry = ITemplateRegistry(templateRegistry);
  }

  /// @notice Mints a new piece
  /// @param to The address of the user to mint the piece to
  /// @param templateId The id of the template to mint the piece from
  function mint(address to, uint256 templateId) external
    onlyRole(accessManager.PIECE_MINTER())
    returns (uint256) 
  {
    ITemplate.TemplateView memory template = _templateRegistry.getTemplate(templateId);
    require(template.nftContract == address(this), Template_InvalidTemplateForNFT(templateId));
    require(template.status == ITemplate.TemplateStatus.ACTIVE, Template_InvalidTemplateStatus(template.id, ITemplate.TemplateStatus.ACTIVE));

    _count++;
    uint256 tokenId = _count;
    _mint(to, tokenId);
    _templates[tokenId] = template;

    emit MintedPiece(to, tokenId);
    return tokenId;
  }

  /// @notice Sets an attribute
  /// @param tokenId The id of the token to set the attribute of
  /// @param key The key of the attribute to set
  /// @param value The value of the attribute to set
  function setAttribute(uint256 tokenId, string memory key, string memory value) public 
    onlyTokenAuthorized(tokenId)
  {
    require(
      accessManager.hasRole(accessManager.PIECE_DOCUMENT_MANAGER(), msg.sender) ||
      accessManager.hasRole(accessManager.PIECE_MANAGER(), msg.sender),
      Access_NotAuthorized(accessManager.PIECE_DOCUMENT_MANAGER())
    );

    _templateRegistry.validateAttribute(_templates[tokenId].id, key, value);
    _setAttribute(tokenId, key, value);
  }

  /// @notice Updates an attribute
  /// @param tokenId The id of the token to update the attribute of
  /// @param key The key of the attribute to update
  /// @param value The value of the attribute to update
  function updateAttribute(uint256 tokenId, string memory key, string memory value) public 
    onlyTokenAuthorized(tokenId)
  {
    require(
      accessManager.hasRole(accessManager.PIECE_DOCUMENT_MANAGER(), msg.sender) ||
      accessManager.hasRole(accessManager.PIECE_MANAGER(), msg.sender),
      Access_NotAuthorized(accessManager.PIECE_DOCUMENT_MANAGER())
    );
    _templateRegistry.validateAttribute(_templates[tokenId].id, key, value);
    _updateAttribute(tokenId, key, value);
  }

  /// @notice Sets a document
  /// @param tokenId The id of the token to set the document of
  /// @param name The name of the document
  /// @param description The description of the document
  /// @param uri The uri of the document
  /// @param hash The hash of the document
  /// @param mimeType The mime type of the document
  function setDocument(uint256 tokenId, string memory name, string memory description, string memory uri, string memory hash, string memory mimeType) public 
    onlyTokenAuthorized(tokenId)
  {
    require(
      accessManager.hasRole(accessManager.PIECE_DOCUMENT_MANAGER(), msg.sender) ||
      accessManager.hasRole(accessManager.PIECE_MANAGER(), msg.sender),
      Access_NotAuthorized(accessManager.PIECE_DOCUMENT_MANAGER())
    );
    _templateRegistry.validateDocument(_templates[tokenId].id, name, mimeType);
    _setDocument(tokenId, name, description, uri, hash, mimeType);
  }

  /// @notice Updates a document
  /// @param tokenId The id of the token to update the document of
  /// @param name The name of the document
  /// @param description The description of the document
  /// @param uri The uri of the document
  /// @param hash The hash of the document
  /// @param mimeType The mime type of the document
  function updateDocument(uint256 tokenId, uint256 docId, string memory name, string memory description, string memory uri, string memory hash, string memory mimeType) public 
    onlyTokenAuthorized(tokenId)
  { 
    require(
      accessManager.hasRole(accessManager.PIECE_DOCUMENT_MANAGER(), msg.sender) ||
      accessManager.hasRole(accessManager.PIECE_MANAGER(), msg.sender),
      Access_NotAuthorized(accessManager.PIECE_DOCUMENT_MANAGER())
    );
    _templateRegistry.validateDocument(_templates[tokenId].id, name, mimeType);
    _updateDocument(tokenId, docId, name, description, uri, hash, mimeType);
  }

  /// @notice Checks if the actor is authorized for the token
  /// @param tokenId The id of the token to check
  /// @param actor The address of the actor to check
  /// @dev This function is used to check if the actor is authorized for the token
  function _isTokenAuthorized(uint256 tokenId, address actor) internal view override returns (bool) {
    _requireOwned(tokenId);
    
    address owner = ownerOf(tokenId);
    return owner == actor || getApproved(tokenId) == actor || isApprovedForAll(owner, actor);
  }
}
