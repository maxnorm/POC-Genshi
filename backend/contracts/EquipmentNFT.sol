// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

import {ERC998TopDown} from "./cNFT/ERC998TopDown.sol";
import {Documents} from "./extensions/Documents.sol";
import {Attributes} from "./extensions/Attributes.sol";
import {ITemplateRegistry} from "./templates/ITemplateRegistry.sol";
import {ITemplate} from "./templates/ITemplate.sol";
import "./templates/TemplateErrors.sol";
import {AccessManaged} from "./access/AccessManaged.sol";
import {ChildContractValidator} from "./extensions/ChildValidator.sol";
import {TokenAuthorized} from "./extensions/TokenAuthorized.sol";
import {Access_NotAuthorized} from "./access/AccessErrors.sol";
import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract EquipmentNFT is ERC998TopDown, Documents, Attributes, AccessManaged, ChildContractValidator, TokenAuthorized {
  ITemplateRegistry private immutable _templateRegistry;
  uint256 private _count;

  mapping(uint256 => ITemplate.TemplateView) private _templates;

  event MintedEquipment(address indexed to, uint256 indexed tokenId);

  constructor(address templateRegistry, address accessManager, address[] memory allowedChildrenContracts) 
    ERC998TopDown("EquipmentNFT", "EQUIPMENT") 
    AccessManaged(accessManager)
    ChildContractValidator(allowedChildrenContracts)
  {
    _templateRegistry = ITemplateRegistry(templateRegistry);
  }

  /// @notice Mints a new piece
  /// @param to The address of the user to mint the piece to
  /// @param templateId The id of the template to mint the piece from
  function mint(address to, uint256 templateId) external override
    onlyRole(accessManager.EQUIPMENT_MINTER())
    returns (uint256)
  {
    ITemplate.TemplateView memory template = _templateRegistry.getTemplate(templateId);
    require(template.nftContract == address(this), Template_InvalidTemplateForNFT(templateId));
    require(template.status == ITemplate.TemplateStatus.ACTIVE, Template_InvalidTemplateStatus(template.id, ITemplate.TemplateStatus.ACTIVE));

    _count++;
    uint256 tokenId = _count;
    _mint(to, tokenId);
    _templates[tokenId] = template;

    emit MintedEquipment(to, tokenId);
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
      accessManager.hasRole(accessManager.EQUIPMENT_DOCUMENT_MANAGER(), msg.sender) ||
      accessManager.hasRole(accessManager.EQUIPMENT_MANAGER(), msg.sender),
      Access_NotAuthorized(accessManager.EQUIPMENT_DOCUMENT_MANAGER())
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
      accessManager.hasRole(accessManager.EQUIPMENT_DOCUMENT_MANAGER(), msg.sender) ||
      accessManager.hasRole(accessManager.EQUIPMENT_MANAGER(), msg.sender),
      Access_NotAuthorized(accessManager.EQUIPMENT_DOCUMENT_MANAGER())
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
      accessManager.hasRole(accessManager.EQUIPMENT_DOCUMENT_MANAGER(), msg.sender) ||
      accessManager.hasRole(accessManager.EQUIPMENT_MANAGER(), msg.sender),
      Access_NotAuthorized(accessManager.EQUIPMENT_DOCUMENT_MANAGER())
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
      accessManager.hasRole(accessManager.EQUIPMENT_DOCUMENT_MANAGER(), msg.sender) ||
      accessManager.hasRole(accessManager.EQUIPMENT_MANAGER(), msg.sender),
      Access_NotAuthorized(accessManager.EQUIPMENT_DOCUMENT_MANAGER())
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

    address rootOwner = bytes32ToAddress(rootOwnerOf(tokenId));
    return rootOwner == actor ||
      getApproved(tokenId) == actor ||
      isApprovedForAll(rootOwner, actor);
  }

  /// @notice Receives a child token from another contract
  /// @notice Overrides the onERC721Received to validate the NFT Contract
  /// @param operator The operator of the child token
  /// @param from The address that sent the child token
  /// @param tokenId The token ID of the parent token
  /// @param data The data of the child token
  /// @dev This function is used to receive a child token from another contract
  function onERC721Received(address operator, address from, uint256 tokenId, bytes calldata data) 
    external override(ERC998TopDown)
    returns (bytes4)
  {
    _validateChild(msg.sender);
    uint256 parentTokenId = abi.decode(data, (uint256));
    _requireOwned(parentTokenId);
    _receiveChild(from, parentTokenId, msg.sender, tokenId);

    return IERC721Receiver.onERC721Received.selector;
  }
}