// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC998TopDown} from "./cNFT/ERC998TopDown.sol";

contract AssemblyNFT is ERC998TopDown {
    uint256 private _count;

    event MintedAssembly(address indexed to, uint256 indexed tokenId);

    constructor() ERC998TopDown("AssemblyNFT", "ASSEMBLY") {}

    function mint(address to) public {
        _count++;
        uint256 tokenId = _count;
        _mint(to, tokenId);
        emit MintedAssembly(to, tokenId);
    }
}