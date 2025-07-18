import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";

function useWrite( contractAddress: string, contractABI: any ) {
  const { data: hash, error, isPending, writeContract } = useWriteContract()
  const { isLoading: isConfirming, isSuccess, error: errorConfirmation } =
    useWaitForTransactionReceipt({
      hash
    })


    /** 
   * Write a contract function
   * @param {string} functionName The function name to call
   * @param {any[]} args The function arguments
   * @returns {Promise<any>} The promise of the transaction
  */
    const write = async (functionName: string, args: any[] = []) => {
      return writeContract({
        address: contractAddress as `0x${string}`,
        abi: contractABI,
        functionName,
        args
      })
    };   

    return {
      hash,
      write,  
      isPending,
      isConfirming,
      isSuccess,
      error,
      errorConfirmation
    }
}

export default useWrite;