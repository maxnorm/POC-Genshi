// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract PieceNFT is ERC721, Ownable {
    uint256 private _count;
    mapping(uint256 => bytes) public pieceTypes;

    event MintedPiece(address indexed to, uint256 tokenId);

    constructor() ERC721("PieceNFT", "PIECE") Ownable(msg.sender) {}

    function mint(address _to, bytes calldata _pieceType) public {
        _count++;
        uint256 tokenId = _count;
        _mint(_to, tokenId);
        pieceTypes[tokenId] = _pieceType;
        emit MintedPiece(_to, tokenId);
    }
}
