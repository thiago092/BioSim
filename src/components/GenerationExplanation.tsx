import { useState } from 'react'
import { X, Minimize2 } from 'lucide-react'
import type { ModeLevel } from '../types'

interface GenerationExplanationProps {
    generation: number
    totalCells?: number
    mode?: ModeLevel
    onClose?: () => void
}

const explanations: Record<number, { title: string; text: string; icon: string }> = {
    0: {
        title: 'Célula Inicial',
        text: 'Uma única célula pronta para iniciar o processo de divisão celular.',
        icon: '🔬'
    },
    1: {
        title: '1ª Divisão Completa',
        text: 'A célula original se dividiu em 2 células-filhas idênticas através da mitose!',
        icon: '➗'
    },
    2: {
        title: '2ª Geração',
        text: 'Cada uma das 2 células se dividiu novamente, resultando em 4 células totais.',
        icon: '🔄'
    },
    3: {
        title: '3ª Geração',
        text: 'Crescimento exponencial continua! Agora temos 8 células, todas com o mesmo DNA.',
        icon: '📈'
    },
    4: {
        title: '4ª Geração',
        text: '16 células! O corpo humano realiza bilhões dessas divisões continuamente.',
        icon: '⚡'
    },
    5: {
        title: '5ª Geração - Exponencial!',
        text: '32 células formadas! Esse é o método que permite o crescimento de tecidos e órgãos.',
        icon: '🌟'
    },
    6: {
        title: 'Crescimento Tecidual',
        text: '64 células! Assim se formam tecidos complexos como pele, músculo e nervos.',
        icon: '🧬'
    },
    7: {
        title: 'Formação de Órgãos',
        text: '128 células! Grupos especializados de células formam órgãos funcionais.',
        icon: '💪'
    },
    8: {
        title: 'Sistema Biológico',
        text: '256 células! Múltiplos órgãos trabalham juntos formando sistemas complexos.',
        icon: '🫀'
    },
    9: {
        title: 'Organismo Completo',
        text: '512 células! De uma célula a um organismo multicelular complexo!',
        icon: '👤'
    },
    10: {
        title: 'Máximo Alcançado!',
        text: '1.024 células visualizadas! O corpo humano tem cerca de 37 trilhões de células.',
        icon: '🎉'
    },
}

export function GenerationExplanation({ generation, totalCells, mode = 'basic', onClose }: GenerationExplanationProps) {
    const [isMinimized, setIsMinimized] = useState(false)

    // Calcula total se não for passado
    const count = totalCells ?? Math.pow(2, generation)

    if (generation === 0) return null

    const explanation = explanations[generation] || explanations[10]

    if (isMinimized) {
        return (
            <div style={{
                position: 'absolute',
                bottom: 30,
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(10, 10, 20, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(68, 136, 255, 0.5)',
                borderRadius: '50px',
                padding: '12px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                zIndex: 1000,
            }}
                onClick={() => setIsMinimized(false)}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(-50%) scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(-50%) scale(1)'}
            >
                <span style={{ fontSize: '1.5rem' }}>{explanation.icon}</span>
                <span style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: '#4488ff',
                }}>
                    Geração {generation} - {count.toLocaleString()} células
                </span>
            </div>
        )
    }

    return (
        <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(10, 10, 20, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(68, 136, 255, 0.5)',
            borderRadius: '24px',
            padding: '32px 40px',
            maxWidth: '500px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7)',
            pointerEvents: 'auto',
            animation: 'fadeInScale 0.6s ease-out',
            zIndex: 1000,
        }}>
            {/* Botões de controle */}
            <div style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                display: 'flex',
                gap: '8px',
            }}>
                <button
                    onClick={() => setIsMinimized(true)}
                    style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                    }}
                    title="Minimizar"
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                >
                    <Minimize2 size={16} />
                </button>

                {onClose && (
                    <button
                        onClick={onClose}
                        style={{
                            background: 'rgba(255, 100, 100, 0.2)',
                            border: '1px solid rgba(255, 100, 100, 0.3)',
                            borderRadius: '8px',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                        }}
                        title="Fechar"
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 100, 100, 0.3)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 100, 100, 0.2)'}
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* Ícone grande */}
            <div style={{
                fontSize: '4rem',
                textAlign: 'center',
                marginBottom: '16px',
                animation: 'bounce 1s ease-in-out',
            }}>
                {explanation.icon}
            </div>

            {/* Título */}
            <h2 style={{
                margin: '0 0 16px 0',
                fontSize: '1.8rem',
                fontWeight: '800',
                textAlign: 'center',
                background: 'linear-gradient(135deg, #4488ff, #00ffff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
            }}>
                {explanation.title}
            </h2>

            {/* Texto explicativo */}
            <p style={{
                margin: '0 0 24px 0',
                fontSize: '1.1rem',
                lineHeight: 1.6,
                color: 'rgba(255, 255, 255, 0.9)',
                textAlign: 'center',
            }}>
                {explanation.text}
            </p>

            {/* Estatísticas */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                padding: '20px',
                background: 'rgba(68, 136, 255, 0.1)',
                borderRadius: '16px',
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        fontSize: '0.8rem',
                        color: 'rgba(255, 255, 255, 0.6)',
                        marginBottom: '4px',
                    }}>
                        Geração
                    </div>
                    <div style={{
                        fontSize: '2rem',
                        fontWeight: '800',
                        color: '#4488ff',
                    }}>
                        {generation}
                    </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        fontSize: '0.8rem',
                        color: 'rgba(255, 255, 255, 0.6)',
                        marginBottom: '4px',
                    }}>
                        Total de Células
                    </div>
                    <div style={{
                        fontSize: '2rem',
                        fontWeight: '800',
                        color: '#00ffff',
                    }}>
                        {count.toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Fórmula */}
            <div style={{
                marginTop: '20px',
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                textAlign: 'center',
            }}>
                <div style={{
                    fontSize: '0.9rem',
                    color: 'rgba(255, 255, 255, 0.7)',
                    marginBottom: '8px',
                }}>
                    Fórmula do Crescimento Exponencial
                </div>
                <div style={{
                    fontSize: '1.3rem',
                    fontWeight: '600',
                    fontFamily: 'monospace',
                    color: '#00ffaa',
                }}>
                    2^{generation} = {count.toLocaleString()}
                </div>
            </div>

            <style>{`
            @keyframes fadeInScale {
                from {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.8);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
            }

            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-20px); }
            }
        `}</style>
        </div>
    )
}
