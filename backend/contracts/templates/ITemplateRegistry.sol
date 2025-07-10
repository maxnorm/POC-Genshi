// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

import {ITemplate} from "./ITemplate.sol";

interface ITemplateRegistry {
  function createTemplate(
    address nftContract,
    string memory templateType,
    ITemplate.AttributeDefinition[] memory attributes,
    ITemplate.DocumentDefinition[] memory documents,
    address[] memory validators
  ) external;
  function deactivateTemplate(uint256 templateId) external;
  function getTemplate(uint256 templateId) external view returns (ITemplate.Template memory);
}