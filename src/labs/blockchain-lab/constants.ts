import { ModuleType, EducationalContent } from "./types";

export const MODULES = [
  { id: ModuleType.BASICS, label: "01. Blockchain Basics" },
  { id: ModuleType.ATTACK, label: "02. Attack Simulation" },
  { id: ModuleType.SMART_CONTRACTS, label: "03. Smart Contracts" },
  { id: ModuleType.DB_COMPARISON, label: "04. DB vs Blockchain" },
  { id: ModuleType.MINING, label: "05. Proof of Work (Mining)" },
  { id: ModuleType.WALLET, label: "06. Wallets & Keys" },
  { id: ModuleType.NFT, label: "07. NFTs & Ownership" },
  { id: ModuleType.DAO, label: "08. DAOs & Governance" },
  { id: ModuleType.DEFI, label: "09. DeFi & Liquidity" },
  { id: ModuleType.STAKING, label: "10. Proof of Stake" },
  { id: ModuleType.LAYER2, label: "11. Layer 2 Scaling" },
  { id: ModuleType.ORACLES, label: "12. Oracles (Real World)" },
  { id: ModuleType.BRIDGES, label: "13. Cross-Chain Bridges" },
  { id: ModuleType.ZKP, label: "14. Zero Knowledge Proofs" },
  { id: ModuleType.GAS, label: "15. Gas & Network Fees" },
  { id: ModuleType.INTEROP, label: "16. Interoperability" },
  { id: ModuleType.CBDC, label: "17. Digital Currencies" },
  { id: ModuleType.TOKENOMICS, label: "18. Token Economics" },
  { id: ModuleType.HISTORY, label: "19. History of Money" },
];

export const INITIAL_BLOCKS = [
  { id: 1, hash: "0000abc...", prevHash: "0000000...", data: "Genesis Block", status: "verified", isGenesis: true },
  { id: 2, hash: "0000def...", prevHash: "0000abc...", data: "Tx: User A -> B", status: "verified" },
  { id: 3, hash: "0000ghi...", prevHash: "0000def...", data: "Tx: User C -> A", status: "active" }
];

