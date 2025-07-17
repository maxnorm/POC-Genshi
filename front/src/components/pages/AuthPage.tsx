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
    <h1 className="text-2xl font-bold pb-6">Authentification requise</h1>
    <div className="flex flex-col items-center justify-center gap-6">
      <p className="text-sm sm:text-md max-w-sm sm:max-w-fit text-center">Connectez votre wallet pour accéder au tableau de bord.</p>
      <ConnectButton label="Se connecter"/>
      <Link href="/" className="text-sm sm:text-md text-genshi-blue-secondary">
        Retour à l'accueil
      </Link>
      <span className="pt-16 text-md sm:text-lg">
        Besoin d'aide?{" "}
        <a href="mailto:support@genshi.xyz" className="hover:underline">
          Contactez-nous
        </a>
      </span>
    </div>
  </div>
  );
}

export default AuthPage;