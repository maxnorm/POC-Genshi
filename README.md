# Genshi - Proof of Concept

This is a modular industrial traceability solution based on hierarchical NFTs.

It enables the identification, certification, and auditing of critical equipment, in compliance with ISO 19443, through a blockchain architecture managed by an industrial consortium.

The project begins with a proof of concept (POC) applied to a nuclear reactor vessel, with a medium-term ambition for cross-industry adoption.

## Features

## Getting Started


### Prerequisites

- Node.js >= 16
- npm or yarn
- MetaMask wallet

### Environment

#### 2. Smart Contract (Backend)
##### 2.1 - Start Local Blockchain & Deploy Contract
```sh
cd backend
npm install

#Run on a separate terminal
npx hardhat node

# Deploy contract locally
npx hardhat run ./scripts/deploy.ts --network localhost
```

##### 2.1 Deploy to Public Testnet
See ```backend/hardhat.config.ts``` for available network
```sh
npx hardhat run ./scripts/deploy.ts --network sepolia
npx hardhat run ./scripts/deploy.ts --network holesky
```

##### Deployed Contracts


