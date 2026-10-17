
import { BookOpen, Users, Trophy, Layout, Brain, Settings, HelpCircle, AlertTriangle, ShieldCheck, Sparkles, Monitor, ClipboardCheck, MessageSquare, Heart, Target, Zap, Clock, Lightbulb, PenTool, Volume2, Accessibility, Star, Megaphone, Layers, Globe, Palette, Headphones, Eye, Rocket, GraduationCap, Handshake, FileText } from 'lucide-react';

export const TEACHING_TIPS = [
    {
        title: 'The Flipped Classroom',
        category: 'Pedagogy',
        description: 'Reverse the traditional learning environment by delivering instructional content, often online, outside of the classroom. It moves activities, including those that may have traditionally been considered homework, into the classroom.',
        icon: BookOpen,
        color: 'text-blue-400'
    },
    {
        title: 'Think-Pair-Share',
        category: 'Engagement',
        description: 'A collaborative learning strategy where students work together to solve a problem or answer a question about an assigned reading. This technique requires students to (1) think individually about a topic or answer to a question; and (2) share ideas with classmates.',
        icon: Users,
        color: 'text-green-400'
    },
    {
        title: 'Gamification Strategies',
        category: 'Motivation',
        description: 'Integrate game-design elements and game principles in non-game contexts. It can also be defined as a set of activities and processes to solve problems by using or applying the characteristics of game elements.',
        icon: Trophy,
        color: 'text-yellow-400'
    },
    {
        title: 'Instructional Scaffolding',
        category: 'Support',
        description: "A process through which a teacher adds supports for students in order to enhance learning and aid in the mastery of tasks. The teacher does this by systematically building on students' experiences and knowledge as they are learning new skills.",
        icon: Layout,
        color: 'text-purple-400'
    },
    {
        title: 'Active Recall',
        category: 'Cognition',
        description: 'A principle of efficient learning, which claims the need to actively stimulate memory during the learning process. It contrasts with passive review, in which the learning material is processed passively (e.g. by reading, watching, etc.).',
        icon: Brain,
        color: 'text-pink-400'
    },
    {
        title: 'Differentiated Instruction',
        category: 'Inclusion',
        description: 'A framework or philosophy for effective teaching that involves providing all students within their diverse classroom community of learners a range of different avenues for understanding new information.',
        icon: Settings,
        color: 'text-cyan-400'
    }
];

