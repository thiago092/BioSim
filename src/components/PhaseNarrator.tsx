import type { Phase } from '../types'

interface PhaseNarratorProps {
    phase: Phase
}

const phaseDescriptions: Partial<Record<Phase, string>> = {
    'Intérfase': 'A célula está crescendo e se preparando para a divisão. O DNA está sendo duplicado nesta fase crucial.',
    'Intérfase-G1': 'Fase de crescimento celular intenso. A célula produz proteínas e organelas necessárias para seu funcionamento.',
    'Intérfase-S': 'Síntese de DNA! Cada cromossomo está sendo replicado, formando cromátides irmãs idênticas.',
    'Intérfase-G2': 'Última checagem antes da divisão. A célula verifica se o DNA foi copiado corretamente e se está pronta.',
    'Prófase': 'Os cromossomos começam a condensar-se, tornando-se visíveis. Os centríolos migram para polos opostos.',
    'Prófase-Inicial': 'O DNA compactado começa a formar estruturas visíveis. O envelope nuclear ainda está intacto.',
    'Prófase-Tardia': 'Os cromossomos estão bem visíveis agora! Os centríolos chegaram aos polos da célula.',
    'Prometáfase': 'O envelope nuclear se desfaz! As fibras do fuso começam a se ligar aos cromossomos.',
    'Metáfase': 'Alinhamento perfeito! Todos os cromossomos estão na placa equatorial, presos pelas fibras do fuso.',
    'Anáfase': 'Separação! As cromátides irmãs são puxadas para polos opostos pelas fibras do fuso mitótico.',
    'Anáfase-A': 'As cromátides irmãs se separam, cada uma indo para um polo diferente da célula.',
    'Anáfase-B': 'Os polos celulares se afastam ainda mais, aumentando a distância entre os conjuntos de cromossomos.',
    'Telófase': 'Quase lá! Novos envelopes nucleares se formam ao redor de cada conjunto de cromossomos.',
    'Citocinese': 'Divisão final do citoplasma. Um sulco de clivagem divide a célula em duas células-filhas.',
    'Células-Filhas': 'Divisão completa! Duas células geneticamente idênticas foram criadas com sucesso.'
}

export function PhaseNarrator({ phase }: PhaseNarratorProps) {
    const description = phaseDescriptions[phase] || 'Observe atentamente as mudanças que ocorrem durante esta fase.'

    return (
        <div style={{
            position: 'fixed',
            bottom: 100,
            right: 30,
            maxWidth: '400px',
            background: 'rgba(10, 10, 30, 0.95)',
            backdropFilter: 'blur(15px)',
            border: '2px solid rgba(157, 78, 221, 0.6)',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 20px rgba(157, 78, 221, 0.3)',
            animation: 'narratorFadeIn 0.5s ease-out',
            pointerEvents: 'none'
        }}>
            {/* Ícone de Narração */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '12px'
            }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #9d4edd, #c77dff)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.3rem',
                    animation: 'pulse 2s infinite'
                }}>
                    📖
                </div>
                <div>
                    <div style={{
                        fontSize: '0.75rem',
                        color: 'rgba(255, 255, 255, 0.6)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        fontWeight: '600'
                    }}>
                        Fase Atual
                    </div>
                    <div style={{
                        fontSize: '1.1rem',
                        fontWeight: '800',
                        background: 'linear-gradient(135deg, #c77dff, #e0aaff)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        {phase}
                    </div>
                </div>
            </div>

            {/* Descrição */}
            <div style={{
                fontSize: '0.95rem',
                lineHeight: '1.6',
                color: 'rgba(255, 255, 255, 0.9)',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                paddingTop: '12px'
            }}>
                {description}
            </div>

            <style>{`
                @keyframes narratorFadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes pulse {
                    0%, 100% { 
                        transform: scale(1);
                        opacity: 0.9;
                    }
                    50% { 
                        transform: scale(1.05);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    )
}
