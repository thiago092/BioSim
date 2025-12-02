import { useState } from 'react'
import { HelpCircle, X } from 'lucide-react'

interface InfoPanelProps {
    mode: string
}

const glossary = [
    { term: 'Cromossomo', definition: 'Estrutura que contém DNA e proteínas, carregando informação genética.' },
    { term: 'Centríolo', definition: 'Organela que ajuda a organizar as fibras do fuso durante a divisão celular.' },
    { term: 'Citocinese', definition: 'Divisão do citoplasma para formar duas células distintas.' },
    { term: 'Meiose', definition: 'Divisão celular que produz células sexuais (gametas) com metade dos cromossomos.' },
    { term: 'Crossing-Over', definition: 'Troca de segmentos de DNA entre cromossomos homólogos, aumentando variabilidade genética.' },
    { term: 'Haploide', definition: 'Célula com metade do número de cromossomos (n), como gametas.' },
    { term: 'Diploide', definition: 'Célula com número completo de cromossomos pareados (2n).' },
    { term: 'Cromatina', definition: 'Complexo de DNA e proteínas que forma os cromossomos.' },
    { term: 'Fuso Mitótico', definition: 'Estrutura de microtúbulos que separa os cromossomos durante a divisão.' },
    { term: 'Telófase', definition: 'Fase final da mitose onde os núcleos se formam.' },
]

const facts = [
    '🧬 O corpo humano realiza cerca de 2 trilhões de divisões celulares por dia!',
    '⏱️ Uma célula humana típica leva cerca de 24 horas para completar o ciclo celular.',
    '🔬 A fase S (síntese de DNA) pode durar de 6 a 8 horas.',
    '🎯 Erros na divisão celular podem levar a doenças como o câncer.',
    '🌟 Durante a meiose, o crossing-over cria trilhões de combinações genéticas únicas!',
    '📊 Aproximadamente 90% do ciclo celular é gasto na intérfase.',
    '🧪 A mitose produz células idênticas, enquanto a meiose cria diversidade.',
]

export function InfoPanel({ mode }: InfoPanelProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [activeTab, setActiveTab] = useState<'glossary' | 'facts'>('glossary')

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                style={{
                    position: 'absolute',
                    bottom: 200,
                    right: 30,
                    background: 'rgba(68, 136, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(68, 136, 255, 0.3)',
                    borderRadius: '50%',
                    width: '56px',
                    height: '56px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                }}
                title="Informações e Glossário"
            >
                <HelpCircle size={28} />
            </button>
        )
    }

    return (
        <div style={{
            position: 'absolute',
            bottom: 200,
            right: 30,
            width: '350px',
            maxHeight: '500px',
            background: 'rgba(20, 20, 30, 0.95)',
            backdropFilter: 'blur(15px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
        }}>
            {/* Header */}
            <div style={{
                padding: '16px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <h3 style={{
                    margin: 0,
                    fontSize: '1.2rem',
                    fontWeight: '700',
                    color: 'white',
                }}>
                    📚 Recursos
                </h3>
                <button
                    onClick={() => setIsOpen(false)}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'rgba(255, 255, 255, 0.7)',
                        cursor: 'pointer',
                        padding: '4px',
                    }}
                >
                    <X size={20} />
                </button>
            </div>

            {/* Tabs */}
            <div style={{
                display: 'flex',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}>
                <button
                    onClick={() => setActiveTab('glossary')}
                    style={{
                        flex: 1,
                        padding: '12px',
                        background: activeTab === 'glossary' ? 'rgba(68, 136, 255, 0.2)' : 'transparent',
                        border: 'none',
                        borderBottom: activeTab === 'glossary' ? '2px solid #4488ff' : 'none',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                    }}
                >
                    Glossário
                </button>
                <button
                    onClick={() => setActiveTab('facts')}
                    style={{
                        flex: 1,
                        padding: '12px',
                        background: activeTab === 'facts' ? 'rgba(68, 136, 255, 0.2)' : 'transparent',
                        border: 'none',
                        borderBottom: activeTab === 'facts' ? '2px solid #4488ff' : 'none',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                    }}
                >
                    Curiosidades
                </button>
            </div>

            {/* Content */}
            <div style={{
                padding: '16px',
                maxHeight: 'calc(500px - 140px)',
                overflowY: 'auto',
            }}>
                {activeTab === 'glossary' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {glossary.map((item, i) => (
                            <div
                                key={i}
                                style={{
                                    padding: '12px',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    borderRadius: '8px',
                                    borderLeft: '3px solid #4488ff',
                                }}
                            >
                                <div style={{
                                    fontSize: '0.95rem',
                                    fontWeight: '700',
                                    color: '#4488ff',
                                    marginBottom: '4px',
                                }}>
                                    {item.term}
                                </div>
                                <div style={{
                                    fontSize: '0.85rem',
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    lineHeight: 1.4,
                                }}>
                                    {item.definition}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {facts.map((fact, i) => (
                            <div
                                key={i}
                                style={{
                                    padding: '14px',
                                    background: 'rgba(68, 136, 255, 0.1)',
                                    borderRadius: '8px',
                                    fontSize: '0.9rem',
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    lineHeight: 1.5,
                                }}
                            >
                                {fact}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
