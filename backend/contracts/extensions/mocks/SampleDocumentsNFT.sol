// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../Documents.sol";

contract SampleDocumentsNFT is ERC721, Documents {
    uint256 private _count;

    constructor() ERC721("SampleDocumentsNFT", "SDOC") {}

    function mint() public returns (uint256) {
        _count++;
        _safeMint(msg.sender, _count);
        return _count;
    }

        function setDocument(
        uint256 tokenId,
        string memory name,
        string memory description,
        string memory uri,
        string memory hash,
        string memory mimeType
    ) public {
        _setDocument(tokenId, name, description, uri, hash, mimeType);
    }

    function updateDocument(
        uint256 tokenId,
        uint256 docId,
        string memory name,
        string memory description,
        string memory uri,
        string memory hash,
        string memory mimeType
    ) public {
        _updateDocument(tokenId, docId, name, description, uri, hash, mimeType);
    }

    function validateDocument(uint256 tokenId, uint256 docId) public {
        _validateDocument(tokenId, docId);
    }
}