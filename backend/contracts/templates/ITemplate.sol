// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

interface ITemplate {
    /// @notice The definition of the attribute
  struct AttributeDefinition {
    /// @notice e.g., "Serial Number", "Material", "Pressure"
    string name;
    /// @notice "string", "number", "date", "enum"
    string attributeType;
    /// @notice allowed values for enum type
    string[] allowedValues;
    /// @notice e.g., "mm", "MPa", "°C", "N/A"
    string units;
    bool required;
  } 

  /// @notice The definition of the document
  struct DocumentDefinition {
    /// @notice e.g., "material_cert", "pressure_test", "inspection_report"
    string docType;
    /// @notice e.g., ["application/pdf"]
    string[] allowedMimeTypes;
    bool required;
  }

  enum TemplateStatus {
    DRAFT,
    ACTIVE,
    INACTIVE
  }

  /// @notice The template definition
  struct Template {
    uint256 id;
    /// @notice The NFT contract that this template is for
    address nftContract;
    /// @notice e.g., "pressure_vessel", "valve", "pipe"
    string templateType;
    /// @notice The keys of the template
    string[] attributeKeys;
    string[] documentKeys;
    /// @notice The attributes of the template
    mapping(string key => AttributeDefinition) attributes;
    mapping(string key => DocumentDefinition) documents;
    /// @notice Validation mapping for keys in attributes
    mapping(string key => bool) validAttributes;
    mapping(string key => bool) validDocuments;
    TemplateStatus status;
  }

  /// @notice The view of the template
  /// @dev This is used to get the template without mapping which can't be returned
  struct TemplateView {
    uint256 id;
    address nftContract;
    string templateType;
    string[] attributeKeys;
    string[] documentKeys;
    TemplateStatus status;
  }
}