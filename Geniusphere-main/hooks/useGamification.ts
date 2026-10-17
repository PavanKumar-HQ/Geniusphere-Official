import { useState, useEffect } from 'react';

// Constants
const STREAK_KEY = 'geniusphere_streak';
const POINTS_KEY = 'geniusphere_points';
const LAST_LOGIN_KEY = 'geniusphere_last_login';

export const useGamification = () => {
    const [streak, setStreak] = useState(0);
    const [points, setPoints] = useState(0);
    const [showStreakModal, setShowStreakModal] = useState(false);
    const [showPointsModal, setShowPointsModal] = useState(false);
    const [earnedPoints, setEarnedPoints] = useState(0);

    // Initial Load & Streak Calculation
    useEffect(() => {
        const savedStreak = parseInt(localStorage.getItem(STREAK_KEY) || '0');
        const savedPoints = parseInt(localStorage.getItem(POINTS_KEY) || '0');
        const lastLogin = localStorage.getItem(LAST_LOGIN_KEY);

        const today = new Date().toDateString();

        setStreak(savedStreak);
        setPoints(savedPoints);

        if (lastLogin !== today) {
            // New day login
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);

            if (lastLogin === yesterday.toDateString()) {
                // Consecutive day
                const newStreak = savedStreak + 1;
                setStreak(newStreak);
                localStorage.setItem(STREAK_KEY, newStreak.toString());
                setShowStreakModal(true); // Celebrate streak increase
            } else if (!lastLogin) {
                // First ever login
                setStreak(1);
                localStorage.setItem(STREAK_KEY, '1');
            } else {
                // Streak broken (or just same day if checked earlier incorrectly, but logic covers that)
                // Actually if it's not today AND not yesterday, streak resets to 1
                setStreak(1);
                localStorage.setItem(STREAK_KEY, '1');
                // Maybe warn user streak broken? Nah, just set to 1.
            }
            localStorage.setItem(LAST_LOGIN_KEY, today);
        }
    }, []);

    const awardPoints = (amount: number) => {
        const newPoints = points + amount;
        setPoints(newPoints);
        setEarnedPoints(amount);
        localStorage.setItem(POINTS_KEY, newPoints.toString());
        setShowPointsModal(true);
        setTimeout(() => setShowPointsModal(false), 3000); // Auto hide after 3s
    };

    return {
        streak,
        points,
        awardPoints,
        showStreakModal,
        setShowStreakModal,
        showPointsModal,
        earnedPoints
    };
};
