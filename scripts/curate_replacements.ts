import fs from 'fs';
import path from 'path';
import { ALL_CANONICAL_17_TOPICS } from '../src/curriculum/index';

interface FailingLesson {
  lessonId: string;
  topicId: string;
  orderIndex: number;
  title: string;
  learningObjective: string;
  currentVideoId: string;
}

const SPECIFIC_QUERIES: Record<string, string[]> = {
  // Blockchain (1)
  'lesson-bc-9': ['Merkle Trees Computerphile', 'Merkle Tree Blockchain Telusko'],

  // MS Office (5)
  'lesson-off-5': ['Excel XLOOKUP VLOOKUP Kevin Stratvert', 'How to use XLOOKUP in Excel Kevin Stratvert'],
  'lesson-off-6': ['Conditional Formatting Excel Kevin Stratvert', 'Conditional Formatting in Excel Leila Gharani'],
  'lesson-off-7': ['Excel Dynamic Charts Dashboards Kevin Stratvert', 'Excel Dashboards Leila Gharani'],
  'lesson-off-8': ['Word Formatting Tables Headers Styles Kevin Stratvert', 'Microsoft Word Tutorial Headers Styles'],
  'lesson-off-10': ['Microsoft Teams Cloud Collaboration Kevin Stratvert', 'Microsoft Teams Tutorial Kevin Stratvert'],

  // Cybersecurity (5)
  'lesson-cyber-6': ['Password Cracking Computerphile', 'SHA256 Computerphile', 'Password Hashing Security Computerphile'],
  'lesson-cyber-7': ['How Firewalls Work PowerCert Animated Videos', 'Firewall Basics NetworkChuck'],
  'lesson-cyber-8': ['Phishing Social Engineering PowerCert Animated Videos', 'Phishing Attacks Explained IBM Technology'],
  'lesson-cyber-9': ['Man in the Middle Attack PowerCert Animated Videos', 'TLS Handshake Computerphile'],
  'lesson-cyber-10': ['Ransomware 3 2 1 Backup Strategy PowerCert', '3 2 1 Backup Rule Techquickie'],

  // IoT (7)
  'lesson-iot-4': ['Raspberry Pi Beginner Guide ExplainingComputers', 'Raspberry Pi 4 Setup Guide NetworkChuck'],
  'lesson-iot-5': ['Sensors and Actuators IoT IBM Technology', 'Sensors and Actuators Explained'],
  'lesson-iot-6': ['Edge Computing vs Cloud Computing IBM Technology', 'Edge Computing Explained Simplilearn'],
  'lesson-iot-7': ['Zigbee LoRaWAN BLE WiFi IoT IBM Technology', 'Wireless Protocols IoT Explained'],
  'lesson-iot-8': ['Analog to Digital Conversion SparkFun', 'PWM Signals Explained SparkFun'],
  'lesson-iot-9': ['ESP32 Home Automation Project Tutorial', 'ESP32 IoT Beginner Guide Random Nerd Tutorials'],
  'lesson-iot-10': ['IoT Security Challenges IBM Technology', 'Securing IoT Devices Explained'],

  // Intro Finance (5)
  'lesson-fin-5': ['50 30 20 Rule Budgeting Two Cents PBS', '50 30 20 Budgeting Rule Explained'],
  'lesson-fin-6': ['Credit Scores Explained Two Cents PBS', 'Understanding Credit Scores and Debt Two Cents'],
  'lesson-fin-8': ['Emergency Funds Two Cents PBS', 'Emergency Fund How Much To Save Two Cents'],
  'lesson-fin-9': ['How to Start Investing for Beginners Two Cents PBS', 'Stock Investing for Beginners Two Cents'],
  'lesson-fin-10': ['How to Calculate Net Worth The Plain Bagel', 'Asset Allocation Explained The Plain Bagel'],

  // Stock Market (9)
  'lesson-stock-2': ['Stock Market for Beginners The Plain Bagel', 'How the Stock Market Works The Plain Bagel'],
  'lesson-stock-3': ['How to Read Candlestick Charts Rayner Teo', 'Candlestick Charts for Beginners'],
  'lesson-stock-4': ['Order Book Bids Asks Spreads Plain Bagel', 'Order Book Explained Bids Asks Spreads'],
  'lesson-stock-5': ['Valuation Metrics PE Ratio The Plain Bagel', 'PE Ratio Explained The Plain Bagel'],
  'lesson-stock-6': ['Index Funds vs Individual Stocks The Plain Bagel', 'Index Funds and ETFs Explained Ben Felix'],
  'lesson-stock-7': ['Dividends and DRIP Explained The Plain Bagel', 'Dividend Investing The Plain Bagel'],
  'lesson-stock-8': ['Modern Portfolio Theory Diversification Ben Felix', 'Portfolio Diversification The Plain Bagel'],
  'lesson-stock-9': ['Stock Beta Systematic Risk Explained The Plain Bagel', 'What is Beta in Stock Market'],
  'lesson-stock-10': ['Short Selling Explained The Plain Bagel', 'Market Corrections and Bear Markets The Plain Bagel'],

  // Cryptocurrency (9)
  'lesson-crypto-1': ['How Bitcoin Works Under the Hood 3Blue1Brown', 'How Bitcoin Actually Works Computerphile'],
  'lesson-crypto-2': ['Bitcoin Halving Explained Simply Explained', 'What is the Bitcoin Halving Finematics'],
  'lesson-crypto-4': ['Automated Market Makers AMM Uniswap Finematics', 'Uniswap AMM Explained Whiteboard Crypto'],
  'lesson-crypto-5': ['Crypto Wallets Public Private Keys Whiteboard Crypto', 'How Crypto Wallets Work Finematics'],
  'lesson-crypto-6': ['Proof of Stake Explained Simply Explained', 'Proof of Stake vs Proof of Work Finematics'],
  'lesson-crypto-7': ['Impermanent Loss Explained Finematics', 'Impermanent Loss Uniswap Whiteboard Crypto'],
  'lesson-crypto-8': ['Stablecoins Explained USDT USDC DAI Finematics', 'How Stablecoins Work Whiteboard Crypto'],
  'lesson-crypto-9': ['Tokenomics Explained Whiteboard Crypto', 'Crypto Tokenomics Finematics'],
  'lesson-crypto-10': ['Crypto Scams Rugpulls Phishing Whiteboard Crypto', 'Crypto Security Best Practices Finematics'],

  // FinTech (10)
  'lesson-fintech-1': ['What is FinTech CNBC', 'FinTech Explained CNBC International'],
  'lesson-fintech-2': ['How UPI Works NPCI Real-Time Payments', 'UPI Payment System Explained'],
  'lesson-fintech-3': ['Credit Card Interchange Fees Payment Gateways CNBC', 'How Credit Card Processing Works'],
  'lesson-fintech-4': ['Open Banking Explained APIs FinTech', 'What is Open Banking Plaid'],
  'lesson-fintech-5': ['Buy Now Pay Later BNPL CNBC', 'The Real Cost of Buy Now Pay Later Two Cents'],
  'lesson-fintech-6': ['Robo-Advisors Automated Investing The Plain Bagel', 'How Robo Advisors Work Two Cents'],
  'lesson-fintech-7': ['AI Fraud Detection in Banking IBM Technology', 'Machine Learning Fraud Detection Explained'],
  'lesson-fintech-8': ['Peer to Peer P2P Lending Explained', 'How P2P Lending Works FinTech'],
  'lesson-fintech-9': ['SWIFT Payment System Explained CNBC', 'How SWIFT Works Cross Border Payments'],
  'lesson-fintech-10': ['Micro-Investing Acorns Round-Ups Two Cents', 'Micro Investing Apps Explained'],

  // Global Economy (6)
  'lesson-econ-2': ['Gross Domestic Product GDP CrashCourse Economics', 'What is GDP Khan Academy'],
  'lesson-econ-3': ['Monetary Policy Federal Reserve CrashCourse Economics', 'Federal Reserve Monetary Policy Khan Academy'],
  'lesson-econ-7': ['Foreign Exchange Rates Currency CrashCourse Economics', 'Exchange Rates Khan Academy'],
  'lesson-econ-8': ['Comparative Advantage Trade CrashCourse Economics', 'Comparative Advantage Khan Academy'],
  'lesson-econ-9': ['The Business Cycle CrashCourse Economics', 'Recessions and Depressions CrashCourse Economics'],
  'lesson-econ-10': ['Yield Curve Bond Markets The Plain Bagel', 'Inverted Yield Curve Explained The Plain Bagel'],

  // Banking (7)
  'lesson-bank-2': ['High-Yield Savings Accounts HYSA Two Cents PBS', 'High Yield Savings Account Explained Ali Abdaal'],
  'lesson-bank-3': ['Certificates of Deposit CD Laddering Two Cents PBS', 'CD Ladder Explained FinTech'],
  'lesson-bank-4': ['Money Market Accounts vs Savings Two Cents PBS', 'Money Market Funds vs High Yield Savings'],
  'lesson-bank-5': ['FDIC Insurance How Bank Failures Work Two Cents PBS', 'FDIC Insurance Explained Khan Academy'],
  'lesson-bank-8': ['Roth IRA vs Traditional IRA Two Cents PBS', 'Roth IRA Explained Plain Bagel'],
  'lesson-bank-9': ['Health Savings Account HSA Two Cents PBS', 'HSA Triple Tax Advantage Explained'],
  'lesson-bank-10': ['Pay Yourself First Automating Money Two Cents PBS', 'Automate Your Finances Ali Abdaal'],

  // Communication (5)
  'lesson-comm-4': ['Nonviolent Communication Marshall Rosenberg Summary', 'NVC Nonviolent Communication Sprouts'],
  'lesson-comm-5': ['Bottom Line Up Front BLUF Executive Communication', 'BLUF Communication Technique'],
  'lesson-comm-8': ['Negotiation Anchoring ZOPA Harvard Business Review', 'Negotiation Skills Chris Voss'],
  'lesson-comm-9': ['30 Second Elevator Pitch Harvard Business Review', 'How to Give an Elevator Pitch TED'],
  'lesson-comm-10': ['Difficult Conversations Workplace Harvard Business Review', 'Crucial Conversations Summary'],

  // Time Management (4)
  'lesson-time-6': ['How to Time Block Your Calendar Ali Abdaal', 'Time Blocking Calendar Tutorial Thomas Frank'],
  'lesson-time-7': ['Parkinsons Law Overcoming Procrastination Ali Abdaal', 'Parkinsons Law Thomas Frank'],
  'lesson-time-8': ['80 20 Rule Pareto Principle Productivity Ali Abdaal', 'Pareto Principle Sprouts'],
  'lesson-time-9': ['Context Switching Cost Productivity', 'Multitasking and Context Switching Explained'],

  // Soft Skills (4)
  'lesson-soft-2': ['Emotional Intelligence Daniel Goleman Sprouts', 'Emotional Intelligence TED'],
  'lesson-soft-3': ['Growth Mindset vs Fixed Mindset Sprouts', 'Growth Mindset Carol Dweck TED'],
  'lesson-soft-5': ['Conflict Resolution Thomas Kilmann Model Sprouts', 'Thomas Kilmann Conflict Resolution Styles'],
  'lesson-soft-10': ['Ethical Decision Making Business Ethics', 'Ethical Dilemmas in Business Explained'],

  // Startup Ideation (10)
  'lesson-startup-1': ['How to Get Startup Ideas Y Combinator', 'How to Evaluate Startup Ideas Y Combinator'],
  'lesson-startup-2': ['Lean Canvas Business Model Ash Maurya', 'How to Build a Lean Canvas Slidebean'],
  'lesson-startup-3': ['The Mom Test Customer Discovery Rob Fitzpatrick', 'How to Talk to Users Y Combinator'],
  'lesson-startup-4': ['Market Sizing TAM SAM SOM Slidebean', 'How to Calculate TAM SAM SOM Y Combinator'],
  'lesson-startup-5': ['7 Powers Hamilton Helmer Competitive Moat', 'Business Moats Explained Slidebean'],
  'lesson-startup-6': ['How to Build an MVP Y Combinator', 'Minimum Viable Product Michael Seibel YC'],
  'lesson-startup-7': ['Product Market Fit Michael Seibel Y Combinator', 'How to Find Product Market Fit Y Combinator'],
  'lesson-startup-8': ['Startup Unit Economics CAC LTV Slidebean', 'Unit Economics for Startups Explained'],
  'lesson-startup-9': ['How to Pitch Your Startup Y Combinator', '10 Slide Pitch Deck Guy Kawasaki Slidebean'],
  'lesson-startup-10': ['Startup Runway and Cash Management Y Combinator', 'How to Manage Startup Cash Runway'],

  // Social Profile (10)
  'lesson-social-1': ['LinkedIn Profile Optimization CareerVidz', 'LinkedIn Profile Tips for Job Seekers'],
  'lesson-social-2': ['Google XYZ Resume Formula Harvard Business Review', 'How to Write Resume Bullet Points CareerVidz'],
  'lesson-social-3': ['GitHub Profile README Tutorial freeCodeCamp', 'How to Build a Standout GitHub Portfolio'],
  'lesson-social-4': ['Beat Applicant Tracking Systems ATS CareerVidz', 'How ATS Works Resume Tips'],
  'lesson-social-5': ['Informational Interviews Cold Email Networking Harvard Business Review', 'How to Network CareerVidz'],
  'lesson-social-6': ['Web Developer Portfolio Website Tutorial Kevin Powell', 'How to Build a Coding Portfolio freeCodeCamp'],
  'lesson-social-7': ['Learn in Public Swyx Developer Career', 'Learning in Public for Developers'],
  'lesson-social-8': ['Online Privacy Digital Footprint The Hated One', 'How to Clean Up Your Digital Footprint'],
  'lesson-social-9': ['STAR Method Interview Technique CareerVidz', 'How to Use the STAR Interview Technique'],
  'lesson-social-10': ['Salary Negotiation Tech CareerVidz', 'How to Negotiate Salary Harvard Business Review'],
};

