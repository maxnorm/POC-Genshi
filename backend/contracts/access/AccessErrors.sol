// contracts/errors/GenshiErrors.sol
// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

error Access_ManagerAddressCannotBeZero();
error Access_NotAuthorized(bytes32 role);
error Access_InvalidRoleCombination(address account, bytes32 role);
error Access_NotAuthorizedForTokenID(uint256 tokenId, address actor);

error Access_DefaultAdminCannotBeGranted();