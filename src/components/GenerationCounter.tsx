import { Infinity, Pause, RotateCcw, TrendingUp } from 'lucide-react'

interface GenerationCounterProps {
    generation: number
    totalCells: number
    isContinuousMode: boolean
    onToggleContinuous: () => void
    onReset: () => void
}

export function GenerationCounter({
    generation,
    totalCells,
    isContinuousMode,
    onToggleContinuous,
    onReset
}: GenerationCounterProps) {
    const predictions = [
        { gen: 1, cells: 2, time: '24h', description: '1 célula inicial' },
        { gen: 2, cells: 4, time: '48h', description: '1ª divisão completa' },
        { gen: 3, cells: 8, time: '72h', description: '2ª divisão completa' },
        { gen: 4, cells: 16, time: '96h', description: '3ª divisão completa' },
        { gen: 5, cells: 32, time: '120h', description: '4ª divisão completa' },
        { gen: 10, cells: 1024, time: '10 dias', description: 'Crescimento exponencial' },
    ]

    return (
        <div style={{
            position: 'absolute',
            bottom: 30,
            right: 30,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            minWidth: '280px',
        }}>
            {/* Contador principal */}
            <div style={{
                background: 'rgba(20, 20, 30, 0.95)',
                backdropFilter: 'blur(15px)',
                border: '2px solid rgba(68, 136, 255, 0.3)',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '16px',
                }}>
                    <TrendingUp size={24} style={{ color: '#4488ff' }} />
                    <div>
                        <div style={{
                            fontSize: '0.85rem',
                            color: 'rgba(255, 255, 255, 0.7)',
                            marginBottom: '2px',
                        }}>
                            Multiplicação Celular
                        </div>
                        <div style={{
                            fontSize: '1.5rem',
                            fontWeight: '700',
                            background: 'linear-gradient(to right, #4488ff, #00ffff)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            Geração {generation}
                        </div>
                    </div>
                </div>

                {/* Células totais */}
                <div style={{
                    background: 'rgba(68, 136, 255, 0.15)',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '16px',
                }}>
                    <div style={{
                        fontSize: '0.8rem',
                        color: 'rgba(255, 255, 255, 0.6)',
                        marginBottom: '8px',
                    }}>
                        Total de Células
                    </div>
                    <div style={{
                        fontSize: '2.5rem',
                        fontWeight: '800',
                        color: '#00ffff',
                        textAlign: 'center',
                        fontFamily: 'monospace',
                    }}>
                        {totalCells.toLocaleString()}
                    </div>
                    {generation > 0 && (
                        <div style={{
                            fontSize: '0.75rem',
                            color: 'rgba(100, 255, 100, 0.8)',
                            textAlign: 'center',
                            marginTop: '8px',
                        }}>
                            ↑ 2^{generation} = {Math.pow(2, generation)} células
                        </div>
                    )}
                </div>

                {/* Controles */}
                <div style={{
                    display: 'flex',
                    gap: '8px',
                }}>
                    <button
                        onClick={onToggleContinuous}
                        style={{
                            flex: 1,
                            padding: '12px',
                            background: isContinuousMode
                                ? 'linear-gradient(135deg, #ff4444, #ff8844)'
                                : 'linear-gradient(135deg, #4488ff, #00ffff)',
                            border: 'none',
                            borderRadius: '10px',
                            color: 'white',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            fontSize: '0.9rem',
                            transition: 'all 0.3s',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)'
                        }}
                    >
                        {isContinuousMode ? (
                            <>
                                <Pause size={18} />
                                Parar Ciclo
                            </>
                        ) : (
                            <>
                                <Infinity size={18} />
                                Ciclo Contínuo
                            </>
                        )}
                    </button>

                    <button
                        onClick={onReset}
                        style={{
                            padding: '12px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: '10px',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        title="Resetar"
                    >
                        <RotateCcw size={18} />
                    </button>
                </div>
            </div>

            {/* Tabela de previsão */}
            {generation > 0 && (
                <div style={{
                    background: 'rgba(20, 20, 30, 0.95)',
                    backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px',
                    padding: '16px',
                    maxHeight: '200px',
                    overflowY: 'auto',
                }}>
                    <div style={{
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        color: 'rgba(255, 255, 255, 0.9)',
                        marginBottom: '12px',
                    }}>
                        📊 Progressão Exponencial
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                    }}>
                        {predictions.map((pred) => (
                            <div
                                key={pred.gen}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '8px',
                                    background: generation >= pred.gen
                                        ? 'rgba(100, 255, 100, 0.1)'
                                        : 'rgba(255, 255, 255, 0.05)',
                                    borderRadius: '6px',
                                    fontSize: '0.75rem',
                                    borderLeft: generation >= pred.gen
                                        ? '3px solid #00ff00'
                                        : '3px solid transparent',
                                }}
                            >
                                <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                    Gen {pred.gen}
                                </span>
                                <span style={{
                                    color: generation >= pred.gen ? '#00ffff' : 'rgba(255, 255, 255, 0.5)',
                                    fontWeight: '600',
                                }}>
                                    {pred.cells.toLocaleString()} células
                                </span>
                            </div>
                        ))}
                    </div>

                    {generation >= 5 && (
                        <div style={{
                            marginTop: '12px',
                            padding: '12px',
                            background: 'rgba(255, 200, 0, 0.1)',
                            border: '1px solid rgba(255, 200, 0, 0.3)',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            color: 'rgba(255, 200, 0, 0.9)',
                            lineHeight: 1.4,
                        }}>
                            ⚡ <strong>Crescimento Exponencial!</strong><br />
                            Em {generation} gerações: {totalCells.toLocaleString()} células formadas
                        </div>
                    )}
                </div>
            )}

            {/* Indicador de ciclo ativo */}
            {isContinuousMode && (
                <div style={{
                    background: 'rgba(100, 255, 100, 0.1)',
                    border: '1px solid rgba(100, 255, 100, 0.3)',
                    borderRadius: '12px',
                    padding: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                }}>
                    <div style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: '#00ff00',
                        animation: 'pulse 1.5s infinite',
                    }} />
                    <span style={{
                        fontSize: '0.85rem',
                        color: 'rgba(100, 255, 100, 0.9)',
                        fontWeight: '600',
                    }}>
                        Multiplicação em andamento...
                    </span>
                </div>
            )}

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 0.4; transform: scale(0.9); }
                    50% { opacity: 1; transform: scale(1.1); }
                }
            `}</style>
        </div>
    )
}
