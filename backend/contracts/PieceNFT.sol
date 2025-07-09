// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;


import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Documents} from "./extensions/Documents.sol";
import {Attributes} from "./extensions/Attributes.sol";

contract PieceNFT is ERC721, Documents, Attributes {
  uint256 private _count;

  event MintedPiece(address indexed to, uint256 indexed tokenId);

  constructor() ERC721("PieceNFT", "PIECE") {}

  function mint(address to) public {
    _count++;
    uint256 tokenId = _count;
    _mint(to, tokenId);
    emit MintedPiece(to, tokenId);
  }
}
