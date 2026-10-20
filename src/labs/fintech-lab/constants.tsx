
import React from 'react';
import { ModuleId, ModuleData } from './types';

export const COLORS = {
  PAYMENTS: '#00FFA3',
  BANKING: '#3BF0FF',
  LENDING: '#7C6BFF',
  SECURITY: '#4DA3FF',
  RISK: '#FF4D4D',
  NEUTRAL: '#E6E9F0',
  BG: '#070B1A'
};

export const MODULES: ModuleData[] = [
  {
    id: ModuleId.WHAT_IS_FINTECH,
    title: "What is FinTech?",
    description: "FinTech uses technology to improve financial services. It's about making money smarter.",
    color: COLORS.SECURITY,
    statusText: "SYSTEM_READY",
    statusType: 'neutral'
  },
  {
    id: ModuleId.DIGITAL_PAYMENTS,
    title: "Digital Payments",
    description: "Money moves instantly using apps. No more waiting for days to clear checks.",
    color: COLORS.PAYMENTS,
    statusText: "PAYMENT_COMPLETED",
    statusType: 'success'
  },
  {
    id: ModuleId.ONLINE_BANKING,
    title: "Online Banking",
    description: "Banking can be done anytime, anywhere. Your bank is in your pocket.",
    color: COLORS.BANKING,
    statusText: "DASHBOARD_ACTIVE",
    statusType: 'success'
  },
  {
    id: ModuleId.UPI_MOBILE_WALLETS,
    title: "UPI & Wallets",
    description: "UPI connects banks through mobile apps using simple IDs like 'name@bank'.",
    color: COLORS.PAYMENTS,
    statusText: "WALLET_SYNCED",
    statusType: 'success'
  },
  {
    id: ModuleId.SECURITY,
    title: "FinTech Security",
    description: "Multi-factor authentication (MFA) keeps your digital money safe from intruders.",
    color: COLORS.SECURITY,
    statusText: "USER_VERIFIED",
    statusType: 'success'
  },
  {
    id: ModuleId.FRAUD_DETECTION,
    title: "Fraud Detection",
    description: "AI monitors millions of transactions to spot patterns that look like theft.",
    color: COLORS.RISK,
    statusText: "FRAUD_BLOCKED",
    statusType: 'error'
  },
  {
    id: ModuleId.DIGITAL_LENDING,
    title: "Digital Lending",
    description: "Need help starting a business? Algorithms can approve loans in minutes.",
    color: COLORS.LENDING,
    statusText: "CREDIT_APPROVED",
    statusType: 'success'
  },
  {
    id: ModuleId.INVESTING_APPS,
    title: "Investing Apps",
    description: "Apps make it easy to grow your savings, but long-term patience is the key.",
    color: COLORS.LENDING,
    statusText: "PORTFOLIO_TRACKING",
    statusType: 'neutral'
  },
  {
    id: ModuleId.DAILY_LIFE,
    title: "Daily Life",
    description: "From school fees to food delivery, FinTech makes daily tasks seamless.",
    color: COLORS.BANKING,
    statusText: "LIFESTYLE_INTEGRATED",
    statusType: 'success'
  },
  {
    id: ModuleId.RESPONSIBLE_USE,
    title: "Responsible Use",
    description: "Technology works best when you manage your budget and stay alert.",
    color: COLORS.SECURITY,
    statusText: "FINTECH_SMART_USER",
    statusType: 'success'
  }
];

export const SAFETY_RULES = [
  "Never share OTP or PIN",
  "Use trusted apps only",
  "Enable security alerts",
  "Track spending digitally",
  "Update apps regularly"
];

export const DID_YOU_KNOW = [
  "India is one of the world’s largest FinTech markets because of UPI.",
  "Digital payments are expected to reach trillions of dollars annually by 2030.",
  "FinTech helps people without physical banks to manage their money safely.",
  "The 'Fin' stands for Finance and 'Tech' stands for Technology.",
  "Biometric security like fingerprints is much harder to hack than just passwords."
];
