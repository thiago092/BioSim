import { useState } from 'react'
import { Lightbulb, X, ArrowRight } from 'lucide-react'

interface TutorialStep {
    title: string
    description: string
    tip: string
    action?: string
}

const TUTORIAL_STEPS: TutorialStep[] = [
    {
        title: '🎯 Bem-vindo ao Simulador de Genética!',
        description: 'Aqui você vai aprender genética mendeliana de forma interativa. Vamos explorar como características são herdadas de pais para filhos.',
        tip: 'Use o mouse para rotacionar a visualização 3D dos cromossomos!',
    },
    {
        title: '🧬 Cromossomos Parentais',
        description: 'Você vê dois cromossomos: um materno (♀️ rosa) e um paterno (♂️ azul). Cada um carrega genes com alelos diferentes.',
        tip: 'As esferas coloridas nos cromossomos representam genes. Passe o mouse sobre elas para ver detalhes!',
    },
    {
        title: '⚙️ Configure o Experimento',
        description: 'No painel direito, você pode ajustar parâmetros como taxa de recombinação e mutação. Também pode escolher quais alelos os pais possuem.',
        tip: 'Comece com valores baixos de mutação (0-5%) para ver padrões mendelianos clássicos.',
        action: 'Configure os alelos parentais',
    },
    {
        title: '🧪 Gere Descendentes',
        description: 'Clique em "Gerar Descendentes" para simular a reprodução. O simulador aplicará as leis de Mendel e mostrará os resultados!',
        tip: 'Gere pelo menos 20 descendentes para ver proporções estatísticas mais precisas.',
        action: 'Clique em "Gerar Descendentes"',
    },
    {
        title: '📊 Analise os Resultados',
        description: 'Observe a lista de descendentes (parte inferior) e as estatísticas (painel esquerdo). Veja genótipos, fenótipos e proporções!',
        tip: 'Para cruzamento Vv x Vv, espere ver aproximadamente 75% fenótipo dominante e 25% recessivo (proporção 3:1).',
    },
    {
        title: '🔬 Experimente!',
        description: 'Agora é sua vez! Mude os parâmetros, teste diferentes combinações de alelos e observe como isso afeta os resultados.',
        tip: 'Use o botão de glossário (📖) no canto inferior direito para aprender mais sobre conceitos genéticos!',
    },
]

interface TutorialPanelProps {
    onComplete?: () => void
}

export function TutorialPanel({ onComplete }: TutorialPanelProps) {
    const [currentStep, setCurrentStep] = useState(0)
    const [isVisible, setIsVisible] = useState(true)

    if (!isVisible) return null

    const step = TUTORIAL_STEPS[currentStep]
    const isLastStep = currentStep === TUTORIAL_STEPS.length - 1

    const handleNext = () => {
        if (isLastStep) {
            setIsVisible(false)
            onComplete?.()
        } else {
            setCurrentStep(prev => prev + 1)
        }
    }

    const handleSkip = () => {
        setIsVisible(false)
        onComplete?.()
    }

    return (
        <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: '600px',
            background: 'rgba(10, 10, 15, 0.98)',
            backdropFilter: 'blur(30px)',
            border: '2px solid rgba(102, 126, 234, 0.4)',
            borderRadius: '24px',
            boxShadow: '0 24px 80px rgba(0, 0, 0, 0.8)',
            color: 'white',
            zIndex: 2000,
            padding: '32px',
            animation: 'fadeIn 0.5s ease-out',
        }}>
            {/* Close button */}
            <button
                onClick={handleSkip}
                style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px',
                    cursor: 'pointer',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <X size={20} />
            </button>

            {/* Progress bar */}
            <div style={{
                width: '100%',
                height: '4px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '2px',
                marginBottom: '24px',
                overflow: 'hidden',
            }}>
                <div style={{
                    width: `${((currentStep + 1) / TUTORIAL_STEPS.length) * 100}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #667eea 0%, #f093fb 100%)',
                    transition: 'width 0.3s ease',
                }} />
            </div>

            {/* Content */}
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{
                    margin: '0 0 16px 0',
                    fontSize: '1.8rem',
                    fontWeight: '800',
                    background: 'linear-gradient(135deg, #667eea 0%, #f093fb 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}>
                    {step.title}
                </h2>

                <p style={{
                    margin: '0 0 20px 0',
                    fontSize: '1.1rem',
                    lineHeight: '1.7',
                    color: 'rgba(255, 255, 255, 0.9)',
                }}>
                    {step.description}
                </p>

                {/* Tip box */}
                <div style={{
                    background: 'rgba(251, 191, 36, 0.1)',
                    border: '1px solid rgba(251, 191, 36, 0.3)',
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'flex',
                    gap: '12px',
                }}>
                    <Lightbulb size={24} color="#fbbf24" style={{ flexShrink: 0 }} />
                    <div>
                        <div style={{
                            fontSize: '0.85rem',
                            fontWeight: '700',
                            color: '#fbbf24',
                            marginBottom: '4px',
                        }}>
                            💡 Dica
                        </div>
                        <div style={{
                            fontSize: '0.95rem',
                            color: 'rgba(255, 255, 255, 0.8)',
                            lineHeight: '1.5',
                        }}>
                            {step.tip}
                        </div>
                    </div>
                </div>

                {step.action && (
                    <div style={{
                        marginTop: '16px',
                        padding: '12px',
                        background: 'rgba(102, 126, 234, 0.15)',
                        border: '1px dashed rgba(102, 126, 234, 0.4)',
                        borderRadius: '10px',
                        fontSize: '0.9rem',
                        color: '#667eea',
                        fontWeight: '600',
                        textAlign: 'center',
                    }}>
                        ▶️ {step.action}
                    </div>
                )}
            </div>

            {/* Navigation */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <div style={{
                    fontSize: '0.9rem',
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontWeight: '600',
                }}>
                    Passo {currentStep + 1} de {TUTORIAL_STEPS.length}
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    {!isLastStep && (
                        <button
                            onClick={handleSkip}
                            style={{
                                padding: '12px 20px',
                                borderRadius: '10px',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                background: 'rgba(255, 255, 255, 0.05)',
                                color: 'rgba(255, 255, 255, 0.7)',
                                cursor: 'pointer',
                                fontSize: '0.95rem',
                                fontWeight: '600',
                            }}
                        >
                            Pular Tutorial
                        </button>
                    )}

                    <button
                        onClick={handleNext}
                        style={{
                            padding: '12px 24px',
                            borderRadius: '10px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '0.95rem',
                            fontWeight: '700',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                        }}
                    >
                        {isLastStep ? 'Começar!' : 'Próximo'}
                        <ArrowRight size={18} />
                    </button>
                </div>
            </div>

            <style>
                {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translate(-50%, -45%);
            }
            to {
              opacity: 1;
              transform: translate(-50%, -50%);
            }
          }
        `}
            </style>
        </div>
    )
}
