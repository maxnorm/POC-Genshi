// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {ERC998TopDown} from "../ERC998TopDown.sol";

contract SampleERC998 is ERC998TopDown {
    uint256 private _count;

    constructor() ERC998TopDown("SampleERC998", "S-ERC998") {}

    function mint(address to) external returns (uint256) {
        _count++;
        _mint(to, _count);
        return _count;
    }
}