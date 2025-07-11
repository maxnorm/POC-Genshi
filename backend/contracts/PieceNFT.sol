// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;


import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Documents} from "./extensions/Documents.sol";
import {Attributes} from "./extensions/Attributes.sol";
import {ITemplateRegistry} from "./templates/ITemplateRegistry.sol";
import {ITemplate} from "./templates/ITemplate.sol";
import "./templates/TemplateErrors.sol";

contract PieceNFT is ERC721, Documents, Attributes {
  ITemplateRegistry private immutable _templateRegistry;
  uint256 private _count;

  mapping(uint256 => ITemplate.TemplateView) private _templates;

  event MintedPiece(address indexed to, uint256 indexed tokenId);

  constructor(address templateRegistry) ERC721("PieceNFT", "PIECE") {
    _templateRegistry = ITemplateRegistry(templateRegistry);
  }

  /// @notice Mints a new piece
  /// @param to The address of the user to mint the piece to
  /// @param templateId The id of the template to mint the piece from
  function mint(address to, uint256 templateId) public {
    ITemplate.TemplateView memory template = _templateRegistry.getTemplate(templateId);
    require(template.nftContract == address(this), Template_InvalidTemplateForNFT(templateId));
    require(template.status == ITemplate.TemplateStatus.ACTIVE, Template_InvalidTemplateStatus(template.id, template.status));

    _count++;
    uint256 tokenId = _count;
    _mint(to, tokenId);
    _templates[tokenId] = template;

    emit MintedPiece(to, tokenId);
  }

  /// @notice Sets an attribute
  /// @param tokenId The id of the token to set the attribute of
  /// @param key The key of the attribute to set
  /// @param value The value of the attribute to set
  function setAttribute(uint256 tokenId, string memory key, string memory value) public {
    _templateRegistry.validateAttribute(_templates[tokenId].id, key, value);
    _setAttribute(tokenId, key, value);
  }

  /// @notice Updates an attribute
  /// @param tokenId The id of the token to update the attribute of
  /// @param key The key of the attribute to update
  /// @param value The value of the attribute to update
  function updateAttribute(uint256 tokenId, string memory key, string memory value) public {
    _templateRegistry.validateAttribute(_templates[tokenId].id, key, value);
    _updateAttribute(tokenId, key, value);
  }
}
