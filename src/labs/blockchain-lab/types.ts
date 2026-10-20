export enum ModuleType {
  BASICS = 'BASICS',
  ATTACK = 'ATTACK',
  SMART_CONTRACTS = 'SMART_CONTRACTS',
  DB_COMPARISON = 'DB_COMPARISON',
  MINING = 'MINING',
  WALLET = 'WALLET',
  NFT = 'NFT',
  DAO = 'DAO',
  DEFI = 'DEFI',
  STAKING = 'STAKING',
  LAYER2 = 'LAYER2',
  ORACLES = 'ORACLES',
  BRIDGES = 'BRIDGES',
  ZKP = 'ZKP',
  GAS = 'GAS',
  INTEROP = 'INTEROP',
  CBDC = 'CBDC',
  TOKENOMICS = 'TOKENOMICS',
  HISTORY = 'HISTORY'
}

export interface BlockData {
  id: number;
  hash: string;
  prevHash: string;
  data: string;
  status: 'pending' | 'active' | 'verified' | 'tampered';
  isGenesis?: boolean;
}

export interface SimulationStep {
  id: number;
  title: string;
  description: string;
}

export type NetworkNodeStatus = 'waiting' | 'syncing' | 'verified' | 'error';

export interface SmartContractState {
  balance: number;
  target: number;
  status: 'deployed' | 'waiting' | 'executed' | 'failed';
}

export interface KeyConcept {
  title: string;
  description: string;
}

export interface EducationalContent {
  title: string;
  steps: string[];
  didYouKnow: string;
  keyConcepts: KeyConcept[];
  maxSteps: number;
}