export const CLASSROOM_MANAGEMENT = [
    {
        title: 'Positive Reinforcement',
        category: 'Behavior',
        description: 'Encourage desired behaviors by acknowledging and rewarding them. Use verbal praise, tokens, or privileges to reinforce positive actions consistently.',
        icon: Heart,
        color: 'text-pink-400',
        details: {
            overview: "Positive reinforcement is one of the most powerful tools in a teacher's arsenal. By consistently acknowledging and rewarding desired behaviors, you create an environment where students are motivated to repeat those behaviors.",
            keyPoints: [
                "Be specific with praise: 'Great job raising your hand!' is better than 'Good job'",
                "Reinforce immediately after the behavior occurs",
                "Use a variety of reinforcers: verbal praise, stickers, privileges, peer recognition",
                "Maintain a 4:1 ratio of positive to corrective feedback",
                "Fade tangible rewards over time, transitioning to intrinsic motivation"
            ],
            simulation: {
                title: "Classroom Scenario: The Distracted Student",
                scenario: "A student who usually talks out of turn raises their hand for the first time today.",
                options: [
                    { text: "Ignore it and continue teaching", result: "missed", feedback: "You missed a crucial opportunity to reinforce the desired behavior. The student may not repeat it." },
                    { text: "Say 'Yes, what is it?' neutrally", result: "partial", feedback: "You acknowledged them, but didn't reinforce the positive behavior. Add specific praise!" },
                    { text: "Smile and say 'I love that you raised your hand! What's your question?'", result: "correct", feedback: "Perfect! You specifically praised the behavior you want to see more of." }
                ]
            }
        }
    },
    {
        title: 'Clear Expectations',
        category: 'Structure',
        description: 'Establish and communicate classroom rules clearly from day one. Post them visibly and review regularly. Consistency is key to effective management.',
        icon: Target,
        color: 'text-blue-400',
        details: {
            overview: "Clear expectations remove ambiguity and help students understand exactly what success looks like. When students know the rules and routines, they feel safer and can focus on learning.",
            keyPoints: [
                "Limit rules to 3-5 positively-stated expectations",
                "Involve students in creating rules for buy-in",
                "Model and practice each expectation explicitly",
                "Post rules visibly and reference them often",
                "Be consistent—apply rules equally to all students"
            ],
            simulation: {
                title: "First Day Setup",
                scenario: "It's the first day of school. How do you introduce classroom expectations?",
                options: [
                    { text: "Hand out a printed list of 15 rules", result: "missed", feedback: "Too many rules! Students won't remember them. Less is more." },
                    { text: "Tell students 'Just be respectful' and move on", result: "partial", feedback: "Too vague. Students need specific, observable behaviors." },
                    { text: "Introduce 4 rules, have students act them out, and post them on the wall", result: "correct", feedback: "Excellent! Limited rules, active practice, and visual reference. This is evidence-based." }
                ]
            }
        }
    },
    {
        title: 'Transition Strategies',
        category: 'Efficiency',
        description: 'Use signals, timers, and routines to move students smoothly between activities. Practice transitions until they become automatic.',
        icon: Zap,
        color: 'text-yellow-400',
        details: {
            overview: "Smooth transitions save instructional time and prevent behavior issues. A class that loses 5 minutes per transition can lose 30+ minutes daily. Effective transitions are taught, practiced, and reinforced.",
            keyPoints: [
                "Use consistent verbal or non-verbal signals (e.g., chime, hand signal)",
                "Give advance warnings: '2 minutes until we switch activities'",
                "Use visual timers so students can see time remaining",
                "Make transitions a game: 'Can we beat our record of 45 seconds?'",
                "Practice transitions explicitly at the start of the year"
            ],
            simulation: {
                title: "The Chaotic Transition",
                scenario: "You say 'Pack up for lunch' and chaos erupts—students are talking loudly, some aren't packing, and it takes 8 minutes.",
                options: [
                    { text: "Yell 'QUIET!' and wait", result: "missed", feedback: "Yelling escalates stress. You need a proactive system, not reactive control." },
                    { text: "Next time, give a 2-minute warning, use a timer, and time the transition", result: "correct", feedback: "Perfect! You've added structure. Over time, transitions become automatic." },
                    { text: "Just accept that transitions are messy", result: "partial", feedback: "Transitions can be trained! With practice, they become efficient routines." }
                ]
            }
        }
    },
    {
        title: 'Time Management',
        category: 'Planning',
        description: 'Break lessons into chunks with clear time allocations. Use visible timers and give warnings before transitions to help students stay on track.',
        icon: Clock,
        color: 'text-emerald-400',
        details: {
            overview: "Effective time management maximizes learning. Chunk lessons to match student attention spans, use visible timers, and build in buffer time for transitions and unexpected moments.",
            keyPoints: [
                "Plan lessons in 10-15 minute chunks for younger students, 20-25 for older",
                "Use visible countdown timers (physical or digital)",
                "Build in 2-3 minute buffers between activities",
                "Have 'sponge activities' ready for unexpected extra time",
                "Reflect weekly: What took longer than expected? Why?"
            ],
            simulation: {
                title: "The Overrun Lesson",
                scenario: "Your 20-minute activity is taking 35 minutes. Students are getting restless.",
                options: [
                    { text: "Push through to finish—you can't leave it incomplete", result: "missed", feedback: "Student engagement drops dramatically. It's better to pause and return later." },
                    { text: "Abruptly stop and move on without explanation", result: "partial", feedback: "Moving on is good, but provide closure: 'We'll pick this up tomorrow.'" },
                    { text: "Pause, summarize key points, and say 'We'll continue this tomorrow'", result: "correct", feedback: "Great! You preserved momentum and gave cognitive closure." }
                ]
            }
        }
    },
    {
        title: 'De-escalation Techniques',
        category: 'Conflict',
        description: 'Stay calm, lower your voice, give space, and offer choices. Focus on the behavior, not the student. Private conversations are more effective than public confrontations.',
        icon: Volume2,
        color: 'text-orange-400',
        details: {
            overview: "When students are escalated, your calm is your superpower. De-escalation focuses on reducing emotional intensity so that productive conversation can happen. Public confrontations rarely work.",
            keyPoints: [
                "Lower your voice—don't match their volume",
                "Give physical space (an arm's length away)",
                "Offer two acceptable choices: 'Would you like to step outside or take a breath here?'",
                "Avoid 'why' questions—they feel accusatory",
                "Address the behavior privately after the student has calmed down"
            ],
            simulation: {
                title: "The Angry Outburst",
                scenario: "A student slams their book and shouts 'This is stupid!' The class goes silent.",
                options: [
                    { text: "Firmly say 'You need to calm down right now'", result: "missed", feedback: "Demanding calmness rarely works and can escalate the situation." },
                    { text: "Quietly approach and say 'I can see you're frustrated. Want to take a walk or stay here?'", result: "correct", feedback: "Perfect. You acknowledged the emotion, lowered the temperature, and offered choices." },
                    { text: "Ignore it and continue teaching", result: "partial", feedback: "Sometimes strategic ignoring works, but this outburst needs a response to restore safety." }
                ]
            }
        }
    },
    {
        title: 'Student Agency',
        category: 'Empowerment',
        description: 'Give students ownership through classroom jobs, choice boards, and self-assessment. Empowered students are more engaged and responsible.',
        icon: Sparkles,
        color: 'text-purple-400',
        details: {
            overview: "When students have agency, they become stakeholders in their learning. Choice and ownership increase intrinsic motivation and reduce power struggles.",
            keyPoints: [
                "Assign meaningful classroom jobs (not just 'line leader')",
                "Use choice boards: 'Complete 3 of these 5 activities'",
                "Teach students to self-assess using rubrics",
                "Hold class meetings where students voice concerns and solve problems",
                "Let students choose seating, project topics, or presentation formats"
            ],
            simulation: {
                title: "The Unmotivated Class",
                scenario: "Your students seem disengaged during a writing assignment. They're doing the minimum.",
                options: [
                    { text: "Remind them this is for a grade", result: "missed", feedback: "Extrinsic motivation has limited power. They'll still do the minimum." },
                    { text: "Offer three topic choices and let them decide how to present (essay, comic, video)", result: "correct", feedback: "Excellent! Autonomy and choice dramatically increase engagement." },
                    { text: "Add a fun reward for the best work", result: "partial", feedback: "Rewards can help, but choice often outperforms prizes for sustained motivation." }
                ]
            }
        }
    }
];

