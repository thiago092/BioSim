import { useState } from 'react'
import { Trophy, Lock, Star } from 'lucide-react'
import { ACHIEVEMENTS } from '../data/gamification-data'

interface AchievementsPanelProps {
    unlockedAchievements: string[]
}

export function AchievementsPanel({ unlockedAchievements }: AchievementsPanelProps) {
    const [isOpen, setIsOpen] = useState(false)

    const unlockedCount = unlockedAchievements.length
    const totalCount = ACHIEVEMENTS.length

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                style={{
                    position: 'fixed',
                    right: '30px',
                    bottom: '30px',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    boxShadow: '0 8px 24px rgba(245, 158, 11, 0.4)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    zIndex: 150,
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)'
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(245, 158, 11, 0.6)'
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(245, 158, 11, 0.4)'
                }}
            >
                <Trophy size={24} />
                <span style={{ fontSize: '0.7rem', fontWeight: '700', marginTop: '2px' }}>
                    {unlockedCount}/{totalCount}
                </span>
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
                    maxWidth: '800px',
                    maxHeight: '80vh',
                    background: 'rgba(15, 15, 20, 0.98)',
                    backdropFilter: 'blur(30px)',
                    border: '2px solid rgba(245, 158, 11, 0.4)',
                    borderRadius: '24px',
                    padding: '32px',
                    color: 'white',
                    overflowY: 'auto',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '24px',
                }}>
                    <div>
                        <h2 style={{
                            margin: 0,
                            fontSize: '2rem',
                            fontWeight: '800',
                            background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            🏆 Conquistas
                        </h2>
                        <p style={{
                            margin: '8px 0 0 0',
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: '0.9rem',
                        }}>
                            {unlockedCount} de {totalCount} desbloqueadas
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

                {/* Progress Bar */}
                <div style={{ marginBottom: '24px' }}>
                    <div style={{
                        height: '8px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '4px',
                        overflow: 'hidden',
                    }}>
                        <div style={{
                            height: '100%',
                            width: `${(unlockedCount / totalCount) * 100}%`,
                            background: 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)',
                            transition: 'width 0.5s ease',
                        }} />
                    </div>
                </div>

                {/* Achievements Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                    gap: '16px',
                }}>
                    {ACHIEVEMENTS.map((achievement) => {
                        const isUnlocked = unlockedAchievements.includes(achievement.id)

                        return (
                            <div
                                key={achievement.id}
                                style={{
                                    background: isUnlocked
                                        ? 'rgba(245, 158, 11, 0.1)'
                                        : 'rgba(255, 255, 255, 0.03)',
                                    border: `2px solid ${isUnlocked ? 'rgba(245, 158, 11, 0.3)' : 'rgba(255, 255, 255, 0.1)'
                                        }`,
                                    borderRadius: '16px',
                                    padding: '20px',
                                    opacity: isUnlocked ? 1 : 0.5,
                                    position: 'relative',
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                {/* Icon */}
                                <div style={{
                                    fontSize: '3rem',
                                    textAlign: 'center',
                                    marginBottom: '12px',
                                    filter: isUnlocked ? 'none' : 'grayscale(100%)',
                                }}>
                                    {achievement.icon}
                                </div>

                                {/* Lock overlay */}
                                {!isUnlocked && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '16px',
                                        right: '16px',
                                    }}>
                                        <Lock size={20} color="#94a3b8" />
                                    </div>
                                )}

                                {/* Title */}
                                <h3 style={{
                                    margin: '0 0 8px 0',
                                    fontSize: '1.1rem',
                                    fontWeight: '700',
                                    textAlign: 'center',
                                    color: isUnlocked ? '#fbbf24' : 'rgba(255, 255, 255, 0.6)',
                                }}>
                                    {achievement.title}
                                </h3>

                                {/* Description */}
                                <p style={{
                                    margin: '0 0 12px 0',
                                    fontSize: '0.85rem',
                                    color: 'rgba(255, 255, 255, 0.7)',
                                    textAlign: 'center',
                                    lineHeight: '1.4',
                                }}>
                                    {achievement.description}
                                </p>

                                {/* Points */}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '6px',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    color: isUnlocked ? '#fbbf24' : 'rgba(255, 255, 255, 0.5)',
                                }}>
                                    <Star size={14} fill={isUnlocked ? '#fbbf24' : 'none'} />
                                    {achievement.points} pontos
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
