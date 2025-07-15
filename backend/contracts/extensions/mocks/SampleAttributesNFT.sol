// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../Attributes.sol";

contract SampleAttributesNFT is ERC721, Attributes {
    uint256 private _count;

    constructor() ERC721("SampleAttributesNFT", "SATTR") {}

    function mint() public returns (uint256) {
        _count++;
        _safeMint(msg.sender, _count);
        return _count;
    }

    function setAttribute(uint256 tokenId, string memory key, string memory value) public {
        _setAttribute(tokenId, key, value);
    }

    function updateAttribute(uint256 tokenId, string memory key, string memory value) public {
        _updateAttribute(tokenId, key, value);
    }

    function validateAttribute(uint256 tokenId, string memory key) public {
        _validateAttribute(tokenId, key);
    }
}