export const DIGITAL_TOOLS = [
    {
        title: 'Canva for Education',
        category: 'Design',
        description: 'Free design tool for creating presentations, infographics, worksheets, and more. Templates make professional designs accessible to everyone.',
        icon: PenTool,
        color: 'text-cyan-400',
        link: 'https://www.canva.com/education/'
    },
    {
        title: 'Kahoot!',
        category: 'Assessment',
        description: 'Game-based learning platform for quizzes and reviews. Perfect for formative assessment and engagement. Students love the competitive element.',
        icon: Trophy,
        color: 'text-purple-400',
        link: 'https://kahoot.com/'
    },
    {
        title: 'Padlet',
        category: 'Collaboration',
        description: 'Virtual bulletin board for brainstorming, discussions, and resource sharing. Great for student collaboration and visible thinking.',
        icon: Layout,
        color: 'text-pink-400',
        link: 'https://padlet.com/'
    },
    {
        title: 'Loom',
        category: 'Video',
        description: 'Quick screen recording for tutorials, feedback, and flipped classroom content. More personal than typed comments.',
        icon: Monitor,
        color: 'text-red-400',
        link: 'https://www.loom.com/education'
    },
    {
        title: 'Notion',
        category: 'Organization',
        description: 'All-in-one workspace for lesson planning, student tracking, and resource organization. Flexible and powerful for classroom management.',
        icon: BookOpen,
        color: 'text-slate-300',
        link: 'https://www.notion.so/product/notion-for-education'
    },
    {
        title: 'Quizizz',
        category: 'Assessment',
        description: 'Self-paced quiz platform with homework mode. Detailed analytics help identify learning gaps. Memes and music make it fun.',
        icon: ClipboardCheck,
        color: 'text-green-400',
        link: 'https://quizizz.com/'
    }
];

export const ASSESSMENT_STRATEGIES = [
    {
        title: 'Exit Tickets',
        category: 'Formative',
        description: 'Quick end-of-class check: "What did you learn?" "What questions do you have?" Informs next-day planning and identifies struggling students.',
        icon: ClipboardCheck,
        color: 'text-blue-400'
    },
    {
        title: 'Peer Assessment',
        category: 'Collaborative',
        description: 'Students evaluate each other using rubrics. Builds critical thinking, self-reflection, and understanding of success criteria.',
        icon: Users,
        color: 'text-green-400'
    },
    {
        title: 'Portfolio Assessment',
        category: 'Growth',
        description: 'Collection of student work over time showing progress. Promotes reflection and ownership of learning journey.',
        icon: BookOpen,
        color: 'text-purple-400'
    },
    {
        title: 'Think-Alouds',
        category: 'Process',
        description: 'Students verbalize their thinking while solving problems. Reveals misconceptions and metacognitive strategies.',
        icon: MessageSquare,
        color: 'text-orange-400'
    },
    {
        title: 'One-Minute Paper',
        category: 'Quick Check',
        description: 'Students write for one minute on the most important concept or muddiest point. Fast, effective formative feedback.',
        icon: PenTool,
        color: 'text-pink-400'
    },
    {
        title: 'Self-Assessment Rubrics',
        category: 'Metacognition',
        description: 'Students rate their own work against criteria before submission. Develops self-awareness and quality standards.',
        icon: Target,
        color: 'text-cyan-400'
    }
];

