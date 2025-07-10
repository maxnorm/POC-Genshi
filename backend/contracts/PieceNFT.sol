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

  mapping(uint256 => uint256) private _templateIds;

  event MintedPiece(address indexed to, uint256 indexed tokenId);

  constructor(address templateRegistry) ERC721("PieceNFT", "PIECE") {
    _templateRegistry = ITemplateRegistry(templateRegistry);
  }

  function mint(address to, uint256 templateId) public {
    ITemplate.Template memory template = _templateRegistry.getTemplate(templateId);
    require(template.nftContract == address(this), "Invalid template for this NFT");
    require(template.active, "Template is not active");

    _count++;
    uint256 tokenId = _count;
    _mint(to, tokenId);
    _templateIds[tokenId] = templateId;
    emit MintedPiece(to, tokenId);
  }
}
