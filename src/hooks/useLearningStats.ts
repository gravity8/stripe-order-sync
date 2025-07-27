import { useState, useEffect } from "react";

interface LearningStats {
  conceptsExplored: string[];
  securityAdviceAccepted: number;
  cleanCodePrinciplesApplied: string[];
  questionsAsked: number;
  blockExplanationsRequested: number;
  whyButtonClicks: number;
  lastActive: Date;
}

const defaultStats: LearningStats = {
  conceptsExplored: [],
  securityAdviceAccepted: 0,
  cleanCodePrinciplesApplied: [],
  questionsAsked: 0,
  blockExplanationsRequested: 0,
  whyButtonClicks: 0,
  lastActive: new Date(),
};

export function useLearningStats() {
  const [stats, setStats] = useState<LearningStats>(defaultStats);

  // Load stats from localStorage on mount
  useEffect(() => {
    const savedStats = localStorage.getItem("learning_stats");
    if (savedStats) {
      try {
        const parsed = JSON.parse(savedStats);
        setStats({
          ...parsed,
          lastActive: new Date(parsed.lastActive),
        });
      } catch (error) {
        console.error("Failed to parse learning stats:", error);
      }
    }
  }, []);

  // Save stats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("learning_stats", JSON.stringify(stats));
  }, [stats]);

  const trackInteraction = (type: string, data: any) => {
    setStats(prev => {
      const newStats = { ...prev, lastActive: new Date() };

      switch (type) {
        case 'concept_explored':
          if (!newStats.conceptsExplored.includes(data.concept)) {
            newStats.conceptsExplored = [...newStats.conceptsExplored, data.concept];
          }
          break;

        case 'security_advice_accepted':
          newStats.securityAdviceAccepted += 1;
          break;

        case 'principle_applied':
          if (!newStats.cleanCodePrinciplesApplied.includes(data.principle)) {
            newStats.cleanCodePrinciplesApplied = [...newStats.cleanCodePrinciplesApplied, data.principle];
          }
          break;

        case 'question_asked':
        case 'related_concept_clicked':
          newStats.questionsAsked += 1;
          break;

        case 'block_explanation':
          newStats.blockExplanationsRequested += 1;
          break;

        case 'why_clicked':
          newStats.whyButtonClicks += 1;
          break;

        default:
          // Handle other interaction types as needed
          break;
      }

      return newStats;
    });
  };

  const clearStats = () => {
    setStats(defaultStats);
    localStorage.removeItem("learning_stats");
  };

  return {
    stats,
    trackInteraction,
    clearStats,
  };
}