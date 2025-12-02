// ==================== TIPOS DE GAMIFICAÇÃO ====================

export interface PlayerProgress {
    points: number
    xp: number
    level: number
    completedMissions: string[]
    unlockedAchievements: string[]
    currentMission: string | null
    stats: PlayerStats
}

export interface PlayerStats {
    totalExperiments: number
    totalOffspring: number
    correctQuizAnswers: number
    totalQuizAnswers: number
    mendelianRatiosAchieved: number
    mutationsFound: number
    crossoversUsed: number
}

export interface Mission {
    id: string
    level: number
    title: string
    description: string
    objectives: MissionObjective[]
    rewards: Rewards
    unlockRequirement?: string // ID da missão anterior
    difficulty: 'easy' | 'medium' | 'hard'
}

export interface MissionObjective {
    id: string
    description: string
    type: 'generate' | 'ratio' | 'quiz' | 'identify' | 'configure'
    targetValue?: number | string
    completed: boolean
}

export interface Rewards {
    points: number
    xp: number
    achievement?: string
    unlocks?: string[] // IDs de missões/features desbloqueadas
}

export interface Achievement {
    id: string
    title: string
    description: string
    icon: string
    points: number
    requirement: AchievementRequirement
    unlocked: boolean
    unlockedAt?: Date
}

export interface AchievementRequirement {
    type: 'mission' | 'stat' | 'action' | 'combo'
    condition: string // Ex: "completedMissions.includes('mission-1-1')"
    value?: number
}

export interface QuizQuestion {
    id: string
    question: string
    type: 'multiple-choice' | 'true-false' | 'prediction'
    options?: string[]
    correctAnswer: string | number
    explanation: string
    difficulty: 'easy' | 'medium' | 'hard'
    points: number
    relatedConcept: string // ID do conceito no glossário
}

export interface QuizResult {
    questionId: string
    userAnswer: string | number
    correct: boolean
    pointsEarned: number
    timestamp: Date
}

// Níveis de jogador
export const PLAYER_LEVELS = [
    { level: 1, name: 'Aprendiz', minXP: 0, maxXP: 100, color: '#94a3b8' },
    { level: 2, name: 'Estudante', minXP: 100, maxXP: 300, color: '#60a5fa' },
    { level: 3, name: 'Geneticista', minXP: 300, maxXP: 600, color: '#a78bfa' },
    { level: 4, name: 'Cientista', minXP: 600, maxXP: 1000, color: '#f59e0b' },
    { level: 5, name: 'Mestre', minXP: 1000, maxXP: Infinity, color: '#f59e0b' },
]

export function getPlayerLevel(xp: number): typeof PLAYER_LEVELS[0] {
    return PLAYER_LEVELS.find(level => xp >= level.minXP && xp < level.maxXP) || PLAYER_LEVELS[0]
}

export function getXPProgress(xp: number): number {
    const level = getPlayerLevel(xp)
    const progress = ((xp - level.minXP) / (level.maxXP - level.minXP)) * 100
    return Math.min(progress, 100)
}
