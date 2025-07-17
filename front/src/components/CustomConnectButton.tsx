'use client';

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { cn } from "@/lib/utils";

function CustomConnectButton() {
  return (
    <ConnectButton 
      accountStatus="address"
      chainStatus="icon"
      showBalance={false}
    />
  );
}

export default CustomConnectButton; 