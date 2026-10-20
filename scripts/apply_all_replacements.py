import json
import re
import os

SCRATCH_DIR = os.path.abspath('scratch')
CURATED_FILE = os.path.join(SCRATCH_DIR, 'curated_97_replacements.json')

with open(CURATED_FILE, 'r') as f:
    replacements = json.load(f)

# Also include the 3 deduplication improvements for banking
replacements["lesson-bank-1"] = {
    "lessonId": "lesson-bank-1",
    "topicId": "topic-banking-accounts",
    "title": "Checking vs Savings Accounts - Key Differences",
    "newVideoId": "iZGljcA3G24",
    "newUrl": "https://www.youtube.com/watch?v=iZGljcA3G24",
    "newTitle": "Checking & Savings Accounts Explained in 3 Minutes",
    "newChannel": "SimpleMoneyLyfe",
    "durationMinutes": 4,
    "verificationStatus": "VERIFIED"
}

replacements["lesson-bank-6"] = {
    "lessonId": "lesson-bank-6",
    "topicId": "topic-banking-accounts",
    "title": "Overdraft Fees & How to Avoid Bank Penalties",
    "newVideoId": "6mBfheuThTg",
    "newUrl": "https://www.youtube.com/watch?v=6mBfheuThTg",
    "newTitle": "FDIC Explains: Overdraft Fees",
    "newChannel": "FDICchannel",
    "durationMinutes": 5,
    "verificationStatus": "VERIFIED"
}

replacements["lesson-bank-7"] = {
    "lessonId": "lesson-bank-7",
    "topicId": "topic-banking-accounts",
    "title": "Fractional Reserve Banking & The Money Multiplier",
    "newVideoId": "93_Va7I7Lgg",
    "newUrl": "https://www.youtube.com/watch?v=93_Va7I7Lgg",
    "newTitle": "Fractional Reserve Banking and the Money Multiplier Made Simple",
    "newChannel": "Marginal Revolution University",
    "durationMinutes": 8,
    "verificationStatus": "VERIFIED"
}

FILES_MAP = {
    'topic-blockchain': 'src/curriculum/data/techPart1.ts',
    'topic-microsoft-office': 'src/curriculum/data/techPart1.ts',
    'topic-cybersecurity-basics': 'src/curriculum/data/techPart1.ts',
    'topic-iot': 'src/curriculum/data/techPart2.ts',
    'topic-intro-finance': 'src/curriculum/data/finPart1.ts',
    'topic-stock-market': 'src/curriculum/data/finPart1.ts',
    'topic-cryptocurrency': 'src/curriculum/data/finPart1.ts',
    'topic-fintech': 'src/curriculum/data/finPart2.ts',
    'topic-global-economy': 'src/curriculum/data/finPart2.ts',
    'topic-banking-accounts': 'src/curriculum/data/finPart2.ts',
    'topic-communication': 'src/curriculum/data/profPart1.ts',
    'topic-time-management': 'src/curriculum/data/profPart1.ts',
    'topic-soft-skills': 'src/curriculum/data/profPart1.ts',
    'topic-startup-ideation': 'src/curriculum/data/profPart2.ts',
    'topic-social-profile': 'src/curriculum/data/profPart2.ts',
}

def get_file_for_lesson(lid, topic_id):
    if lid in ['lesson-cyber-6', 'lesson-cyber-7', 'lesson-cyber-8', 'lesson-cyber-9', 'lesson-cyber-10']:
        return 'src/curriculum/data/techPart2.ts'
    return FILES_MAP.get(topic_id)

files_content = {}
for rel_path in set(FILES_MAP.values()):
    with open(rel_path, 'r', encoding='utf-8') as f:
        files_content[rel_path] = f.read()

updated_count = 0

for lid, rep in replacements.items():
    topic_id = rep['topicId']
    file_rel = get_file_for_lesson(lid, topic_id)
    if not file_rel:
        print(f"Unknown file for topic {topic_id}")
        continue

    content = files_content[file_rel]
    
    # Locate lesson block by id
    pattern = rf"(id:\s*'{lid}',[\s\S]*?youtubeVideoId:\s*')([^']+)('[\s\S]*?youtubeUrl:\s*')([^']+)('[\s\S]*?channelTitle:\s*')([^']+)('[\s\S]*?durationMinutes:\s*)(\d+)"
    match = re.search(pattern, content)
    if not match:
        print(f"FAILED to match lesson block for {lid} in {file_rel}")
        continue

    # Escape any single quotes in channel title
    safe_channel = rep['newChannel'].replace("'", "\\'")

    def replacer(m):
        return f"{m.group(1)}{rep['newVideoId']}{m.group(3)}{rep['newUrl']}{m.group(5)}{safe_channel}{m.group(7)}{rep['durationMinutes']}"

    new_content, n = re.subn(pattern, replacer, content, count=1)
    if n > 0:
        files_content[file_rel] = new_content
        updated_count += 1
    else:
        print(f"Regex replacement yielded 0 updates for {lid}")

print(f"Total replacements made: {updated_count}/{len(replacements)}")

for rel_path, content in files_content.items():
    with open(rel_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Wrote updated {rel_path}")

print("Replacement script complete.")
