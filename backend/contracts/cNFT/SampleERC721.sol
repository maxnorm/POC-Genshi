// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract SampleERC721 is ERC721 {
    uint256 private _tokenIds;

    constructor() ERC721("SampleERC721", "S-ERC721") {}

    function mint(address to) external returns (uint256) {
        _tokenIds++;
        _mint(to, _tokenIds);
        return _tokenIds;
    }
}