// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

import {AccessManaged} from "./access/AccessManaged.sol";

/// @title TemplateRegistry
/// @author Maxime Normandin <m.normandin@tranqilo.ca>
/// @notice This contract is used to manage the templates for the AssemblyNFT contract
/// @dev This contract is used to create, update, and deactivate templates for NFTs 
contract TemplateRegistry is AccessManaged {
  uint256 private _count;

  event TemplateCreated(uint256 indexed templateId, string templateType, address indexed nftContract);
  event TemplateDeactivated(uint256 indexed templateId, string templateType, address indexed nftContract);
  
  /// @notice The definition of the attribute
  struct AttributeDefinition {
    /// @notice e.g., "material", "diameter", "pressure_rating"
    string name;
    /// @notice e.g., "string", "number", "date", "enum"
    string attributeType;
    /// @notice Is this attribute mandatory?
    bool required;
    /// @notice If type is enum, possible values
    string[] enumValues;
    /// @notice e.g., "mm", "MPa", "°C", "N/A"
    string units;
  } 

  /// @notice The definition of the document
  struct DocumentDefinition {
    /// @notice e.g., "material_cert", "pressure_test", "inspection_report"
    string docType;
    /// @notice Is this document mandatory?
    bool required;
    /// @notice e.g., ["application/pdf"]
    string[] allowedMimeTypes;
  }

  /// @notice The template definition
  struct Template {
    uint256 id;
    /// @notice The NFT contract that this template is for
    address nftContract;
    /// @notice e.g., "pressure_vessel", "valve", "pipe"
    string templateType;
    AttributeDefinition[] attributes;
    DocumentDefinition[] documents;
    address[] allowedValidators;
    bool active;
  }

  mapping(uint256 => Template) public templates;
  mapping(address => uint256[]) public templatesByNFTContract;

  constructor(address _accessManager) AccessManaged(_accessManager) {}
  
  /// @notice Creates a new template
  /// @param nftContract The NFT contract that this template is for
  /// @param templateType The type of the template
  /// @param attributes The attributes of the template
  /// @param documents The documents of the template
  /// @param validators The validators of the template
  function createTemplate(
    address nftContract,
    string memory templateType,
    AttributeDefinition[] memory attributes,
    DocumentDefinition[] memory documents,
    address[] memory validators
  ) external onlyRole(accessManager.ADMIN_ROLE()) {
    _count++;
    templates[_count] = Template({
      id: _count,
      nftContract: nftContract,
      templateType: templateType,
      attributes: attributes,
      documents: documents,
      allowedValidators: validators,
      active: true
    });
    templatesByNFTContract[nftContract].push(_count);
    emit TemplateCreated(_count, templateType, nftContract);
  }

  /// @notice Deactivates a template
  /// @param templateId The id of the template to deactivate
  function deactivateTemplate(uint256 templateId) external onlyRole(accessManager.ADMIN_ROLE()) {
    templates[templateId].active = false;
    emit TemplateDeactivated(templateId, templates[templateId].templateType, templates[templateId].nftContract);
  }

  /// @notice Gets a template by id
  /// @param templateId The id of the template to get
  function getTemplate(uint256 templateId) external view returns (Template memory) {
    return templates[templateId];
  }
}