export const TEACHER_PROMPTS = [
    {
        category: 'Lesson Planning',
        prompts: [
            "Create a 5E lesson plan for teaching [TOPIC] to [GRADE LEVEL] students.",
            "Generate 3 learning objectives for [TOPIC] using Bloom's Taxonomy capabilities.",
            "Suggest 5 engaging hook activities to start a lesson on [TOPIC].",
            "Create a timeline for a 4-week unit on [SUBJECT].",
            "Draft a list of required materials for a science experiment about [CONCEPT].",
            "Design a cross-curricular project combining [SUBJECT 1] and [SUBJECT 2].",
            "Create a lesson plan that incorporates checking for understanding every 10 minutes.",
            "Suggest 3 modifications for this lesson plan to support ESL students: [PASTE PLAN].",
            "Develop a flipped classroom activity for [TOPIC].",
            "Create a playlist of 5 educational videos suitable for [GRADE] about [TOPIC]."
        ]
    },
    {
        category: 'Simplification',
        prompts: [
            "Explain [COMPLEX CONCEPT] to a 5-year-old using simple language.",
            "Create an analogy to explain [CONCEPT] using everyday objects.",
            "Rewrite this paragraph to be readable for a 6th-grade reading level: [PASTE TEXT].",
            "Summarize the key points of this article in 5 bullet points: [PASTE TEXT].",
            "Translate this technical jargon into plain English for parents: [PASTE TEXT].",
            "Create a visual metaphor description for [ABSTRACT CONCEPT].",
            "Explain the importance of [TOPIC] relating it to a popular video game.",
            "Break down the steps of [PROCESS] into a simple checklist.",
            "Create a glossary of terms for [TOPIC] with simple definitions.",
            "Explain the 'Why' behind learning [TOPIC] to an unmotivated student."
        ]
    },
    {
        category: 'Assessment',
        prompts: [
            "Create a 10-question multiple-choice quiz on [TOPIC] with answer key.",
            "Design a rubric for grading a [PROJECT TYPE] with 4 criteria.",
            "Generate 5 open-ended discussion questions about [TOPIC] to encourage critical thinking.",
            "Create a 'Two Truths and a Lie' game content for reviewing [TOPIC].",
            "Draft constructive feedback for a student who struggles with [SPECIFIC SKILL].",
            "Create a self-assessment checklist for students to use before submitting their work.",
            "Design a peer-review form for students to critique each other's essays.",
            "Generate a list of project ideas that allow students to demonstrate understanding of [TOPIC].",
            "Create 3 distinct formative assessment activities for the end of a class.",
            "Write a sample 'Exceeds Expectations' response for this assignment prompt: [PROMPT]."
        ]
    },
    {
        category: 'Engagement',
        prompts: [
            "Suggest 5 classroom debate topics related to [Current Event/Topic].",
            "Create a mystery story opening where students have to use [MATH/SCIENCE] to solve the next step.",
            "Design a scavenger hunt list for a field trip to [LOCATION].",
            "Suggest 3 role-playing scenarios to teach [HISTORICAL EVENT].",
            "Create a 'Jeopardy' style game board with categories for [TOPIC].",
            "Brainstorm ideas for a class talent show that integrates [SUBJECT].",
            "Suggest ways to use social media trends to teach [TOPIC] responsibly.",
            "Create a 'Real World' problem statement for students to solve using [SKILL].",
            "Design a classroom challenge to encourage kindness/collaboration.",
            "Suggest 5 icebreaker questions for the first day of school for [GRADE]."
        ]
    },
    {
        category: 'Admin',
        prompts: [
            "Draft a welcome email to parents introducing yourself and the curriculum.",
            "Write a compassionate email to a parent about their child's behavioral changes.",
            "Create a template for a weekly classroom newsletter.",
            "Draft a request to the administration for funding for [RESOURCE].",
            "Write a clear set of classroom rules and expectations.",
            "Create a volunteer sign-up sheet description for an upcoming event.",
            "Draft a recommendation letter for a student applying for [PROGRAM].",
            "Write a response to an angry email from a parent regarding [ISSUE].",
            "Create a checklist for end-of-term classroom closing procedures.",
            "Draft a feedback form for parents to provide input on the school year."
        ]
    }
];

