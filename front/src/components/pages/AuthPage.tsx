'use client';

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";
import useRedirectWhenConnected from "@/hooks/useRedirectWhenConnected";

function AuthPage() {
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
    <h1 className="text-2xl font-bold pb-6">Authentication Required</h1>
    <div className="flex flex-col items-center justify-center gap-6">
      <p className="text-sm sm:text-md max-w-sm sm:max-w-fit text-center">Connect your wallet to access the dashboard.</p>
      <ConnectButton />
      <Link href="/" className="text-sm sm:text-md text-genshi-blue-secondary">
        Back to home
      </Link>
      <span className="pt-16 text-md sm:text-lg">
        Need help?{" "}
        <a href="mailto:support@genshi.xyz" className="hover:underline">
          Contact us
        </a>
      </span>
    </div>
  </div>
  );
}

export default AuthPage;