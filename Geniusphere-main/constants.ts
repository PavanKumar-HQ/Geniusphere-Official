





import { Course, Sector, SectorType, Service, VideoResource, Trainer, GalleryItem, FAQItem, FeatureItem, VideoTestimonial, Student, EducationalResource, CurriculumItem, Ambassador } from './types';

export const SECTORS: Sector[] = [
  {
    id: 'sec_tech',
    name: SectorType.TECHNOLOGY,
    overview: 'Future-ready skills in AI, Blockchain, and IoT.',
    iconName: 'Cpu',
    gradient: 'from-blue-500 to-cyan-400',
  },
  {
    id: 'sec_fin',
    name: SectorType.FINANCE,
    overview: 'Mastering markets, crypto, and personal wealth.',
    iconName: 'TrendingUp',
    gradient: 'from-emerald-500 to-green-400',
  },
  {
    id: 'sec_prof',
    name: SectorType.PROFESSIONAL,
    overview: 'Leadership, communication, and career branding.',
    iconName: 'Briefcase',
    gradient: 'from-violet-500 to-purple-400',
  },
];

export const EDUCATIONAL_RESOURCES: EducationalResource[] = [
  // --- VIDEOS ---
  { id: 'vid_01', title: 'Ram Mandir Boosts Indian Economy?', type: 'video', category: SectorType.FINANCE, url: 'https://www.youtube.com/watch?v=tOgrIjDGI78', thumbnailUrl: 'https://img.youtube.com/vi/tOgrIjDGI78/hqdefault.jpg', description: 'Explore the economic dimensions surrounding the construction of the Ram Mandir', duration: '10:00', author: 'Geniusphere' },
  { id: 'vid_02', title: 'Career Choices and Financial Impact: Surgeon vs. Investment Banker', type: 'video', category: SectorType.PROFESSIONAL, url: 'https://www.youtube.com/watch?v=deeBWH_buhw', thumbnailUrl: 'https://img.youtube.com/vi/deeBWH_buhw/hqdefault.jpg', description: 'Unravel the financial realities of two distinct career paths', duration: '10:00', author: 'Geniusphere' },
  { id: 'vid_03', title: 'Powering India\'s Future: Solar vs. Nuclear - A Financial Deep Dive', type: 'video', category: SectorType.TECHNOLOGY, url: 'https://www.youtube.com/watch?v=3nZ_1AHTBtU', thumbnailUrl: 'https://img.youtube.com/vi/3nZ_1AHTBtU/hqdefault.jpg', description: 'Compare the financial aspects of solar and nuclear energy from the government\'s perspective', duration: '10:00', author: 'Geniusphere' },
  { id: 'vid_04', title: 'Understanding EPF: Your Savings, Your Future', type: 'video', category: SectorType.FINANCE, url: 'https://www.youtube.com/watch?v=nk50TYfETNA', thumbnailUrl: 'https://img.youtube.com/vi/nk50TYfETNA/hqdefault.jpg', description: 'Learn how EPF works - from contribution process to tax benefits', duration: '10:00', author: 'Geniusphere' },
  { id: 'vid_05', title: 'Understanding Venture Capital In Startups: Part-1', type: 'video', category: SectorType.FINANCE, url: 'https://www.youtube.com/watch?v=hPZ71rFAyS8', thumbnailUrl: 'https://img.youtube.com/vi/hPZ71rFAyS8/hqdefault.jpg', description: 'Explore venture capital, equity, and investor roles in startups', duration: '10:00', author: 'Geniusphere' },
  { id: 'vid_06', title: 'Understanding Venture Capital In Startups: Part-2', type: 'video', category: SectorType.FINANCE, url: 'https://www.youtube.com/watch?v=TYNsZF1qgaY', thumbnailUrl: 'https://img.youtube.com/vi/TYNsZF1qgaY/hqdefault.jpg', description: 'Dive into how venture capitalists operate in the real world', duration: '10:00', author: 'Geniusphere' },
  { id: 'vid_07', title: 'Understanding Venture Capital In Startups: Part-3', type: 'video', category: SectorType.FINANCE, url: 'https://www.youtube.com/watch?v=0olrjEQhZ6Q', thumbnailUrl: 'https://img.youtube.com/vi/0olrjEQhZ6Q/hqdefault.jpg', description: 'Explore how VC firms raise funds and operate', duration: '10:00', author: 'Geniusphere' },
  { id: 'vid_08', title: 'Unlocking Quantum Secrets: A Simple Guide to Quantum Computing', type: 'video', category: SectorType.TECHNOLOGY, url: 'https://www.youtube.com/watch?v=NXuP3GsgiPA', thumbnailUrl: 'https://img.youtube.com/vi/NXuP3GsgiPA/hqdefault.jpg', description: 'Dive into the quantum realm and understand quantum computing basics', duration: '10:00', author: 'Geniusphere' },
  { id: 'vid_09', title: 'Unlocking Financial Magic: The Fintech Revolution!', type: 'video', category: SectorType.FINANCE, url: 'https://www.youtube.com/watch?v=gtk_w5_SNK8', thumbnailUrl: 'https://img.youtube.com/vi/gtk_w5_SNK8/hqdefault.jpg', description: 'Discover how innovative technology is transforming finance', duration: '10:00', author: 'Geniusphere' },
  { id: 'vid_10', title: 'Exploring Sophia: The AI Who Asks "WHY"?', type: 'video', category: SectorType.TECHNOLOGY, url: 'https://www.youtube.com/watch?v=nN-cS3xWmXw', thumbnailUrl: 'https://img.youtube.com/vi/nN-cS3xWmXw/hqdefault.jpg', description: 'Discover Sophia, the extraordinary AI created by Hanson Robotics', duration: '10:00', author: 'Geniusphere' },
  { id: 'vid_11', title: 'Announcing a Transformative Partnership with Ekaiva.Biz', type: 'video', category: SectorType.PROFESSIONAL, url: 'https://www.youtube.com/watch?v=wBWq1bEc1hs', thumbnailUrl: 'https://img.youtube.com/vi/wBWq1bEc1hs/hqdefault.jpg', description: 'Geniusphere x Ekaiva.Biz collaboration to empower students', duration: '10:00', author: 'Geniusphere' },
  { id: 'vid_12', title: 'AI Revolutionizes Nuclear Fusion: A Leap towards Limitless Clean Energy', type: 'video', category: SectorType.TECHNOLOGY, url: 'https://www.youtube.com/watch?v=syYfmWr5FKU', thumbnailUrl: 'https://img.youtube.com/vi/syYfmWr5FKU/hqdefault.jpg', description: 'How AI is achieving groundbreaking milestones in nuclear fusion', duration: '10:00', author: 'Geniusphere' },
  { id: 'vid_13', title: 'Government Bonds: Secure Investments for Your Financial Future!', type: 'video', category: SectorType.FINANCE, url: 'https://www.youtube.com/watch?v=dl519YcoB6w', thumbnailUrl: 'https://img.youtube.com/vi/dl519YcoB6w/hqdefault.jpg', description: 'Discover the benefits of investing in Government Bonds', duration: '10:00', author: 'Geniusphere' },
  { id: 'vid_14', title: 'Exploring ESG Investing: Good for the Planet and Your Pocket Money!', type: 'video', category: SectorType.FINANCE, url: 'https://www.youtube.com/watch?v=Tt_jCzZvO34', thumbnailUrl: 'https://img.youtube.com/vi/Tt_jCzZvO34/hqdefault.jpg', description: 'Dive into Environmental, Social, and Governance investing', duration: '10:00', author: 'Geniusphere' },
  { id: 'vid_15', title: 'Unlocking Potential: How Geniusphere is Changing Education', type: 'video', category: SectorType.PROFESSIONAL, url: 'https://www.youtube.com/watch?v=mxgeTBk7FjU', thumbnailUrl: 'https://img.youtube.com/vi/mxgeTBk7FjU/hqdefault.jpg', description: 'Discover how Geniusphere is revolutionizing education', duration: '10:00', author: 'Geniusphere' },
  { id: 'vid_16', title: 'Jio: Changing the Internet Landscape', type: 'video', category: SectorType.TECHNOLOGY, url: 'https://www.youtube.com/watch?v=u3INOgf5OzY', thumbnailUrl: 'https://img.youtube.com/vi/u3INOgf5OzY/hqdefault.jpg', description: 'The legendary tale of Jio, the disruptor of Indian telecommunications', duration: '10:00', author: 'Geniusphere' },
  { id: 'vid_17', title: 'Cybersecurity Basics: Essential Tips to Protect Your Digital World', type: 'video', category: SectorType.TECHNOLOGY, url: 'https://www.youtube.com/watch?v=NZLNu-oNZyA', thumbnailUrl: 'https://img.youtube.com/vi/NZLNu-oNZyA/hqdefault.jpg', description: 'Learn fundamentals of cybersecurity and protect your digital information', duration: '10:00', author: 'Geniusphere' },
  { id: 'vid_18', title: 'The Power of Communication: Why It\'s Essential', type: 'video', category: SectorType.PROFESSIONAL, url: 'https://www.youtube.com/watch?v=abXjFj3gML4', thumbnailUrl: 'https://img.youtube.com/vi/abXjFj3gML4/hqdefault.jpg', description: 'Explore the importance of communication and its benefits', duration: '10:00', author: 'Geniusphere' },
  { id: 'vid_19', title: 'Stock Market Basics for Students: Understanding Investments', type: 'video', category: SectorType.FINANCE, url: 'https://www.youtube.com/watch?v=-bbbzSVwpBI', thumbnailUrl: 'https://img.youtube.com/vi/-bbbzSVwpBI/hqdefault.jpg', description: 'Learn the fundamentals of the stock market in this beginner-friendly guide', duration: '10:00', author: 'Geniusphere' },
  { id: 'vid_20', title: 'Microsoft Outage: What Went Wrong?', type: 'video', category: SectorType.TECHNOLOGY, url: 'https://www.youtube.com/watch?v=mVOvqpEkxqo', thumbnailUrl: 'https://img.youtube.com/vi/mVOvqpEkxqo/hqdefault.jpg', description: 'Uncover the details behind the massive Microsoft outage', duration: '10:00', author: 'Geniusphere' },
  { id: 'vid_21', title: 'Global Events and Their Economic Ripple Effects: Analyzing Major Impacts', type: 'video', category: SectorType.FINANCE, url: 'https://www.youtube.com/watch?v=dcR2ZI37qaE', thumbnailUrl: 'https://img.youtube.com/vi/dcR2ZI37qaE/hqdefault.jpg', description: 'Explore how significant global events impact the global economy', duration: '10:00', author: 'Geniusphere' },
  { id: 'vid_22', title: 'Students Taking the Lead: Why Climate Action Matters', type: 'video', category: SectorType.PROFESSIONAL, url: 'https://www.youtube.com/watch?v=t5KGoh--Ok0', thumbnailUrl: 'https://img.youtube.com/vi/t5KGoh--Ok0/hqdefault.jpg', description: 'Learn why climate action is crucial and how you can contribute', duration: '10:00', author: 'Geniusphere' },
  { id: 'vid_23', title: 'The Essential Need for Social Media Development in Student Growth', type: 'video', category: SectorType.PROFESSIONAL, url: 'https://www.youtube.com/watch?v=qQvc_vdem_w', thumbnailUrl: 'https://img.youtube.com/vi/qQvc_vdem_w/hqdefault.jpg', description: 'Social media as a critical tool for personal and professional development', duration: '10:00', author: 'Geniusphere' },
  { id: 'vid_24', title: 'The Power of Open-Source and Big Data: Unlocking Innovation', type: 'video', category: SectorType.TECHNOLOGY, url: 'https://www.youtube.com/watch?v=IzcbSVQZHzs', thumbnailUrl: 'https://img.youtube.com/vi/IzcbSVQZHzs/hqdefault.jpg', description: 'Discover how open-source and big data are reshaping industries', duration: '10:00', author: 'Geniusphere' },
  { id: 'vid_25', title: 'The Cutting Edge of Technology: Google, Microsoft, OpenAI', type: 'video', category: SectorType.TECHNOLOGY, url: 'https://www.youtube.com/watch?v=POgUQqgeVOg', thumbnailUrl: 'https://img.youtube.com/vi/POgUQqgeVOg/hqdefault.jpg', description: 'Explore the latest in technology with groundbreaking advancements', duration: '10:00', author: 'Geniusphere' },
  { id: 'vid_26', title: 'Neuromorphic Computing: Shaping the Future of AI', type: 'video', category: SectorType.TECHNOLOGY, url: 'https://www.youtube.com/watch?v=CSUscRShvj0', thumbnailUrl: 'https://img.youtube.com/vi/CSUscRShvj0/hqdefault.jpg', description: 'Discover brain-inspired technology revolutionizing AI', duration: '10:00', author: 'Geniusphere' },
  { id: 'vid_27', title: 'AutoML Unleashed: Simplifying Machine Learning for Students', type: 'video', category: SectorType.TECHNOLOGY, url: 'https://www.youtube.com/watch?v=VwCG3kr04o4', thumbnailUrl: 'https://img.youtube.com/vi/VwCG3kr04o4/hqdefault.jpg', description: 'Dive into Automated Machine Learning and simplify ML', duration: '10:00', author: 'Geniusphere' },
  { id: 'vid_28', title: 'The Semiconductor Crisis: Unpacking Its Impact on Technology and Finance', type: 'video', category: SectorType.TECHNOLOGY, url: 'https://www.youtube.com/watch?v=7WitSIUO8bk', thumbnailUrl: 'https://img.youtube.com/vi/7WitSIUO8bk/hqdefault.jpg', description: 'Learn about the semiconductor crisis affecting global tech and finance', duration: '10:00', author: 'Geniusphere' },
  { id: 'vid_29', title: 'Unmasking the Shadows: How the Dark Web Launders Billions Through Crypto', type: 'video', category: SectorType.FINANCE, url: 'https://www.youtube.com/watch?v=iDfMn82xhoM', thumbnailUrl: 'https://img.youtube.com/vi/iDfMn82xhoM/hqdefault.jpg', description: 'Explore how the dark web leverages cryptocurrencies for money laundering', duration: '10:00', author: 'Geniusphere' },
  { id: 'vid_30', title: 'Unveiling the Bitfinex Hack: Lessons in Crypto Crime', type: 'video', category: SectorType.FINANCE, url: 'https://www.youtube.com/watch?v=IMdonjUWwls', thumbnailUrl: 'https://img.youtube.com/vi/IMdonjUWwls/hqdefault.jpg', description: 'Dive into one of the largest cryptocurrency thefts in history', duration: '10:00', author: 'Geniusphere' },
  // --- BLOGS ---
  { id: 'blog_01', title: 'Quantum Computing Advancements (as of mid-to-late 2025)', type: 'blog', category: SectorType.TECHNOLOGY, url: 'https://www.reddit.com/r/Geniusphere_Hub/comments/1njz5qw/quantum_computing_advancements_as_of_midtolate/', thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=500&auto=format&fit=crop', description: 'Explore the latest breakthroughs in quantum computing technology', author: 'Geniusphere Hub', date: '2 weeks ago' },
  { id: 'blog_02', title: 'India\'s AI Journey: Challenges, Opportunities, and Global Competition', type: 'blog', category: SectorType.TECHNOLOGY, url: 'https://www.reddit.com/r/Geniusphere_Hub/comments/1iknbso/indias_ai_journey_challenges_opportunities_and/', thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=500&auto=format&fit=crop', description: 'Analyzing India\'s position in the global AI race and opportunities for students', author: 'Geniusphere Hub', date: '1 month ago' },
  { id: 'blog_03', title: 'The Evolution of Quantum Internet: Redefining Connectivity', type: 'blog', category: SectorType.TECHNOLOGY, url: 'https://www.reddit.com/r/Geniusphere_Hub/comments/1i8y2gr/the_evolution_of_quantum_internet_redefining/', thumbnailUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=500&auto=format&fit=crop', description: 'How quantum internet will revolutionize secure communications', author: 'Geniusphere Hub', date: '1 month ago' },
  { id: 'blog_04', title: 'Post-Quantum Cryptography: Safeguarding Data in the Quantum Era', type: 'blog', category: SectorType.TECHNOLOGY, url: 'https://www.reddit.com/r/Geniusphere_Hub/comments/1hrkfws/postquantum_cryptography_safeguarding_data_in_the/', thumbnailUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=500&auto=format&fit=crop', description: 'Understanding cryptography solutions for the quantum computing age', author: 'Geniusphere Hub', date: '2 months ago' },
  { id: 'blog_05', title: 'The Intersection of Blockchain and Artificial Intelligence', type: 'blog', category: SectorType.TECHNOLOGY, url: 'https://www.reddit.com/r/Geniusphere_Hub/comments/1hkh14e/the_intersection_of_blockchain_and_artificial/', thumbnailUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=500&auto=format&fit=crop', description: 'Exploring the game-changing synergy between blockchain and AI', author: 'Geniusphere Hub', date: '2 months ago' },
  { id: 'blog_06', title: 'Unveiling Google\'s Willow Quantum Computing Chip', type: 'blog', category: SectorType.TECHNOLOGY, url: 'https://www.reddit.com/r/Geniusphere_Hub/comments/1hb74rc/unveiling_googles_willow_quantum_computing_chip_a/', thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=500&auto=format&fit=crop', description: 'A quantum leap forward in computing technology', author: 'Geniusphere Hub', date: '2 months ago' },
  { id: 'blog_07', title: 'The Irony of AI: Are We Sacrificing Our Own Intelligence?', type: 'blog', category: SectorType.TECHNOLOGY, url: 'https://www.reddit.com/r/Geniusphere_Hub/comments/1hfm8v0/the_irony_of_ai_are_we_sacrificing_our_own/', thumbnailUrl: 'https://images.unsplash.com/photo-1677756119517-756a188d2d94?q=80&w=500&auto=format&fit=crop', description: 'A critical look at AI\'s impact on human cognitive abilities', author: 'Geniusphere Hub', date: '2 months ago' },
  { id: 'blog_08', title: 'The Future of Space Mining: Unlocking Asteroid Resources', type: 'blog', category: SectorType.TECHNOLOGY, url: 'https://www.reddit.com/r/Geniusphere_Hub/comments/1hem3db/the_future_of_space_mining_unlocking_the/', thumbnailUrl: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?q=80&w=500&auto=format&fit=crop', description: 'Exploring the potential of asteroid mining for future resources', author: 'Geniusphere Hub', date: '2 months ago' },
  { id: 'blog_09', title: 'The Impact of RBI\'s Latest Monetary Policy on Startups', type: 'blog', category: SectorType.FINANCE, url: 'https://www.reddit.com/r/Geniusphere_Hub/comments/1hipcrg/the_impact_of_rbis_latest_monetary_policy/', thumbnailUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=500&auto=format&fit=crop', description: 'How RBI\'s monetary decisions affect Indian startups', author: 'Geniusphere Hub', date: '2 months ago' },
  { id: 'blog_10', title: 'Anonymous Cryptocurrencies and the Digital Black Market', type: 'blog', category: SectorType.FINANCE, url: 'https://www.reddit.com/r/Geniusphere_Hub/comments/1hdb8ha/anonymous_cryptocurrencies_and_the_rise_of_the/', thumbnailUrl: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=500&auto=format&fit=crop', description: 'Understanding the rise of anonymous cryptocurrencies', author: 'Geniusphere Hub', date: '2 months ago' },
  { id: 'blog_11', title: 'How Indian Festivals Impact Consumer Spending', type: 'blog', category: SectorType.FINANCE, url: 'https://www.reddit.com/r/Geniusphere_Hub/comments/1h500xj/how_indian_festivals_impact_consumer_spending/', thumbnailUrl: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?q=80&w=500&auto=format&fit=crop', description: 'Analyzing the economic impact of festivals on consumer behavior', author: 'Geniusphere Hub', date: '2 months ago' },
  { id: 'blog_12', title: 'Why Indian Startups Are Attracting Record-Breaking Investments', type: 'blog', category: SectorType.FINANCE, url: 'https://www.reddit.com/r/Geniusphere_Hub/comments/1h35xi3/why_indian_startups_are_attracting_recordbreaking/', thumbnailUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=500&auto=format&fit=crop', description: 'Exploring the factors behind India\'s startup investment boom', author: 'Geniusphere Hub', date: '3 months ago' },
  { id: 'blog_13', title: 'Why India\'s UPI Is Gaining Global Recognition', type: 'blog', category: SectorType.FINANCE, url: 'https://www.reddit.com/r/Geniusphere_Hub/comments/1h2lqvr/why_indias_upi_unified_payments_interface_is/', thumbnailUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=500&auto=format&fit=crop', description: 'How India\'s Unified Payments Interface is revolutionizing global payments', author: 'Geniusphere Hub', date: '3 months ago' },
  { id: 'blog_14', title: 'Why Gold Is Still a Safe Investment in the Age of Cryptocurrency', type: 'blog', category: SectorType.FINANCE, url: 'https://www.reddit.com/r/Geniusphere_Hub/comments/1h1khj9/why_gold_is_still_a_safe_investment_in_the_age_of/', thumbnailUrl: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?q=80&w=500&auto=format&fit=crop', description: 'Comparing traditional gold investment with modern cryptocurrencies', author: 'Geniusphere Hub', date: '3 months ago' },
  { id: 'blog_15', title: 'Russia\'s Breakthrough: A Vaccine for Cancer', type: 'blog', category: SectorType.PROFESSIONAL, url: 'https://www.reddit.com/r/Geniusphere_Hub/comments/1hj4o7f/russias_breakthrough_a_vaccine_for_cancer/', thumbnailUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=500&auto=format&fit=crop', description: 'Exploring Russia\'s groundbreaking cancer vaccine development', author: 'Geniusphere Hub', date: '2 months ago' },
  { id: 'blog_16', title: 'Enhancing English Communication and Fluency with AI Tools', type: 'blog', category: SectorType.PROFESSIONAL, url: 'https://www.reddit.com/r/Geniusphere_Hub/comments/1h7acnt/enhancing_english_communication_and_fluency_with/', thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=500&auto=format&fit=crop', description: 'Discover AI-powered apps and tools to improve English communication skills', author: 'Geniusphere Hub', date: '2 months ago' },
  { id: 'blog_17', title: 'Why Financial Literacy Should Be Taught in Schools', type: 'blog', category: SectorType.FINANCE, url: 'https://www.reddit.com/r/Geniusphere_Hub/comments/1h0uao4/why_financial_literacy_should_be_taught_in_schools/', thumbnailUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=500&auto=format&fit=crop', description: 'The importance of teaching financial literacy to students early', author: 'Geniusphere Hub', date: '3 months ago' },
  { id: 'blog_18', title: 'The Role of Indian Women in the Financial Sector\'s Growth', type: 'blog', category: SectorType.PROFESSIONAL, url: 'https://www.reddit.com/r/Geniusphere_Hub/comments/1gzb6c5/the_role_of_indian_women_in_the_financial_sectors/', thumbnailUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=500&auto=format&fit=crop', description: 'Exploring women leaders and entrepreneurs transforming India\'s finance sector', author: 'Geniusphere Hub', date: '3 months ago' },
  { id: 'blog_19', title: 'India\'s Stock Market vs. Global Markets: How Do They Compare?', type: 'blog', category: SectorType.FINANCE, url: 'https://www.reddit.com/r/Geniusphere_Hub/comments/1ghrgg7/indias_stock_market_vs_global_markets_how_do_they/', thumbnailUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=500&auto=format&fit=crop', description: 'Comparing India\'s stock market performance with global markets', author: 'Geniusphere Hub', date: '3 months ago' },
  { id: 'blog_20', title: 'Understanding SEBI: How India\'s Stock Market Regulator Protects Investors', type: 'blog', category: SectorType.FINANCE, url: 'https://www.reddit.com/r/Geniusphere_Hub/comments/1gihduy/understanding_sebi_how_indias_stock_market/', thumbnailUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=500&auto=format&fit=crop', description: 'Learn how SEBI safeguards investor interests in India', author: 'Geniusphere Hub', date: '3 months ago' },
  { id: 'blog_21', title: 'The Economic Impact of the Atmanirbhar Bharat Initiative', type: 'blog', category: SectorType.FINANCE, url: 'https://www.reddit.com/r/Geniusphere_Hub/comments/1ghnqul/the_economic_impact_of_the_atmanirbhar_bharat/', thumbnailUrl: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=500&auto=format&fit=crop', description: 'Analyzing the Self-Reliant India initiative\'s economic impact', author: 'Geniusphere Hub', date: '3 months ago' },
  // --- EBOOKS ---
  {
    id: 'res_ebook_01',
    title: 'The Python Handbook',
    type: 'ebook',
    category: SectorType.TECHNOLOGY,
    url: 'https://drive.google.com/file/d/sample-python-handbook',
    description: 'A comprehensive guide to Python programming for beginners. Includes exercises.',
    author: 'Geniusphere Curriculum Team',
    fileSize: '4.2 MB'
  },
  {
    id: 'res_ebook_02',
    title: 'Investment Strategies 101',
    type: 'ebook',
    category: SectorType.FINANCE,
    url: 'https://drive.google.com/file/d/sample-investment-101',
    description: 'Understanding asset allocation, risk management, and long-term wealth building.',
    author: 'Dr. Evelyn Reed',
    fileSize: '2.8 MB'
  }
];

export const VIDEOS: VideoResource[] = [
  { id: 'vid_01', title: 'Video 1', category: SectorType.TECHNOLOGY, videoUrl: 'https://www.youtube.com/watch?v=tOgrIjDGI78', thumbnailUrl: 'https://img.youtube.com/vi/tOgrIjDGI78/hqdefault.jpg', description: 'Educational video content', duration: '10:00' },
  { id: 'vid_02', title: 'Video 2', category: SectorType.TECHNOLOGY, videoUrl: 'https://www.youtube.com/watch?v=deeBWH_buhw', thumbnailUrl: 'https://img.youtube.com/vi/deeBWH_buhw/hqdefault.jpg', description: 'Educational video content', duration: '10:00' },
  { id: 'vid_03', title: 'Video 3', category: SectorType.TECHNOLOGY, videoUrl: 'https://www.youtube.com/watch?v=3nZ_1AHTBtU', thumbnailUrl: 'https://img.youtube.com/vi/3nZ_1AHTBtU/hqdefault.jpg', description: 'Educational video content', duration: '10:00' },
  { id: 'vid_04', title: 'Video 4', category: SectorType.TECHNOLOGY, videoUrl: 'https://www.youtube.com/watch?v=nk50TYfETNA', thumbnailUrl: 'https://img.youtube.com/vi/nk50TYfETNA/hqdefault.jpg', description: 'Educational video content', duration: '10:00' },
  { id: 'vid_05', title: 'Video 5', category: SectorType.TECHNOLOGY, videoUrl: 'https://www.youtube.com/watch?v=hPZ71rFAyS8', thumbnailUrl: 'https://img.youtube.com/vi/hPZ71rFAyS8/hqdefault.jpg', description: 'Educational video content', duration: '10:00' },
  { id: 'vid_06', title: 'Video 6', category: SectorType.FINANCE, videoUrl: 'https://www.youtube.com/watch?v=TYNsZF1qgaY', thumbnailUrl: 'https://img.youtube.com/vi/TYNsZF1qgaY/hqdefault.jpg', description: 'Educational video content', duration: '10:00' },
  { id: 'vid_07', title: 'Video 7', category: SectorType.FINANCE, videoUrl: 'https://www.youtube.com/watch?v=0olrjEQhZ6Q', thumbnailUrl: 'https://img.youtube.com/vi/0olrjEQhZ6Q/hqdefault.jpg', description: 'Educational video content', duration: '10:00' },
  { id: 'vid_08', title: 'Video 8', category: SectorType.FINANCE, videoUrl: 'https://www.youtube.com/watch?v=NXuP3GsgiPA', thumbnailUrl: 'https://img.youtube.com/vi/NXuP3GsgiPA/hqdefault.jpg', description: 'Educational video content', duration: '10:00' },
  { id: 'vid_09', title: 'Video 9', category: SectorType.FINANCE, videoUrl: 'https://www.youtube.com/watch?v=gtk_w5_SNK8', thumbnailUrl: 'https://img.youtube.com/vi/gtk_w5_SNK8/hqdefault.jpg', description: 'Educational video content', duration: '10:00' },
  { id: 'vid_10', title: 'Video 10', category: SectorType.FINANCE, videoUrl: 'https://www.youtube.com/watch?v=nN-cS3xWmXw', thumbnailUrl: 'https://img.youtube.com/vi/nN-cS3xWmXw/hqdefault.jpg', description: 'Educational video content', duration: '10:00' },
  { id: 'vid_11', title: 'Video 11', category: SectorType.PROFESSIONAL, videoUrl: 'https://www.youtube.com/watch?v=wBWq1bEc1hs', thumbnailUrl: 'https://img.youtube.com/vi/wBWq1bEc1hs/hqdefault.jpg', description: 'Educational video content', duration: '10:00' },
  { id: 'vid_12', title: 'Video 12', category: SectorType.PROFESSIONAL, videoUrl: 'https://www.youtube.com/watch?v=syYfmWr5FKU', thumbnailUrl: 'https://img.youtube.com/vi/syYfmWr5FKU/hqdefault.jpg', description: 'Educational video content', duration: '10:00' },
  { id: 'vid_13', title: 'Video 13', category: SectorType.PROFESSIONAL, videoUrl: 'https://www.youtube.com/watch?v=dl519YcoB6w', thumbnailUrl: 'https://img.youtube.com/vi/dl519YcoB6w/hqdefault.jpg', description: 'Educational video content', duration: '10:00' },
  { id: 'vid_14', title: 'Video 14', category: SectorType.PROFESSIONAL, videoUrl: 'https://www.youtube.com/watch?v=Tt_jCzZvO34', thumbnailUrl: 'https://img.youtube.com/vi/Tt_jCzZvO34/hqdefault.jpg', description: 'Educational video content', duration: '10:00' },
  { id: 'vid_15', title: 'Video 15', category: SectorType.PROFESSIONAL, videoUrl: 'https://www.youtube.com/watch?v=mxgeTBk7FjU', thumbnailUrl: 'https://img.youtube.com/vi/mxgeTBk7FjU/hqdefault.jpg', description: 'Educational video content', duration: '10:00' },
  { id: 'vid_16', title: 'Video 16', category: SectorType.TECHNOLOGY, videoUrl: 'https://www.youtube.com/watch?v=u3INOgf5OzY', thumbnailUrl: 'https://img.youtube.com/vi/u3INOgf5OzY/hqdefault.jpg', description: 'Educational video content', duration: '10:00' },
  { id: 'vid_17', title: 'Video 17', category: SectorType.TECHNOLOGY, videoUrl: 'https://www.youtube.com/watch?v=NZLNu-oNZyA', thumbnailUrl: 'https://img.youtube.com/vi/NZLNu-oNZyA/hqdefault.jpg', description: 'Educational video content', duration: '10:00' },
  { id: 'vid_18', title: 'Video 18', category: SectorType.TECHNOLOGY, videoUrl: 'https://www.youtube.com/watch?v=abXjFj3gML4', thumbnailUrl: 'https://img.youtube.com/vi/abXjFj3gML4/hqdefault.jpg', description: 'Educational video content', duration: '10:00' },
  { id: 'vid_19', title: 'Video 19', category: SectorType.TECHNOLOGY, videoUrl: 'https://www.youtube.com/watch?v=-bbbzSVwpBI', thumbnailUrl: 'https://img.youtube.com/vi/-bbbzSVwpBI/hqdefault.jpg', description: 'Educational video content', duration: '10:00' },
  { id: 'vid_20', title: 'Video 20', category: SectorType.TECHNOLOGY, videoUrl: 'https://www.youtube.com/watch?v=mVOvqpEkxqo', thumbnailUrl: 'https://img.youtube.com/vi/mVOvqpEkxqo/hqdefault.jpg', description: 'Educational video content', duration: '10:00' },
  { id: 'vid_21', title: 'Video 21', category: SectorType.FINANCE, videoUrl: 'https://www.youtube.com/watch?v=dcR2ZI37qaE', thumbnailUrl: 'https://img.youtube.com/vi/dcR2ZI37qaE/hqdefault.jpg', description: 'Educational video content', duration: '10:00' },
  { id: 'vid_22', title: 'Video 22', category: SectorType.FINANCE, videoUrl: 'https://www.youtube.com/watch?v=t5KGoh--Ok0', thumbnailUrl: 'https://img.youtube.com/vi/t5KGoh--Ok0/hqdefault.jpg', description: 'Educational video content', duration: '10:00' },
  { id: 'vid_23', title: 'Video 23', category: SectorType.FINANCE, videoUrl: 'https://www.youtube.com/watch?v=qQvc_vdem_w', thumbnailUrl: 'https://img.youtube.com/vi/qQvc_vdem_w/hqdefault.jpg', description: 'Educational video content', duration: '10:00' },
  { id: 'vid_24', title: 'Video 24', category: SectorType.FINANCE, videoUrl: 'https://www.youtube.com/watch?v=IzcbSVQZHzs', thumbnailUrl: 'https://img.youtube.com/vi/IzcbSVQZHzs/hqdefault.jpg', description: 'Educational video content', duration: '10:00' },
  { id: 'vid_25', title: 'Video 25', category: SectorType.FINANCE, videoUrl: 'https://www.youtube.com/watch?v=POgUQqgeVOg', thumbnailUrl: 'https://img.youtube.com/vi/POgUQqgeVOg/hqdefault.jpg', description: 'Educational video content', duration: '10:00' },
  { id: 'vid_26', title: 'Video 26', category: SectorType.PROFESSIONAL, videoUrl: 'https://www.youtube.com/watch?v=CSUscRShvj0', thumbnailUrl: 'https://img.youtube.com/vi/CSUscRShvj0/hqdefault.jpg', description: 'Educational video content', duration: '10:00' },
  { id: 'vid_27', title: 'Video 27', category: SectorType.PROFESSIONAL, videoUrl: 'https://www.youtube.com/watch?v=VwCG3kr04o4', thumbnailUrl: 'https://img.youtube.com/vi/VwCG3kr04o4/hqdefault.jpg', description: 'Educational video content', duration: '10:00' },
  { id: 'vid_28', title: 'Video 28', category: SectorType.PROFESSIONAL, videoUrl: 'https://www.youtube.com/watch?v=7WitSIUO8bk', thumbnailUrl: 'https://img.youtube.com/vi/7WitSIUO8bk/hqdefault.jpg', description: 'Educational video content', duration: '10:00' },
  { id: 'vid_29', title: 'Video 29', category: SectorType.PROFESSIONAL, videoUrl: 'https://www.youtube.com/watch?v=iDfMn82xhoM', thumbnailUrl: 'https://img.youtube.com/vi/iDfMn82xhoM/hqdefault.jpg', description: 'Educational video content', duration: '10:00' },
  { id: 'vid_30', title: 'Video 30', category: SectorType.PROFESSIONAL, videoUrl: 'https://www.youtube.com/watch?v=IMdonjUWwls', thumbnailUrl: 'https://img.youtube.com/vi/IMdonjUWwls/hqdefault.jpg', description: 'Educational video content', duration: '10:00' },
];

// Helper for generating generic modules for the new courses
const createMockModules = (topic: string, count: number = 10) => {
  return Array.from({ length: count }).map((_, i) => {
    return {
      id: `mod_${topic.substring(0, 3)}_${i}`,
      title: `${topic} - Module ${i + 1}`,
      description: `Deep dive into key concepts of ${topic}, covering essential theories and practical applications.`,
      videoUrl: 'https://www.youtube.com/watch?v=ad79nYk2keg', // Placeholder
      duration: '10:00',
      contentMarkdown: `## Module ${i + 1}: ${topic}\n\nThis module covers the fundamental aspects of **${topic}**.`
    };
  });
};

const createMockQuiz = (topic: string) => ({
  passThreshold: 70,
  questions: Array.from({ length: 30 }).map((_, i) => ({
    id: `q_${topic.substring(0, 3)}_${i}`,
    text: `Question ${i + 1} about ${topic}: What is the primary function?`,
    options: ["Option A: Incorrect", "Option B: Correct Answer", "Option C: Incorrect", "Option D: Incorrect"],
    correctIndex: 1
  }))
});

export const COURSES: Course[] = [
  // --- TECHNOLOGY ---
  {
    course_id: 'tech_ai_basics',
    title: 'Artificial Intelligence (AI) — Basics',
    sector: SectorType.TECHNOLOGY,
    short_description: 'Basics of AI, real-life applications, and intro to machine learning.',
    long_description: 'Explore the foundations of AI, neural networks, and how machine learning is reshaping industries.',
    level: 'Beginner',
    duration: '10 Modules',
    tags: ['AI', 'ML', 'Innovation'],
    status: 'active',
    simulationId: 'sim_ai_neural',
    modules: [
      { id: 'm1', title: 'What is AI?', description: 'Definitions and History', videoUrl: 'https://www.youtube.com/watch?v=ad79nYk2keg', duration: '05:20', contentMarkdown: "Intro to AI..." },
      { id: 'm2', title: 'Machine Learning vs AI', description: 'Understanding the difference', videoUrl: 'https://www.youtube.com/watch?v=ukzFI9rgwfU', duration: '06:00' },
      { id: 'm3', title: 'Neural Networks 101', description: 'How computers think', videoUrl: 'https://www.youtube.com/watch?v=aircAruvnKk', duration: '19:00' },
      { id: 'm4', title: 'Deep Learning', description: 'Layers of logic', videoUrl: 'https://www.youtube.com/watch?v=5q87K1WaoFI', duration: '08:45' },
      { id: 'm5', title: 'AI in Healthcare', description: 'Real world applications', videoUrl: 'https://www.youtube.com/watch?v=J4fKxVf-gSg', duration: '10:00' },
      { id: 'm6', title: 'AI in Finance', description: 'Algorithmic trading', videoUrl: 'https://www.youtube.com/watch?v=Z_tM042jWc4', duration: '10:00' },
      { id: 'm7', title: 'Ethics of AI', description: 'Bias and safety', videoUrl: 'https://www.youtube.com/watch?v=D5MNn_f58bE', duration: '10:00' },
      { id: 'm8', title: 'Generative AI', description: 'Creating art and text', videoUrl: 'https://www.youtube.com/watch?v=G2fqAlgmoPo', duration: '10:00' },
      { id: 'm9', title: 'Future of Work', description: 'AI impact on jobs', videoUrl: 'https://www.youtube.com/watch?v=M5K8d5e1_5E', duration: '10:00' },
      { id: 'm10', title: 'Building your first Model', description: 'Practical steps', videoUrl: 'https://www.youtube.com/watch?v=7eh4d6sabA0', duration: '10:00' }
    ],
    quiz: createMockQuiz("Artificial Intelligence")
  },
  {
    course_id: 'tech_blockchain',
    title: 'Blockchain Fundamentals',
    sector: SectorType.TECHNOLOGY,
    short_description: 'Distributed ledgers, cryptocurrencies, and practical blockchain use cases.',
    long_description: 'Understand the architecture of trustless systems, smart contracts, and the future of Web3.',
    level: 'Intermediate',
    duration: '10 Modules',
    tags: ['Blockchain', 'Crypto', 'Web3'],
    status: 'active',
    simulationId: 'sim_blockchain_hash',
    modules: createMockModules('Blockchain', 10),
    quiz: createMockQuiz('Blockchain')
  },
  {
    course_id: 'tech_cyber',
    title: 'Cybersecurity Essentials',
    sector: SectorType.TECHNOLOGY,
    short_description: 'Online safety, ethical hacking basics, and protecting digital identity.',
    long_description: 'Learn to defend against cyber threats, understand encryption, and secure your digital footprint.',
    level: 'Beginner',
    duration: '10 Modules',
    tags: ['Security', 'Privacy', 'Hacking'],
    status: 'active',
    simulationId: 'cyber-lab',
    modules: [
      { id: 'cyber_m1', title: 'Cyber Basics for Students', description: 'Understand what cybersecurity really means, why it is important for every student today, and the different types of threats you may encounter online', videoUrl: 'https://youtu.be/c5-cTCO4ZpI?si=5C7f0ueLcSMPNpgJ', duration: '10:00', contentMarkdown: 'Module 1: Cyber Basics for Students' },
      { id: 'cyber_m2', title: 'Building Safe Digital Foundations', description: 'Learn the difference between cyber safety and cybersecurity, understand your personal role in keeping the digital world secure', videoUrl: 'https://youtu.be/EswiqGU2upA?si=wwyF3VfNV1X4tbcK', duration: '10:00', contentMarkdown: 'Module 2: Building Safe Digital Foundations' },
      { id: 'cyber_m3', title: 'Securing Your Accounts Effectively', description: 'Explore the best ways to manage your passwords, understand why 2-factor authentication adds powerful security, and learn to identify phishing emails', videoUrl: 'https://youtu.be/YfKVweO5EhM?si=QEKsEntjhLpm3C4G', duration: '10:00', contentMarkdown: 'Module 3: Securing Your Accounts Effectively' },
      { id: 'cyber_m4', title: 'Smarter Browsing & Social Media Safety', description: 'Stay away from risky websites and harmful downloads, build safe online navigation habits, and learn how to adjust your social media privacy settings', videoUrl: 'https://youtu.be/Q2jB6K35rsY?si=Qbb0VrtV1MaJMl_K', duration: '10:00', contentMarkdown: 'Module 4: Smarter Browsing & Social Media Safety' },
      { id: 'cyber_m5', title: 'Safe Digital Behavior Every Day', description: 'Discover how your digital footprint shapes your online identity, practice safe browsing methods, and understand when and how to report suspicious behavior', videoUrl: 'https://youtu.be/McH3A-a-Ftk?si=ogJk6Ic-7OM8RRSl', duration: '10:00', contentMarkdown: 'Module 5: Safe Digital Behavior Every Day' },
      { id: 'cyber_m6', title: 'Protecting Your Devices & Connections', description: 'Know why antivirus tools matter, keep your devices updated for maximum protection, and understand the risks of using public Wi-Fi', videoUrl: 'https://youtu.be/ChoFe2dPnPg?si=MoyF6AH22oCfhwjn', duration: '10:00', contentMarkdown: 'Module 6: Protecting Your Devices & Connections' },
      { id: 'cyber_m7', title: 'Secure Device & School Network Usage', description: 'Use Bluetooth and file-sharing safely to avoid unwanted access, understand how firewalls guard your network, and follow proper rules on shared systems', videoUrl: 'https://youtu.be/xGx7R9A9w4w?si=ndQPYCPmTVRDyaKT', duration: '10:00', contentMarkdown: 'Module 7: Secure Device & School Network Usage' },
      { id: 'cyber_m8', title: 'Handling Online Threats Responsibly', description: 'Recognize and respond to cyberbullying, respect online copyright rules, and learn how to identify fake offers, scams, or unrealistic online deals', videoUrl: 'https://youtu.be/LBXYJ4eGjNM?si=-5uGsp0v46LwBz5k', duration: '10:00', contentMarkdown: 'Module 8: Handling Online Threats Responsibly' },
      { id: 'cyber_m9', title: 'Responsible & Respectful Online Conduct', description: 'Practice good digital manners (netiquette), stay safe while gaming or making in-game purchases, and understand why guidance from parents and teachers helps', videoUrl: 'https://youtu.be/Os9yLcXJ2BA?si=BTNZuEia6sFZZma0', duration: '10:00', contentMarkdown: 'Module 9: Responsible & Respectful Online Conduct' },
      { id: 'cyber_m10', title: 'Becoming a Smart Digital Citizen', description: 'Learn what it means to be a responsible digital citizen, understand how cybersecurity is a team effort, and remember: stay alert, stay safe', videoUrl: 'https://youtu.be/XlPKiT-0MGs?si=SHB3C3LukkMZSkZb', duration: '10:00', contentMarkdown: 'Module 10: Becoming a Smart Digital Citizen' }
    ],
    quiz: {
      passThreshold: 70,
      questions: [
        {
          id: 'q_sec_01',
          text: 'What is the primary goal of cybersecurity?',
          options: [
            'To make computers run faster',
            'To protect systems, networks, and data from digital attacks',
            'To monitor all employee activities',
            'To create better video games'
          ],
          correctIndex: 1
        },
        {
          id: 'q_sec_02',
          text: 'Which of the following creates the strongest password?',
          options: [
            'Your birthdate (e.g., 1990)',
            'The word "password123"',
            'A mix of 12+ uppercase, lowercase, numbers, and symbols',
            'Your pet\'s name'
          ],
          correctIndex: 2
        },
        {
          id: 'q_sec_03',
          text: 'What is a "phishing" attack?',
          options: [
            'A virus that deletes all your files',
            'Hacking into a bank server',
            'A fraudulent attempt to steal sensitive info by pretending to be a trustworthy source',
            'Using a computer to catch fish'
          ],
          correctIndex: 2
        },
        {
          id: 'q_sec_04',
          text: 'What does Two-Factor Authentication (2FA) add to your account security?',
          options: [
            'It makes your password twice as long',
            'It requires a second form of verification (like a code) in addition to your password',
            'It allows two people to use the account',
            'It removes the need for a password'
          ],
          correctIndex: 1
        },
        {
          id: 'q_sec_05',
          text: 'What is your "digital footprint"?',
          options: [
            'The physical size of your laptop',
            'The trail of data you leave behind while using the internet',
            'The number of steps you take while holding your phone',
            'A secure boot drive'
          ],
          correctIndex: 1
        },
        {
          id: 'q_sec_06',
          text: 'Which action is generally UNSAFE on public Wi-Fi?',
          options: [
            'Reading news articles',
            'Checking the weather',
            'Logging into your bank account without a VPN',
            'Searching for a recipe'
          ],
          correctIndex: 2
        },
        {
          id: 'q_sec_07',
          text: 'What does "HTTPS" in a website URL indicate?',
          options: [
            'Hyper Text Transfer Protocol Secure - communication is encrypted',
            'High Tech Transfer Speed - the site loads faster',
            'Home Text Type System - it is a personal blog',
            'HTML Text Transfer Protocol Source - open source code'
          ],
          correctIndex: 0
        },
        {
          id: 'q_sec_08',
          text: 'What is "ransomware"?',
          options: [
            'Free software that runs ads',
            'Malware that locks your data and demands payment to release it',
            'Software used to track stolen laptops',
            'An antivirus program'
          ],
          correctIndex: 1
        },
        {
          id: 'q_sec_09',
          text: 'What is "social engineering"?',
          options: [
            'Building social media apps',
            'Manipulating people into giving up confidential information',
            'Engineers working together in a team',
            'Organizing social events online'
          ],
          correctIndex: 1
        },
        {
          id: 'q_sec_10',
          text: 'What should you do if you receive a suspicious email with an attachment?',
          options: [
            'Open the attachment to see what it is',
            'Reply and ask if it is real',
            'Forward it to all your friends',
            'Do not open it; report it as spam or delete it'
          ],
          correctIndex: 3
        },
        {
          id: 'q_sec_11',
          text: 'Which of these is a good practice for digital citizenship?',
          options: [
            'Sharing fake news without checking',
            'Bullying others anonymously',
            'Respecting others\' privacy and copyright',
            'Downloading pirated movies'
          ],
          correctIndex: 2
        },
        {
          id: 'q_sec_12',
          text: 'What is a "firewall"?',
          options: [
            'A wall behind your computer to prevent overheating',
            'A security system that monitors and controls incoming and outgoing network traffic',
            'Software that burns viruses',
            'A physical lock on the server room'
          ],
          correctIndex: 1
        }
      ]
    }
  },
  {
    course_id: 'tech_office',
    title: 'Microsoft Office Mastery',
    sector: SectorType.TECHNOLOGY,
    short_description: 'Word, Excel, PowerPoint essentials for academic and professional use.',
    long_description: 'Master the tools used in 90% of workplaces. Formulas, formatting, and presentations.',
    level: 'Beginner',
    duration: '10 Modules',
    tags: ['Office', 'Productivity', 'Excel'],
    status: 'active',
    simulationId: 'sim_office',
    modules: createMockModules('Microsoft Office', 10),
    quiz: createMockQuiz('Microsoft Office')
  },
  {
    course_id: 'tech_iot',
    title: 'Internet of Things (IoT)',
    sector: SectorType.TECHNOLOGY,
    short_description: 'Smart devices, sensors, and their role in everyday life.',
    long_description: 'How physical objects connect to the internet to share data and automate the world.',
    level: 'Intermediate',
    duration: '10 Modules',
    tags: ['IoT', 'Hardware', 'Smart Home'],
    status: 'active',
    simulationId: 'sim_iot_smart',
    modules: createMockModules('IoT', 10),
    quiz: createMockQuiz('IoT')
  },
  {
    course_id: 'tech_digital_footprint',
    title: 'Digital Footprint & Privacy',
    sector: SectorType.TECHNOLOGY,
    short_description: 'Awareness of online presence, responsible digital habits, and data protection.',
    long_description: 'Your online reputation matters. Learn how to manage it and protect your personal data.',
    level: 'Beginner',
    duration: '10 Modules',
    tags: ['Privacy', 'Social Media', 'Safety'],
    status: 'active',
    simulationId: 'sim_digital_privacy',
    modules: createMockModules('Digital Privacy', 10),
    quiz: createMockQuiz('Digital Privacy')
  },

  // --- FINANCE ---
  {
    course_id: 'fin_intro',
    title: 'Introduction to Finance',
    sector: SectorType.FINANCE,
    short_description: 'Basics of money management and budgeting.',
    long_description: 'Build a strong financial foundation by mastering the principles of budgeting and saving.',
    level: 'Beginner',
    duration: '10 Modules',
    tags: ['Budgeting', 'Savings', 'Money'],
    status: 'active',
    simulationId: 'sim_intro_finance',
    modules: [
      { id: 'fin_intro_01', title: 'Understanding Money & Making Smart Choices', description: 'Learn what financial literacy means, why it matters in daily life, and how to clearly tell needs from wants', videoUrl: 'https://www.youtube.com/watch?v=GBpUqhCWPQw', duration: '10:00', contentMarkdown: '## Module 1: Understanding Money & Making Smart Choices\n\nLearn the fundamentals of financial literacy and smart money decisions.' },
      { id: 'fin_intro_02', title: 'Budgeting, Saving & Growing Your Money', description: 'Understand how to track your income and expenses, make saving a habit, and get a simple introduction to investing', videoUrl: 'https://www.youtube.com/watch?v=IV9YRqAa0ec', duration: '10:00', contentMarkdown: '## Module 2: Budgeting, Saving & Growing Your Money\n\nMaster budgeting techniques and learn how to grow your wealth.' },
      { id: 'fin_intro_03', title: 'Using Credit Wisely & Staying Protected', description: 'Learn how credit works, how to build a strong credit score, avoid unnecessary debt, and protect yourself from scams', videoUrl: 'https://www.youtube.com/watch?v=MXXwpiyAq2E', duration: '10:00', contentMarkdown: '## Module 3: Using Credit Wisely & Staying Protected\n\nUnderstand credit management and financial security.' },
      { id: 'fin_intro_04', title: 'Managing Money Smartly Every Day', description: 'Explore how money flows in and out, understand the power of budgeting, and gain full control over your finances', videoUrl: 'https://www.youtube.com/watch?v=a2rPq3ib69Y', duration: '10:00', contentMarkdown: '## Module 4: Managing Money Smartly Every Day\n\nDaily money management strategies for financial success.' },
      { id: 'fin_intro_05', title: 'Practical Budgeting Skills for Students', description: 'Discover easy budgeting methods, practice tracking your spending, and learn how saving helps you prepare for future opportunities', videoUrl: 'https://www.youtube.com/watch?v=03yXRJN1UKI', duration: '10:00', contentMarkdown: '## Module 5: Practical Budgeting Skills for Students\n\nStudent-focused budgeting techniques and savings strategies.' },
      { id: 'fin_intro_06', title: 'Setting Goals & Building Smart Spending Habits', description: 'Learn to set meaningful financial goals and develop smart spending habits that support your long-term success', videoUrl: 'https://www.youtube.com/watch?v=4kyP84lXIA8', duration: '10:00', contentMarkdown: '## Module 6: Setting Goals & Building Smart Spending Habits\n\nGoal-setting and habit formation for financial wellness.' },
      { id: 'fin_intro_07', title: 'Staying Debt-Free & Making Better Choices', description: 'Understand how to avoid falling into debt, make conscious spending decisions, and follow habits that keep your financial life stable', videoUrl: 'https://www.youtube.com/watch?v=7JGTfdlKNBM', duration: '10:00', contentMarkdown: '## Module 7: Staying Debt-Free & Making Better Choices\n\nDebt avoidance strategies and conscious spending.' },
      { id: 'fin_intro_08', title: 'Credit, Debt & Prioritizing Your Needs', description: 'Learn how credit shapes your financial future, avoid the dangers of excessive debt, and understand how to prioritize needs over wants', videoUrl: 'https://www.youtube.com/watch?v=_ny6QuvcRps', duration: '10:00', contentMarkdown: '## Module 8: Credit, Debt & Prioritizing Your Needs\n\nCredit management and priority-based spending.' },
      { id: 'fin_intro_09', title: 'Smart Saving, Budgeting & Investing Skills', description: 'Build long-term saving strategies, strengthen your budgeting skills, and get a friendly introduction to investing', videoUrl: 'https://www.youtube.com/watch?v=t3vp-zYpCV0', duration: '10:00', contentMarkdown: '## Module 9: Smart Saving, Budgeting & Investing Skills\n\nAdvanced saving techniques and investment basics.' },
      { id: 'fin_intro_10', title: 'Real-Life Money Practice & Securing Your Future', description: 'Apply real-life scenarios like balancing saving and spending, understand how to stay safe from scams, and take confident steps toward long-term financial security', videoUrl: 'https://www.youtube.com/watch?v=aywGMwiZOes', duration: '10:00', contentMarkdown: '## Module 10: Real-Life Money Practice & Securing Your Future\n\nPractical application and long-term financial planning.' },
    ],
    quiz: createMockQuiz('Finance Intro')
  },
  {
    course_id: 'fin_fintech',
    title: 'Fintech Revolution',
    sector: SectorType.FINANCE,
    short_description: 'Technology in banking and digital payments.',
    long_description: 'How startups are disrupting traditional banking with apps, APIs, and digital wallets.',
    level: 'Intermediate',
    duration: '10 Modules',
    tags: ['Fintech', 'Apps', 'Payments'],
    status: 'active',
    simulationId: 'sim_fintech',
    modules: createMockModules('Fintech', 10),
    quiz: createMockQuiz('Fintech')
  },
  {
    course_id: 'fin_banking',
    title: 'Types of Banking Accounts',
    sector: SectorType.FINANCE,
    short_description: 'Savings, current, fixed deposits, and their uses.',
    long_description: 'Navigate the banking system. Interest rates, fees, and choosing the right account.',
    level: 'Beginner',
    duration: '10 Modules',
    tags: ['Banking', 'Accounts', 'Interest'],
    status: 'active',
    simulationId: 'sim_finance_budget', // Budgeting applies to banking
    modules: createMockModules('Banking', 10),
    quiz: createMockQuiz('Banking')
  },
  {
    course_id: 'fin_stocks',
    title: 'Stock Market Basics',
    sector: SectorType.FINANCE,
    short_description: 'How stock markets work, investing essentials.',
    long_description: 'Demystifying Wall Street. Bulls, bears, dividends, and reading a stock chart.',
    level: 'Intermediate',
    duration: '10 Modules',
    tags: ['Stocks', 'Investing', 'Markets'],
    status: 'active',
    simulationId: 'sim_stock_market',
    modules: createMockModules('Stock Market', 10),
    quiz: createMockQuiz('Stock Market')
  },
  {
    course_id: 'fin_crypto',
    title: 'Cryptocurrency Deep Dive',
    sector: SectorType.FINANCE,
    short_description: 'Understanding Bitcoin, Ethereum, and digital assets.',
    long_description: 'Beyond the hype. How crypto works as a currency and an asset class.',
    level: 'Advanced',
    duration: '10 Modules',
    tags: ['Crypto', 'Bitcoin', 'Assets'],
    status: 'active',
    simulationId: 'sim_crypto',
    modules: createMockModules('Cryptocurrency', 10),
    quiz: createMockQuiz('Cryptocurrency')
  },
  {
    course_id: 'fin_economy',
    title: 'Global Events & Economy',
    sector: SectorType.FINANCE,
    short_description: 'How international events impact finance and daily life.',
    long_description: 'Inflation, recession, trade wars. Understand the headlines affecting your wallet.',
    level: 'Advanced',
    duration: '10 Modules',
    tags: ['Economy', 'Global', 'News'],
    status: 'active',
    simulationId: 'sim_global_economy',
    modules: createMockModules('Global Economy', 10),
    quiz: createMockQuiz('Global Economy')
  },

  // --- PROFESSIONAL DEVELOPMENT ---
  {
    course_id: 'prof_soft_skills',
    title: 'Professional & Soft Skills',
    sector: SectorType.PROFESSIONAL,
    short_description: 'Building confidence, teamwork, and workplace etiquette.',
    long_description: 'Technical skills get you the interview; soft skills get you the job.',
    level: 'Beginner',
    duration: '10 Modules',
    tags: ['Soft Skills', 'Confidence', 'Etiquette'],
    status: 'active',
    simulationId: 'sim_prof_skills',
    modules: [
      { id: 'prof_soft_01', title: 'Core Foundations of Professional Growth', description: 'Mastering Professional Skills introduces the basics needed for success, while effective communication and strategic time management help you express ideas clearly', videoUrl: 'https://www.youtube.com/watch?v=ylD3yVPnJjc', duration: '10:00', contentMarkdown: '## Module 1: Core Foundations of Professional Growth\n\nBuild the essential foundations for professional success.' },
      { id: 'prof_soft_02', title: 'Teamwork, Problem-Solving & Leadership', description: 'Collaborative teamwork builds strong group skills, effective problem-solving strengthens analytical thinking, and impactful leadership helps you guide others', videoUrl: 'https://www.youtube.com/watch?v=GxekwgerYro', duration: '10:00', contentMarkdown: '## Module 2: Teamwork, Problem-Solving & Leadership\n\nDevelop collaborative and leadership capabilities.' },
      { id: 'prof_soft_03', title: 'Smart Thinking, Emotional Strength & Conflict Skills', description: 'Strategic decision-making sharpens judgment, developing emotional intelligence builds self-awareness, and constructive conflict resolution teaches you how to handle disagreements', videoUrl: 'https://www.youtube.com/watch?v=egKrXpWrVUk', duration: '10:00', contentMarkdown: '## Module 3: Smart Thinking, Emotional Strength & Conflict Skills\n\nEnhance emotional intelligence and conflict management.' },
      { id: 'prof_soft_04', title: 'Speaking, Resume Focus & Interview Skills', description: 'Confident public speaking improves stage presence, resume-focused professional skills help you present yourself professionally, and ace your interviews with proven techniques', videoUrl: 'https://www.youtube.com/watch?v=xlv82O9vsg4', duration: '10:00', contentMarkdown: '## Module 4: Speaking, Resume Focus & Interview Skills\n\nMaster communication and career preparation skills.' },
      { id: 'prof_soft_05', title: 'Work-Life Skills & Digital Fluency', description: 'Achieve work-life balance, enhance digital literacy, and learn the basics of project management to stay organized in academic and professional environments', videoUrl: 'https://www.youtube.com/watch?v=Ne-5_DA85FE', duration: '10:00', contentMarkdown: '## Module 5: Work-Life Skills & Digital Fluency\n\nBalance life and develop digital competencies.' },
      { id: 'prof_soft_06', title: 'Motivation, Body Language & Cultural Awareness', description: 'Cultivate self-motivation to stay driven, understand body language to communicate non-verbally, and develop cross-cultural competence to work with diverse people', videoUrl: 'https://www.youtube.com/watch?v=ukZsze-rMkk', duration: '10:00', contentMarkdown: '## Module 6: Motivation, Body Language & Cultural Awareness\n\nBuild motivation and cultural intelligence.' },
      { id: 'prof_soft_07', title: 'Stress, Growth & Your Path to Success', description: 'Manage stress effectively to stay productive, embrace continuous professional development, and follow the Path to Success mindset for long-term career growth', videoUrl: 'https://www.youtube.com/watch?v=iwvmpXdhn0I', duration: '10:00', contentMarkdown: '## Module 7: Stress, Growth & Your Path to Success\n\nManage stress and plan your career journey.' },
      { id: 'prof_soft_08', title: 'Adaptability, Critical Thinking & Creativity', description: 'Become adaptable to change, strengthen your critical thinking for better decisions, and boost creativity and innovation to bring new ideas to life', videoUrl: 'https://www.youtube.com/watch?v=-9hrEjqYTY0', duration: '10:00', contentMarkdown: '## Module 8: Adaptability, Critical Thinking & Creativity\n\nFoster adaptability and innovative thinking.' },
      { id: 'prof_soft_09', title: 'Work Ethic, Presentation & Listening Skills', description: 'Build a strong work ethic, craft powerful presentations, and improve your listening skills to understand others better and collaborate effectively', videoUrl: 'https://www.youtube.com/watch?v=SKmh_dOuzYg', duration: '10:00', contentMarkdown: '## Module 9: Work Ethic, Presentation & Listening Skills\n\nStrengthen work ethic and communication abilities.' },
      { id: 'prof_soft_10', title: 'Goal Setting, Discipline & Professional Etiquette', description: 'Set clear goals, practice self-discipline to stay consistent, and master professional etiquette to present yourself confidently in any formal environment', videoUrl: 'https://www.youtube.com/watch?v=ZWrhGNkeKuI', duration: '10:00', contentMarkdown: '## Module 10: Goal Setting, Discipline & Professional Etiquette\n\nAchieve goals with discipline and professionalism.' },
    ],
    quiz: createMockQuiz('Soft Skills')
  },
  {
    course_id: 'prof_time',
    title: 'Time Management',
    sector: SectorType.PROFESSIONAL,
    short_description: 'Productivity techniques for students and professionals.',
    long_description: 'Pomodoro, Time Blocking, and Eisenhower Matrix. Master your schedule.',
    level: 'Beginner',
    duration: '10 Modules',
    tags: ['Productivity', 'Planning', 'Focus'],
    status: 'active',
    simulationId: 'sim_time_matrix',
    modules: createMockModules('Time Management', 10),
    quiz: createMockQuiz('Time Management')
  },
  {
    course_id: 'prof_comm',
    title: 'Communication Skills',
    sector: SectorType.PROFESSIONAL,
    short_description: 'Verbal, written, and presentation skills.',
    long_description: 'Speak so people listen. Write so people understand. Present with power.',
    level: 'Intermediate',
    duration: '10 Modules',
    tags: ['Communication', 'Public Speaking', 'Writing'],
    status: 'active',
    simulationId: 'sim_soft_comm',
    modules: createMockModules('Communication', 10),
    quiz: createMockQuiz('Communication')
  },
  {
    course_id: 'prof_social',
    title: 'Social Profile Development',
    sector: SectorType.PROFESSIONAL,
    short_description: 'Building LinkedIn, CVs, and a positive online presence.',
    long_description: 'Your personal brand is your most valuable asset. Build it intentionally.',
    level: 'Intermediate',
    duration: '10 Modules',
    tags: ['Branding', 'LinkedIn', 'Career'],
    status: 'active',
    simulationId: 'sim_social_profile',
    modules: createMockModules('Social Profile', 10),
    quiz: createMockQuiz('Social Profile')
  }
];

export const SERVICES: Service[] = [
  {
    service_id: 'serv_01',
    title: 'Skill Development Workshops',
    category: 'WORKSHOPS',
    description: 'Prepare students for the future with hands-on learning in AI, Cybersecurity, Coding, and Emerging Technologies.',
    deliverables: ['On-site & Virtual Sessions', 'Customized Curriculum for Your School', 'Student Skill Assessment & Progress Tracking']
  },
  {
    service_id: 'serv_02',
    title: 'Mentorship & Career Guidance',
    category: 'MENTORSHIP',
    description: 'Support students with personalized mentorship from industry experts to explore career paths and enhance learning.',
    deliverables: ['Dedicated Industry Mentor for Students', 'Career Roadmaps for Young Learners', 'Project & Portfolio Guidance', 'Mock Interviews & Soft Skills Training']
  },
  {
    service_id: 'serv_03',
    title: 'Certification & Recognition',
    category: 'CERTIFICATION',
    description: 'Give students a head start in their careers with official certification and recognition.',
    deliverables: ['Verified Digital Certificates', 'Sharable LinkedIn / School Profile Badges', 'Entry in Geniusphere Graduate Directory']
  },
  {
    service_id: 'serv_04',
    title: 'Teacher & School Support',
    category: 'CONSULTING',
    description: 'Empower teachers and schools to implement future-ready programs efficiently.',
    deliverables: ['Faculty Workshops & Training', 'Custom Curriculum Design', 'Performance & Impact Tracking']
  }
];

export const TRAINERS_DATA: Trainer[] = [
  {
    id: "t1",
    name: "Pavan Kumar.S",
    title: "BCA Student & Session Handler",
    bio: "Certified Google AI educator with expertise in K12 and higher education. Passionate about integrating generative AI and emerging technologies into modern learning experiences.",
    imageUrl: "/images/pavan-kumar.jpg",
    qualifications: [
      {
        title: "Gemini Certification for Students (K12)",
        imageUrl: "https://storage.googleapis.com/exceedlms-external-uploads-production/uploads/organizations/default_certification_badges/349/original/500x500-skillshop-course-badgesl-02.png",
        certificateUrl: "https://edu.exceedlms.com/student/award/3mq9jHMoY6dL29HR6pAQ8oP1"
      },
      {
        title: "Google AI for Higher Education",
        imageUrl: "https://storage.googleapis.com/exceedlms-external-uploads-production/uploads/certifications/badges/143348/large/500x500-google-ai-for-higher-ed-course-badge-final.png",
        certificateUrl: "https://edu.exceedlms.com/student/award/ubojGQu5fkSgUFgLLKXxB8jx"
      },
      {
        title: "Google AI for K12 Educators",
        imageUrl: "https://storage.googleapis.com/exceedlms-external-uploads-production/uploads/certifications/badges/143352/large/500x500-gemini-course-badge-final-01-1.png",
        certificateUrl: "https://edu.exceedlms.com/student/award/kXm7XPWrWrkXqUHk3TexNuqW"
      },
      {
        title: "Generative AI for Educators Certificate",
        imageUrl: "https://storage.googleapis.com/exceedlms-external-uploads-production/uploads/certifications/badges/143338/large/genai-completion2.png",
        certificateUrl: "https://edu.exceedlms.com/student/award/2sEp7nY7HihXS4r3QL5nFGFu"
      }
    ]
  }
];

export const GALLERY_DATA: GalleryItem[] = [
  {
    id: 'gallery_01',
    schoolName: "Innovate High School",
    description: "Cybersecurity bootcamp for Grade 11 students.",
    marqueeImageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop",
    eventCategory: "Sessions",
    detailImageUrls: [
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=500&auto=format&fit=crop"
    ]
  },
  {
    id: 'gallery_02',
    schoolName: "Geniusphere Tech Day",
    description: "Annual tech showcase with student projects.",
    marqueeImageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop",
    eventCategory: "Sessions",
    detailImageUrls: [
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=500&auto=format&fit=crop"
    ]
  },
  {
    id: 'gallery_03',
    schoolName: "Vignan Public High School",
    description: "Debate Competition: Juniors vs Seniors.",
    marqueeImageUrl: "/images/vignan-debate/vignan-debate-01.jpg",
    eventCategory: "Debate Events",
    detailImageUrls: [
      "/images/vignan-debate/vignan-debate-01.jpg",
      "/images/vignan-debate/vignan-debate-02.jpg",
      "/images/vignan-debate/vignan-debate-03.jpg",
      "/images/vignan-debate/vignan-debate-04.jpg",
      "/images/vignan-debate/vignan-debate-05.jpg",
      "/images/vignan-debate/vignan-debate-06.jpg",
      "/images/vignan-debate/vignan-debate-07.jpg",
      "/images/vignan-debate/vignan-debate-08.jpg",
      "/images/vignan-debate/vignan-debate-09.jpg"
    ]
  }
];

export const FAQS: FAQItem[] = [
  {
    question: "What is the duration and frequency of the classes?",
    answer: "Our interactive modules are self-paced, but our cohort-based live workshops typically run for 4-6 weeks with 2 sessions per week."
  },
  {
    question: "What all programs are available for my kids?",
    answer: "We offer comprehensive paths in Artificial Intelligence, Blockchain Fundamentals, Financial Literacy, and Professional Development."
  },
  {
    question: "Do you offer 1-on-1 mentorship?",
    answer: "Yes, we provide personalized mentorship programs connecting students with industry experts for career guidance and skill development."
  },
  {
    question: "What are the system requirements for the simulations?",
    answer: "Geniusphere is browser-based. A modern browser (Chrome, Firefox, Safari) and a stable internet connection are all you need. No heavy downloads required."
  }
];

export const FEATURES: FeatureItem[] = [
  {
    title: "Quality of curriculum",
    description: "Personalized curriculum focused on mastery through depth and practice.",
    iconName: "BookOpen"
  },
  {
    title: "Progress monitoring",
    description: "Highly detailed personalized progress reports.",
    iconName: "PieChart"
  },
  {
    title: "Quality of teachers",
    description: "Highly passionate and qualified teachers with relevant background.",
    iconName: "ShieldCheck"
  },
  {
    title: "In-class & outside class engagement",
    description: "Student centric fun environment - community events, webinars & more.",
    iconName: "Users"
  },
  {
    title: "Adaptive AI based learning",
    description: "Learning journey aided by AI ensuring better learning outcomes.",
    iconName: "Zap"
  },
  {
    title: "Hands-on learning",
    description: "Rigorous hands-on practice enabled through 1k+ of exercises & worksheets.",
    iconName: "FileText"
  }
];

export const VIDEO_TESTIMONIALS: VideoTestimonial[] = [
  {
    id: 'vt1',
    quote: "I've been delighted by looking at the progress my daughter has made and the sincerity shown by Geniusphere.",
    author: "DEEPANJAN, Nandini's father",
    role: "USA",
    category: 'Parent',
    flagCode: "USA",
    videoThumbnail: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=500&auto=format&fit=crop",
    // Replaced with YouTube link
    videoUrl: "https://www.youtube.com/watch?v=L_LUpnjgPso"
  },
  {
    id: 'vt2',
    quote: "The parents should take a trial class take a decision and definitely join!",
    author: "RADA, Joshua's mother",
    role: "UK",
    category: 'Parent',
    flagCode: "UK",
    videoThumbnail: "https://images.unsplash.com/photo-1610216705422-caa3fcb6d158?q=80&w=500&auto=format&fit=crop",
    videoUrl: "https://www.youtube.com/watch?v=Jv6Z0VqK9C4"
  },
  {
    id: 'vt3',
    quote: "Fantastic mentorship by the teacher, one word to describe my experience - EXCELLENT!",
    author: "DR. AUROOB, Anusha's father",
    role: "INDIA",
    category: 'Parent',
    flagCode: "IN",
    videoThumbnail: "https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=500&auto=format&fit=crop",
    videoUrl: "https://www.youtube.com/watch?v=ysz5S6P_oj0"
  },
  {
    id: 'vt4',
    quote: "We saw a 40% increase in confidence within just two months. Highly recommended.",
    author: "SARAH, School Principal",
    role: "UAE",
    category: 'School',
    flagCode: "UAE",
    videoThumbnail: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=500&auto=format&fit=crop",
    videoUrl: "https://www.youtube.com/watch?v=9xwazD5SyVg"
  }
];

export const MOCK_STUDENTS: Student[] = [
  { id: 's1', name: 'Alex Johnson', email: 'alex.j@example.com', enrolledCourse: 'AI Fundamentals', progress: 45, status: 'Active', joinDate: '2023-01-15' },
  { id: 's2', name: 'Maria Garcia', email: 'm.garcia@example.com', enrolledCourse: 'Finance 101', progress: 80, status: 'Active', joinDate: '2023-02-10' },
  { id: 's3', name: 'Sam Lee', email: 'sam.lee@example.com', enrolledCourse: 'Blockchain Basics', progress: 100, status: 'Completed', joinDate: '2022-11-05' },
  { id: 's4', name: 'Jessica Chen', email: 'jess.chen@example.com', enrolledCourse: 'Public Speaking', progress: 10, status: 'Inactive', joinDate: '2023-03-20' },
  { id: 's5', name: 'David Smith', email: 'd.smith@example.com', enrolledCourse: 'AI Fundamentals', progress: 60, status: 'Active', joinDate: '2023-01-20' },
];

export const ACTION_PLAN_DATA: CurriculumItem[] = [
  { id: 'plan_1', topic: 'Advanced Neural Networks Module', course: 'AI Masterclass', assignedTo: 'Dr. Reed', dueDate: '2023-11-15', status: 'In Progress' },
  { id: 'plan_2', topic: 'Crypto Security Simulation', course: 'Blockchain', assignedTo: 'Dev Team', dueDate: '2023-10-30', status: 'Pending' },
  { id: 'plan_3', topic: 'Market Crash Scenario', course: 'Finance', assignedTo: 'Sarah J.', dueDate: '2023-09-20', status: 'Completed' },
  { id: 'plan_4', topic: 'Soft Skills Quiz Update', course: 'Professional', assignedTo: 'Content Team', dueDate: '2023-11-01', status: 'Pending' },
];

export const MOCK_AMBASSADORS: Ambassador[] = [];