export const CLARITY_DATA = [
    {
        category: 'Student Confusions',
        icon: HelpCircle,
        description: 'Addressing the most frequent points of confusion for students on Geniusphere and beyond.',
        topics: [
            {
                myth: "Is using AI for assignments considered cheating?",
                truth: "Geniusphere teaches that AI should be used as a 'Thinking Partner' or 'Tutor'—to explain concepts and brainstorm—rather than for generating final answers without understanding."
            },
            {
                myth: "Higher XP in the Geniusphere game means I'm automatically better at the skill.",
                truth: "XP reflects engagement and practice frequency; however, the real measure of mastery is the 'Simulation Score' and your ability to apply skills in real-world scenarios."
            },
            {
                myth: "Do I need a finance or tech degree to be successful on this platform?",
                truth: "No. Geniusphere is designed for 'Universal Digital Literacy'. The core concepts—budgeting, AI logic, and professional branding—are essentials for every career path today."
            },
            {
                myth: "I can skip the theory content and just jump into Simulation Labs.",
                truth: "Labs are 2x more effective when you have the conceptual foundation. Students who skip theory often hit a 'Skill Ceiling' during complex multi-step simulations."
            },
            {
                myth: "I should only focus on technical skills like coding.",
                truth: "Soft skills (leadership, communication, responsible AI use) are the 'multipliers'. A coder who can lead a team is 10x more valuable than one who only knows syntax."
            },
            {
                myth: "Cybersecurity is only for people who want to be hackers.",
                truth: "90% of security is 'Digital Hygiene'. Students often think they aren't targets, but simple habits like 2FA are the most important defense for every internet user."
            }
        ]
    },
    {
        category: 'Technology',
        icon: Brain,
        description: 'Debunking common misconceptions about AI, coding, and digital safety.',
        topics: [
            { myth: "AI will replace teachers entirely.", truth: "AI is a tool to augment human connection and personalize learning, not replace the mentorship and empathy of a teacher." },
            { myth: "You need to be a math genius to code.", truth: "Coding is more about logic, creativity, and problem-solving than advanced mathematics." },
            { myth: "Does screen time kill creativity?", truth: "Not necessarily. Active creation (coding, design) vs. passive consumption makes the difference. It's about how you use it." },
            { myth: "More megapixels always mean a better camera.", truth: "Sensor size, lens quality, and image processing software are often more important for image quality." },
            { myth: "Incognito mode makes you 100% invisible.", truth: "Your ISP, employer, and the websites you visit can often still track your activity; it mainly prevents local history saving." },
            { myth: "Macs don't get viruses.", truth: "While less targeted than Windows, macOS is still vulnerable to malware and phishing attacks." }
        ]
    },
    {
        category: 'Finance',
        icon: Trophy,
        description: 'Clarifying investment, saving, and money management concepts.',
        topics: [
            { myth: "Investing is just like gambling.", truth: "Investing involves calculated risk and long-term wealth creation based on fundamentals, whereas gambling is based on chance." },
            { myth: "You need a lot of money to start investing.", truth: "Micro-investing apps allow you to start with as little as $1 or ₹100." },
            { myth: "Credit cards are always bad.", truth: "When used responsibly (paying in full on time), credit cards build credit history and offer rewards and fraud protection." },
            { myth: "Renting is always 'throwing money away'.", truth: "Renting offers flexibility and freedom from maintenance costs; buying isn't always the better financial decision depending on the market and timeline." },
            { myth: "Debit cards are safer than credit cards.", truth: "Credit cards often offer better fraud protection and you aren't fighting to get your own money back if compromised." }
        ]
    },
    {
        category: 'Professional Skills',
        icon: Users,
        description: 'Essential soft skills and workplace knowledge for career success.',
        topics: [
            { myth: "Networking is just schmoozing and fake friendships.", truth: "Authentic networking is about building genuine relationships by offering value first. It's about community, not transactions." },
            { myth: "Asking for help makes you look incompetent.", truth: "Strategic asks signal self-awareness and a growth mindset. Top performers actively seek mentorship and feedback." },
            { myth: "Your resume should list everything you've ever done.", truth: "A strong resume is curated, not comprehensive. Focus on quantifiable impact and relevance to the target role." },
            { myth: "Conflict at work should always be avoided.", truth: "Healthy, constructive conflict drives innovation. The key is disagreeing respectfully and focusing on solutions, not personal attacks." },
            { myth: "Work-life balance means working less.", truth: "It's about intentional prioritization and energy management, not just reducing hours. High performers protect their peak focus time." },
            { myth: "Public speaking is a talent you either have or don't.", truth: "Presentation skills are built through practice and structure. Anyone can become a confident speaker with the right framework." }
        ]
    }
];

export const STUDENT_GUIDANCE = [
    {
        title: 'Explaining AI Ethics',
        category: 'Confusion: AI Cheating',
        description: 'Guide students on the line between AI as a tool and AI as a substitute. Discuss: Cognitive Offloading vs. Conceptual Speed-running.',
        icon: ShieldCheck,
        color: 'text-emerald-400'
    },
    {
        title: 'The XP vs. Ability Gap',
        category: 'Confusion: Gamification',
        description: 'Explain that while XP measures consistency, Mastery requires applying concepts in Labs without "Hint" assistance.',
        icon: AlertTriangle,
        color: 'text-yellow-400'
    },
    {
        title: 'Platform Navigation FAQ',
        category: 'Confusion: Technical',
        description: 'Common issues like: "Where is my Certificate?", "Why didn\'t my XP update?", and "How to resume a lab?".',
        icon: HelpCircle,
        color: 'text-blue-400'
    },
    {
        title: 'Value of Soft Skills',
        category: 'Confusion: Career',
        description: 'Discussing why a "Coding Cert" alone isn\'t enough. Focus on: The Collaboration Multiplier in the modern workplace.',
        icon: Sparkles,
        color: 'text-purple-400'
    }
];

