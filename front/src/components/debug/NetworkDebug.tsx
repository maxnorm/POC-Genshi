"use client";

import { useEffect, useState } from "react";
import { getNetworkConfig } from "@/lib/networkConfig";
import { useAccount, useChainId } from "wagmi";

export default function NetworkDebug() {
  const [networkConfig, setNetworkConfig] = useState<any>(null);
  const { address } = useAccount();
  const chainId = useChainId();

  useEffect(() => {
    const config = getNetworkConfig();
    setNetworkConfig(config);
  }, []);

  if (!networkConfig) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Network Debug Info</h3>
      <div className="space-y-1">
        <div>Default Network: {process.env.NEXT_PUBLIC_DEFAULT_NETWORK}</div>
        <div>Chain ID: {chainId}</div>
        <div>Connected Address: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}</div>
        <div>RPC URL: {networkConfig.rpcUrl ? 'Set' : 'Missing'}</div>
        <div>Access Manager: {networkConfig.contractsAddresses?.accessManager ? 'Set' : 'Missing'}</div>
        <div>Template Registry: {networkConfig.contractsAddresses?.templateRegistry ? 'Set' : 'Missing'}</div>
        <div>Piece NFT: {networkConfig.contractsAddresses?.pieceNFT ? 'Set' : 'Missing'}</div>
        <div>Assembly NFT: {networkConfig.contractsAddresses?.assemblyNFT ? 'Set' : 'Missing'}</div>
        <div>Equipment NFT: {networkConfig.contractsAddresses?.equipmentNFT ? 'Set' : 'Missing'}</div>
      </div>
    </div>
  );
} 