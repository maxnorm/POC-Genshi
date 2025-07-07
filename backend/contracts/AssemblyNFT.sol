// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC998TopDown} from "./cNFT/ERC998TopDown.sol";

contract AssemblyNFT is ERC998TopDown {
    uint256 private _count;

    constructor() ERC998TopDown("AssemblyNFT", "ASSEMBLY") {
        // constructor
    }

    
}