export const INCLUSIVE_TEACHING = [
    {
        title: 'Universal Design for Learning',
        category: 'Framework',
        description: 'Provide multiple means of engagement, representation, and action/expression to reach every learner.',
        icon: Accessibility,
        color: 'text-blue-400',
        details: {
            overview: "UDL is a framework that addresses the primary barrier to learning: inflexible, one-size-fits-all curricula. By designing lessons with flexibility from the start, you remove barriers before they appear.",
            keyPoints: [
                "Offer content in multiple formats: text, audio, video, and hands-on",
                "Allow students to demonstrate learning in varied ways",
                "Provide options for self-regulation and sustained effort",
                "Design for the margins—what helps struggling students helps everyone",
                "Use technology to provide built-in accessibility features"
            ],
            simulation: {
                title: "The Diverse Classroom",
                scenario: "You have a student with dyslexia, an English language learner, and a gifted student in the same class. How do you teach a new concept?",
                options: [
                    { text: "Teach the standard way and offer extra help after class", result: "missed", feedback: "Reactive support isn't enough. Proactive design is more effective and equitable." },
                    { text: "Create three separate lesson plans for each group", result: "partial", feedback: "Good intent, but unsustainable. UDL builds flexibility INTO one lesson." },
                    { text: "Present content via video, text, and diagram simultaneously, then let students choose how to respond", result: "correct", feedback: "Perfect UDL! Multiple means of representation and expression in one lesson." }
                ]
            }
        }
    },
    {
        title: 'Culturally Responsive Teaching',
        category: 'Equity',
        description: "Use students' cultural backgrounds as assets. Include diverse perspectives in curriculum and build genuine relationships.",
        icon: Globe,
        color: 'text-emerald-400',
        details: {
            overview: "Culturally responsive teaching recognizes that all students learn differently and that cultural backgrounds significantly influence learning. It leverages students' cultures as vehicles for learning.",
            keyPoints: [
                "Learn about your students' backgrounds and communities",
                "Include diverse authors, scientists, and historical figures in curriculum",
                "Validate different communication styles and ways of knowing",
                "Examine your own biases and assumptions regularly",
                "Create a classroom environment where all identities are celebrated"
            ],
            simulation: {
                title: "The History Lesson",
                scenario: "You're teaching about a historical event. A student says, 'My family's experience of this was completely different from the textbook.'",
                options: [
                    { text: "Say 'Let's stick to what the textbook says for now'", result: "missed", feedback: "You've dismissed a valuable perspective and possibly damaged trust." },
                    { text: "Thank them and ask if they'd like to share more with the class", result: "correct", feedback: "Excellent! You validated their experience and enriched the lesson." },
                    { text: "Acknowledge it privately after class", result: "partial", feedback: "Private acknowledgment is okay, but sharing publicly would benefit all students." }
                ]
            }
        }
    },
    {
        title: 'Neurodiversity Awareness',
        category: 'Inclusion',
        description: 'Understand and support students with ADHD, autism, dyslexia, and other neurological differences as variations, not deficits.',
        icon: Brain,
        color: 'text-purple-400',
        details: {
            overview: "Neurodiversity is the concept that neurological differences are natural human variations. Students with ADHD, autism, dyslexia, and other conditions bring unique strengths to the classroom.",
            keyPoints: [
                "Focus on strengths, not just accommodations",
                "Provide sensory-friendly options (fidgets, quiet corners, noise-canceling headphones)",
                "Use clear, explicit instructions with visual supports",
                "Allow movement and flexible seating",
                "Build predictable routines with advance notice of changes"
            ],
            simulation: {
                title: "The Fidgeting Student",
                scenario: "A student with ADHD is constantly fidgeting during your lesson. Other students are starting to notice.",
                options: [
                    { text: "Tell them to sit still and pay attention", result: "missed", feedback: "Fidgeting often HELPS focus for students with ADHD. Stopping it may reduce their learning." },
                    { text: "Provide a quiet fidget tool and offer flexible seating options", result: "correct", feedback: "Great! You supported their need while maintaining the learning environment." },
                    { text: "Move them to the back so they don't distract others", result: "partial", feedback: "Isolation isn't ideal. Inclusive solutions benefit the student without stigma." }
                ]
            }
        }
    },
    {
        title: 'Multilingual Learners',
        category: 'Language',
        description: 'Support English language learners with visual aids, scaffolded vocabulary, peer support, and home language inclusion.',
        icon: MessageSquare,
        color: 'text-cyan-400'
    },
    {
        title: 'Accessible Materials',
        category: 'Resources',
        description: 'Ensure all learning materials are accessible: alt text for images, captions for videos, readable fonts, and sufficient color contrast.',
        icon: Eye,
        color: 'text-yellow-400'
    },
    {
        title: 'Flexible Grouping',
        category: 'Strategy',
        description: 'Rotate grouping strategies—mixed ability, similar ability, interest-based, and random—to avoid fixed tracking.',
        icon: Users,
        color: 'text-orange-400'
    }
];

