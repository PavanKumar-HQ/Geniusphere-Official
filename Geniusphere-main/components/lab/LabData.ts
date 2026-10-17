import { LabConfig } from './LabTypes';

export const LAB_CONFIGS: Record<string, LabConfig> = {
    'sim_blockchain_hash': {
        id: 'sim_blockchain_hash',
        title: 'Blockchain & Crypto Lab',
        theme: 'amber',
        modules: [
            {
                id: 'hashing',
                title: 'Cryptographic Hashing',
                description: 'The digital fingerprint that secures data on the blockchain.',
                analogy: 'Like a magical blender that turns any fruit into a unique juice, but you can\'t turn the juice back into fruit.',
                icon: 'Hash',
                animationType: 'hashing',
                animationSteps: [
                    { time: 0, label: 'input', text: 'Data (like a transaction) is sent to the hashing algorithm.', microcopy: 'Raw Data.' },
                    { time: 3, label: 'process', text: 'The algorithm scrambles the data using math.', microcopy: 'Crunching numbers...' },
                    { time: 6, label: 'output', text: 'A unique fixed-length string (Hash) is produced.', microcopy: 'Unique fingerprint.' },
                    { time: 9, label: 'change', text: 'Changing even one detailed letter in the input changes the WHOLE hash.', microcopy: 'Tamper evident!' },
                    { time: 12, label: 'security', text: 'This ensures data integrity—no one can tamper without it being obvious.', microcopy: 'Data is secure.' },
                ],
                keyPoints: [
                    { title: 'One-Way', description: 'Easy to create, impossible to reverse.' },
                    { title: 'Unique', description: 'Every input creates a completely different output.' },
                    { title: 'Deterministic', description: 'The same input always produces the exact same hash.' },
                ],
                quiz: {
                    question: 'If you change one letter in a document, what happens to its hash?',
                    options: ['It stays the same', 'It changes slightly', 'It changes completely', 'It is deleted'],
                    correctAnswer: 'It changes completely',
                    explanation: 'This "avalanche effect" is key to security. Any tampering is immediately obvious.',
                },
                miniSim: {
                    description: 'You want to verify a file hasn\'t been hacked. What do you compare?',
                    options: [
                        { id: 'a', text: 'The file size.', isCorrect: false },
                        { id: 'b', text: 'The file name.', isCorrect: false },
                        { id: 'c', text: 'The cryptographic hash.', isCorrect: true },
                    ],
                    feedback: {
                        correct: 'Correct! The hash is the only mathematically code-proof way to verify data integrity.',
                        incorrect: 'Spoofing size or name is easy. Spoofing a hash is mathematically impossible.',
                    },
                },
                funFact: 'Bitcoin uses the SHA-256 hashing algorithm.',
                badge: 'Hash Hero',
            },
        ]
    },
    'sim_iot_smart': {
        id: 'sim_iot_smart',
        title: 'IoT & Smart Cities Lab',
        theme: 'blue',
        modules: [
            {
                id: 'sensors',
                title: 'Sensors & Data Collection',
                description: 'How devices "feel" the world around them.',
                analogy: 'Like digital eyes and ears for a computer.',
                icon: 'Wifi',
                animationType: 'iot_sensor',
                animationSteps: [
                    { time: 0, label: 'environment', text: 'The environment changes (Temperature rises).', microcopy: 'It\'s getting hot.' },
                    { time: 3, label: 'detect', text: 'A sensor detects this change.', microcopy: 'Sensor activated.' },
                    { time: 6, label: 'convert', text: 'Analog signal is converted to digital data.', microcopy: 'Converting to data...' },
                    { time: 9, label: 'transmit', text: 'Data is sent to the Cloud via Wi-Fi.', microcopy: 'Sending to cloud.' },
                    { time: 12, label: 'action', text: 'The Smart AC turns on automatically.', microcopy: 'Action taken!' },
                ],
                keyPoints: [
                    { title: 'Input', description: 'Sensors gather data (light, heat, motion).' },
                    { title: 'Connectivity', description: 'Sending data to be processed.' },
                    { title: 'Automation', description: 'Machines acting on data without human help.' },
                ],
                quiz: {
                    question: 'Which of these is an IoT device?',
                    options: ['A regular hammer', 'A smart thermostat', 'A printed book', 'A generic rock'],
                    correctAnswer: 'A smart thermostat',
                    explanation: 'It collects data (temperature) and communicates over the internet to automate climate control.',
                },
                miniSim: {
                    description: 'Design a Smart Farm. What sensor do you need to water plants automatically?',
                    options: [
                        { id: 'a', text: 'Motion sensor.', isCorrect: false },
                        { id: 'b', text: 'Soil Moisture sensor.', isCorrect: true },
                        { id: 'c', text: 'Noise sensor.', isCorrect: false },
                    ],
                    feedback: {
                        correct: 'Perfect! When the soil is dry, the sensor triggers the sprinklers.',
                        incorrect: 'That won\'t help knowing when they are thirsty!',
                    },
                },
                funFact: 'There are more connected IoT devices on Earth than there are humans!',
                badge: 'IoT Innovator',
            },
        ]
    },
};