async function searchCandidates(query: string): Promise<string[]> {
  const url = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(query);
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
    if (!res.ok) return [];
    const html = await res.text();
    const matches = [...html.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g)];
    const ids = Array.from(new Set(matches.map((m) => m[1])));
    return ids;
  } catch (e) {
    return [];
  }
}

async function verifyOembed(id: string): Promise<{ title: string; author_name: string } | null> {
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`;
    const res = await fetch(oembedUrl);
    if (!res.ok) return null;
    const data = await res.json();
    return { title: data.title, author_name: data.author_name };
  } catch (e) {
    return null;
  }
}

export async function curateAll() {
  const inventory: any[] = JSON.parse(fs.readFileSync('scratch/lesson_inventory_audit.json', 'utf-8'));
  const validIds = new Set<string>();
  
  // Track all valid existing IDs
  inventory.forEach((item) => {
    if (item.verificationStatus === 'VERIFIED') {
      validIds.add(item.currentVideoId);
    }
  });

  const failing = inventory.filter((item) => item.verificationStatus !== 'VERIFIED');
  console.log(`Found ${failing.length} failing lessons needing curation. Currently ${validIds.size} valid IDs in use.`);

  const curatedReplacements: Record<string, { videoId: string; title: string; channel: string; url: string }> = {};

  for (let i = 0; i < failing.length; i++) {
    const lesson = failing[i];
    console.log(`[${i + 1}/${failing.length}] Curating: ${lesson.lessonId} - ${lesson.title}`);

    const queries = SPECIFIC_QUERIES[lesson.lessonId] || [
      `${lesson.title} tutorial educational`,
      `${lesson.title} explained`,
    ];

    let found = false;

    for (const query of queries) {
      const candidateIds = await searchCandidates(query);
      for (const candId of candidateIds) {
        if (validIds.has(candId)) continue; // avoid duplicate across curriculum

        const meta = await verifyOembed(candId);
        if (!meta) continue;

        // Skip shorts if possible
        if (meta.title.toLowerCase().includes('#short')) continue;

        console.log(`  -> Selected: ${candId} | "${meta.title}" by ${meta.author_name}`);
        validIds.add(candId);
        curatedReplacements[lesson.lessonId] = {
          videoId: candId,
          title: meta.title,
          channel: meta.author_name,
          url: `https://www.youtube.com/watch?v=${candId}`,
        };
        found = true;
        break;
      }
      if (found) break;
    }

    if (!found) {
      console.warn(`  FAILED to find candidate for ${lesson.lessonId}: ${lesson.title}`);
    }

    // Small delay to be polite to YouTube oEmbed
    await new Promise((r) => setTimeout(r, 200));
  }

  fs.writeFileSync('scratch/curated_replacements.json', JSON.stringify(curatedReplacements, null, 2));
  console.log(`Finished curation. Curated: ${Object.keys(curatedReplacements).length}/${failing.length}`);
}

curateAll().catch(console.error);
