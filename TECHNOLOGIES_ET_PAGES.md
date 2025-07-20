# Technologies et Pages - Application GENSHI

## Technologies Utilisées pour l'Interaction avec les Smart Contracts

### 🏗️ Architecture Frontend

#### **Framework Principal**
- **Next.js 15.4.1** - Framework React avec App Router
- **React 19.1.0** - Bibliothèque UI
- **TypeScript 5** - Typage statique

#### **Technologies Blockchain et Web3**

##### **Wagmi v2.15.7**
- Bibliothèque React pour l'interaction avec Ethereum
- Hooks personnalisés pour les contrats intelligents
- Gestion des transactions et des états

##### **RainbowKit v2.2.8**
- Interface de connexion de portefeuille
- Support multi-portefeuilles (MetaMask, WalletConnect, etc.)
- Thème personnalisé avec couleurs GENSHI

##### **Viem v2.32.0**
- Client Ethereum TypeScript
- Gestion des chaînes et des réseaux
- Support des réseaux de test (Sepolia, Holesky, Hardhat)

##### **TanStack Query v5.83.0**
- Gestion du cache et des états
- Synchronisation des données blockchain
- Optimisation des performances

#### **Interface Utilisateur**
- **Tailwind CSS v4** - Framework CSS utilitaire
- **Radix UI** - Composants d'interface accessibles
- **Lucide React** - Icônes modernes
- **Sonner** - Notifications toast
- **Class Variance Authority** - Gestion des variantes de composants

### 🔧 Architecture Backend (Smart Contracts)

#### **Framework de Développement**
- **Hardhat** - Environnement de développement Ethereum
- **Solidity 0.8.28** - Langage des smart contracts
- **TypeChain** - Génération de types TypeScript

#### **Smart Contracts Principaux**

##### **Système NFT Hiérarchique**
- **EquipmentNFT** - NFT pour équipements (ERC998 Top-Down)
- **AssemblyNFT** - NFT pour assemblages (ERC998 Top-Down)
- **PieceNFT** - NFT pour pièces individuelles

##### **Système de Gestion**
- **TemplateRegistry** - Gestion des modèles de données
- **AccessManager** - Contrôle d'accès basé sur les rôles

#### **Fonctionnalités Avancées**
- **ERC998 Top-Down** - NFTs composables hiérarchiques
- **Système de Rôles** - Contrôle d'accès granulaire
- **Gestion de Documents** - Métadonnées et versioning
- **Système d'Attributs** - Validation et historique

## 📱 Pages Réalisées

### 🏠 **Page d'Accueil**
- **Route**: `/`
- **Fonctionnalités**:
  - Présentation de l'application GENSHI
  - Connexion de portefeuille
  - Redirection vers le dashboard après authentification

### 🔐 **Page d'Authentification**
- **Route**: `/auth`
- **Fonctionnalités**:
  - Vérification de la connexion du portefeuille
  - Contrôle des rôles utilisateur
  - Redirection conditionnelle selon les permissions

### 📊 **Dashboard Principal**
- **Route**: `/dashboard`
- **Fonctionnalités**:
  - Vue d'ensemble des statistiques
  - Activité récente
  - Actions rapides
  - Navigation vers les modules

#### **Composants du Dashboard**
- **DashboardStats** - Statistiques en temps réel
- **RecentActivity** - Activité récente sur la blockchain
- **QuickActions** - Actions rapides pour les tâches courantes

### 📦 **Module Inventaire**
- **Route**: `/dashboard/inventory`
- **Fonctionnalités**:
  - Visualisation hiérarchique des NFTs
  - Filtrage et recherche avancée
  - Vue tableau et arborescence
  - Gestion des équipements, assemblages et pièces

#### **Fonctionnalités Avancées**
- **Filtres Multi-critères**:
  - Par type (Équipement, Assemblage, Pièce)
  - Par statut (Actif, Inactif, Audit, Maintenance)
  - Par modèle de données
  - Recherche textuelle

- **Vue Hiérarchique**:
  - Expansion/réduction des éléments
  - Visualisation de la structure parent-enfant
  - Navigation dans l'arborescence

### 📋 **Module Modèles**
- **Route**: `/dashboard/templates`
- **Fonctionnalités**:
  - Gestion des modèles de données
  - Création et modification de templates
  - Définition d'attributs et documents requis
  - Gestion du cycle de vie (Brouillon → Actif → Inactif)

#### **Types de Modèles Supportés**
- **Modèles de Pièces** - Composants individuels
- **Modèles d'Assemblage** - Groupes de composants
- **Modèles d'Équipement** - Équipements complets

#### **Système d'Attributs**
- **Types Supportés**:
  - Chaînes de caractères
  - Nombres (avec validation)
  - Booléens
  - Énumérations (options prédéfinies)
  - Unités personnalisées (mm, MPa, °C, etc.)

