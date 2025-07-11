// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

import {ITemplate} from "./ITemplate.sol";

interface ITemplateRegistry {
  function getTemplate(uint256 templateId) external view returns (ITemplate.TemplateView memory);
  function getAttribute(uint256 templateId, string memory key) external view returns (ITemplate.AttributeDefinition memory);
  function getDocument(uint256 templateId, string memory key) external view returns (ITemplate.DocumentDefinition memory);
  function validateAttribute(uint256 templateId, string memory key, string memory value) external view;
}