import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Hook to redirect the user to the path when connected
 * @param path - The path to redirect to
 */
function useRedirectWhenConnected(path: string) {
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      router.push(path);
    }
  }, [isConnected, router, path]);  
}

export default useRedirectWhenConnected;