import { useState } from 'react'
import { Target, CheckCircle2, Lock, ChevronRight } from 'lucide-react'
import type { Mission } from '../types/gamification'
import { LEVEL_1_MISSIONS } from '../data/gamification-data'

interface MissionsPanelProps {
    completedMissions: string[]
    currentMission: string | null
    onStartMission: (missionId: string) => void
    isMissionAvailable: (mission: Mission) => boolean
}

export function MissionsPanel({
    completedMissions,
    currentMission,
    onStartMission,
    isMissionAvailable,
}: MissionsPanelProps) {
    const [isOpen, setIsOpen] = useState(false)

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                style={{
                    position: 'fixed',
                    left: '30px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    borderRadius: '0 12px 12px 0',
                    padding: '16px 12px',
                    color: 'white',
                    cursor: 'pointer',
                    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
                    zIndex: 150,
                    writingMode: 'vertical-rl',
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    letterSpacing: '1px',
                    transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-50%) translateX(5px)'
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(-50%)'
                }}
            >
                🎯 MISSÕES
            </button>
        )
    }

    return (
        <div
            style={{
                position: 'fixed',
                left: '0',
                top: '0',
                width: '100%',
                height: '100%',
                background: 'rgba(0, 0, 0, 0.7)',
                zIndex: 2000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
            onClick={() => setIsOpen(false)}
        >
            <div
                style={{
                    width: '90%',
                    maxWidth: '700px',
                    maxHeight: '80vh',
                    background: 'rgba(15, 15, 20, 0.98)',
                    backdropFilter: 'blur(30px)',
                    border: '2px solid rgba(102, 126, 234, 0.4)',
                    borderRadius: '24px',
                    padding: '32px',
                    color: 'white',
                    overflowY: 'auto',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '24px',
                    }}
                >
                    <div>
                        <h2
                            style={{
                                margin: 0,
                                fontSize: '2rem',
                                fontWeight: '800',
                                background: 'linear-gradient(135deg, #667eea 0%, #f093fb 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Missões - Nível 1
                        </h2>
                        <p
                            style={{
                                margin: '8px 0 0 0',
                                color: 'rgba(255, 255, 255, 0.6)',
                                fontSize: '0.9rem',
                            }}
                        >
                            Complete missões para ganhar pontos e XP
                        </p>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '8px 16px',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                        }}
                    >
                        Fechar
                    </button>
                </div>

                {/* Missões */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {LEVEL_1_MISSIONS.map((mission) => {
                        const isCompleted = completedMissions.includes(mission.id)
                        const isAvailable = isMissionAvailable(mission)
                        const isCurrent = currentMission === mission.id
                        const isLocked = !isAvailable && !isCompleted

                        return (
                            <div
                                key={mission.id}
                                style={{
                                    background: isCompleted
                                        ? 'rgba(74, 222, 128, 0.1)'
                                        : isCurrent
                                            ? 'rgba(102, 126, 234, 0.15)'
                                            : 'rgba(255, 255, 255, 0.05)',
                                    border: `2px solid ${isCompleted
                                            ? 'rgba(74, 222, 128, 0.3)'
                                            : isCurrent
                                                ? 'rgba(102, 126, 234, 0.4)'
                                                : 'rgba(255, 255, 255, 0.1)'
                                        }`,
                                    borderRadius: '16px',
                                    padding: '20px',
                                    opacity: isLocked ? 0.5 : 1,
                                    position: 'relative',
                                }}
                            >
                                {/* Badge de Status */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '16px',
                                        right: '16px',
                                    }}
                                >
                                    {isCompleted ? (
                                        <CheckCircle2 size={24} color="#4ade80" />
                                    ) : isLocked ? (
                                        <Lock size={24} color="#94a3b8" />
                                    ) : isCurrent ? (
                                        <Target size={24} color="#667eea" />
                                    ) : null}
                                </div>

                                {/* Título e Descrição */}
                                <h3
                                    style={{
                                        margin: '0 0 8px 0',
                                        fontSize: '1.3rem',
                                        fontWeight: '700',
                                        color: isCompleted ? '#4ade80' : 'white',
                                    }}
                                >
                                    {mission.title}
                                </h3>
                                <p
                                    style={{
                                        margin: '0 0 16px 0',
                                        color: 'rgba(255, 255, 255, 0.7)',
                                        fontSize: '0.9rem',
                                        lineHeight: '1.5',
                                    }}
                                >
                                    {mission.description}
                                </p>

                                {/* Objetivos */}
                                <div style={{ marginBottom: '16px' }}>
                                    {mission.objectives.map((obj) => (
                                        <div
                                            key={obj.id}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                marginBottom: '8px',
                                                fontSize: '0.85rem',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: '16px',
                                                    height: '16px',
                                                    borderRadius: '50%',
                                                    border: '2px solid rgba(255, 255, 255, 0.3)',
                                                    background: obj.completed ? '#4ade80' : 'transparent',
                                                }}
                                            />
                                            <span
                                                style={{
                                                    color: obj.completed ? '#4ade80' : 'rgba(255, 255, 255, 0.8)',
                                                    textDecoration: obj.completed ? 'line-through' : 'none',
                                                }}
                                            >
                                                {obj.description}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Recompensas e Ação */}
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            gap: '12px',
                                            fontSize: '0.85rem',
                                        }}
                                    >
                                        <span
                                            style={{
                                                background: 'rgba(251, 191, 36, 0.2)',
                                                padding: '4px 10px',
                                                borderRadius: '6px',
                                                color: '#fbbf24',
                                                fontWeight: '600',
                                            }}
                                        >
                                            +{mission.rewards.points} pts
                                        </span>
                                        <span
                                            style={{
                                                background: 'rgba(96, 165, 250, 0.2)',
                                                padding: '4px 10px',
                                                borderRadius: '6px',
                                                color: '#60a5fa',
                                                fontWeight: '600',
                                            }}
                                        >
                                            +{mission.rewards.xp} XP
                                        </span>
                                    </div>

                                    {!isCompleted && !isLocked && (
                                        <button
                                            onClick={() => onStartMission(mission.id)}
                                            style={{
                                                background: isCurrent
                                                    ? 'rgba(102, 126, 234, 0.3)'
                                                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                border: 'none',
                                                borderRadius: '8px',
                                                padding: '8px 16px',
                                                color: 'white',
                                                cursor: 'pointer',
                                                fontSize: '0.85rem',
                                                fontWeight: '600',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                            }}
                                        >
                                            {isCurrent ? 'Em Progresso' : 'Iniciar'}
                                            {!isCurrent && <ChevronRight size={16} />}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
