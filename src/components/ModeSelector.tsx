import { useState } from 'react'
import type { ModeLevel } from '../types'
import { MODE_NAMES } from '../types'

interface ModeSelectorProps {
    currentMode: ModeLevel
    onModeChange: (mode: ModeLevel) => void
}

export function ModeSelector({ currentMode, onModeChange }: ModeSelectorProps) {
    const [isOpen, setIsOpen] = useState(false)

    const modes: ModeLevel[] = ['basic', 'intermediate', 'advanced']

    return (
        <div style={{
            position: 'absolute',
            top: 120,
            left: 30,
            zIndex: 100,
        }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    background: 'rgba(20, 20, 30, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '12px 20px',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'all 0.3s ease',
                    minWidth: '280px',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.border = '1px solid rgba(68, 136, 255, 0.5)'
                    e.currentTarget.style.background = 'rgba(30, 30, 50, 0.95)'
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.1)'
                    e.currentTarget.style.background = 'rgba(20, 20, 30, 0.9)'
                }}
            >
                <span>📚</span>
                <span style={{ flex: 1, textAlign: 'left' }}>{MODE_NAMES[currentMode]}</span>
                <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>{isOpen ? '▲' : '▼'}</span>
            </button>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '60px',
                    left: 0,
                    background: 'rgba(20, 20, 30, 0.95)',
                    backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    minWidth: '280px',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
                }}>
                    {modes.map((mode) => (
                        <button
                            key={mode}
                            onClick={() => {
                                onModeChange(mode)
                                setIsOpen(false)
                            }}
                            style={{
                                width: '100%',
                                padding: '15px 20px',
                                background: currentMode === mode ? 'rgba(68, 136, 255, 0.2)' : 'transparent',
                                border: 'none',
                                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                                color: 'white',
                                fontSize: '0.95rem',
                                fontWeight: currentMode === mode ? '700' : '500',
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(68, 136, 255, 0.15)'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = currentMode === mode ? 'rgba(68, 136, 255, 0.2)' : 'transparent'
                            }}
                        >
                            {currentMode === mode && <span>✓</span>}
                            <span>{MODE_NAMES[mode]}</span>
                        </button>
                    ))}
                    <div style={{
                        padding: '12px 20px',
                        fontSize: '0.8rem',
                        color: 'rgba(255, 255, 255, 0.5)',
                        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                    }}>
                        💡 Escolha o nível de detalhamento
                    </div>
                </div>
            )}
        </div>
    )
}
