import type { ZoomLevel } from '../data/educational-content'
import { EDUCATIONAL_CONTENT } from '../data/educational-content'
import { X } from 'lucide-react'

interface EducationalPanelProps {
    level: ZoomLevel
    onClose?: () => void
}

export function EducationalPanel({ level, onClose }: EducationalPanelProps) {
    const content = EDUCATIONAL_CONTENT[level]

    return (
        <div style={{
            position: 'fixed',
            top: '30px',
            left: '30px',
            maxWidth: '400px',
            background: 'rgba(15, 15, 20, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '24px',
            color: 'white',
            zIndex: 100,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '16px',
            }}>
                <h2 style={{
                    margin: 0,
                    fontSize: '1.5rem',
                    fontWeight: '800',
                    background: 'linear-gradient(to right, #f093fb, #f5576c)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}>
                    {content.title}
                </h2>
                {onClose && (
                    <button
                        onClick={onClose}
                        style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '6px',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <X size={20} />
                    </button>
                )}
            </div>

            {/* Description */}
            <p style={{
                margin: '0 0 16px 0',
                fontSize: '0.95rem',
                lineHeight: '1.6',
                color: 'rgba(255, 255, 255, 0.8)',
            }}>
                {content.description}
            </p>

            {/* Facts */}
            <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '16px',
            }}>
                {content.facts.map((fact, i) => (
                    <div
                        key={i}
                        style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '10px',
                            marginBottom: i < content.facts.length - 1 ? '10px' : 0,
                            fontSize: '0.85rem',
                            lineHeight: '1.5',
                        }}
                    >
                        <div style={{
                            minWidth: '6px',
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: '#4ade80',
                            marginTop: '6px',
                        }} />
                        <span style={{ color: 'rgba(255, 255, 255, 0.9)' }}>{fact}</span>
                    </div>
                ))}
            </div>

            {/* Base Pairs (only for bases level) */}
            {level === 'bases' && 'pairs' in content && (
                <div style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '16px',
                }}>
                    <div style={{
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        marginBottom: '12px',
                        color: 'rgba(255, 255, 255, 0.7)',
                    }}>
                        PARES DE BASES
                    </div>
                    {content.pairs.map((pair, i) => (
                        <div
                            key={i}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                marginBottom: i < content.pairs.length - 1 ? '12px' : 0,
                            }}
                        >
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: pair.color1,
                                boxShadow: `0 0 15px ${pair.color1}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: '700',
                                fontSize: '1.1rem',
                            }}>
                                {pair.base1.charAt(0)}
                            </div>
                            <div style={{
                                fontSize: '1.2rem',
                                color: 'rgba(255, 255, 255, 0.5)',
                            }}>
                                ↔
                            </div>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: pair.color2,
                                boxShadow: `0 0 15px ${pair.color2}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: '700',
                                fontSize: '1.1rem',
                            }}>
                                {pair.base2.charAt(0)}
                            </div>
                            <div style={{
                                flex: 1,
                                fontSize: '0.75rem',
                                color: 'rgba(255, 255, 255, 0.7)',
                            }}>
                                {pair.rule}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Stats (if available) */}
            {'stats' in content && (
                <div style={{
                    marginTop: '16px',
                    padding: '12px',
                    background: 'rgba(74, 222, 128, 0.1)',
                    border: '1px solid rgba(74, 222, 128, 0.3)',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                }}>
                    <div style={{ fontWeight: '700', marginBottom: '6px', color: '#4ade80' }}>
                        📊 Dados
                    </div>
                    {Object.entries(content.stats).map(([key, value]) => (
                        <div key={key} style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                            • <strong>{key}:</strong> {String(value)}
                        </div>
                    ))}
                </div>
            )}

            {/* Details (if available) */}
            {'details' in content && (
                <div style={{
                    marginTop: '16px',
                    padding: '12px',
                    background: 'rgba(139, 92, 246, 0.1)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                }}>
                    <div style={{ fontWeight: '700', marginBottom: '8px', color: '#8b5cf6' }}>
                        🔬 Detalhes Importantes
                    </div>
                    {Object.entries(content.details).map(([key, value]) => (
                        <div key={key} style={{ 
                            color: 'rgba(255, 255, 255, 0.8)',
                            marginBottom: '4px',
                            paddingLeft: '8px',
                            borderLeft: '2px solid rgba(139, 92, 246, 0.5)',
                        }}>
                            <strong style={{ color: '#c084fc' }}>{key}:</strong> {String(value)}
                        </div>
                    ))}
                </div>
            )}

            {/* Process indicator for molecular processes */}
            {(level === 'replication' || level === 'transcription' || level === 'translation') && (
                <div style={{
                    marginTop: '16px',
                    padding: '12px',
                    background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.1) 0%, rgba(34, 211, 238, 0.1) 100%)',
                    border: '1px solid rgba(74, 222, 128, 0.3)',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    textAlign: 'center',
                }}>
                    <div style={{ color: '#4ade80', fontWeight: '600' }}>
                        🎬 Animação Interativa
                    </div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.7)', marginTop: '4px' }}>
                        Use os controles abaixo para pausar, ajustar a velocidade e navegar entre processos
                    </div>
                </div>
            )}
        </div>
    )
}
