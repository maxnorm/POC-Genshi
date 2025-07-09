// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

import {AccessManager} from "./AccessManager.sol";
import "./AccessErrors.sol";

/// @title AccessManaged
/// @notice Abstract contract that provides access management functionality
/// @dev This contract is intended to be inherited by other contracts that need access management
abstract contract AccessManaged {
  AccessManager internal immutable accessManager;

  /// @notice Constructor that sets the access manager address
  /// @param _accessManager The address of the access manager contract
  constructor(address _accessManager) {
    if (_accessManager == address(0)) revert Access_ManagerAddressCannotBeZero();
    accessManager = AccessManager(_accessManager);
  }

  /// @notice Modifier that checks if the caller has the specified role
  /// @param role The role to check for
  /// @dev Reverts if the caller does not have the specified role
  modifier onlyRole(bytes32 role) {
    if(!accessManager.hasRole(role, msg.sender)) revert Access_NotAuthorized(role);
    _;
  }
}