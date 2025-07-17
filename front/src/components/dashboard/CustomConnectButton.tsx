'use client';

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { cn } from "@/lib/utils";

function CustomConnectButton() {
  return (
    <div className="px-2 py-1">
      <ConnectButton 
        chainStatus="icon"
        showBalance={false}
        accountStatus={{
          smallScreen: 'avatar',
          largeScreen: 'full',
        }}
      />
    </div>
  );
}

export default CustomConnectButton; 