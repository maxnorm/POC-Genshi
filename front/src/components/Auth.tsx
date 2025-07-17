'use client';

import { useAccount } from 'wagmi';
import AuthPage from './pages/AuthPage';

function Auth({ children }: { children: React.ReactNode }) {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
     <AuthPage />
    );
  }

  return <>{children}</>;
}

export default Auth;