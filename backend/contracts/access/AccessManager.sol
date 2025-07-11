// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

import {Access_InvalidRoleCombination} from "./AccessErrors.sol";

/// @title AccessManager
/// @author Maxime Normandin <m.normandin@tranqilo.ca>
/// @notice This contract is used to manage the access in the system
contract AccessManager is AccessControl {
  bytes32 public constant PIECE_MANAGER = keccak256("PIECE_MANAGER");
  bytes32 public constant PIECE_MINTER = keccak256("PIECE_MINTER");
  bytes32 public constant PIECE_AUDITOR = keccak256("PIECE_AUDITOR");
  bytes32 public constant PIECE_VALIDATOR = keccak256("PIECE_VALIDATOR");
  bytes32 public constant PIECE_DOCUMENT_MANAGER = keccak256("PIECE_DOCUMENT_MANAGER");

  bytes32 public constant ASSEMBLY_MANAGER = keccak256("ASSEMBLY_MANAGER");
  bytes32 public constant ASSEMBLY_MINTER = keccak256("ASSEMBLY_MINTER");
  bytes32 public constant ASSEMBLY_AUDITOR = keccak256("ASSEMBLY_AUDITOR");
  bytes32 public constant ASSEMBLY_VALIDATOR = keccak256("ASSEMBLY_VALIDATOR");
  bytes32 public constant ASSEMBLY_DOCUMENT_MANAGER = keccak256("ASSEMBLY_DOCUMENT_MANAGER");

  bytes32 public constant EQUIPMENT_MANAGER = keccak256("EQUIPMENT_MANAGER");
  bytes32 public constant EQUIPMENT_MINTER = keccak256("EQUIPMENT_MINTER");
  bytes32 public constant EQUIPMENT_AUDITOR = keccak256("EQUIPMENT_AUDITOR");
  bytes32 public constant EQUIPMENT_VALIDATOR = keccak256("EQUIPMENT_VALIDATOR");
  bytes32 public constant EQUIPMENT_DOCUMENT_MANAGER = keccak256("EQUIPMENT_DOCUMENT_MANAGER");

  bytes32 public constant TEMPLATE_MANAGER = keccak256("TEMPLATE_MANAGER");

  bytes32 public constant REGULATOR = keccak256("REGULATOR");

  constructor() {
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(TEMPLATE_MANAGER, msg.sender);

    _setRoleAdmin(PIECE_MANAGER, DEFAULT_ADMIN_ROLE);
    _setRoleAdmin(PIECE_MINTER, PIECE_MANAGER);
    _setRoleAdmin(PIECE_AUDITOR, PIECE_MANAGER);
    _setRoleAdmin(PIECE_VALIDATOR, PIECE_MANAGER);
    _setRoleAdmin(PIECE_DOCUMENT_MANAGER, PIECE_MANAGER);
    

    _setRoleAdmin(ASSEMBLY_MANAGER, DEFAULT_ADMIN_ROLE);
    _setRoleAdmin(ASSEMBLY_MINTER, ASSEMBLY_MANAGER);
    _setRoleAdmin(ASSEMBLY_AUDITOR, ASSEMBLY_MANAGER);
    _setRoleAdmin(ASSEMBLY_VALIDATOR, ASSEMBLY_MANAGER);
    _setRoleAdmin(ASSEMBLY_DOCUMENT_MANAGER, ASSEMBLY_MANAGER);

    _setRoleAdmin(EQUIPMENT_MANAGER, DEFAULT_ADMIN_ROLE);
    _setRoleAdmin(EQUIPMENT_MINTER, EQUIPMENT_MANAGER);
    _setRoleAdmin(EQUIPMENT_AUDITOR, EQUIPMENT_MANAGER);
    _setRoleAdmin(EQUIPMENT_VALIDATOR, EQUIPMENT_MANAGER);
    _setRoleAdmin(EQUIPMENT_DOCUMENT_MANAGER, EQUIPMENT_MANAGER);
  }

  /// @notice Grants a role to an account
  /// @param role The role to grant
  /// @param account The account to grant the role to
  /// @dev This function is used to grant a role to an account
  /// @dev This function is also used to check if a role combination is valid
  function grantRole(bytes32 role, address account) public override {
    _checkRoleCombination(role, account);
    super.grantRole(role, account);
  }

  /// @notice Checks if a role combination is valid
  /// @param role The role to check
  /// @param account The account to check
  /// @dev This function is used to prevent wrong role combinations
  function _checkRoleCombination(bytes32 role, address account) internal view {
    if (role == PIECE_AUDITOR ) {
        require(!hasRole(PIECE_MINTER, account), Access_InvalidRoleCombination(account, role));
    }
    if (role == ASSEMBLY_AUDITOR) {
        require(!hasRole(ASSEMBLY_MINTER, account), Access_InvalidRoleCombination(account, role));
    }
    if (role == EQUIPMENT_AUDITOR) {
        require(!hasRole(EQUIPMENT_MINTER, account), Access_InvalidRoleCombination(account, role));
    }

    if (role == PIECE_VALIDATOR) {
        require(!hasRole(PIECE_AUDITOR, account), Access_InvalidRoleCombination(account, role));
    }
    if (role == ASSEMBLY_VALIDATOR) {
        require(!hasRole(ASSEMBLY_AUDITOR, account), Access_InvalidRoleCombination(account, role));
    }
    if (role == EQUIPMENT_VALIDATOR) {  
        require(!hasRole(EQUIPMENT_AUDITOR, account), Access_InvalidRoleCombination(account, role));
    }
  }  
}