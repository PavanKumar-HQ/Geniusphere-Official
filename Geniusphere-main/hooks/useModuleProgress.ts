import { useState, useEffect } from 'react';

const STORAGE_KEY = 'gs_student_progress';
const XP_KEY = 'gs_student_xp';
const WEEKLY_KEY = 'gs_student_weekly_activity';

const XP_PER_MODULE = 50;

type WeeklyActivity = {
    [date: string]: number; // date string (YYYY-MM-DD) -> count of completed items
};

export const useModuleProgress = (allResources: any[]) => {
    const [completedIds, setCompletedIds] = useState<string[]>([]);
    const [xp, setXp] = useState(0);
    const [weeklyActivity, setWeeklyActivity] = useState<WeeklyActivity>({});
    const [isInitialized, setIsInitialized] = useState(false);

    // Load from LocalStorage on mount
    useEffect(() => {
        const storedProgress = localStorage.getItem(STORAGE_KEY);
        const storedXp = localStorage.getItem(XP_KEY);
        const storedWeekly = localStorage.getItem(WEEKLY_KEY);

        if (storedProgress) {
            try {
                setCompletedIds(JSON.parse(storedProgress));
            } catch (e) {
                console.error('Failed to parse progress', e);
            }
        }
        if (storedXp) setXp(parseInt(storedXp, 10));
        if (storedWeekly) {
            try {
                setWeeklyActivity(JSON.parse(storedWeekly));
            } catch (e) {
                console.error('Failed to parse weekly activity', e);
            }
        }

        setIsInitialized(true);
    }, []);

    const toggleCompletion = (resourceId: string) => {
        setCompletedIds(prev => {
            const isCompleting = !prev.includes(resourceId);
            const newIds = isCompleting
                ? [...prev, resourceId]
                : prev.filter(id => id !== resourceId);

            localStorage.setItem(STORAGE_KEY, JSON.stringify(newIds));

            // Logic for XP and Weekly Activity
            if (isCompleting) {
                const newXp = xp + XP_PER_MODULE;
                setXp(newXp);
                localStorage.setItem(XP_KEY, newXp.toString());

                const today = new Date().toISOString().split('T')[0];
                setWeeklyActivity(prevWeekly => {
                    const newWeekly = { ...prevWeekly, [today]: (prevWeekly[today] || 0) + 1 };
                    localStorage.setItem(WEEKLY_KEY, JSON.stringify(newWeekly));
                    return newWeekly;
                });
            } else {
                // Deduct XP if unchecked to keep it accurate to "current state".
                const newXp = Math.max(0, xp - XP_PER_MODULE);
                setXp(newXp);
                localStorage.setItem(XP_KEY, newXp.toString());
            }

            return newIds;
        });
    };

    const clearProgress = () => {
        if (window.confirm("Are you sure you want to clear your learning progress? This cannot be undone.")) {
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(XP_KEY);
            localStorage.removeItem(WEEKLY_KEY);
            setCompletedIds([]);
            setXp(0);
            setWeeklyActivity({});
        }
    };

    // Calculate stats based on ALL available resources to show accurate "X/Total" count
    const validCompletedCount = completedIds.filter(id => allResources.some(r => r.id === id)).length;
    const totalTrackableModules = allResources.length;
    const progressPercentage = totalTrackableModules > 0
        ? Math.round((validCompletedCount / totalTrackableModules) * 100)
        : 0;

    // Weekly Report Data Helper
    const getLast7DaysActivity = () => {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            days.push({
                date: dateStr,
                dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
                count: weeklyActivity[dateStr] || 0
            });
        }
        return days;
    };

    return {
        completedIds,
        toggleCompletion,
        clearProgress,
        completedCount: validCompletedCount,
        totalModules: totalTrackableModules,
        progressPercentage,
        xp,
        weeklyReport: getLast7DaysActivity(),
        isInitialized
    };
};
