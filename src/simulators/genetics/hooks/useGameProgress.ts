import { useState, useEffect } from 'react'
import type { PlayerProgress, PlayerStats, Mission } from '../types/gamification'
import { LEVEL_1_MISSIONS, ACHIEVEMENTS } from '../data/gamification-data'
import { getPlayerLevel } from '../types/gamification'

const STORAGE_KEY = 'biosim-genetics-progress'

const initialProgress: PlayerProgress = {
    points: 0,
    xp: 0,
    level: 1,
    completedMissions: [],
    unlockedAchievements: [],
    currentMission: null,
    stats: {
        totalExperiments: 0,
        totalOffspring: 0,
        correctQuizAnswers: 0,
        totalQuizAnswers: 0,
        mendelianRatiosAchieved: 0,
        mutationsFound: 0,
        crossoversUsed: 0,
    },
}

export function useGameProgress() {
    const [progress, setProgress] = useState<PlayerProgress>(() => {
        const saved = localStorage.getItem(STORAGE_KEY)
        return saved ? JSON.parse(saved) : initialProgress
    })

    // Salva progresso automaticamente
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    }, [progress])

    // Adiciona pontos e XP
    const addReward = (points: number, xp: number) => {
        setProgress(prev => {
            const newXP = prev.xp + xp
            const newLevel = getPlayerLevel(newXP)

            return {
                ...prev,
                points: prev.points + points,
                xp: newXP,
                level: newLevel.level,
            }
        })
    }

    // Completa missão
    const completeMission = (missionId: string) => {
        const mission = LEVEL_1_MISSIONS.find(m => m.id === missionId)
        if (!mission || progress.completedMissions.includes(missionId)) return

        setProgress(prev => ({
            ...prev,
            completedMissions: [...prev.completedMissions, missionId],
            points: prev.points + mission.rewards.points,
            xp: prev.xp + mission.rewards.xp,
        }))

        // Desbloqueia conquista se houver
        if (mission.rewards.achievement) {
            unlockAchievement(mission.rewards.achievement)
        }
    }

    // Desbloqueia conquista
    const unlockAchievement = (achievementId: string) => {
        if (progress.unlockedAchievements.includes(achievementId)) return

        const achievement = ACHIEVEMENTS.find(a => a.id === achievementId)
        if (!achievement) return

        setProgress(prev => ({
            ...prev,
            unlockedAchievements: [...prev.unlockedAchievements, achievementId],
            points: prev.points + achievement.points,
        }))
    }

    // Atualiza estatísticas
    const updateStats = (updates: Partial<PlayerStats>) => {
        setProgress(prev => ({
            ...prev,
            stats: {
                ...prev.stats,
                ...updates,
            },
        }))
    }

    // Incrementa estatística
    const incrementStat = (stat: keyof PlayerStats, amount: number = 1) => {
        setProgress(prev => ({
            ...prev,
            stats: {
                ...prev.stats,
                [stat]: prev.stats[stat] + amount,
            },
        }))
    }

    // Registra experimento
    const recordExperiment = (offspringCount: number, hasCrossover: boolean) => {
        setProgress(prev => {
            const newStats = {
                ...prev.stats,
                totalExperiments: prev.stats.totalExperiments + 1,
                totalOffspring: prev.stats.totalOffspring + offspringCount,
            }

            if (hasCrossover) {
                newStats.crossoversUsed += 1
            }

            return {
                ...prev,
                stats: newStats,
            }
        })

        // Primeira geração = conquista
        if (progress.stats.totalOffspring === 0) {
            unlockAchievement('first-generation')
            addReward(10, 5)
        }
    }

    // Registra proporção mendeliana
    const recordMendelianRatio = () => {
        incrementStat('mendelianRatiosAchieved')

        if (progress.stats.mendelianRatiosAchieved === 0) {
            unlockAchievement('mendelian')
            addReward(50, 25)
        }
    }

    // Registra resposta de quiz
    const recordQuizAnswer = (correct: boolean, points: number) => {
        setProgress(prev => ({
            ...prev,
            stats: {
                ...prev.stats,
                totalQuizAnswers: prev.stats.totalQuizAnswers + 1,
                correctQuizAnswers: prev.stats.correctQuizAnswers + (correct ? 1 : 0),
            },
            points: correct ? prev.points + points : prev.points,
            xp: correct ? prev.xp + (points / 2) : prev.xp,
        }))
    }

    // Reseta progresso
    const resetProgress = () => {
        setProgress(initialProgress)
        localStorage.removeItem(STORAGE_KEY)
    }

    // Verifica se missão está disponível
    const isMissionAvailable = (mission: Mission): boolean => {
        if (!mission.unlockRequirement) return true
        return progress.completedMissions.includes(mission.unlockRequirement)
    }

    // Verifica se missão está completa
    const isMissionCompleted = (missionId: string): boolean => {
        return progress.completedMissions.includes(missionId)
    }

    // Verifica se conquista está desbloqueada
    const isAchievementUnlocked = (achievementId: string): boolean => {
        return progress.unlockedAchievements.includes(achievementId)
    }

    // Inicia uma missão
    const startMission = (missionId: string) => {
        setProgress(prev => ({
            ...prev,
            currentMission: missionId,
        }))
    }

    return {
        progress,
        addReward,
        completeMission,
        unlockAchievement,
        updateStats,
        incrementStat,
        recordExperiment,
        recordMendelianRatio,
        recordQuizAnswer,
        resetProgress,
        isMissionAvailable,
        isMissionCompleted,
        isAchievementUnlocked,
        startMission,
    }
}
