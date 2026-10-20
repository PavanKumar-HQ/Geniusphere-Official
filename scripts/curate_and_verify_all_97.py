import json
import subprocess
import urllib.request
import re
import os
import sys

SCRATCH_DIR = os.path.abspath('scratch')
INVENTORY_FILE = os.path.join(SCRATCH_DIR, 'lesson_inventory_audit.json')
OUTPUT_FILE = os.path.join(SCRATCH_DIR, 'curated_97_replacements.json')

with open(INVENTORY_FILE, 'r') as f:
    inventory = json.load(f)

# Track valid IDs already verified
used_ids = set()
for item in inventory:
    if item.get('verificationStatus') == 'VERIFIED' and item.get('currentVideoId'):
        used_ids.add(item['currentVideoId'])

print(f"Total canonical lessons: {len(inventory)}")
print(f"Already valid video IDs: {len(used_ids)}")

failing = [item for item in inventory if item.get('verificationStatus') != 'VERIFIED']
print(f"Failing lessons to curate and verify: {len(failing)}")

SPECIFIC_QUERIES = {
    # Blockchain
    'lesson-bc-9': ['Computerphile Merkle Trees', 'Merkle Tree Blockchain Telusko'],

    # Microsoft Office
    'lesson-off-5': ['Excel XLOOKUP VLOOKUP Kevin Stratvert', 'How to Use XLOOKUP in Excel Kevin Stratvert'],
    'lesson-off-6': ['Conditional Formatting in Excel Kevin Stratvert', 'Conditional Formatting Excel Leila Gharani'],
    'lesson-off-7': ['Excel Interactive Dashboards Kevin Stratvert', 'Dynamic Excel Dashboards Leila Gharani'],
    'lesson-off-8': ['Styles in Microsoft Word Kevin Stratvert', 'Word Formatting Headers Tables Kevin Stratvert'],
    'lesson-off-10': ['Microsoft Teams Tutorial Kevin Stratvert', 'Microsoft 365 Collaboration Kevin Stratvert'],

    # Cybersecurity
    'lesson-cyber-6': ['Password Cracking Computerphile', 'SHA256 Computerphile'],
    'lesson-cyber-7': ['What is a Firewall PowerCert Animated Videos', 'Firewall Basics NetworkChuck'],
    'lesson-cyber-8': ['What is Phishing PowerCert Animated Videos', 'Phishing Attacks Explained IBM Technology'],
    'lesson-cyber-9': ['What is a Man-in-the-Middle Attack Eye on Tech', 'Man in the Middle Attack PowerCert Animated Videos'],
    'lesson-cyber-10': ['3 2 1 Backup Rule Techquickie', 'The 3-2-1 Backup Rule Veltec Networks'],

    # IoT
    'lesson-iot-4': ['Setting Up a Raspberry Pi ExplainingComputers', 'Raspberry Pi 4 Beginner Guide NetworkChuck'],
    'lesson-iot-5': ['Smart Sensors Actuators RealPars', 'What is a Sensor RealPars'],
    'lesson-iot-6': ['Edge Computing vs Cloud Computing IBM Technology', 'Edge Computing Explained Simplilearn'],
    'lesson-iot-7': ['Wireless IoT Protocols LoRaWAN Zigbee BLE', 'Zigbee vs LoRa vs BLE IoT'],
    'lesson-iot-8': ['Pulse Width Modulation PWM Explained SparkFun', 'PWM Explained Simply SparkFun'],
    'lesson-iot-9': ['ESP32 Home Automation Tutorial Beginner', 'ESP32 IoT Beginner Guide Random Nerd Tutorials'],
    'lesson-iot-10': ['IoT Security Challenges IBM Technology', 'Securing IoT Devices Explained'],

    # Intro Finance
    'lesson-fin-5': ['50 30 20 Budgeting Rule Two Cents PBS', '50 30 20 Rule Ali Abdaal'],
    'lesson-fin-6': ['Credit Scores Explained Two Cents PBS', 'Understanding Credit Scores and Debt Two Cents'],
    'lesson-fin-8': ['Emergency Fund How Much to Save Two Cents PBS', 'Emergency Funds Two Cents PBS'],
    'lesson-fin-9': ['How to Start Investing for Beginners Two Cents PBS', 'Stock Investing for Beginners Two Cents'],
    'lesson-fin-10': ['How to Calculate Net Worth The Plain Bagel', 'Asset Allocation Explained The Plain Bagel'],

    # Stock Market
    'lesson-stock-2': ['How the Stock Market Works The Plain Bagel', 'Stock Market for Beginners The Plain Bagel'],
    'lesson-stock-3': ['Candlestick Charts for Beginners Rayner Teo', 'How to Read Candlestick Charts'],
    'lesson-stock-4': ['Bid Ask Spread Order Book Explained The Plain Bagel', 'Order Book Depth Bids Asks Spreads'],
    'lesson-stock-5': ['PE Ratio Explained The Plain Bagel', 'Valuation Metrics PE Ratio Plain Bagel'],
    'lesson-stock-6': ['Index Funds vs Individual Stocks The Plain Bagel', 'Index Funds and ETFs Explained Ben Felix'],
    'lesson-stock-7': ['Dividends and DRIP Explained The Plain Bagel', 'Dividend Investing The Plain Bagel'],
    'lesson-stock-8': ['Portfolio Diversification The Plain Bagel', 'Modern Portfolio Theory Ben Felix'],
    'lesson-stock-9': ['What is Beta in Stocks The Plain Bagel', 'Stock Beta Systematic Risk Plain Bagel'],
    'lesson-stock-10': ['Short Selling Explained The Plain Bagel', 'Market Corrections and Bear Markets The Plain Bagel'],

    # Cryptocurrency
    'lesson-crypto-1': ['How Does Bitcoin Actually Work 3Blue1Brown', 'How Bitcoin Works Computerphile'],
    'lesson-crypto-2': ['Bitcoin Halving Explained Simply Explained', 'What is Bitcoin Halving Finematics'],
    'lesson-crypto-4': ['Automated Market Makers AMM Finematics', 'Uniswap AMM Explained Whiteboard Crypto'],
    'lesson-crypto-5': ['How Crypto Wallets Work Finematics', 'Crypto Wallets Public Private Keys Whiteboard Crypto'],
    'lesson-crypto-6': ['Proof of Stake Explained Finematics', 'Proof of Stake vs Proof of Work Simply Explained'],
    'lesson-crypto-7': ['Impermanent Loss Explained Finematics', 'Impermanent Loss Uniswap Whiteboard Crypto'],
    'lesson-crypto-8': ['Stablecoins Explained Finematics', 'How Stablecoins Work Whiteboard Crypto'],
    'lesson-crypto-9': ['Crypto Tokenomics Whiteboard Crypto', 'Tokenomics Explained Finematics'],
    'lesson-crypto-10': ['Crypto Scams Rugpulls Phishing Whiteboard Crypto', 'Crypto Security Best Practices Finematics'],

    # FinTech
    'lesson-fintech-1': ['What is FinTech CNBC', 'FinTech Explained CNBC International'],
    'lesson-fintech-2': ['How UPI Works NPCI Real Time Payments', 'UPI Payment System Explained'],
    'lesson-fintech-3': ['Credit Card Interchange Fees CNBC', 'How Credit Card Processing Works'],
    'lesson-fintech-4': ['Open Banking Explained APIs Plaid', 'What is Open Banking FinTech'],
    'lesson-fintech-5': ['Buy Now Pay Later BNPL CNBC', 'The Real Cost of Buy Now Pay Later Two Cents'],
    'lesson-fintech-6': ['Robo Advisors Explained The Plain Bagel', 'How Robo Advisors Work Two Cents'],
    'lesson-fintech-7': ['AI Fraud Detection Banking IBM Technology', 'Machine Learning Fraud Detection Explained'],
    'lesson-fintech-8': ['Peer to Peer P2P Lending Explained', 'How P2P Lending Works FinTech'],
    'lesson-fintech-9': ['How SWIFT Works Cross-Border Payments CNBC', 'SWIFT Payment System Explained CNBC'],
    'lesson-fintech-10': ['Micro Investing Acorns Round Ups Two Cents', 'Micro Investing Apps Explained Two Cents'],

    # Global Economy
    'lesson-econ-2': ['Gross Domestic Product GDP CrashCourse Economics', 'What is GDP Khan Academy'],
    'lesson-econ-3': ['Monetary Policy Federal Reserve CrashCourse Economics', 'Federal Reserve Monetary Policy Khan Academy'],
    'lesson-econ-7': ['Foreign Exchange Rates CrashCourse Economics', 'Exchange Rates Khan Academy'],
    'lesson-econ-8': ['Comparative Advantage CrashCourse Economics', 'Comparative Advantage Khan Academy'],
    'lesson-econ-9': ['The Business Cycle CrashCourse Economics', 'Recessions and Depressions CrashCourse Economics'],
    'lesson-econ-10': ['Inverted Yield Curve Explained The Plain Bagel', 'Yield Curve Bond Markets Plain Bagel'],

    # Banking Accounts
    'lesson-bank-2': ['High Yield Savings Accounts HYSA Two Cents PBS', 'High Yield Savings Account Explained Ali Abdaal'],
    'lesson-bank-3': ['CD Laddering Certificates of Deposit Two Cents PBS', 'CD Ladder Explained Two Cents'],
    'lesson-bank-4': ['Money Market Accounts vs Savings Two Cents PBS', 'Money Market Funds vs High Yield Savings'],
    'lesson-bank-5': ['FDIC Insurance Bank Failures Two Cents PBS', 'FDIC Insurance Explained Khan Academy'],
    'lesson-bank-8': ['Roth IRA vs Traditional IRA Two Cents PBS', 'Roth IRA Explained Plain Bagel'],
    'lesson-bank-9': ['Health Savings Accounts HSA Two Cents PBS', 'HSA Triple Tax Advantage Explained'],
    'lesson-bank-10': ['Pay Yourself First Automating Money Two Cents PBS', 'Automate Your Finances Ali Abdaal'],

    # Communication
    'lesson-comm-4': ['Nonviolent Communication Marshall Rosenberg Summary', 'NVC Nonviolent Communication Sprouts'],
    'lesson-comm-5': ['Bottom Line Up Front BLUF Executive Communication', 'BLUF Communication Technique'],
    'lesson-comm-8': ['Negotiation Anchoring ZOPA Harvard Business Review', 'Negotiation Skills Chris Voss'],
    'lesson-comm-9': ['How to Pitch Elevator Pitch Harvard Business Review', '30 Second Elevator Pitch TED'],
    'lesson-comm-10': ['Difficult Conversations Workplace Harvard Business Review', 'Crucial Conversations Summary'],

    # Time Management
    'lesson-time-6': ['Time Blocking Calendar Ali Abdaal', 'Time Blocking Calendar Tutorial Thomas Frank'],
    'lesson-time-7': ['Parkinsons Law Thomas Frank', 'Parkinsons Law Overcoming Procrastination Ali Abdaal'],
    'lesson-time-8': ['80 20 Rule Pareto Principle Ali Abdaal', 'Pareto Principle Sprouts'],
    'lesson-time-9': ['The Cost of Multitasking Context Switching', 'Context Switching Cost Productivity'],

    # Soft Skills
    'lesson-soft-2': ['Emotional Intelligence Daniel Goleman Sprouts', 'Emotional Intelligence TED'],
    'lesson-soft-3': ['Growth Mindset vs Fixed Mindset Sprouts', 'Growth Mindset Carol Dweck TED'],
    'lesson-soft-5': ['Conflict Resolution Thomas Kilmann Model Sprouts', 'Thomas Kilmann Conflict Resolution Styles'],
    'lesson-soft-10': ['Ethical Decision Making in Business Explained', 'Ethical Dilemmas in Business Explained'],

    # Startup Ideation
    'lesson-startup-1': ['How to Get Startup Ideas Y Combinator', 'How to Evaluate Startup Ideas Y Combinator'],
    'lesson-startup-2': ['Lean Canvas Business Model Ash Maurya', 'How to Build a Lean Canvas Slidebean'],
    'lesson-startup-3': ['The Mom Test Rob Fitzpatrick Customer Discovery', 'How to Talk to Users Y Combinator'],
    'lesson-startup-4': ['How to Calculate TAM SAM SOM Y Combinator', 'Market Sizing TAM SAM SOM Slidebean'],
    'lesson-startup-5': ['7 Powers Hamilton Helmer Competitive Moat', 'Business Moats Explained Slidebean'],
    'lesson-startup-6': ['How to Build an MVP Y Combinator Michael Seibel', 'Minimum Viable Product Michael Seibel YC'],
    'lesson-startup-7': ['How to Find Product Market Fit Y Combinator', 'Product Market Fit Michael Seibel Y Combinator'],
    'lesson-startup-8': ['Startup Unit Economics CAC LTV Slidebean', 'Unit Economics for Startups Explained'],
    'lesson-startup-9': ['How to Pitch Your Startup Y Combinator', '10 Slide Pitch Deck Guy Kawasaki Slidebean'],
    'lesson-startup-10': ['Startup Runway and Cash Management Y Combinator', 'How to Manage Startup Cash Runway'],

    # Social Profile
    'lesson-social-1': ['LinkedIn Profile Optimization CareerVidz', 'LinkedIn Profile Tips for Job Seekers'],
    'lesson-social-2': ['Google XYZ Resume Formula Harvard Business Review', 'How to Write Resume Bullet Points CareerVidz'],
    'lesson-social-3': ['GitHub Profile README Tutorial freeCodeCamp', 'How to Build a Standout GitHub Portfolio'],
    'lesson-social-4': ['Beat Applicant Tracking Systems ATS CareerVidz', 'How ATS Works Resume Tips'],
    'lesson-social-5': ['Informational Interviews Cold Email Networking Harvard Business Review', 'How to Network CareerVidz'],
    'lesson-social-6': ['How to Build a Portfolio Website freeCodeCamp', 'Web Developer Portfolio Website Tutorial Kevin Powell'],
    'lesson-social-7': ['Learn in Public Swyx Developer Career', 'Learning in Public for Developers'],
    'lesson-social-8': ['Online Privacy Digital Footprint The Hated One', 'How to Clean Up Your Digital Footprint'],
    'lesson-social-9': ['STAR Method Interview Technique CareerVidz', 'How to Use the STAR Interview Technique'],
    'lesson-social-10': ['How to Negotiate Salary CareerVidz', 'Salary Negotiation Tech CareerVidz'],
}

