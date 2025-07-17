import { hardhat as hardhatViem, sepolia as sepoliaViem, holesky as holeskyViem } from 'viem/chains';
import { hardhat as hardhatWagmi, sepolia as sepoliaWagmi, holesky as holeskyWagmi } from 'wagmi/chains';
import { Chain } from 'viem/chains';
import type { Chain as WagmiChain } from 'wagmi/chains';
import { Contracts } from './contracts';

interface NetworkConfig {
  network: string;
  wagmiChain: WagmiChain;
  defaultChain: Chain;
  rpcUrl?: string;
  fromBlocks?: {
    [key in Contracts]: bigint;
  };
  contractsAddresses?: {
    [key in Contracts]: `0x${string}`;
  };
}

const defaultNetwork = process.env.NEXT_PUBLIC_DEFAULT_NETWORK || 'hardhat';

const networks: Record<string, NetworkConfig> = {
  hardhat: {
    network: defaultNetwork,
    wagmiChain: hardhatWagmi,
    defaultChain: hardhatViem,
    rpcUrl: 'http://127.0.0.1:8545',
    fromBlocks: {
      [Contracts.AccessManager]: BigInt(0),
      [Contracts.TemplateRegistry]: BigInt(0),
      [Contracts.PieceNFT]: BigInt(0),
      [Contracts.AssemblyNFT]: BigInt(0),
      [Contracts.EquipmentNFT]: BigInt(0),
    },
    contractsAddresses: {
      [Contracts.AccessManager]: process.env.NEXT_PUBLIC_HARDHAT_ACCESS_MANAGER_ADDRESS as `0x${string}`,
      [Contracts.TemplateRegistry]: process.env.NEXT_PUBLIC_HARDHAT_TEMPLATE_REGISTRY_ADDRESS as `0x${string}`,
      [Contracts.PieceNFT]: process.env.NEXT_PUBLIC_HARDHAT_PIECE_NFT_ADDRESS as `0x${string}`,
      [Contracts.AssemblyNFT]: process.env.NEXT_PUBLIC_HARDHAT_ASSEMBLY_NFT_ADDRESS as `0x${string}`,
      [Contracts.EquipmentNFT]: process.env.NEXT_PUBLIC_HARDHAT_EQUIPMENT_NFT_ADDRESS as `0x${string}`,
    },
  },
  sepolia: {
    network: defaultNetwork,
    wagmiChain: sepoliaWagmi,
    defaultChain: sepoliaViem,
    rpcUrl: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL,
    fromBlocks: {
      [Contracts.AccessManager]: process.env.NEXT_PUBLIC_SEPOLIA_ACCESS_MANAGER_BLOCKNUMBER_DEPLOYED ? 
        BigInt(process.env.NEXT_PUBLIC_SEPOLIA_ACCESS_MANAGER_BLOCKNUMBER_DEPLOYED) : BigInt(0),
      [Contracts.TemplateRegistry]: process.env.NEXT_PUBLIC_SEPOLIA_TEMPLATE_REGISTRY_BLOCKNUMBER_DEPLOYED ? 
        BigInt(process.env.NEXT_PUBLIC_SEPOLIA_TEMPLATE_REGISTRY_BLOCKNUMBER_DEPLOYED) : BigInt(0),
      [Contracts.PieceNFT]: process.env.NEXT_PUBLIC_SEPOLIA_PIECE_NFT_BLOCKNUMBER_DEPLOYED ? 
        BigInt(process.env.NEXT_PUBLIC_SEPOLIA_PIECE_NFT_BLOCKNUMBER_DEPLOYED) : BigInt(0),
      [Contracts.AssemblyNFT]: process.env.NEXT_PUBLIC_SEPOLIA_ASSEMBLY_NFT_BLOCKNUMBER_DEPLOYED ? 
        BigInt(process.env.NEXT_PUBLIC_SEPOLIA_ASSEMBLY_NFT_BLOCKNUMBER_DEPLOYED) : BigInt(0),
      [Contracts.EquipmentNFT]: process.env.NEXT_PUBLIC_SEPOLIA_EQUIPMENT_NFT_BLOCKNUMBER_DEPLOYED ? 
        BigInt(process.env.NEXT_PUBLIC_SEPOLIA_EQUIPMENT_NFT_BLOCKNUMBER_DEPLOYED) : BigInt(0),
    },
    contractsAddresses: {
      [Contracts.AccessManager]: process.env.NEXT_PUBLIC_SEPOLIA_ACCESS_MANAGER_ADDRESS as `0x${string}`,
      [Contracts.TemplateRegistry]: process.env.NEXT_PUBLIC_SEPOLIA_TEMPLATE_REGISTRY_ADDRESS as `0x${string}`,
      [Contracts.PieceNFT]: process.env.NEXT_PUBLIC_SEPOLIA_PIECE_NFT_ADDRESS as `0x${string}`,
      [Contracts.AssemblyNFT]: process.env.NEXT_PUBLIC_SEPOLIA_ASSEMBLY_NFT_ADDRESS as `0x${string}`,
      [Contracts.EquipmentNFT]: process.env.NEXT_PUBLIC_SEPOLIA_EQUIPMENT_NFT_ADDRESS as `0x${string}`,
    },
  },
  holesky: {
    network: defaultNetwork,
    wagmiChain: holeskyWagmi,
    defaultChain: holeskyViem,
    rpcUrl: process.env.NEXT_PUBLIC_HOLESKY_RPC_URL,
    fromBlocks: {
      [Contracts.AccessManager]: process.env.NEXT_PUBLIC_HOLESKY_ACCESS_MANAGER_BLOCKNUMBER_DEPLOYED ?
         BigInt(process.env.NEXT_PUBLIC_HOLESKY_ACCESS_MANAGER_BLOCKNUMBER_DEPLOYED) : BigInt(0),
      [Contracts.TemplateRegistry]: process.env.NEXT_PUBLIC_HOLESKY_TEMPLATE_REGISTRY_BLOCKNUMBER_DEPLOYED ? 
        BigInt(process.env.NEXT_PUBLIC_HOLESKY_TEMPLATE_REGISTRY_BLOCKNUMBER_DEPLOYED) : BigInt(0),
      [Contracts.PieceNFT]: process.env.NEXT_PUBLIC_HOLESKY_PIECE_NFT_BLOCKNUMBER_DEPLOYED ? 
        BigInt(process.env.NEXT_PUBLIC_HOLESKY_PIECE_NFT_BLOCKNUMBER_DEPLOYED) : BigInt(0),
      [Contracts.AssemblyNFT]: process.env.NEXT_PUBLIC_HOLESKY_ASSEMBLY_NFT_BLOCKNUMBER_DEPLOYED ? 
        BigInt(process.env.NEXT_PUBLIC_HOLESKY_ASSEMBLY_NFT_BLOCKNUMBER_DEPLOYED) : BigInt(0),
      [Contracts.EquipmentNFT]: process.env.NEXT_PUBLIC_HOLESKY_EQUIPMENT_NFT_BLOCKNUMBER_DEPLOYED ? 
        BigInt(process.env.NEXT_PUBLIC_HOLESKY_EQUIPMENT_NFT_BLOCKNUMBER_DEPLOYED) : BigInt(0),
    },
    contractsAddresses: {
      [Contracts.AccessManager]: process.env.NEXT_PUBLIC_HOLESKY_ACCESS_MANAGER_ADDRESS as `0x${string}`,
      [Contracts.TemplateRegistry]: process.env.NEXT_PUBLIC_HOLESKY_TEMPLATE_REGISTRY_ADDRESS as `0x${string}`,
      [Contracts.PieceNFT]: process.env.NEXT_PUBLIC_HOLESKY_PIECE_NFT_ADDRESS as `0x${string}`,
      [Contracts.AssemblyNFT]: process.env.NEXT_PUBLIC_HOLESKY_ASSEMBLY_NFT_ADDRESS as `0x${string}`,
      [Contracts.EquipmentNFT]: process.env.NEXT_PUBLIC_HOLESKY_EQUIPMENT_NFT_ADDRESS as `0x${string}`,
    },
  }
};  

export const getNetworkConfig = (): NetworkConfig => {
  return networks[defaultNetwork];
};