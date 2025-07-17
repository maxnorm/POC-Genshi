'use client';

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { useAccount } from 'wagmi';
import { Button } from "@/components/ui/button"
import Link from "next/link";
import useRedirectWhenConnected from "@/hooks/useRedirectWhenConnected";

function HomePage() {
  const { isConnected } = useAccount();
  useRedirectWhenConnected('/dashboard');

  return (
    <div className="flex flex-col items-center justify-center h-screen">
    <Image
      src="/LOGO-GENSHI.png"
      alt="GENSHI"
      width={200}
      height={200}
      className="w-48 h-48" 
    />
    <h1 className="text-2xl font-bold pb-6">Welcome to GENSHI</h1>
    <div className="flex flex-col items-center justify-center gap-6">
      <p className="text-sm sm:text-md max-w-sm sm:max-w-fit text-center">
        Traceability platform for critical industrial assets using blockchain and NFTs
      </p>
      {isConnected ? (
        <Button asChild variant="genshi-light">
          <Link href="/dashboard">
            Go to Dashboard
          </Link>
        </Button>
      ) : (
        <ConnectButton />
      )}
      <span className="pt-16 text-md sm:text-lg flex flex-col items-center justify-center">
        Questions about GENSHI?{" "}
        <a href="mailto:support@genshi.xyz" className="hover:underline">
          Contact our team
        </a>
      </span>
    </div>
  </div>
  );
}

export default HomePage;