export const STUDENT_MOTIVATION = [
    {
        title: 'Growth Mindset Culture',
        category: 'Mindset',
        description: 'Teach students that intelligence is not fixed. Praise effort and strategies, not just results.',
        icon: Rocket,
        color: 'text-purple-400',
        details: {
            overview: "Carol Dweck's research shows that students who believe intelligence can be developed outperform those who believe it's fixed. Teachers can actively cultivate this mindset.",
            keyPoints: [
                "Praise process over outcome: 'Your strategy was smart' vs 'You're so smart'",
                "Normalize mistakes as learning opportunities",
                "Use 'yet' language: 'You don't understand it YET'",
                "Share stories of famous failures who persisted",
                "Model your own learning struggles and growth"
            ],
            simulation: {
                title: "The Failed Test",
                scenario: "A student gets a low score and says, 'I'm just stupid. I'll never get this.'",
                options: [
                    { text: "Say 'You're not stupid, you just need to study harder'", result: "partial", feedback: "Well-intentioned, but 'study harder' isn't specific enough. Focus on strategies." },
                    { text: "Say 'Let's look at what you DO understand and build from there. You haven't mastered it YET.'", result: "correct", feedback: "Perfect growth mindset response! You redirected to strengths and added 'yet'." },
                    { text: "Say 'It's okay, not everyone is good at this subject'", result: "missed", feedback: "This confirms a fixed mindset. You've just told them ability is predetermined." }
                ]
            }
        }
    },
    {
        title: 'Intrinsic vs Extrinsic Motivation',
        category: 'Psychology',
        description: 'Understand when to use rewards and when to foster internal drive. Long-term engagement comes from autonomy, mastery, and purpose.',
        icon: Heart,
        color: 'text-pink-400',
        details: {
            overview: "Daniel Pink's research identifies three pillars of intrinsic motivation: Autonomy (choice), Mastery (growth), and Purpose (meaning). Over-reliance on extrinsic rewards can undermine intrinsic motivation.",
            keyPoints: [
                "Give students choices in how they learn and demonstrate knowledge",
                "Set 'Goldilocks' challenges—not too easy, not too hard",
                "Connect learning to real-world relevance and student interests",
                "Use rewards sparingly and strategically",
                "Help students set personal goals and track their own progress"
            ],
            simulation: {
                title: "The Reward System",
                scenario: "Students are only completing reading assignments because of the pizza party reward. Once the reward stops, reading drops.",
                options: [
                    { text: "Increase the reward to something bigger", result: "missed", feedback: "This creates a reward treadmill. Each time, you'll need a bigger incentive." },
                    { text: "Let students choose their own books and create reading circles around interests", result: "correct", feedback: "Autonomy and social connection build lasting intrinsic motivation." },
                    { text: "Make reading mandatory with consequences for not completing", result: "partial", feedback: "Compliance isn't motivation. Students may read, but they won't love it." }
                ]
            }
        }
    },
    {
        title: 'Goal Setting Frameworks',
        category: 'Planning',
        description: 'Teach students to set SMART goals. Break big objectives into achievable milestones to maintain momentum.',
        icon: Target,
        color: 'text-blue-400'
    },
    {
        title: 'Celebration of Progress',
        category: 'Recognition',
        description: 'Recognize growth, not just achievement. Use progress portfolios, shout-outs, and personal best tracking.',
        icon: Star,
        color: 'text-yellow-400'
    },
    {
        title: 'Student Voice and Choice',
        category: 'Empowerment',
        description: 'Let students co-create rubrics, choose project topics, and provide input on classroom decisions.',
        icon: Megaphone,
        color: 'text-emerald-400'
    },
    {
        title: 'Real-World Connections',
        category: 'Relevance',
        description: 'Connect curriculum to careers, current events, and student passions. Answer the eternal question: "Why do we need to learn this?"',
        icon: Globe,
        color: 'text-orange-400'
    }
];

export const COMMUNICATION_SKILLS = [
    {
        title: 'Active Listening Techniques',
        category: 'Listening',
        description: 'Model and teach reflective listening, paraphrasing, and asking clarifying questions.',
        icon: Headphones,
        color: 'text-blue-400',
        details: {
            overview: "Active listening is a foundational communication skill. When teachers model it, students learn to truly hear each other, reducing conflicts and deepening understanding.",
            keyPoints: [
                "Maintain eye contact and open body language",
                "Paraphrase what the speaker said before responding",
                "Ask clarifying questions: 'Can you tell me more about that?'",
                "Avoid interrupting or planning your response while they speak",
                "Reflect emotions: 'It sounds like you're feeling frustrated'"
            ],
            simulation: {
                title: "The Parent Conference",
                scenario: "A parent is upset about their child's grade. They say: 'My kid works so hard and you just don't appreciate it!'",
                options: [
                    { text: "Immediately defend your grading system", result: "missed", feedback: "Defending before listening escalates the conflict. The parent doesn't feel heard." },
                    { text: "Say 'I hear that you see your child working hard, and that matters. Let's look at the specifics together.'", result: "correct", feedback: "You validated their perspective and redirected to collaboration." },
                    { text: "Say 'I understand, but grades are based on performance'", result: "partial", feedback: "The 'but' negates your understanding. Try 'and' instead of 'but'." }
                ]
            }
        }
    },
    {
        title: 'Giving Effective Feedback',
        category: 'Feedback',
        description: 'Use the "Praise-Question-Suggestion" model. Make feedback specific, timely, and actionable.',
        icon: MessageSquare,
        color: 'text-emerald-400',
        details: {
            overview: "Effective feedback is the bridge between teaching and learning. Research shows that quality feedback can double the rate of learning, but only if it's specific, timely, and actionable.",
            keyPoints: [
                "Be specific: 'Your thesis statement clearly states your argument' vs 'Good job'",
                "Focus on the work, not the person",
                "Provide feedback while students can still use it (not just on final grades)",
                "Limit feedback to 2-3 actionable points",
                "Ask students what kind of feedback they want"
            ],
            simulation: {
                title: "The Essay Review",
                scenario: "A student submits a mediocre essay. Their argument is weak but their writing style is engaging.",
                options: [
                    { text: "Write 'Needs improvement' and return it", result: "missed", feedback: "Too vague. The student has no idea what to improve or how." },
                    { text: "Say 'Your writing style draws the reader in! How might you strengthen your main argument with evidence from paragraph 2?'", result: "correct", feedback: "Perfect! You praised a strength, then guided improvement with a specific question." },
                    { text: "List every grammar error and logical flaw", result: "partial", feedback: "Overwhelming feedback paralyzes students. Focus on the most impactful 2-3 points." }
                ]
            }
        }
    },
    {
        title: 'Nonverbal Communication',
        category: 'Body Language',
        description: 'Your body language speaks louder than words. Master proximity, facial expressions, and gestures.',
        icon: Eye,
        color: 'text-purple-400'
    },
    {
        title: 'Difficult Conversations',
        category: 'Conflict',
        description: 'Navigate tough talks with students and parents using empathy, facts, and solution-focused language.',
        icon: Handshake,
        color: 'text-orange-400'
    },
    {
        title: 'Questioning Strategies',
        category: 'Inquiry',
        description: "Use Bloom's Taxonomy to craft questions from recall to creation. Wait time of 3-5 seconds increases quality responses by 300%.",
        icon: HelpCircle,
        color: 'text-cyan-400'
    },
    {
        title: 'Written Communication',
        category: 'Documentation',
        description: 'Write clear rubrics, parent emails, and progress reports. Templates save time and ensure consistency.',
        icon: FileText,
        color: 'text-pink-400'
    }
];

