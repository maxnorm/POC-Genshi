// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

interface ITemplate {
    /// @notice The definition of the attribute
  struct AttributeDefinition {
    /// @notice e.g., "material", "diameter", "pressure_rating"
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
}