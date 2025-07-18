
import { createPublicClient, http } from 'viem'
import { getNetworkConfig } from './networkConfig'

const { defaultChain, rpcUrl } = getNetworkConfig()

/**
 * Create a public client to interact with the blockchain
 * Specify the chain and the transport
 * @returns {Object} The public client
 */
export const publicClient = createPublicClient({ 
  chain: defaultChain,
  transport: http(rpcUrl)
})