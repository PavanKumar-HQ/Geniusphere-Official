
import React from 'react';
import { Step } from './types';

export const THEME = {
  bg: '#050816',
  blockchain: '#3BF0FF', // Cyan
  transaction: '#00FFA3', // Neon Green
  node: '#7C6BFF', // Purple
  risk: '#FF4D4D', // Red
  text: '#E6E9F0'
};

export const STEPS: Step[] = [
  {
    id: 1,
    title: 'Problem with Traditional Money',
    description: 'Traditional money relies on banks and intermediaries. Transfers can be slow and expensive.',
  },
  {
    id: 2,
    title: 'Digital Money Concept',
    description: 'Cryptocurrency is money that exists only in digital form, secured by complex mathematics.',
  },
  {
    id: 3,
    title: 'Blockchain Appears',
    description: 'A blockchain is a public digital record of transactions that everyone can see but no one can secretly change.',
    status: 'BLOCKCHAIN_CREATED'
  },
  {
    id: 4,
    title: 'Decentralized Network',
    description: 'No single authority controls cryptocurrency. It lives on thousands of computers globally.',
  },
  {
    id: 5,
    title: 'Wallet & Keys',
    description: 'A wallet stores your crypto access keys, not physical money. Keep your private key secret!',
  },
  {
    id: 6,
    title: 'Transaction Flow',
    description: 'Transactions are verified by the network and added to the blockchain as new blocks.',
    status: 'TRANSACTION_CONFIRMED'
  },
  {
    id: 7,
    title: 'Mining & Validation',
    description: 'Some networks use miners or validators to secure the system and process transactions.',
  },
  {
    id: 8,
    title: 'Price Volatility',
    description: 'Crypto prices can change rapidly and unpredictably. It is a highly experimental asset.',
    status: 'HIGH_VOLATILITY'
  },
  {
    id: 9,
    title: 'Use Cases',
    description: 'Crypto can be used for global payments, smart contracts, and proving digital ownership.',
  },
  {
    id: 10,
    title: 'Risks & Responsibility',
    description: 'Crypto involves risks like scams, price crashes, and lost access. Education is your best defense.',
  }
];

export const MYTHS = [
  { myth: "Crypto makes everyone rich", fact: "Crypto is experimental and highly risky technology." },
  { myth: "Crypto is completely anonymous", fact: "Most blockchains are public and transparent records." },
  { myth: "Crypto is illegal everywhere", fact: "Laws differ by country; many recognize it as a digital asset." }
];
