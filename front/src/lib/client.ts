/* 
createPublicClient : 
Une fonction utilisée pour créer un client qui peut interagir avec la blockchain 
sans nécessiter de compte utilisateur ou de clé privée. Cela est souvent utilisé 
pour lire des données d'un contrat intelligent.

http : 
Une fonction qui spécifie le mode de transport pour la communication 
avec la blockchain, dans ce cas, via des requêtes HTTP.

hardhat : 
Un objet qui représente la chaîne Hardhat, utilisée pour le développement
et le test de contrats intelligents localement avant leur déploiement sur une chaîne publique.
*/
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