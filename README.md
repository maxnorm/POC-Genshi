# Genshi - Proof of Concept

This is a modular industrial traceability solution based on hierarchical NFTs.

It enables the identification, certification, and auditing of critical equipment, in compliance with ISO 19443, through a blockchain architecture managed by an industrial consortium.

The project begins with a proof of concept (POC) applied to a nuclear reactor vessel, with a medium-term ambition for cross-industry adoption.

## Features
### NFT System
- **Three NFT Types**
  - `PieceNFT`: Base NFT for individual components
  - `AssemblyNFT`: Composable NFT that can hold other NFTs (ERC998)
  - `EquipmentNFT`: Composable NFT for equipment assemblies (ERC998)

### Template System
- **Dynamic Template Creation**
  - Create templates for different NFT types
  - Define required attributes and documents
  - Template lifecycle management (Draft → Active → Inactive)
- **Attribute Types Support**
  - String values
  - Number values (with validation)
  - Boolean values
  - Enum values (with predefined options)
  - Custom units support (e.g., mm, MPa, °C)
- **Document Management**
  - Document metadata storage
  - MIME type validation
  - Document versioning
  - URI and hash storage for off-chain files

### Role-Based Access Control
- **Granular Role System**
  - Manager roles for each NFT type
  - Minter roles for token creation
  - Auditor roles for verification
  - Validator roles for approval
  - Document manager roles
  - Template manager role
  - Regulator role
- **Role Hierarchy**
  - Manager roles can grant sub-roles
  - Role combination restrictions (e.g., Auditor cannot be Minter)

### Composability Features
- **ERC998 Top-Down Implementation**

  This is a newer top-down implementation of ERC998 for Solidity 0.8.28, based on the [ERC998](https://github.com/ethereum/EIPs/issues/998) specification and the [proposed implementation](https://github.com/mattlockyer/composables-998/blob/master/contracts/ComposableTopDown.sol) from 2018 in Solidity 0.4.24.

  - Hierarchical NFT ownership
  - Child NFT management
  - Safe transfer mechanisms
  - Child contract validation
  
### Data Management Extension
- **Attribute System**
  - Set and update attributes
  - Attribute validation against templates
  - Attribute history tracking

- **Document System**
  - Document metadata management
  - Version control for documents
  - Document history tracking

# Getting Started
## Prerequisites
- Node.js >= 16
- npm or yarn
- MetaMask wallet

## Environment
### Smart Contract (Backend)
#### 1. Start Local Blockchain & Deploy Contract
```sh
cd backend
npm install

#Run on a separate terminal
npx hardhat node

# Deploy contract locally
npx hardhat run ./scripts/deploy.ts --network localhost
```

#### 2 Deploy to Public Testnet
See ```backend/hardhat.config.ts``` for available network
```sh
npx hardhat run ./scripts/deploy.ts --network sepolia
npx hardhat run ./scripts/deploy.ts --network holesky
```

### Deployed Contracts
#### Sepolia Network
<b>AccessManager</b>: [0x25fAd169401842CbEFF80b25Ae333876A389Af6C](https://sepolia.etherscan.io/address/0x25fAd169401842CbEFF80b25Ae333876A389Af6C#code)<br>
<b>TemplateRegistry</b>: [0x62f857A13A493Eb0F2C5E436974a96b06448FD1f](https://sepolia.etherscan.io/address/0x62f857A13A493Eb0F2C5E436974a96b06448FD1f#code)<br>
<b>PieceNFT</b>:  [0x3CfF0a397d75050f7a34B2EdF32E2053aB504bD5](https://sepolia.etherscan.io/address/0x3CfF0a397d75050f7a34B2EdF32E2053aB504bD5#code)<br>
<b>AssemblyNFT</b>: [0xf617C0907198A002a596b9bBdfe22CF52eb74d20](https://sepolia.etherscan.io/address/0xf617C0907198A002a596b9bBdfe22CF52eb74d20#code)<br>
<b>EquipmentNFT</b>: [0x9a68A0f1Bce34ecB00cD4a781D2E26a3Ef31b131](https://sepolia.etherscan.io/address/0x9a68A0f1Bce34ecB00cD4a781D2E26a3Ef31b131#code)<br>
