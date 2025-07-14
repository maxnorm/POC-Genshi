// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

import {AccessManaged} from "../access/AccessManaged.sol";
import {ITemplateRegistry} from "./ITemplateRegistry.sol";
import {ITemplate} from "./ITemplate.sol";
import {
  Template_InvalidTemplate, 
  Template_InvalidTemplateStatus, 
  Template_InvalidAttributeKey, 
  Template_InvalidDocumentKey, 
  Template_InvalidEnumValue, 
  Template_InvalidNumberValue,
  Template_InvalidBooleanValue, 
  Template_InvalidMimeType
  } from "./TemplateErrors.sol";

/// @title TemplateRegistry
/// @author Maxime Normandin <m.normandin@tranqilo.ca>
/// @notice This contract is used to manage the templates for the AssemblyNFT contract
/// @dev This contract is used to create, update, and deactivate templates for NFTs 
contract TemplateRegistry is AccessManaged, ITemplateRegistry {
  uint256 private _count;

  event Template_Created(uint256 indexed templateId, string templateType, address indexed nftContract);
  event Template_Deactivated(uint256 indexed templateId, string templateType, address indexed nftContract);
  event Template_Activated(uint256 indexed templateId, string templateType, address indexed nftContract);

  mapping(uint256 => ITemplate.Template) public templates;
  mapping(address => uint256[]) public templatesByNFTContract;

  constructor(address _accessManager) AccessManaged(_accessManager) {}
  
  /// @notice Creates a new template  
  /// @param nftContract The NFT contract that this template is for
  /// @param templateType The type of the template
  function createTemplate(
    address nftContract,
    string memory templateType
  ) external onlyRole(accessManager.TEMPLATE_MANAGER()) {
    _count++;
      
    ITemplate.Template storage newTemplate = templates[_count];
    newTemplate.id = _count;
    newTemplate.nftContract = nftContract;
    newTemplate.templateType = templateType;
    templatesByNFTContract[nftContract].push(_count);

    emit Template_Created(_count, templateType, nftContract);
  }

  /// @notice Adds an attribute to a template
  /// @param templateId The id of the template to add the attribute to
  /// @param key The key of the attribute
  /// @param attribute The attribute to add
  /// @dev A batch version should be implemented later when MAX_ATTRIBUTES in tx is tested
  function addAttribute(uint256 templateId, string memory key, ITemplate.AttributeDefinition memory attribute) 
    external onlyRole(accessManager.TEMPLATE_MANAGER()) 
  {
    require(templateId <= _count, Template_InvalidTemplate(templateId));
    templates[templateId].attributes[key] = attribute;
    templates[templateId].attributeKeys.push(key);
    templates[templateId].validAttributes[key] = true;
  }

  /// @notice Adds a document to a template
  /// @param templateId The id of the template to add the document to
  /// @param key The key of the document
  /// @param document The document to add
  /// @dev A batch version should be implemented later when MAX_DOCUMENTS in tx is tested
  function addDocument(uint256 templateId, string memory key, ITemplate.DocumentDefinition memory document) 
    external onlyRole(accessManager.TEMPLATE_MANAGER()) 
  {
    require(templateId <= _count, Template_InvalidTemplate(templateId));
    templates[templateId].documents[key] = document;
    templates[templateId].documentKeys.push(key);
    templates[templateId].validDocuments[key] = true;
  }

  /// @notice Activates a template
  /// @param templateId The id of the template to activate
  function activateTemplate(uint256 templateId) external onlyRole(accessManager.TEMPLATE_MANAGER()) {
    require(templateId <= _count, Template_InvalidTemplate(templateId));
    require(templates[templateId].status == ITemplate.TemplateStatus.DRAFT, Template_InvalidTemplateStatus(templateId, ITemplate.TemplateStatus.DRAFT));
    templates[templateId].status = ITemplate.TemplateStatus.ACTIVE;
    emit Template_Activated(templateId, templates[templateId].templateType, templates[templateId].nftContract);
  }

  /// @notice Deactivates a template
  /// @param templateId The id of the template to deactivate
  function deactivateTemplate(uint256 templateId) external onlyRole(accessManager.TEMPLATE_MANAGER()) {
    require(templateId <= _count, Template_InvalidTemplate(templateId));
    require(templates[templateId].status == ITemplate.TemplateStatus.ACTIVE, Template_InvalidTemplateStatus(templateId, ITemplate.TemplateStatus.ACTIVE));
    templates[templateId].status = ITemplate.TemplateStatus.INACTIVE;
    emit Template_Deactivated(templateId, templates[templateId].templateType, templates[templateId].nftContract);
  }

  /// @notice Gets a template by id
  /// @param templateId The id of the template to get
  function getTemplate(uint256 templateId) external view returns (ITemplate.TemplateView memory) {
    require(templateId <= _count, Template_InvalidTemplate(templateId));
    return ITemplate.TemplateView({
      id: templates[templateId].id,
      nftContract: templates[templateId].nftContract,
      templateType: templates[templateId].templateType,
      attributeKeys: templates[templateId].attributeKeys,
      documentKeys: templates[templateId].documentKeys,
      status: templates[templateId].status
    });
  }

  /// @notice Gets an attribute by key
  /// @param templateId The id of the template to get the attribute from
  /// @param key The key of the attribute to get
  function getAttribute(uint256 templateId, string memory key) external view returns (ITemplate.AttributeDefinition memory) {
    require(templateId <= _count, Template_InvalidTemplate(templateId));
    require(templates[templateId].validAttributes[key], Template_InvalidAttributeKey(templateId, key));
    return templates[templateId].attributes[key];
  }

  /// @notice Gets a document by key
  /// @param templateId The id of the template to get the document from
  /// @param key The key of the document to get
  function getDocument(uint256 templateId, string memory key) external view returns (ITemplate.DocumentDefinition memory) {
    require(templateId <= _count, Template_InvalidTemplate(templateId));
    require(templates[templateId].validDocuments[key], Template_InvalidDocumentKey(templateId, key));
    return templates[templateId].documents[key];
  }

  /// @notice Validates an attribute
  /// @param templateId The id of the template to validate the attribute of
  /// @param key The key of the attribute to validate
  /// @param value The value of the attribute to validate
  function validateAttribute(uint256 templateId, string memory key, string memory value) external view {
    require(templateId <= _count, Template_InvalidTemplate(templateId));
    require(templates[templateId].validAttributes[key], Template_InvalidAttributeKey(templateId, key));

    ITemplate.AttributeDefinition memory attribute = templates[templateId].attributes[key];

    if (keccak256(bytes(attribute.attributeType)) == keccak256(bytes("enum"))) {
      _validateEnum(attribute, key, value);
    } else if (keccak256(bytes(attribute.attributeType)) == keccak256(bytes("number"))) {
      _validateNumber(key, value);
    } else if (keccak256(bytes(attribute.attributeType)) == keccak256(bytes("boolean"))) {
      _validateBoolean(key, value);
    }
  }

  function validateDocument(uint256 templateId, string memory key, string memory mimeType) external view {
    require(templateId <= _count, Template_InvalidTemplate(templateId));
    require(templates[templateId].validDocuments[key], Template_InvalidDocumentKey(templateId, key));

    ITemplate.DocumentDefinition memory document = templates[templateId].documents[key];
    _validateMimeType(document, mimeType);
  }

  /// @notice Validates a mime type
  /// @param mimeType The mime type to validate
  function _validateMimeType(ITemplate.DocumentDefinition memory document, string memory mimeType) internal pure {
    for (uint256 i = 0; i < document.allowedMimeTypes.length; i++) {
      if (keccak256(bytes(document.allowedMimeTypes[i])) == keccak256(bytes(mimeType))) {
        return;
      }
    }
    revert Template_InvalidMimeType(mimeType);
  }

  /// @notice Validates an enum value
  /// @param attribute The attribute to validate
  /// @param key The key of the attribute to validate
  /// @param value The value of the attribute to validate
  function _validateEnum(ITemplate.AttributeDefinition memory attribute, string memory key, string memory value) internal pure {
    bool isValidValue = false;
    for (uint256 i = 0; i < attribute.allowedValues.length; i++) {
      if (keccak256(bytes(attribute.allowedValues[i])) == keccak256(bytes(value))) {
        isValidValue = true;
        break;
      }
    }
    require(isValidValue, Template_InvalidEnumValue(key, value));
  }

  /// @notice Validates a number value
  /// @param key The key of the attribute to validate
  /// @param value The value of the attribute to validate
  function _validateNumber(string memory key, string memory value) internal pure {
    bytes memory valueBytes = bytes(value);
    bool hasDecimal = false;
    bool hasDigit = false;

    /// @dev ASCII values for special characters
    /// 0x2D = "-"
    /// 0x2E = "."
    /// 0x30 = "0"
    /// 0x31 = "1"
    /// 0x39 = "9"

    for (uint i = 0; i < valueBytes.length; i++) {
        /// @dev Allow negative numbers
        if (i == 0 && valueBytes[i] == 0x2D) continue;  

        /// @dev Allow decimal numbers
        if (valueBytes[i] == 0x2E && !hasDecimal) {
            hasDecimal = true;
            continue;
        }

        /// @dev Check if the character is a number (0-9)
        if (valueBytes[i] >= 0x30 && valueBytes[i] <= 0x39) {
            hasDigit = true;
            continue;
        }
        revert Template_InvalidNumberValue(key, value);
    }
    
    require(hasDigit, Template_InvalidNumberValue(key, value));
  }

  function _validateBoolean(string memory key, string memory value) internal pure {
    require(
      keccak256(bytes(value)) == keccak256(bytes("true")) || 
      keccak256(bytes(value)) == keccak256(bytes("false")), 
      Template_InvalidBooleanValue(key, value)
    );
  }
}