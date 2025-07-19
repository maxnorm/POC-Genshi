'use client';

import { ConnectButton } from "@rainbow-me/rainbowkit";

/**
 * Custom connect button
 * This is a wrapper to the rainbowkit connect button
 * @returns {Object} The CustomConnectButton component
 */
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