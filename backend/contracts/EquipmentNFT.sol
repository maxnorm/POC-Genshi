// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {ERC998TopDown} from "./cNFT/ERC998TopDown.sol";

contract AssemblyNFT is ERC998TopDown {
    uint256 private _count;

    event MintedEquipment(address indexed to, uint256 indexed tokenId);

    constructor() ERC998TopDown("EquipmentNFT", "EQUIPMENT") {}

    function mint(address to) public {
        _count++;
        uint256 tokenId = _count;
        _mint(to, tokenId);
        emit MintedEquipment(to, tokenId);
    }
}