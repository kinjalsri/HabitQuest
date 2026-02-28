const express = require('express');

//service file for quests 

//normalize dates 
const normalizeDate = (date) => {
    const d = new Date(date);
    d.setHours(0,0,0,0);
    return d;
}

//calculate weekly progress 
const calculateWeeklyProgress = (quest) => {
    const today = normalizeDate(new Date());

    const curDay = today.getDay(); // where 0-> Sunday, 1-> Monday, ..., 6-> Saturday
    //make monday the start of the day 
    const daysToSub = curDay === 0? 6 : curDay - 1; 

    //get the start of the week (Monday)
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - daysToSub);

    const weeklyCount = quest.completedDates.filter((date) => {
        const d = normalizeDate(date);
        return d >= weekStart && d <= today;
    }).length;

    const weeklyCompleted = weeklyCount >= quest.targetDaysPerWeek;

     return {
    weeklyCount,
    weeklyTarget: quest.targetDaysPerWeek,
    weeklyCompleted,
    weeklyPercentage: Math.min(
      Math.floor((weeklyCount / quest.targetDaysPerWeek) * 100),
      100
    )
  };
    
};

//cal streaks

const calculateStreak = (quest) => {
  if (!quest.completedDates.length) return 0;

  const today = normalizeDate(new Date());

  const normalizedDates = quest.completedDates
    .map(normalizeDate)
    .sort((a, b) => b - a); // newest first

  // If today is not completed → streak = 0
  if (normalizedDates[0].getTime() !== today.getTime()) {
    return 0;
  }

  let streak = 1;
  let currentDate = new Date(today);

  for (let i = 1; i < normalizedDates.length; i++) {
    currentDate.setDate(currentDate.getDate() - 1);

    if (normalizedDates[i].getTime() === currentDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

//calculate xp 
const calculateQuestXP = (quest, streak) => {
  let xp = quest.completedDates.length * quest.xpPerCompletion;

  // Bonus rules
  if (streak >= 30) xp += 100;
  else if (streak >= 7) xp += 50;

  return xp;
};

// cal stats
const calculateStats = (quests) => {
  let totalXP = 0;

  const questStats = quests.map(quest => {
    const weekly = calculateWeeklyProgress(quest);
    const streak = calculateStreak(quest);
    const xpEarned = calculateQuestXP(quest, streak);

    totalXP += xpEarned;

    return {
      id: quest._id,
      title: quest.title,
      weeklyCount: weekly.weeklyCount,
      weeklyTarget: weekly.weeklyTarget,
      weeklyCompleted: weekly.weeklyCompleted,
      weeklyPercentage: weekly.weeklyPercentage,
      currentStreak: streak,
      xpEarned
    };
  });

  return {
    totalXP,
    quests: questStats
  };
};

module.exports = {
  calculateWeeklyProgress,
  calculateStreak,
  calculateQuestXP,
  calculateStats
};