def verify_oembed(video_id):
    url = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={video_id}&format=json"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=5) as response:
            if response.status == 200:
                data = json.loads(response.read().decode('utf-8'))
                return data
    except Exception:
        return None
    return None

def search_candidates_yt_dlp(query, max_results=5):
    cmd = [
        '/opt/anaconda3/bin/yt-dlp',
        '--print', '%(id)s\t%(title)s\t%(uploader)s\t%(duration)s',
        '--no-warnings',
        f'ytsearch{max_results}:{query}'
    ]
    try:
        res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, timeout=15)
        if res.returncode != 0:
            return []
        lines = res.stdout.strip().split('\n')
        candidates = []
        for line in lines:
            parts = line.split('\t')
            if len(parts) >= 3:
                vid = parts[0].strip()
                title = parts[1].strip()
                uploader = parts[2].strip()
                duration = parts[3].strip() if len(parts) > 3 else '0'
                if len(vid) == 11:
                    candidates.append({
                        'id': vid,
                        'title': title,
                        'uploader': uploader,
                        'duration': duration
                    })
        return candidates
    except Exception as e:
        print(f"Error in yt-dlp: {e}")
        return []

curated = {}

for idx, lesson in enumerate(failing):
    lid = lesson['lessonId']
    ltitle = lesson['title']
    print(f"[{idx+1}/{len(failing)}] Curating: {lid} - {ltitle}")

    queries = SPECIFIC_QUERIES.get(lid, [
        f"{ltitle} tutorial",
        f"{ltitle} explained educational"
    ])

    matched = False
    for q in queries:
        candidates = search_candidates_yt_dlp(q, max_results=5)
        for cand in candidates:
            cand_id = cand['id']
            if cand_id in used_ids:
                continue
            
            # Check duration - skip ultra shorts under 60 seconds if duration known
            try:
                dur_secs = float(cand['duration']) if cand['duration'] and cand['duration'] != 'NA' else 300
                if 0 < dur_secs < 60:
                    continue
            except Exception:
                pass

            # Skip title with shorts
            if '#short' in cand['title'].lower():
                continue

            # Verify with live oEmbed
            oembed_data = verify_oembed(cand_id)
            if not oembed_data:
                continue

            # Verified!
            dur_mins = round(float(cand['duration']) / 60) if cand['duration'] and cand['duration'] != 'NA' and float(cand['duration']) > 0 else 12
            if dur_mins < 1:
                dur_mins = 5

            curated[lid] = {
                'lessonId': lid,
                'topicId': lesson['topicId'],
                'title': ltitle,
                'oldVideoId': lesson['currentVideoId'],
                'newVideoId': cand_id,
                'newUrl': f"https://www.youtube.com/watch?v={cand_id}",
                'newTitle': oembed_data.get('title', cand['title']),
                'newChannel': oembed_data.get('author_name', cand['uploader']),
                'durationMinutes': dur_mins,
                'verificationStatus': 'VERIFIED'
            }
            used_ids.add(cand_id)
            print(f"  -> SUCCESS: {cand_id} | \"{oembed_data.get('title')}\" by {oembed_data.get('author_name')}")
            matched = True
            break
        if matched:
            break

    if not matched:
        print(f"  FAILED to find verified replacement for {lid}: {ltitle}")

with open(OUTPUT_FILE, 'w') as f:
    json.dump(curated, f, indent=2)

print("\n-------------------------------------------")
print(f"Curation complete: {len(curated)}/{len(failing)} successfully verified and curated.")
print(f"Output saved to: {OUTPUT_FILE}")