export const EDUCATIONAL_CONTENT: Record<ModuleType, EducationalContent> = {
  [ModuleType.BASICS]: {
    title: "How Blockchain Works",
    steps: ["A transaction is created.", "Grouped into a block.", "Hash is generated.", "Distributed to nodes.", "Consensus reached.", "Block added to chain.", "Verified & Secure."],
    didYouKnow: "Bitcoin's blockchain has never been hacked. Only the apps built on top of it.",
    keyConcepts: [
      { title: "Distributed Ledger", description: "Every node has a copy." },
      { title: "Hashing", description: "Unique digital fingerprints." }
    ],
    maxSteps: 6
  },
  [ModuleType.ATTACK]: {
    title: "Security & Tampering",
    steps: ["Select a block to attack.", "Modify block data.", "Hash breaks.", "Chain reaction starts.", "Network detects mismatch.", "Tampered chain rejected."],
    didYouKnow: "A 51% attack on Bitcoin would cost billions in hardware and electricity today.",
    keyConcepts: [
      { title: "Immutability", description: "Data cannot be changed." },
      { title: "Avalanche Effect", description: "Small changes break the whole chain." }
    ],
    maxSteps: 0
  },
  [ModuleType.SMART_CONTRACTS]: {
    title: "Smart Contracts",
    steps: ["Code is deployed.", "Waiting for event...", "Transaction arrives.", "Conditions checked.", "Code executes.", "Assets transferred."],
    didYouKnow: "Smart contracts are 'deterministic'—the same input always results in the same output.",
    keyConcepts: [
      { title: "Trustless", description: "No middleman needed." },
      { title: "Self-Executing", description: "Code is law." }
    ],
    maxSteps: 5
  },
  [ModuleType.DB_COMPARISON]: {
    title: "Blockchain vs Database",
    steps: ["Single admin vs Network.", "Silent edit vs Alert.", "Central vs Decentral.", "Trust comparison."],
    didYouKnow: "Most apps don't need a blockchain; a database is faster and cheaper.",
    keyConcepts: [
      { title: "Centralization", description: "Control by one entity." },
      { title: "Decentralization", description: "Control by many." }
    ],
    maxSteps: 3
  },
  [ModuleType.MINING]: {
    title: "Proof of Work (Mining)",
    steps: ["Transaction pool filled.", "Miners pick transactions.", "Search for the Nonce.", "Mining difficulty check.", "Valid hash found!", "Block reward distributed."],
    didYouKnow: "The difficulty of Bitcoin mining adjusts every 2016 blocks to keep time steady.",
    keyConcepts: [
      { title: "Nonce", description: "Number used once to find a specific hash." },
      { title: "Difficulty", description: "Complexity of the math problem." }
    ],
    maxSteps: 5
  },
  [ModuleType.WALLET]: {
    title: "Wallets & Keys",
    steps: ["Generate Private Key.", "Derive Public Key.", "Create Wallet Address.", "Sign a message.", "Verify signature.", "Transaction broadcast."],
    didYouKnow: "If you lose your private key, your funds are gone forever. 'Not your keys, not your crypto.'",
    keyConcepts: [
      { title: "Private Key", description: "Your digital secret signature." },
      { title: "Public Key", description: "Your digital identity." }
    ],
    maxSteps: 5
  },
  [ModuleType.NFT]: {
    title: "NFTs & Digital Assets",
    steps: ["Digital art upload.", "Metadata creation.", "Minting the token.", "Unique ID assigned.", "Ownership recorded.", "Provenance established."],
    didYouKnow: "NFTs can represent anything unique: art, real estate, or even academic degrees.",
    keyConcepts: [
      { title: "Non-Fungible", description: "Cannot be replaced by something identical." },
      { title: "Metadata", description: "Data about the asset (URI, attributes)." }
    ],
    maxSteps: 5
  },
  [ModuleType.DAO]: {
    title: "DAOs & Governance",
    steps: ["Proposal submitted.", "Quorum check.", "Members cast votes.", "Consensus tallying.", "Execution of code.", "Treasury updated."],
    didYouKnow: "The largest DAOs manage billions of dollars with no human CEO.",
    keyConcepts: [
      { title: "Quorum", description: "Minimum votes needed for a decision." },
      { title: "On-Chain Voting", description: "Voting recorded permanently." }
    ],
    maxSteps: 5
  },
  [ModuleType.DEFI]: {
    title: "DeFi & Liquidity",
    steps: ["Deposit assets.", "Liquidity pool creation.", "Automated Market Maker (AMM).", "Swap Token A for B.", "Fee distribution.", "Yield generation."],
    didYouKnow: "DeFi allows you to lend and borrow money globally without a bank account.",
    keyConcepts: [
      { title: "Liquidity Pool", description: "Crowdsourced tokens for trading." },
      { title: "Yield", description: "Interest earned on deposited assets." }
    ],
    maxSteps: 5
  },
  [ModuleType.STAKING]: {
    title: "Proof of Stake",
    steps: ["Lock up tokens.", "Validator selection.", "Proposing a block.", "Attestation (Checking).", "Reward distribution.", "Slashing (Penalty)."],
    didYouKnow: "Ethereum reduced its energy consumption by 99.9% after switching to Proof of Stake.",
    keyConcepts: [
      { title: "Validator", description: "Nodes that secure the network." },
      { title: "Slashing", description: "Losing tokens for bad behavior." }
    ],
    maxSteps: 5
  },
  [ModuleType.LAYER2]: {
    title: "Layer 2 Scaling",
    steps: ["Transactions on L2.", "Batching transactions.", "Generating Proof.", "Settlement on L1.", "Data compressed.", "Finality reached."],
    didYouKnow: "Layer 2s are like HOV lanes for a highway, grouping cars to speed up traffic.",
    keyConcepts: [
      { title: "Rollup", description: "Bundling transactions together." },
      { title: "Scaling", description: "Increasing throughput capacity." }
    ],
    maxSteps: 5
  },
  [ModuleType.ORACLES]: {
    title: "Blockchain Oracles",
    steps: ["External data request.", "Oracle nodes query source.", "Data verification.", "Aggregation.", "Feeding to Smart Contract.", "Action triggered."],
    didYouKnow: "Smart contracts can't 'see' the internet. Oracles are their eyes and ears.",
    keyConcepts: [
      { title: "Data Feed", description: "Real-world price or event info." },
      { title: "Deterministic", description: "Why blockchains can't call APIs." }
    ],
    maxSteps: 5
  },
  [ModuleType.BRIDGES]: {
    title: "Cross-Chain Bridges",
    steps: ["Lock assets on Chain A.", "Bridge verification.", "Relayer message.", "Mint assets on Chain B.", "Transfer complete.", "Burn & Unlock."],
    didYouKnow: "Most major hacks in crypto happen at the 'Bridge'—it's a high-value target.",
    keyConcepts: [
      { title: "Interoperability", description: "Chains talking to each other." },
      { title: "Wrapped Tokens", description: "Tokens representing assets on other chains." }
    ],
    maxSteps: 5
  },
  [ModuleType.ZKP]: {
    title: "Zero Knowledge Proofs",
    steps: ["Prover creates claim.", "Secret input masked.", "Generating the ZK Proof.", "Verifier checks proof.", "Verification successful.", "Privacy preserved."],
    didYouKnow: "ZKP lets you prove you are over 18 without revealing your actual birth date.",
    keyConcepts: [
      { title: "Privacy", description: "Verifying without revealing." },
      { title: "Succinctness", description: "Proof is small and fast to check." }
    ],
    maxSteps: 5
  },
  [ModuleType.GAS]: {
    title: "Gas & Fees",
    steps: ["Tx broadcast.", "Mempool congestion.", "Bidding for space.", "Miner selection.", "Execution cost.", "Change returned."],
    didYouKnow: "High gas fees mean the network is in high demand, not that it's broken.",
    keyConcepts: [
      { title: "Gas Limit", description: "Max work allowed for a Tx." },
      { title: "Base Fee", description: "Minimum price to get included." }
    ],
    maxSteps: 5
  },
  [ModuleType.INTEROP]: {
    title: "Interoperability",
    steps: ["Protocol message.", "Cross-chain router.", "Packet forwarding.", "Multi-chain consensus.", "Asset migration.", "Global state."],
    didYouKnow: "Interoperability is the 'Internet of Blockchains' vision.",
    keyConcepts: [
      { title: "IBC", description: "Inter-Blockchain Communication." },
      { title: "Relayers", description: "Messengers between chains." }
    ],
    maxSteps: 5
  },
  [ModuleType.CBDC]: {
    title: "Digital Currencies (CBDC)",
    steps: ["Central Bank issue.", "Commercial bank nodes.", "Programmable money.", "KYC compliance.", "Retail distribution.", "Offline payments."],
    didYouKnow: "CBDCs are centralized and controlled by governments, unlike Bitcoin.",
    keyConcepts: [
      { title: "Permisisoned", description: "Only approved nodes can join." },
      { title: "KYC", description: "Know Your Customer (ID required)." }
    ],
    maxSteps: 5
  },
  [ModuleType.TOKENOMICS]: {
    title: "Token Economics",
    steps: ["Genesis supply.", "Inflation (Minting).", "Deflation (Burning).", "Utility rewards.", "Staking lockup.", "Ecosystem growth."],
    didYouKnow: "Bitcoin is deflationary because its supply is capped at 21 million.",
    keyConcepts: [
      { title: "Supply Cap", description: "Maximum tokens that can exist." },
      { title: "Burn", description: "Removing tokens from circulation." }
    ],
    maxSteps: 5
  },
  [ModuleType.HISTORY]: {
    title: "History of Money",
    steps: ["Barter system.", "Gold coins.", "Paper currency.", "Digital ledgers.", "Cryptocurrency.", "Programmable value."],
    didYouKnow: "The first Bitcoin transaction was for two pizzas (10,000 BTC).",
    keyConcepts: [
      { title: "Ledger", description: "A record of all balances." },
      { title: "Scarcity", description: "Limited supply creates value." }
    ],
    maxSteps: 5
  }
};
