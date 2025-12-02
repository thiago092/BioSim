import { Microscope, Dna, Sparkles, Search, Globe } from 'lucide-react'
import { SimulatorCard } from '../shared/components/SimulatorCard'

export function HomePage() {
    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Animated background particles */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle at 20% 50%, rgba(68, 136, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(138, 43, 226, 0.08) 0%, transparent 50%), radial-gradient(circle at 50% 20%, rgba(34, 197, 94, 0.06) 0%, transparent 40%)',
                pointerEvents: 'none',
            }} />

            {/* Glow effects */}
            <div style={{
                position: 'absolute',
                top: '-10%',
                right: '-5%',
                width: '500px',
                height: '500px',
                background: 'radial-gradient(circle, rgba(68, 136, 255, 0.15) 0%, transparent 70%)',
                filter: 'blur(60px)',
                pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-10%',
                left: '-5%',
                width: '500px',
                height: '500px',
                background: 'radial-gradient(circle, rgba(138, 43, 226, 0.1) 0%, transparent 70%)',
                filter: 'blur(60px)',
                pointerEvents: 'none',
            }} />

            <div style={{
                position: 'relative',
                zIndex: 1,
                maxWidth: '1400px',
                margin: '0 auto',
                padding: '40px 20px',
            }}>
                {/* Header */}
                <header style={{
                    textAlign: 'center',
                    marginBottom: '50px',
                    animation: 'fadeInDown 0.8s ease-out',
                }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '20px',
                        padding: '8px 20px',
                        background: 'rgba(68, 136, 255, 0.1)',
                        borderRadius: '30px',
                        border: '1px solid rgba(68, 136, 255, 0.3)',
                    }}>
                        <Sparkles size={20} color="#4488ff" />
                        <span style={{
                            color: '#4488ff',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            letterSpacing: '0.5px',
                        }}>
                            PLATAFORMA EDUCACIONAL
                        </span>
                    </div>

                    <h1 style={{
                        margin: '0 0 24px 0',
                        fontSize: 'clamp(2.5rem, 8vw, 5rem)',
                        fontWeight: '900',
                        background: 'linear-gradient(135deg, #fff 0%, #4488ff 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '-0.03em',
                        lineHeight: '1.1',
                    }}>
                        BioSim
                    </h1>

                    <p style={{
                        margin: '0 auto 20px auto',
                        fontSize: '1.5rem',
                        color: 'rgba(255, 255, 255, 0.8)',
                        maxWidth: '700px',
                        fontWeight: '400',
                        lineHeight: '1.6',
                    }}>
                        Explore ciências através de simulações interativas em 3D
                    </p>

                    <p style={{
                        margin: 0,
                        fontSize: '1.1rem',
                        color: 'rgba(255, 255, 255, 0.5)',
                        fontWeight: '500',
                    }}>
                        Por <span style={{
                            background: 'linear-gradient(to right, #4488ff, #00ffff)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontWeight: '700'
                        }}>Professora Anayram Martins</span> 📱 @anayrammartins
                    </p>
                </header>

                {/* Simulators Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '32px',
                    animation: 'fadeInUp 0.8s ease-out 0.2s both',
                }}>
                    <SimulatorCard
                        title="Divisão Celular"
                        description="Explore mitose e meiose em detalhes com visualização 3D interativa. Aprenda sobre as fases da divisão celular de forma visual e intuitiva."
                        icon={Microscope}
                        path="/cell-division"
                        gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    />

                    <SimulatorCard
                        title="Genética Mendeliana"
                        description="Descubra os experimentos de Mendel com ervilhas. Cruze plantas, analise proporções fenotípicas e genotípicas com o Quadro de Punnett interativo."
                        icon={Dna}
                        path="/genetics"
                        gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                    />

                    <SimulatorCard
                        title="DNA Explorer"
                        description="Navegue pela estrutura do DNA em múltiplos níveis de zoom. Visualize replicação, transcrição e tradução em animações 3D detalhadas."
                        icon={Search}
                        path="/dna"
                        gradient="linear-gradient(135deg, #22c55e 0%, #059669 100%)"
                    />

                    <SimulatorCard
                        title="Sistema Solar"
                        description="Viaje pelo Sistema Solar! Veja os 8 planetas orbitando o Sol, explore dados de cada planeta e aprenda sobre astronomia."
                        icon={Globe}
                        path="/solar-system"
                        isNew={true}
                        gradient="linear-gradient(135deg, #fdb813 0%, #ff6b00 100%)"
                    />
                </div>

                {/* Recursos de cada simulador */}
                <div style={{
                    marginTop: '80px',
                    animation: 'fadeIn 1s ease-out 0.4s both',
                }}>
                    <h2 style={{
                        textAlign: 'center',
                        fontSize: '2rem',
                        fontWeight: '800',
                        color: 'white',
                        marginBottom: '40px'
                    }}>
                        🔬 O que você vai aprender
                    </h2>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '24px',
                    }}>
                        {/* Divisão Celular */}
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.05))',
                            border: '1px solid rgba(102, 126, 234, 0.2)',
                            borderRadius: '16px',
                            padding: '24px',
                        }}>
                            <h3 style={{ color: '#667eea', fontSize: '1.1rem', fontWeight: '700', marginTop: 0, marginBottom: '16px' }}>
                                🔬 Divisão Celular
                            </h3>
                            <ul style={{ margin: 0, padding: '0 0 0 20px', color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', lineHeight: '1.8' }}>
                                <li>Mitose completa com subfases</li>
                                <li>Meiose I e II</li>
                                <li>Visualização de cromossomos 3D</li>
                                <li>Crossing-over animado</li>
                                <li>Múltiplas gerações</li>
                            </ul>
                        </div>

                        {/* Genética */}
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(240, 147, 251, 0.1), rgba(245, 87, 108, 0.05))',
                            border: '1px solid rgba(240, 147, 251, 0.2)',
                            borderRadius: '16px',
                            padding: '24px',
                        }}>
                            <h3 style={{ color: '#f093fb', fontSize: '1.1rem', fontWeight: '700', marginTop: 0, marginBottom: '16px' }}>
                                🧬 Genética Mendeliana
                            </h3>
                            <ul style={{ margin: 0, padding: '0 0 0 20px', color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', lineHeight: '1.8' }}>
                                <li>7 genes de Mendel</li>
                                <li>Quadro de Punnett interativo</li>
                                <li>Teste Chi-quadrado (χ²)</li>
                                <li>Dados históricos de Mendel</li>
                                <li>Visualização de ervilhas</li>
                            </ul>
                        </div>

                        {/* DNA */}
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(5, 150, 105, 0.05))',
                            border: '1px solid rgba(34, 197, 94, 0.2)',
                            borderRadius: '16px',
                            padding: '24px',
                        }}>
                            <h3 style={{ color: '#22c55e', fontSize: '1.1rem', fontWeight: '700', marginTop: 0, marginBottom: '16px' }}>
                                🔍 DNA Explorer
                            </h3>
                            <ul style={{ margin: 0, padding: '0 0 0 20px', color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', lineHeight: '1.8' }}>
                                <li>Zoom multinível (cromossomo → bases)</li>
                                <li>Replicação do DNA</li>
                                <li>Transcrição (DNA → RNA)</li>
                                <li>Tradução (RNA → Proteína)</li>
                                <li>Animações detalhadas</li>
                            </ul>
                        </div>

                        {/* Sistema Solar */}
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(253, 184, 19, 0.1), rgba(255, 107, 0, 0.05))',
                            border: '1px solid rgba(253, 184, 19, 0.2)',
                            borderRadius: '16px',
                            padding: '24px',
                        }}>
                            <h3 style={{ color: '#fdb813', fontSize: '1.1rem', fontWeight: '700', marginTop: 0, marginBottom: '16px' }}>
                                🌌 Sistema Solar
                            </h3>
                            <ul style={{ margin: 0, padding: '0 0 0 20px', color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', lineHeight: '1.8' }}>
                                <li>8 planetas em órbita 3D</li>
                                <li>Dados reais de cada planeta</li>
                                <li>Anéis de Saturno</li>
                                <li>Cinturão de asteroides</li>
                                <li>Controle de velocidade orbital</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Features */}
                <div style={{
                    marginTop: '100px',
                    textAlign: 'center',
                    animation: 'fadeIn 1s ease-out 0.6s both',
                }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '30px',
                        maxWidth: '1000px',
                        margin: '0 auto',
                    }}>
                        {[
                            { icon: '🎯', title: 'Interativo', desc: 'Aprenda fazendo e experimentando' },
                            { icon: '🔬', title: 'Científico', desc: 'Baseado em conceitos reais' },
                            { icon: '🎨', title: 'Visual', desc: 'Gráficos 3D de alta qualidade' },
                            { icon: '📚', title: 'Educativo', desc: 'Explicações claras e didáticas' },
                        ].map((feature, i) => (
                            <div key={i} style={{
                                padding: '30px',
                                background: 'rgba(255, 255, 255, 0.03)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: '16px',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                            }}>
                                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{feature.icon}</div>
                                <h3 style={{
                                    margin: '0 0 8px 0',
                                    fontSize: '1.2rem',
                                    color: 'white',
                                    fontWeight: '700',
                                }}>
                                    {feature.title}
                                </h3>
                                <p style={{
                                    margin: 0,
                                    fontSize: '0.95rem',
                                    color: 'rgba(255, 255, 255, 0.6)',
                                }}>
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>
                {`
          @keyframes fadeInDown {
            from {
              opacity: 0;
              transform: translateY(-30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        `}
            </style>
        </div>
    )
}
