import { NFTType } from "@/lib/enums/nftType";

export interface NFTItem {
  id: number;
  type: NFTType;
  contractAddress: string;
  owner: string;
  name?: string;
  status?: 'active' | 'inactive' | 'audit' | 'maintenance';
  templateId?: number;
  templateName?: string;
  attributes?: Record<string, any>;
  documents?: any[];
  children?: NFTItem[];
  createdAt?: Date;
  lastUpdated?: Date;
} 