#### **Gestion de Documents**
- **Métadonnées**:
  - Nom et description
  - Type MIME
  - URI et hash pour stockage hors-chaîne
  - Versioning automatique

### 👥 **Module Administration**
- **Route**: `/dashboard/admin`
- **Fonctionnalités**:
  - Gestion des utilisateurs
  - Attribution et révocation de rôles
  - Surveillance des permissions
  - Statistiques d'utilisation

#### **Système de Rôles**
- **Rôles de Gestion**:
  - `EQUIPMENT_MANAGER` - Gestion des équipements
  - `ASSEMBLY_MANAGER` - Gestion des assemblages
  - `PIECE_MANAGER` - Gestion des pièces
  - `TEMPLATE_MANAGER` - Gestion des modèles

- **Rôles Opérationnels**:
  - `EQUIPMENT_MINTER` - Création d'équipements
  - `ASSEMBLY_MINTER` - Création d'assemblages
  - `PIECE_MINTER` - Création de pièces
  - `DOCUMENT_MANAGER` - Gestion des documents

- **Rôles de Contrôle**:
  - `AUDITOR` - Audit et vérification
  - `VALIDATOR` - Validation des opérations
  - `REGULATOR` - Contrôle réglementaire

### 🔍 **Module Audit**
- **Route**: `/dashboard/audit`
- **Fonctionnalités**:
  - Traçabilité complète des opérations
  - Historique des modifications
  - Rapports d'audit
  - Conformité réglementaire

## 🎨 **Interface Utilisateur**

### **Design System**
- **Thème GENSHI**:
  - Couleurs principales: Bleu (#000f24, #03c0f9)
  - Typographie système
  - Bordures arrondies
  - Effets de flou et transparence

### **Composants UI**
- **Navigation**:
  - Sidebar rétractable
  - Breadcrumbs
  - Navigation par onglets

- **Tableaux**:
  - Tri et filtrage
  - Pagination
  - Actions en lot
  - Expansion des lignes

- **Formulaires**:
  - Validation en temps réel
  - Champs dynamiques
  - Upload de fichiers
  - Prévisualisation

- **Notifications**:
  - Toast notifications
  - États de chargement
  - Messages d'erreur
  - Confirmations

## 🔗 **Intégration Blockchain**

### **Connexion de Portefeuille**
```typescript
// Configuration RainbowKit
const config = getDefaultConfig({
  appName: 'GENSHI',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  chains: [wagmiChain],
  ssr: true,
});
```

### **Interaction avec les Smart Contracts**
```typescript
// Hook personnalisé pour les écritures
const { write, isPending, isSuccess, error } = useWriteContract(
  contractAddress,
  contractABI
);

// Exemple d'utilisation
const mintEquipment = async (templateId: number) => {
  await write('mint', [userAddress, templateId]);
};
```

### **Gestion des Événements**
```typescript
// Hook pour écouter les événements
const { data: events } = useContractEvent({
  address: contractAddress,
  abi: contractABI,
  eventName: 'MintedEquipment',
});
```

## 🌐 **Réseaux Supportés**

### **Réseaux de Test**
- **Sepolia** - Testnet Ethereum
- **Holesky** - Testnet Ethereum (nouveau)
- **Hardhat** - Réseau local de développement

### **Configuration Réseau**
```typescript
const networks = {
  hardhat: {
    rpcUrl: 'http://127.0.0.1:8545',
    contractsAddresses: { /* ... */ }
  },
  sepolia: {
    rpcUrl: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL,
    contractsAddresses: { /* ... */ }
  },
  holesky: {
    rpcUrl: process.env.NEXT_PUBLIC_HOLESKY_RPC_URL,
    contractsAddresses: { /* ... */ }
  }
};
```

## 📊 **Fonctionnalités Avancées**

### **Système de Cache**
- Mise en cache des données blockchain
- Synchronisation automatique
- Optimisation des performances

### **Gestion d'État**
- Context API React
- Hooks personnalisés
- État global de l'application

### **Sécurité**
- Validation côté client et serveur
- Contrôle d'accès basé sur les rôles
- Protection contre les attaques courantes

### **Performance**
- Lazy loading des composants
- Optimisation des requêtes blockchain
- Compression des assets

## 🚀 **Déploiement**

### **Frontend**
- **Vercel** - Déploiement automatique
- **Variables d'environnement** - Configuration par environnement
- **CDN** - Distribution globale

### **Smart Contracts**
- **Hardhat** - Scripts de déploiement
- **Etherscan** - Vérification des contrats
- **Tests automatisés** - Assurance qualité

---

*Ce document décrit l'architecture complète de l'application GENSHI, une solution de traçabilité industrielle basée sur la blockchain Ethereum et les NFTs hiérarchiques.* 