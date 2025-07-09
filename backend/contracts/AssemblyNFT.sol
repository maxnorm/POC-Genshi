// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

import {ERC998TopDown} from "./cNFT/ERC998TopDown.sol";
import {Documents} from "./extensions/Documents.sol";
import {Attributes} from "./extensions/Attributes.sol";

contract AssemblyNFT is ERC998TopDown, Documents, Attributes {
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