export const PROJECT_BASED_LEARNING = [
    {
        title: 'Driving Questions',
        category: 'Design',
        description: 'Create compelling driving questions that spark curiosity and guide authentic investigation.',
        icon: HelpCircle,
        color: 'text-purple-400',
        details: {
            overview: "A great driving question is the engine of PBL. It should be open-ended, engaging, and aligned to learning goals. Students should not be able to Google the answer.",
            keyPoints: [
                "Make it open-ended: 'How might we...' or 'Why does...'",
                "Connect to real-world problems students care about",
                "Ensure it requires multiple skills to answer",
                "Test it: Would a student voluntarily investigate this?",
                "Revisit and refine the question throughout the project"
            ],
            simulation: {
                title: "Designing a PBL Unit",
                scenario: "You're creating a PBL unit on environmental science. Which driving question would you use?",
                options: [
                    { text: "'What are the three types of rocks?'", result: "missed", feedback: "This is Googleable and closed-ended. No investigation needed." },
                    { text: "'How could we redesign our school campus to reduce its environmental impact by 50%?'", result: "correct", feedback: "Excellent! Open-ended, authentic, requires research, math, science, and collaboration." },
                    { text: "'Why is recycling important?'", result: "partial", feedback: "Better, but still somewhat factual. Make it more actionable and locally relevant." }
                ]
            }
        }
    },
    {
        title: 'Scaffolded Autonomy',
        category: 'Process',
        description: 'Give structure early, then gradually release responsibility. Students need scaffolding before independence.',
        icon: Layers,
        color: 'text-blue-400',
        details: {
            overview: "PBL fails when students are given too much freedom too soon. The key is scaffolded autonomy—structured support that gradually fades as students build competence.",
            keyPoints: [
                "Week 1: Teacher-led research methods and tools",
                "Week 2: Teacher-guided group work with check-ins",
                "Week 3: Student-led with teacher as consultant",
                "Provide checklists, timelines, and milestone deadlines",
                "Build in reflection checkpoints throughout"
            ],
            simulation: {
                title: "The Struggling Group",
                scenario: "A group is two weeks into a project and has made almost no progress. They seem overwhelmed.",
                options: [
                    { text: "Let them figure it out—that's the point of PBL", result: "missed", feedback: "Productive struggle is good; unproductive floundering is not. They need scaffolding." },
                    { text: "Take over and tell them exactly what to do", result: "partial", feedback: "This removes all agency. Guide, don't direct." },
                    { text: "Meet with them, break the project into smaller tasks, set a next-day mini-deadline, and check in tomorrow", result: "correct", feedback: "Perfect scaffolding! You provided structure without removing ownership." }
                ]
            }
        }
    },
    {
        title: 'Authentic Audiences',
        category: 'Presentation',
        description: 'Students present to real audiences: community members, experts, younger students. Real audiences raise quality.',
        icon: Megaphone,
        color: 'text-emerald-400'
    },
    {
        title: 'Cross-Curricular Integration',
        category: 'Interdisciplinary',
        description: 'Combine subjects naturally. A project on designing a community garden integrates science, math, art, and social studies.',
        icon: Palette,
        color: 'text-pink-400'
    },
    {
        title: 'Reflection and Iteration',
        category: 'Metacognition',
        description: 'Build in structured reflection: What worked? What would you change? How did your thinking evolve?',
        icon: Brain,
        color: 'text-cyan-400'
    },
    {
        title: 'Assessment in PBL',
        category: 'Evaluation',
        description: 'Use rubrics, peer critique protocols, and self-assessment. Grade the process AND the product.',
        icon: ClipboardCheck,
        color: 'text-yellow-400'
    }
];
