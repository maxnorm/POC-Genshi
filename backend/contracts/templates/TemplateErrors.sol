// contracts/errors/GenshiErrors.sol
// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

import {ITemplate} from "./ITemplate.sol";

error Template_InvalidTemplate(uint256 templateId);
error Template_NotActive(uint256 templateId);
error Template_InvalidTemplateForNFT(uint256 templateId);
error Template_InvalidTemplateStatus(uint256 templateId, ITemplate.TemplateStatus status);


error Template_InvalidAttributeKey(uint256 templateId, string key);
error Template_InvalidDocumentKey(uint256 templateId, string key);

error Template_InvalidEnumValue(string key, string value);
error Template_InvalidNumberValue(string key, string value);
error Template_InvalidBooleanValue(string key, string value);
error Template_InvalidMimeType(string mimeType);