'use client';

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { useAccount } from 'wagmi';
import { Button } from "@/components/ui/button"
import Link from "next/link";
import useRedirectWhenConnected from "@/hooks/user/useRedirectWhenConnected";

/**
 * Home page
 * This is the home page of the application
 * @returns {Object} The HomePage component
 */
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
    <h1 className="text-2xl font-bold pb-6">Bienvenue sur GENSHI</h1>
    <div className="flex flex-col items-center justify-center gap-6">
      <p className="text-sm sm:text-md max-w-sm sm:max-w-fit text-center">
        Passeport numérique sécurisé pour la traçabilité et le suivi de vos équipements critiques
      </p>
      {isConnected ? (
        <Button asChild variant="genshi">
          <Link href="/dashboard">
            Accéder au tableau de bord
          </Link>
        </Button>
      ) : (
        <ConnectButton label="Se connecter"/>
      )}
      <span className="pt-16 text-md sm:text-lg flex flex-col items-center justify-center">
        <span className="font-semibold">Questions sur GENSHI?</span>
        <a href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`} className="hover:underline">
          Contactez notre équipe
        </a>
      </span>
    </div>
  </div>
  );
}

export default HomePage;