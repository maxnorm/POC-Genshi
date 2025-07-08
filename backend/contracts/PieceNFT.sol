// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;


import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract PieceNFT is ERC721, Ownable {
    uint256 private _count;
    mapping(uint256 => bytes) public pieceTypes;

    event MintedPiece(address indexed to, uint256 tokenId);

    constructor() ERC721("PieceNFT", "PIECE") Ownable(msg.sender) {}

    function mint(address to, bytes calldata pieceType_) public {
        _count++;
        uint256 tokenId = _count;
        _mint(to, tokenId);
        pieceTypes[tokenId] = pieceType_;
        emit MintedPiece(to, tokenId);
    }
}
