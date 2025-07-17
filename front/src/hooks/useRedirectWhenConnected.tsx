import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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