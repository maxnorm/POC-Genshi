// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {AccessManaged} from "../AccessManaged.sol";

contract SampleERC721AccessManaged is ERC721, AccessManaged {
    uint256 private _count;

    constructor(address _accessManager) ERC721("Sample-AccessManaged", "S-AM") AccessManaged(_accessManager) {}

    function mint(address to) external onlyRole(accessManager.PIECE_MINTER()) returns (uint256) {
        _count++;
        _mint(to, _count);
        return _count;
    }
}