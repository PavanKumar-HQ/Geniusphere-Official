import { LabConfig } from './LabTypes';

export const TEACHING_LAB_CONFIGS: Record<string, LabConfig> = {

    // ===== 1. MODERN PEDAGOGY LAB =====
    'lab_pedagogy': {
        id: 'lab_pedagogy',
        title: 'Modern Pedagogy Lab',
        theme: 'blue',
        modules: [
            {
                id: 'flipped_classroom',
                title: 'The Flipped Classroom',
                description: 'Reverse the traditional model: students learn content at home and practice in class with teacher support.',
                analogy: 'Imagine watching a cooking show at home, then going to a kitchen class where the chef helps YOU cook. That is flipped learning!',
                animationSteps: [
                    { time: 0, label: 'traditional', text: 'In traditional teaching, the teacher lectures in class and students practice alone at home.', microcopy: 'The old way.' },
                    { time: 3, label: 'flip_content', text: 'In flipped learning, students watch video lessons or read materials at HOME before class.', microcopy: 'Content delivery moves home.' },
                    { time: 6, label: 'flip_practice', text: 'Class time is now used for hands-on activities, group work, and personalized help from the teacher.', microcopy: 'Practice moves to class.' },
                    { time: 9, label: 'benefits', text: 'Teachers can identify struggling students in real-time and provide immediate support.', microcopy: 'The real magic happens here.' },
                    { time: 12, label: 'outcome', text: 'Students move at their own pace at home and get expert help when they need it most—during practice.', microcopy: 'Best of both worlds.' },
                ],
                keyPoints: [
                    { title: 'Pre-class Content', description: 'Short videos or readings that students consume before coming to class.' },
                    { title: 'Active Class Time', description: 'Class time is used for discussion, problem-solving, and application.' },
                    { title: 'Teacher as Guide', description: 'The teacher shifts from lecturer to facilitator and mentor.' },
                    { title: 'Student Ownership', description: 'Students take responsibility for their own learning pace.' },
                ],
                quiz: {
                    question: 'In a flipped classroom, what happens during class time?',
                    options: ['Students watch lectures', 'Students do homework alone', 'Students practice with teacher support', 'Students take tests'],
                    correctAnswer: 'Students practice with teacher support',
                    explanation: 'The "flip" moves lectures to home and brings practice into the classroom where teachers can provide real-time support.',
                },
                miniSim: {
                    description: 'You want to flip your math class. What should students do BEFORE coming to class?',
                    options: [
                        { id: 'a', text: 'Complete the practice problems.', isCorrect: false },
                        { id: 'b', text: 'Watch a 10-minute video explaining the new concept.', isCorrect: true },
                        { id: 'c', text: 'Write a summary of the previous lesson.', isCorrect: false },
                    ],
                    feedback: {
                        correct: 'Exactly! Students consume the content (video) at home, so class time can be used for guided practice.',
                        incorrect: 'In a flipped model, content delivery (not practice) happens before class. Save practice for when the teacher can help!',
                    },
                },
                funFact: 'The flipped classroom concept was popularized by Aaron Sams and Jonathan Bergmann, two chemistry teachers from Colorado, in 2007.',
                badge: 'Flip Master',
                animationType: 'classroom',
            },
            {
                id: 'differentiated_instruction',
                title: 'Differentiated Instruction',
                description: 'Tailoring teaching to meet the diverse needs of all learners in a single classroom.',
                analogy: 'Think of a doctor who gives different medicine to different patients based on their needs. Teachers do the same with learning!',
                animationSteps: [
                    { time: 0, label: 'assess', text: 'First, assess where each student is in their understanding of the topic.', microcopy: 'Know your learners.' },
                    { time: 3, label: 'content', text: 'Differentiate CONTENT: Provide materials at varying complexity levels.', microcopy: 'Same topic, different depth.' },
                    { time: 6, label: 'process', text: 'Differentiate PROCESS: Offer different activities—visual, kinesthetic, auditory.', microcopy: 'Many paths, one destination.' },
                    { time: 9, label: 'product', text: 'Differentiate PRODUCT: Let students show learning through essays, presentations, art, or code.', microcopy: 'Multiple ways to demonstrate mastery.' },
                    { time: 12, label: 'evaluate', text: 'Use ongoing assessment to adjust groups and strategies throughout the unit.', microcopy: 'Always adapting.' },
                ],
                keyPoints: [
                    { title: 'Content', description: 'What students learn—adjust complexity and reading level.' },
                    { title: 'Process', description: 'How students learn—vary activities and grouping.' },
                    { title: 'Product', description: 'How students show what they know—offer choice.' },
                    { title: 'Environment', description: 'Where students learn—flexible seating and spaces.' },
                ],
                quiz: {
                    question: 'What are the three main areas you can differentiate?',
                    options: ['Speed, Volume, Difficulty', 'Content, Process, Product', 'Reading, Writing, Math', 'Morning, Afternoon, Evening'],
                    correctAnswer: 'Content, Process, Product',
                    explanation: 'Carol Ann Tomlinson identified Content (what), Process (how), and Product (show) as the three pillars of differentiation.',
                },
                miniSim: {
                    description: 'A student finishes the assignment 20 minutes early. What do you do?',
                    options: [
                        { id: 'a', text: 'Tell them to sit quietly until others finish.', isCorrect: false },
                        { id: 'b', text: 'Give them an enrichment challenge that extends the concept.', isCorrect: true },
                        { id: 'c', text: 'Have them help other students (always).', isCorrect: false },
                    ],
                    feedback: {
                        correct: 'Providing enrichment that deepens understanding is true differentiation. It respects their readiness level.',
                        incorrect: 'Sitting idle wastes potential. While peer tutoring can work sometimes, the fast finisher also deserves new challenges.',
                    },
                },
                funFact: 'Research shows differentiated instruction can improve student achievement by up to 30% compared to one-size-fits-all approaches.',
                badge: 'Differentiation Pro',
                animationType: 'classroom',
            },
        ]
    },

    // ===== 2. CLASSROOM MANAGEMENT LAB =====
    'lab_management': {
        id: 'lab_management',
        title: 'Classroom Management Lab',
        theme: 'purple',
        modules: [
            {
                id: 'positive_reinforcement',
                title: 'Positive Reinforcement Mastery',
                description: 'Learn the science behind encouraging desired behaviors through strategic acknowledgment and rewards.',
                analogy: 'When your dog sits on command and gets a treat, it sits again next time. Students work the same way—reward what you want to see more of!',
                animationSteps: [
                    { time: 0, label: 'trigger', text: 'A student exhibits a desired behavior—raising their hand, helping a peer, or staying focused.', microcopy: 'Spot the behavior.' },
                    { time: 3, label: 'reinforce', text: 'The teacher immediately acknowledges with specific praise: "I love that you raised your hand, Sarah!"', microcopy: 'Be specific and timely.' },
                    { time: 6, label: 'dopamine', text: 'The student experiences a positive emotional response, creating a neural pathway that links the behavior to a reward.', microcopy: 'Brain chemistry at work.' },
                    { time: 9, label: 'repeat', text: 'The student is more likely to repeat the behavior. Other students notice and start imitating it.', microcopy: 'The ripple effect.' },
                    { time: 12, label: 'culture', text: 'Over time, a positive classroom culture emerges where desired behaviors are the norm.', microcopy: 'Culture shift complete.' },
                ],
                keyPoints: [
                    { title: 'Specificity', description: 'Name the exact behavior you are praising, not just "good job".' },
                    { title: 'Immediacy', description: 'Reinforce within seconds of the behavior for maximum impact.' },
                    { title: '4:1 Ratio', description: 'Aim for 4 positive interactions for every 1 corrective one.' },
                    { title: 'Fade Rewards', description: 'Transition from tangible rewards to social reinforcement over time.' },
                ],
                quiz: {
                    question: 'Which is the BEST example of specific positive reinforcement?',
                    options: ['Good job!', 'I noticed you shared your materials with Alex. That was very thoughtful.', 'You are a great student.', 'Keep it up!'],
                    correctAnswer: 'I noticed you shared your materials with Alex. That was very thoughtful.',
                    explanation: 'Specific praise names the exact behavior AND acknowledges the impact. This tells the student exactly what to repeat.',
                },
                miniSim: {
                    description: 'A usually disruptive student quietly completes their work for the first time. What do you do?',
                    options: [
                        { id: 'a', text: 'Say nothing—you do not want to draw attention.', isCorrect: false },
                        { id: 'b', text: 'Quietly tell them: "I noticed you focused through the whole assignment. That takes real discipline."', isCorrect: true },
                        { id: 'c', text: 'Announce to the class: "Look, everyone! This student finally did their work!"', isCorrect: false },
                    ],
                    feedback: {
                        correct: 'Private, specific praise is perfect for students who may be embarrassed by public attention. You noted the behavior and the positive trait behind it.',
                        incorrect: 'Ignoring the behavior misses a crucial opportunity. Public announcement could embarrass the student and feel sarcastic.',
                    },
                },
                funFact: 'B.F. Skinner discovered that intermittent reinforcement (unpredictable rewards) is actually more powerful than continuous reinforcement for maintaining behavior.',
                badge: 'Reinforcement Expert',
                animationType: 'classroom',
            },
            {
                id: 'deescalation',
                title: 'De-escalation Techniques',
                description: 'Master the art of calming heated situations without power struggles or public confrontations.',
                analogy: 'When a fire is burning, you do not pour gasoline on it. You stay calm, lower the temperature, and remove fuel. Same with an upset student.',
                animationSteps: [
                    { time: 0, label: 'trigger', text: 'A student is visibly upset—raised voice, clenched fists, or defiant posture.', microcopy: 'Recognize the signs early.' },
                    { time: 3, label: 'calm', text: 'Lower YOUR voice. Speak slowly and softly. Your calm is contagious.', microcopy: 'You set the emotional tone.' },
                    { time: 6, label: 'validate', text: '"I can see you are really frustrated right now. That makes sense."', microcopy: 'Validation, not agreement.' },
                    { time: 9, label: 'choices', text: 'Offer two acceptable options: "Would you like to step outside for a minute, or take some deep breaths here?"', microcopy: 'Choices preserve dignity.' },
                    { time: 12, label: 'followup', text: 'After the student has calmed, have a private conversation to address the root cause.', microcopy: 'The real work happens after.' },
                ],
                keyPoints: [
                    { title: 'Stay Calm', description: 'Your emotional state directly influences the student. Model regulation.' },
                    { title: 'Lower Volume', description: 'Whispering is more effective than yelling. It draws students in.' },
                    { title: 'Offer Choices', description: 'Two acceptable options give a sense of control without losing authority.' },
                    { title: 'Follow Up', description: 'Private conversations after cooling down address root causes.' },
                ],
                quiz: {
                    question: 'A student shouts "This is stupid!" during class. What is the BEST first response?',
                    options: ['Tell them to be quiet immediately', 'Send them to the principal', 'Quietly say "I hear your frustration. Want to talk about it or take a break?"', 'Ignore it completely'],
                    correctAnswer: 'Quietly say "I hear your frustration. Want to talk about it or take a break?"',
                    explanation: 'Acknowledging the emotion (not the behavior) and offering choices de-escalates without a power struggle.',
                },
                miniSim: {
                    description: 'Two students are arguing loudly. The class is watching. What is your first move?',
                    options: [
                        { id: 'a', text: 'Yell "STOP!" to get their attention.', isCorrect: false },
                        { id: 'b', text: 'Calmly step between them, use their names, and say: "Jake, Maria—I need you both to take a breath. Let us figure this out."', isCorrect: true },
                        { id: 'c', text: 'Send both students to the office immediately.', isCorrect: false },
                    ],
                    feedback: {
                        correct: 'Using names personalizes the interaction. Stepping in calmly models regulation. Offering to "figure it out" shows fairness.',
                        incorrect: 'Yelling escalates. Immediate removal teaches nothing. Both students need to feel heard before consequences.',
                    },
                },
                funFact: 'Research shows it takes the human brain approximately 20 minutes to return to baseline after an emotional outburst. Plan accordingly!',
                badge: 'Calm Commander',
                animationType: 'conversation',
            },
        ]
    },

    // ===== 3. INCLUSIVE TEACHING LAB =====
    'lab_inclusive': {
        id: 'lab_inclusive',
        title: 'Inclusive Teaching Lab',
        theme: 'blue',
        modules: [
            {
                id: 'udl_framework',
                title: 'Universal Design for Learning',
                description: 'Design lessons that work for ALL learners from the start, not as an afterthought.',
                analogy: 'Curb cuts on sidewalks were designed for wheelchairs, but everyone benefits—strollers, bikes, luggage. UDL is curb cuts for learning!',
                animationSteps: [
                    { time: 0, label: 'barrier', text: 'Traditional one-size-fits-all lessons create barriers for many students.', microcopy: 'The problem.' },
                    { time: 3, label: 'engagement', text: 'Multiple Means of ENGAGEMENT: Why learn? Offer choice, relevance, and varied challenge levels.', microcopy: 'The WHY of learning.' },
                    { time: 6, label: 'representation', text: 'Multiple Means of REPRESENTATION: What to learn? Present info through text, audio, video, and hands-on.', microcopy: 'The WHAT of learning.' },
                    { time: 9, label: 'action', text: 'Multiple Means of ACTION & EXPRESSION: How to show learning? Allow essays, presentations, models, or code.', microcopy: 'The HOW of learning.' },
                    { time: 12, label: 'result', text: 'When you design for the margins, EVERY student benefits—not just those with identified needs.', microcopy: 'Everyone wins.' },
                ],
                keyPoints: [
                    { title: 'Engagement', description: 'The "why"—motivate through choice, relevance, and appropriate challenge.' },
                    { title: 'Representation', description: 'The "what"—present content in multiple formats.' },
                    { title: 'Action & Expression', description: 'The "how"—let students show learning in varied ways.' },
                    { title: 'Proactive Design', description: 'Build accessibility into the lesson from the start, not as remediation.' },
                ],
                quiz: {
                    question: 'What are the three principles of UDL?',
                    options: ['Reading, Writing, Arithmetic', 'Engagement, Representation, Action & Expression', 'Visual, Auditory, Kinesthetic', 'Plan, Teach, Assess'],
                    correctAnswer: 'Engagement, Representation, Action & Expression',
                    explanation: 'UDL is built on three pillars: WHY (engagement), WHAT (representation), and HOW (action & expression) of learning.',
                },
                miniSim: {
                    description: 'You are teaching photosynthesis. How do you apply UDL?',
                    options: [
                        { id: 'a', text: 'Lecture for 45 minutes and assign a worksheet.', isCorrect: false },
                        { id: 'b', text: 'Show a video, provide a reading, do a hands-on lab, and let students choose how to present their understanding.', isCorrect: true },
                        { id: 'c', text: 'Create separate lessons for each learning style.', isCorrect: false },
                    ],
                    feedback: {
                        correct: 'This is UDL in action! Multiple representations (video, text, lab) and flexible expression (student choice). One lesson, many paths.',
                        incorrect: 'UDL is not about creating separate lessons for each student. It is about building flexibility INTO one lesson from the start.',
                    },
                },
                funFact: 'UDL was inspired by architecture. The term "Universal Design" was coined by architect Ronald Mace to describe designing buildings accessible to all people.',
                badge: 'UDL Champion',
                animationType: 'classroom',
            },
            {
                id: 'neurodiversity',
                title: 'Neurodiversity in the Classroom',
                description: 'Support students with ADHD, autism, dyslexia, and other neurological differences as strengths, not deficits.',
                analogy: 'A forest with only one type of tree is fragile. A diverse forest is resilient. Neurodiverse classrooms are stronger classrooms.',
                animationSteps: [
                    { time: 0, label: 'spectrum', text: 'Every brain is wired differently. Neurodiversity includes ADHD, autism, dyslexia, giftedness, and many more.', microcopy: 'Brains are not one-size-fits-all.' },
                    { time: 3, label: 'strengths', text: 'Students with ADHD often show hyperfocus, creativity, and energy. Autistic students may have intense expertise and pattern recognition.', microcopy: 'Superpowers in disguise.' },
                    { time: 6, label: 'environment', text: 'Create a sensory-friendly environment: quiet corners, fidget tools, noise-canceling headphones, flexible seating.', microcopy: 'Design the space.' },
                    { time: 9, label: 'instruction', text: 'Use clear, explicit instructions. Provide visual schedules. Give advance notice of changes.', microcopy: 'Predictability = Safety.' },
                    { time: 12, label: 'celebrate', text: 'Celebrate different ways of thinking. Normalize asking for help. Build on each student\'s unique strengths.', microcopy: 'Different is valuable.' },
                ],
                keyPoints: [
                    { title: 'Strengths-Based', description: 'Focus on what students CAN do, not just their challenges.' },
                    { title: 'Sensory Support', description: 'Provide tools and spaces for sensory regulation.' },
                    { title: 'Clear Expectations', description: 'Explicit instructions with visual supports reduce anxiety.' },
                    { title: 'Flexibility', description: 'Allow movement, alternative seating, and breaks.' },
                ],
                quiz: {
                    question: 'A student with ADHD is fidgeting. What should you do?',
                    options: ['Tell them to sit still', 'Provide a fidget tool', 'Move them to the back', 'Contact the parents'],
                    correctAnswer: 'Provide a fidget tool',
                    explanation: 'For many students with ADHD, fidgeting actually HELPS focus. A quiet fidget tool supports their need without disrupting others.',
                },
                miniSim: {
                    description: 'An autistic student is overwhelmed by a surprise schedule change. They are shutting down. What do you do?',
                    options: [
                        { id: 'a', text: 'Tell them "It is fine, just go with it."', isCorrect: false },
                        { id: 'b', text: 'Give them space, provide a visual of the new schedule, and check back in 5 minutes.', isCorrect: true },
                        { id: 'c', text: 'Ask the whole class to be patient.', isCorrect: false },
                    ],
                    feedback: {
                        correct: 'Space, visual supports, and a quiet check-in respect their processing needs: perfect response.',
                        incorrect: 'Dismissing their feelings or drawing attention makes things worse. Autistic students often need time and visual information to process changes.',
                    },
                },
                funFact: 'Many famous innovators were neurodivergent: Albert Einstein (dyslexia), Thomas Edison (ADHD), Temple Grandin (autism), and Richard Branson (dyslexia).',
                badge: 'Neurodiversity Ally',
                animationType: 'neural_network',
            },
        ]
    },

    // ===== 4. STUDENT MOTIVATION LAB =====
    'lab_motivation': {
        id: 'lab_motivation',
        title: 'Student Motivation Lab',
        theme: 'purple',
        modules: [
            {
                id: 'growth_mindset',
                title: 'Growth Mindset Science',
                description: 'Understand the neuroscience behind fixed vs. growth mindset and how to cultivate it in students.',
                analogy: 'Your brain is like a muscle. The more you use it, the stronger it gets. Struggling is not a sign of weakness—it is your brain getting a workout!',
                animationSteps: [
                    { time: 0, label: 'fixed', text: 'FIXED MINDSET: "I am bad at math. I will always be bad at math." The student avoids challenges.', microcopy: 'The limiting belief.' },
                    { time: 3, label: 'growth', text: 'GROWTH MINDSET: "I have not mastered this YET. With practice, I will improve." The student embraces challenges.', microcopy: 'The empowering belief.' },
                    { time: 6, label: 'neurons', text: 'When you struggle and persist, your neurons form stronger connections. Mistakes literally grow your brain.', microcopy: 'Neuroplasticity in action.' },
                    { time: 9, label: 'praise', text: 'Praise EFFORT and STRATEGY, not talent: "Your approach was really creative" vs "You are so smart."', microcopy: 'Words shape mindsets.' },
                    { time: 12, label: 'culture', text: 'Create a classroom where mistakes are celebrated as learning, and "I don\'t know YET" is the most powerful phrase.', microcopy: 'The power of YET.' },
                ],
                keyPoints: [
                    { title: 'Neuroplasticity', description: 'The brain physically changes and grows when we learn through struggle.' },
                    { title: 'Process Praise', description: 'Praise effort, strategy, and persistence—not innate ability.' },
                    { title: 'The Power of "Yet"', description: 'Adding "yet" to any struggle reframes it as a journey, not a dead end.' },
                    { title: 'Model Mistakes', description: 'Teachers who share their own struggles normalize the discomfort of learning.' },
                ],
                quiz: {
                    question: 'Which teacher phrase promotes a growth mindset?',
                    options: ['You are so smart!', 'Not everyone is good at this.', 'Your strategy of breaking it into smaller steps was really effective.', 'Some people are just natural at this.'],
                    correctAnswer: 'Your strategy of breaking it into smaller steps was really effective.',
                    explanation: 'This praises the specific strategy (process), not innate talent. It teaches the student WHAT to repeat, not just that they are "smart".',
                },
                miniSim: {
                    description: 'A student says "I am just not a math person." How do you respond?',
                    options: [
                        { id: 'a', text: '"That is okay. Everyone has different strengths."', isCorrect: false },
                        { id: 'b', text: '"You are not a math person YET. Let\'s look at what you DO understand and build from there."', isCorrect: true },
                        { id: 'c', text: '"Just try harder next time."', isCorrect: false },
                    ],
                    feedback: {
                        correct: '"Yet" reframes the struggle as temporary. Starting from strengths builds confidence. This is growth mindset in action.',
                        incorrect: 'Accepting a fixed belief reinforces it. "Try harder" is vague. Growth mindset requires specific, actionable redirection.',
                    },
                },
                funFact: 'Carol Dweck\'s research at Stanford showed that students praised for effort outperformed students praised for intelligence by 30% on subsequent challenges.',
                badge: 'Mindset Shifter',
                animationType: 'neural_network',
            },
            {
                id: 'intrinsic_motivation',
                title: 'Intrinsic Motivation',
                description: 'Learn the three pillars of lasting motivation: Autonomy, Mastery, and Purpose.',
                analogy: 'Nobody had to motivate you to play your favorite video game. It had choice (autonomy), leveling up (mastery), and a story worth pursuing (purpose).',
                animationSteps: [
                    { time: 0, label: 'problem', text: 'Extrinsic rewards (stickers, pizza parties) work short-term but can actually DECREASE long-term motivation.', microcopy: 'The reward trap.' },
                    { time: 3, label: 'autonomy', text: 'AUTONOMY: Give students choices—what to study, how to learn, how to demonstrate knowledge.', microcopy: 'Pillar 1: Choice.' },
                    { time: 6, label: 'mastery', text: 'MASTERY: Set "Goldilocks" challenges—not too easy, not too hard. Track visible progress.', microcopy: 'Pillar 2: Growth.' },
                    { time: 9, label: 'purpose', text: 'PURPOSE: Connect learning to real-world impact. "Why does this matter?" should always have an answer.', microcopy: 'Pillar 3: Meaning.' },
                    { time: 12, label: 'result', text: 'When all three pillar align, students develop a deep, lasting love of learning. No pizza parties required.', microcopy: 'Self-sustaining motivation.' },
                ],
                keyPoints: [
                    { title: 'Autonomy', description: 'The desire to direct our own lives. Offer meaningful choices.' },
                    { title: 'Mastery', description: 'The urge to get better at something that matters. Track growth.' },
                    { title: 'Purpose', description: 'The yearning to do something in service of something larger.' },
                    { title: 'Overjustification Effect', description: 'Excessive rewards can undermine existing intrinsic motivation.' },
                ],
                quiz: {
                    question: 'According to Daniel Pink, what are the three pillars of intrinsic motivation?',
                    options: ['Speed, Quality, Cost', 'Autonomy, Mastery, Purpose', 'Rewards, Grades, Competition', 'Reading, Writing, Arithmetic'],
                    correctAnswer: 'Autonomy, Mastery, Purpose',
                    explanation: 'Daniel Pink identified Autonomy (choice), Mastery (growth), and Purpose (meaning) as the three drivers of lasting motivation.',
                },
                miniSim: {
                    description: 'Students only read when there is a pizza party reward. When the reward stops, reading drops. What do you do?',
                    options: [
                        { id: 'a', text: 'Offer a bigger reward next time.', isCorrect: false },
                        { id: 'b', text: 'Let students choose their own books and start book clubs based on interests.', isCorrect: true },
                        { id: 'c', text: 'Make reading mandatory with penalties.', isCorrect: false },
                    ],
                    feedback: {
                        correct: 'Choice (autonomy) and social connection (purpose) build intrinsic motivation. Students read because they WANT to, not for a reward.',
                        incorrect: 'Bigger rewards create a treadmill. Penalties create compliance, not passion. Long-term motivation comes from within.',
                    },
                },
                funFact: 'The "overjustification effect" was demonstrated in a famous 1973 study where children who were rewarded for drawing lost interest in drawing once the rewards stopped.',
                badge: 'Motivation Master',
                animationType: 'growth_chart',
            },
        ]
    },

    // ===== 5. COMMUNICATION SKILLS LAB =====
    'lab_communication': {
        id: 'lab_communication',
        title: 'Communication Skills Lab',
        theme: 'green',
        modules: [
            {
                id: 'active_listening',
                title: 'Active Listening',
                description: 'Master the skill that transforms conversations, resolves conflicts, and builds trust with students and parents.',
                analogy: 'Most people listen like a vending machine: waiting for the other person to stop talking so they can dispense their response. Active listening is different.',
                animationSteps: [
                    { time: 0, label: 'passive', text: 'PASSIVE LISTENING: Hearing words while planning your response. The speaker feels unheard.', microcopy: 'How most people listen.' },
                    { time: 3, label: 'attend', text: 'ATTEND: Make eye contact. Open body language. Put away distractions. Give the speaker your full presence.', microcopy: 'Step 1: Be present.' },
                    { time: 6, label: 'reflect', text: 'REFLECT: Paraphrase what they said: "So what I hear you saying is..."', microcopy: 'Step 2: Mirror back.' },
                    { time: 9, label: 'clarify', text: 'CLARIFY: Ask questions to deepen understanding: "Can you tell me more about that?"', microcopy: 'Step 3: Go deeper.' },
                    { time: 12, label: 'validate', text: 'VALIDATE: "That makes sense. I understand why you feel that way." (Validation is not the same as agreement.)', microcopy: 'Step 4: Acknowledge.' },
                ],
                keyPoints: [
                    { title: 'Attend', description: 'Full presence, eye contact, open body language, no distractions.' },
                    { title: 'Reflect', description: 'Paraphrase their words back to show understanding.' },
                    { title: 'Clarify', description: 'Ask open-ended questions to deepen the conversation.' },
                    { title: 'Validate', description: 'Acknowledge their feelings without necessarily agreeing.' },
                ],
                quiz: {
                    question: 'A parent says: "My child works so hard and you just don\'t appreciate it!" What is the BEST first response?',
                    options: ['Defend your grading system', '"I understand, but grades are based on performance"', '"I hear that you see hard work. That matters. Let\'s look at the details together."', '"Your child needs to study more"'],
                    correctAnswer: '"I hear that you see hard work. That matters. Let\'s look at the details together."',
                    explanation: 'This validates their perspective ("I hear you"), affirms their observation, and redirects to collaborative problem-solving.',
                },
                miniSim: {
                    description: 'A student says: "Nobody likes me in this class." What is the active listening response?',
                    options: [
                        { id: 'a', text: '"That is not true, lots of people like you!"', isCorrect: false },
                        { id: 'b', text: '"It sounds like you are feeling lonely. Can you tell me what happened?"', isCorrect: true },
                        { id: 'c', text: '"Just try being nicer to people."', isCorrect: false },
                    ],
                    feedback: {
                        correct: 'You reflected the emotion (lonely), validated the feeling, and asked an open-ended question. This is textbook active listening.',
                        incorrect: 'Dismissing feelings ("that is not true") or giving unsolicited advice ("be nicer") shuts down the conversation. Listen first.',
                    },
                },
                funFact: 'Studies show that doctors who practice active listening for just 3 more minutes per patient have 47% fewer malpractice claims.',
                badge: 'Listening Leader',
                animationType: 'conversation',
            },
            {
                id: 'effective_feedback',
                title: 'The Feedback Loop',
                description: 'Learn to give feedback that is specific, timely, actionable, and growth-oriented.',
                analogy: 'A GPS does not just say "wrong!" when you take a wrong turn. It tells you exactly where to go next. Good feedback is the same.',
                animationSteps: [
                    { time: 0, label: 'vague', text: 'BAD FEEDBACK: "Good job!" or "Needs improvement." Neither tells the student WHAT to keep doing or change.', microcopy: 'Useless feedback.' },
                    { time: 3, label: 'specific', text: 'BE SPECIFIC: "Your thesis statement clearly argues your position. Strong opening."', microcopy: 'Name exactly what works.' },
                    { time: 6, label: 'actionable', text: 'BE ACTIONABLE: "Your evidence in paragraph 2 could be stronger. Try adding a statistic or expert quote."', microcopy: 'Tell them HOW to improve.' },
                    { time: 9, label: 'timely', text: 'BE TIMELY: Give feedback while students can still USE it—during drafts, not just on final grades.', microcopy: 'Timing is everything.' },
                    { time: 12, label: 'growth', text: 'FOCUS ON GROWTH: "Compare this to your last essay—your paragraph transitions have improved dramatically."', microcopy: 'Show the progress.' },
                ],
                keyPoints: [
                    { title: 'Specific', description: 'Name the exact element—not "good" but "your use of metaphor in line 3..."' },
                    { title: 'Actionable', description: 'Include a clear next step the student can take immediately.' },
                    { title: 'Timely', description: 'Provide feedback during the process, not just at the end.' },
                    { title: 'Growth-Oriented', description: 'Show students how far they have come, not just where they are.' },
                ],
                quiz: {
                    question: 'Which is the most effective feedback?',
                    options: ['Great essay!', 'B+', 'Your argument is strong but your conclusion restates the intro. Try answering: So what? Why does this matter?', 'Needs more work.'],
                    correctAnswer: 'Your argument is strong but your conclusion restates the intro. Try answering: So what? Why does this matter?',
                    explanation: 'This feedback is specific (names the issue), actionable (gives a question to answer), and starts with a strength. That is the formula.',
                },
                miniSim: {
                    description: 'A student submits a mediocre essay with great writing style but a weak argument. How do you give feedback?',
                    options: [
                        { id: 'a', text: '"C+. See me after class."', isCorrect: false },
                        { id: 'b', text: '"Your writing draws the reader in beautifully! To strengthen your argument, try adding evidence from chapter 3 to support your claim in paragraph 2."', isCorrect: true },
                        { id: 'c', text: 'Mark every grammar error in red pen.', isCorrect: false },
                    ],
                    feedback: {
                        correct: 'You led with a specific strength, then gave an actionable next step with a clear example. This is the Praise-Push-Guide model.',
                        incorrect: 'Grades without guidance teach nothing. Overwhelming red marks paralyze. Effective feedback is targeted and encouraging.',
                    },
                },
                funFact: 'Research by John Hattie found that effective feedback has an effect size of 0.73—nearly double the average education intervention. It is one of the highest-impact teaching strategies.',
                badge: 'Feedback Pro',
                animationType: 'conversation',
            },
        ]
    },

    // ===== 6. PROJECT-BASED LEARNING LAB =====
    'lab_pbl': {
        id: 'lab_pbl',
        title: 'Project-Based Learning Lab',
        theme: 'amber',
        modules: [
            {
                id: 'driving_questions',
                title: 'Crafting Driving Questions',
                description: 'Learn to create the compelling questions that spark student curiosity and guide authentic investigation.',
                analogy: 'A driving question is like a treasure map—it does not give you the answer, but it makes you NEED to find it.',
                animationSteps: [
                    { time: 0, label: 'bad_question', text: 'Closed question: "What are the three types of rocks?" Students can Google this in 5 seconds.', microcopy: 'Not a driving question.' },
                    { time: 3, label: 'open', text: 'Make it OPEN-ENDED: "How might we..." or "Why does..." or "What would happen if..."', microcopy: 'No single right answer.' },
                    { time: 6, label: 'authentic', text: 'Make it AUTHENTIC: Connect to real problems students care about. "How could we reduce our school\'s waste by 50%?"', microcopy: 'Real-world relevance.' },
                    { time: 9, label: 'multiskill', text: 'Make it MULTI-SKILL: The question should require research, collaboration, creativity, AND critical thinking.', microcopy: '21st century skills.' },
                    { time: 12, label: 'test', text: 'The litmus test: Would a student voluntarily investigate this on a Saturday? If yes, it is a great driving question.', microcopy: 'The ultimate test.' },
                ],
                keyPoints: [
                    { title: 'Open-Ended', description: 'Cannot be answered with a simple Google search or yes/no.' },
                    { title: 'Authentic', description: 'Connected to real problems students care about.' },
                    { title: 'Multi-Disciplinary', description: 'Requires multiple skills and subject areas to answer.' },
                    { title: 'Engaging', description: 'Sparks genuine curiosity that sustains a multi-week project.' },
                ],
                quiz: {
                    question: 'Which is the BEST driving question for a PBL unit?',
                    options: ['What are the causes of pollution?', 'How could we redesign our school cafeteria to eliminate single-use plastics?', 'Define the water cycle.', 'List 5 renewable energy sources.'],
                    correctAnswer: 'How could we redesign our school cafeteria to eliminate single-use plastics?',
                    explanation: 'It is open-ended, authentic (their school), actionable (redesign), and requires research, math, science, and persuasion.',
                },
                miniSim: {
                    description: 'You are designing a history PBL unit. Which driving question works best?',
                    options: [
                        { id: 'a', text: '"When did World War 2 start?"', isCorrect: false },
                        { id: 'b', text: '"How can we create a museum exhibit that helps our community understand how WWII shaped our city?"', isCorrect: true },
                        { id: 'c', text: '"Who were the major leaders of WWII?"', isCorrect: false },
                    ],
                    feedback: {
                        correct: 'This question is open-ended, authentic (museum for community), action-oriented (create), and locally relevant (our city). Perfect PBL.',
                        incorrect: 'Factual questions have answers that can be looked up. Driving questions require investigation, creation, and critical thinking.',
                    },
                },
                funFact: 'The Buck Institute for Education found that students in PBL classrooms score equally well on standardized tests AND develop stronger collaboration, communication, and critical thinking skills.',
                badge: 'Question Crafter',
                animationType: 'process_flow',
            },
            {
                id: 'scaffolded_autonomy',
                title: 'Scaffolded Autonomy',
                description: 'Master the gradual release of responsibility—from teacher-led to student-driven project work.',
                analogy: 'Teaching someone to drive: first you explain, then you sit beside them, then you ride in the backseat, and finally you hand over the keys.',
                animationSteps: [
                    { time: 0, label: 'too_much', text: 'Common PBL failure: giving students total freedom on Day 1. Result: paralysis, frustration, and wasted time.', microcopy: 'The freedom trap.' },
                    { time: 3, label: 'week1', text: 'WEEK 1: Teacher models research methods, provides templates, and sets clear milestones.', microcopy: 'I do, you watch.' },
                    { time: 6, label: 'week2', text: 'WEEK 2: Teacher guides group work with check-ins. Students follow the framework but make choices within it.', microcopy: 'We do it together.' },
                    { time: 9, label: 'week3', text: 'WEEK 3: Students lead. Teacher becomes a consultant—available but not directing.', microcopy: 'You do, I support.' },
                    { time: 12, label: 'reflect', text: 'Throughout: Build in reflection checkpoints. "What worked? What would you change? Where are you stuck?"', microcopy: 'Metacognition matters.' },
                ],
                keyPoints: [
                    { title: 'Gradual Release', description: 'Move from "I do" to "We do" to "You do" over the course of the project.' },
                    { title: 'Milestones', description: 'Break big projects into small, checkable milestones with deadlines.' },
                    { title: 'Checkpoints', description: 'Regular reflection and feedback sessions prevent projects from derailing.' },
                    { title: 'Teacher as Consultant', description: 'By the end, you should be guiding, not directing. Ask questions, don\'t give answers.' },
                ],
                quiz: {
                    question: 'A group is stuck in Week 2 of their project. What should you do?',
                    options: ['Let them figure it out—struggle is part of PBL', 'Take over and do it for them', 'Meet with them, help them break the project into smaller tasks, and set a 24-hour mini-deadline', 'Assign them a different project'],
                    correctAnswer: 'Meet with them, help them break the project into smaller tasks, and set a 24-hour mini-deadline',
                    explanation: 'This is scaffolding: you provided structure (smaller tasks, deadline) without removing ownership. You guided without directing.',
                },
                miniSim: {
                    description: 'It is Day 1 of a 3-week PBL unit. What should students do today?',
                    options: [
                        { id: 'a', text: 'Start working on their projects immediately with full freedom.', isCorrect: false },
                        { id: 'b', text: 'Watch the teacher model the research process, practice with a guided example, and co-create project criteria.', isCorrect: true },
                        { id: 'c', text: 'Take a quiz on the topic first.', isCorrect: false },
                    ],
                    feedback: {
                        correct: 'Day 1 is "I do" time. Model the process, set expectations together, and build the foundation for independent work later.',
                        incorrect: 'Full freedom on Day 1 leads to chaos. Students need scaffolding before they can soar.',
                    },
                },
                funFact: 'The "Gradual Release of Responsibility" model was developed by Pearson and Gallagher in 1983 and remains one of the most evidence-based instructional frameworks.',
                badge: 'Scaffold Master',
                animationType: 'growth_chart',
            },
        ]
    },

    // ===== 7. ASSESSMENT STRATEGIES LAB =====
    'lab_assessment': {
        id: 'lab_assessment',
        title: 'Assessment Strategies Lab',
        theme: 'green',
        modules: [
            {
                id: 'formative_assessment',
                title: 'Formative Assessment',
                description: 'Master the art of checking understanding DURING learning, not just at the end.',
                analogy: 'A doctor checks your vitals during treatment, not just at the end. Formative assessment is the thermometer of teaching.',
                animationSteps: [
                    { time: 0, label: 'summative', text: 'SUMMATIVE assessment is the final exam—it measures what was learned AFTER instruction is over.', microcopy: 'Autopsy of learning.' },
                    { time: 3, label: 'formative', text: 'FORMATIVE assessment happens DURING learning—exit tickets, think-pair-share, quick polls, observations.', microcopy: 'Health check of learning.' },
                    { time: 6, label: 'adjust', text: 'The key difference: formative assessment data is used to ADJUST teaching in real-time.', microcopy: 'Teach, check, adjust.' },
                    { time: 9, label: 'strategies', text: 'Easy strategies: Thumbs up/down, whiteboards, 3-2-1 exit tickets, one-minute papers, cold calling.', microcopy: 'Simple but powerful.' },
                    { time: 12, label: 'culture', text: 'When formative assessment is routine, students see it as a learning tool, not a judgment. Low stakes, high impact.', microcopy: 'Assessment AS learning.' },
                ],
                keyPoints: [
                    { title: 'Low Stakes', description: 'Formative assessments should never be graded. They are for learning, not judging.' },
                    { title: 'Real-Time Data', description: 'Use the data immediately to adjust your teaching in the moment.' },
                    { title: 'Student Friendly', description: 'Students should see these as helpful, not stressful.' },
                    { title: 'Frequent', description: 'Check understanding every 10-15 minutes, not just at the end.' },
                ],
                quiz: {
                    question: 'What is the PRIMARY purpose of formative assessment?',
                    options: ['To grade students', 'To adjust teaching based on student understanding', 'To rank students', 'To satisfy admin requirements'],
                    correctAnswer: 'To adjust teaching based on student understanding',
                    explanation: 'Formative assessment is a diagnostic tool for teachers. The data tells you who understands, who is confused, and what to do next.',
                },
                miniSim: {
                    description: 'After a 15-minute mini-lesson, you ask students to "thumbs up if you get it." All thumbs are up, but the exit ticket shows 40% are confused. What happened?',
                    options: [
                        { id: 'a', text: 'The students lied.', isCorrect: false },
                        { id: 'b', text: 'Thumbs-up is a low-quality formative assessment—students follow the crowd. Use individual written responses instead.', isCorrect: true },
                        { id: 'c', text: 'The exit ticket was too hard.', isCorrect: false },
                    ],
                    feedback: {
                        correct: 'Public responses create peer pressure. Private, written formative assessments give you more honest data. Tool selection matters!',
                        incorrect: 'Students were not lying—they simply followed social cues. The problem is the assessment method, not the students.',
                    },
                },
                funFact: 'Dylan Wiliam\'s research found that formative assessment can add 6-9 months of additional learning progress per year when implemented well.',
                badge: 'Assessment Ace',
                animationType: 'classroom',
            },
        ]
    },

    // ===== 8. DIGITAL TOOLS LAB =====
    'lab_tools': {
        id: 'lab_tools',
        title: 'Digital Tools Lab',
        theme: 'cyan',
        modules: [
            {
                id: 'ai_in_teaching',
                title: 'AI Tools for Teachers',
                description: 'Learn to use AI as your teaching assistant—for planning, differentiation, and feedback—not as a replacement.',
                analogy: 'AI is like a kitchen appliance: a blender can not cook, but it helps the chef work faster and more creatively.',
                animationSteps: [
                    { time: 0, label: 'fear', text: 'Many teachers fear AI will replace them. In reality, AI is a powerful ASSISTANT, not a replacement.', microcopy: 'The reality check.' },
                    { time: 3, label: 'planning', text: 'LESSON PLANNING: "Generate 3 differentiated activities for teaching fractions to 4th graders at beginner, intermediate, and advanced levels."', microcopy: 'Save hours of prep.' },
                    { time: 6, label: 'feedback', text: 'FEEDBACK: Use AI to draft feedback on student writing, then personalize it. Cut grading time by 50%.', microcopy: 'AI + human touch.' },
                    { time: 9, label: 'differentiation', text: 'DIFFERENTIATION: "Explain photosynthesis at a 3rd grade level, a 6th grade level, and a high school level."', microcopy: 'Instant scaffolding.' },
                    { time: 12, label: 'ethics', text: 'CRITICAL: Always review AI output. Teach students to use AI as a thinking partner, not a thinking replacement.', microcopy: 'Human oversight is essential.' },
                ],
                keyPoints: [
                    { title: 'AI as Assistant', description: 'Use AI for drafting, brainstorming, and scaffolding—not for final decisions.' },
                    { title: 'Prompt Engineering', description: 'Better prompts give better results. Be specific about grade level, format, and goals.' },
                    { title: 'Always Review', description: 'AI makes mistakes. Always verify facts and personalize AI-generated content.' },
                    { title: 'Teach AI Literacy', description: 'Students need to understand how AI works, its limits, and ethical use.' },
                ],
                quiz: {
                    question: 'What is the BEST use of AI in teaching?',
                    options: ['Replace all grading', 'Generate lesson plan drafts that you then customize', 'Let students use AI for all assignments', 'Eliminate teacher planning time'],
                    correctAnswer: 'Generate lesson plan drafts that you then customize',
                    explanation: 'AI is excellent for drafting and brainstorming. The teacher\'s expertise is needed to customize, personalize, and ensure quality.',
                },
                miniSim: {
                    description: 'A student submits an essay clearly written by AI. How do you handle it?',
                    options: [
                        { id: 'a', text: 'Give them a zero for cheating.', isCorrect: false },
                        { id: 'b', text: 'Have a conversation about WHAT they learned. Ask them to explain their argument verbally, then discuss AI ethics and academic integrity.', isCorrect: true },
                        { id: 'c', text: 'Ban all AI use in your class.', isCorrect: false },
                    ],
                    feedback: {
                        correct: 'This is a teaching moment, not just a discipline moment. Understanding WHY they used AI and teaching responsible use is more effective than punishment.',
                        incorrect: 'A zero teaches nothing about ethics. Blanket bans do not prepare students for a world where AI is everywhere. Teach responsible use.',
                    },
                },
                funFact: 'A 2024 study found that teachers who used AI for lesson planning reported saving an average of 5 hours per week while increasing lesson quality.',
                badge: 'AI-Powered Teacher',
                animationType: 'neural_network',
            },
        ]
    },
};
