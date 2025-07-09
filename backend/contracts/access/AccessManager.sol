// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/// @title AccessManager
/// @author Maxime Normandin <m.normandin@tranqilo.ca>
/// @notice This contract is used to manage the access in the system
contract AccessManager is AccessControl {
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
  bytes32 public constant MANUFACTURER_ROLE = keccak256("MANUFACTURER_ROLE");
  bytes32 public constant SUPPLIER_ROLE = keccak256("SUPPLIER_ROLE");
  bytes32 public constant AUDITOR_ROLE = keccak256("AUDITOR_ROLE");
  bytes32 public constant VALIDATOR_ROLE = keccak256("VALIDATOR_ROLE");
  bytes32 public constant PIECE_MANAGER = keccak256("PIECE_MANAGER");
  bytes32 public constant ASSEMBLY_MANAGER = keccak256("ASSEMBLY_MANAGER");
  bytes32 public constant EQUIPMENT_MANAGER = keccak256("EQUIPMENT_MANAGER");

  constructor() {
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(ADMIN_ROLE, msg.sender);
  }
}