import { Star } from 'lucide-react'
import type { PlayerProgress } from '../types/gamification'
import { getPlayerLevel, getXPProgress } from '../types/gamification'

interface PlayerStatsBarProps {
    progress: PlayerProgress
}

export function PlayerStatsBar({ progress }: PlayerStatsBarProps) {
    const level = getPlayerLevel(progress.xp)
    const xpProgress = getXPProgress(progress.xp)
    const nextLevel = level.level < 5 ? level.maxXP : null

    return (
        <div style={{
            position: 'fixed',
            top: '30px',
            left: '200px',
            background: 'rgba(15, 15, 20, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '8px 12px',
            color: 'white',
            zIndex: 150,
            minWidth: '180px',
            maxWidth: '200px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            transition: 'all 0.3s ease',
        }}>
            {/* Nível e Nome */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
            }}>
                <div>
                    <div style={{
                        fontSize: '0.65rem',
                        color: 'rgba(255, 255, 255, 0.6)',
                        marginBottom: '2px',
                    }}>
                        Nível {level.level}
                    </div>
                    <div style={{
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        color: level.color,
                    }}>
                        {level.name}
                    </div>
                </div>

                {/* Pontos */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: 'rgba(251, 191, 36, 0.15)',
                    padding: '4px 8px',
                    borderRadius: '6px',
                }}>
                    <Star size={12} color="#fbbf24" fill="#fbbf24" />
                    <span style={{ fontWeight: '700', color: '#fbbf24', fontSize: '0.8rem' }}>
                        {progress.points}
                    </span>
                </div>
            </div>

            {/* Barra de XP */}
            <div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '4px',
                    fontSize: '0.65rem',
                    color: 'rgba(255, 255, 255, 0.7)',
                }}>
                    <span>XP: {progress.xp}</span>
                    {nextLevel && <span>Próx: {nextLevel}</span>}
                </div>
                <div style={{
                    height: '5px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '3px',
                    overflow: 'hidden',
                }}>
                    <div style={{
                        height: '100%',
                        width: `${xpProgress}%`,
                        background: `linear-gradient(90deg, ${level.color}, ${level.color}dd)`,
                        transition: 'width 0.5s ease',
                        boxShadow: `0 0 10px ${level.color}`,
                    }} />
                </div>
            </div>

            {/* Estatísticas Rápidas */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '6px',
                marginTop: '8px',
                fontSize: '0.65rem',
            }}>
                <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '4px 6px',
                    borderRadius: '4px',
                }}>
                    <div style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Experimentos</div>
                    <div style={{ fontWeight: '700', color: '#60a5fa', fontSize: '0.75rem' }}>
                        {progress.stats.totalExperiments}
                    </div>
                </div>
                <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    padding: '4px 6px',
                    borderRadius: '4px',
                }}>
                    <div style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Descendentes</div>
                    <div style={{ fontWeight: '700', color: '#4ade80', fontSize: '0.75rem' }}>
                        {progress.stats.totalOffspring}
                    </div>
                </div>
            </div>
        </div>
    )
}
