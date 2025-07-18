'use client';

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";
import useRedirectWhenConnected from "@/hooks/useRedirectWhenConnected";
import { Button } from "@/components/ui/button";

/**
 * No access page
 * This is the page to display when the user has no access to the page
 * @returns {Object} The NoAccessPage component
 */
function NoAccessPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
    <Image
      src="/LOGO-GENSHI.png"
      alt="GENSHI"
      width={200}
      height={200}
      className="w-48 h-48" 
    />
    <h1 className="text-2xl font-bold pb-6">{"Accès refusé"}</h1>
    <div className="flex flex-col items-center justify-center gap-6">
      <p className="text-sm sm:text-md max-w-sm sm:max-w-fit text-center">{"Vous n'avez pas les permissions nécessaires pour accéder à cette page."}</p>
      <Button asChild variant="genshi">
        <Link href="/dashboard">
          {"Accéder au tableau de bord"}
        </Link>
      </Button>
      <span className="pt-16 text-md sm:text-lg flex flex-col items-center justify-center">
        <span className="font-semibold">{"Besoin d'aide?"}</span>
        <a href="mailto:support@genshi.xyz" className="hover:underline">
          {"Contactez nous"}
        </a>
      </span>
    </div>
  </div>
  );
}

export default NoAccessPage;