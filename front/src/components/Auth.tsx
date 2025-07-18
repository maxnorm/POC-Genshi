'use client';

import { useAccount } from 'wagmi';
import AuthPage from './pages/AuthPage';

/**
 * Auth component
 * This is a wrapper to check if the user is connected and redirect to the auth page if not
 * @param children - The children components
 * @returns {Object} The Auth component
 */
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