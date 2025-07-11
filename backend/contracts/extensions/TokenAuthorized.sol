// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

import {Access_NotAuthorizedForTokenID} from "../access/AccessErrors.sol";

/// @title TokenAuthorized
/// @notice This contract is used to validate that a token is authorized to be used with the parent contract
/// @dev This contract is used to validate that a token is authorized to be used with the parent contract
abstract contract TokenAuthorized {
  /// @notice Modifier that checks if the caller is authorized for the token
  /// @param tokenId The id of the token to check
  /// @dev Reverts if the caller is not authorized for the token
  modifier onlyTokenAuthorized(uint256 tokenId) {
    require(_isTokenAuthorized(tokenId, msg.sender), Access_NotAuthorizedForTokenID(tokenId, msg.sender));
    _;
  }

  /// @notice Virtual function to be implemented by specific NFT contracts
  /// @notice This function is used to check if the actor is authorized for a specific tokenID
  /// @param tokenId The id of the token to check
  /// @param actor The address of the actor to check
  function _isTokenAuthorized(uint256 tokenId, address actor) internal view virtual returns (bool);
}