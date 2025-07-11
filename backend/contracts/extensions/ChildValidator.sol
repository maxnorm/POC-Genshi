// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

error ChildContractNotAllowed(address childContract);

/// @title ChildContractValidator
/// @notice This contract is used to validate that a child contract is allowed to be used with the parent contract
/// @dev This contract is used to validate that a child contract is allowed to be used with the parent contract
abstract contract ChildContractValidator {
  address[] private _allowedChildrenContracts;

  constructor(address[] memory allowedChildrenContracts) {
    _allowedChildrenContracts = allowedChildrenContracts;
  }

  function _validateChild(address childContract) internal view {
    uint256 length = _allowedChildrenContracts.length;
    for (uint256 i = 0; i < length; i++) {
      if (_allowedChildrenContracts[i] == childContract) {
        return;
      }
    }
    revert ChildContractNotAllowed(childContract);
  }
}