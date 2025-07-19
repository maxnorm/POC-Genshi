import { getNetworkConfig } from "@/lib/networkConfig";

const { contractsAddresses } = getNetworkConfig()

export const templateRegistryAddress = contractsAddresses?.templateRegistry as `0x${string}`
export const templateRegistryABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_accessManager",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "Access_ManagerAddressCannotBeZero",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "role",
        "type": "bytes32"
      }
    ],
    "name": "Access_NotAuthorized",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "templateId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "key",
        "type": "string"
      }
    ],
    "name": "Template_InvalidAttributeKey",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "key",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "value",
        "type": "string"
      }
    ],
    "name": "Template_InvalidBooleanValue",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "templateId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "key",
        "type": "string"
      }
    ],
    "name": "Template_InvalidDocumentKey",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "key",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "value",
        "type": "string"
      }
    ],
    "name": "Template_InvalidEnumValue",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "mimeType",
        "type": "string"
      }
    ],
    "name": "Template_InvalidMimeType",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "key",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "value",
        "type": "string"
      }
    ],
    "name": "Template_InvalidNumberValue",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "templateId",
        "type": "uint256"
      }
    ],
    "name": "Template_InvalidTemplate",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "templateId",
        "type": "uint256"
      },
      {
        "internalType": "enum ITemplate.TemplateStatus",
        "name": "status",
        "type": "uint8"
      }
    ],
    "name": "Template_InvalidTemplateStatus",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "templateId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "templateName",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "nftContract",
        "type": "address"
      }
    ],
    "name": "Template_Activated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "templateId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "templateName",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "nftContract",
        "type": "address"
      }
    ],
    "name": "Template_Created",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "templateId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "templateName",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "nftContract",
        "type": "address"
      }
    ],
    "name": "Template_Deactivated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "templateId",
        "type": "uint256"
      }
    ],
    "name": "activateTemplate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "templateId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "key",
        "type": "string"
      },
      {
        "components": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "attributeType",
            "type": "string"
          },
          {
            "internalType": "string[]",
            "name": "allowedValues",
            "type": "string[]"
          },
          {
            "internalType": "string",
            "name": "units",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "required",
            "type": "bool"
          }
        ],
        "internalType": "struct ITemplate.AttributeDefinition",
        "name": "attribute",
        "type": "tuple"
      }
    ],
    "name": "addAttribute",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "templateId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "key",
        "type": "string"
      },
      {
        "components": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string[]",
            "name": "allowedMimeTypes",
            "type": "string[]"
          },
          {
            "internalType": "bool",
            "name": "required",
            "type": "bool"
          }
        ],
        "internalType": "struct ITemplate.DocumentDefinition",
        "name": "document",
        "type": "tuple"
      }
    ],
    "name": "addDocument",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "nftContract",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "templateName",
        "type": "string"
      }
    ],
    "name": "createTemplate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "templateId",
        "type": "uint256"
      }
    ],
    "name": "deactivateTemplate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "templateId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "key",
        "type": "string"
      }
    ],
    "name": "getAttribute",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "attributeType",
            "type": "string"
          },
          {
            "internalType": "string[]",
            "name": "allowedValues",
            "type": "string[]"
          },
          {
            "internalType": "string",
            "name": "units",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "required",
            "type": "bool"
          }
        ],
        "internalType": "struct ITemplate.AttributeDefinition",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "templateId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "key",
        "type": "string"
      }
    ],
    "name": "getDocument",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string[]",
            "name": "allowedMimeTypes",
            "type": "string[]"
          },
          {
            "internalType": "bool",
            "name": "required",
            "type": "bool"
          }
        ],
        "internalType": "struct ITemplate.DocumentDefinition",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "templateId",
        "type": "uint256"
      }
    ],
    "name": "getTemplate",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "nftContract",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "templateName",
            "type": "string"
          },
          {
            "internalType": "string[]",
            "name": "attributeKeys",
            "type": "string[]"
          },
          {
            "internalType": "string[]",
            "name": "documentKeys",
            "type": "string[]"
          },
          {
            "internalType": "enum ITemplate.TemplateStatus",
            "name": "status",
            "type": "uint8"
          }
        ],
        "internalType": "struct ITemplate.TemplateView",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "templates",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "nftContract",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "templateName",
        "type": "string"
      },
      {
        "internalType": "enum ITemplate.TemplateStatus",
        "name": "status",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "templatesByNFTContract",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "templateId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "key",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "value",
        "type": "string"
      }
    ],
    "name": "validateAttribute",
    "outputs": [],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "templateId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "key",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "mimeType",
        "type": "string"
      }
    ],
    "name": "validateDocument",
    "outputs": [],
    "stateMutability": "view",
    "type": "function"
  }
]