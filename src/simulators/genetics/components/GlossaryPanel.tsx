import { useState } from 'react'
import { BookOpen, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { GENETICS_CONCEPTS } from '../data/educational-concepts'

export function GlossaryPanel() {
    const [isOpen, setIsOpen] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')

    const filteredConcepts = GENETICS_CONCEPTS.filter(concept =>
        concept.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        concept.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const currentConcept = filteredConcepts[currentIndex] || GENETICS_CONCEPTS[0]

    const nextConcept = () => {
        setCurrentIndex((prev) => (prev + 1) % filteredConcepts.length)
    }

    const prevConcept = () => {
        setCurrentIndex((prev) => (prev - 1 + filteredConcepts.length) % filteredConcepts.length)
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                style={{
                    position: 'fixed',
                    bottom: '30px',
                    right: '30px',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    zIndex: 1000,
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)'
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(102, 126, 234, 0.6)'
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.4)'
                }}
            >
                <BookOpen size={28} />
            </button>
        )
    }

    return (
        <div style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            width: '450px',
            maxHeight: '600px',
            background: 'rgba(15, 15, 20, 0.98)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(102, 126, 234, 0.3)',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
            color: 'white',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
        }}>
            {/* Header */}
            <div style={{
                padding: '20px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <BookOpen size={24} />
                    <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '700' }}>
                        Glossário de Genética
                    </h2>
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    style={{
                        background: 'rgba(255, 255, 255, 0.2)',
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
            </div>

            {/* Search */}
            <div style={{ padding: '16px' }}>
                <input
                    type="text"
                    placeholder="🔍 Buscar conceito..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value)
                        setCurrentIndex(0)
                    }}
                    style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: 'white',
                        fontSize: '0.95rem',
                        outline: 'none',
                    }}
                />
            </div>

            {/* Content */}
            <div style={{
                flex: 1,
                padding: '20px',
                overflowY: 'auto',
            }}>
                <div style={{
                    textAlign: 'center',
                    fontSize: '4rem',
                    marginBottom: '16px',
                }}>
                    {currentConcept.icon}
                </div>

                <h3 style={{
                    margin: '0 0 16px 0',
                    fontSize: '1.5rem',
                    fontWeight: '800',
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #667eea 0%, #f093fb 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}>
                    {currentConcept.title}
                </h3>

                <div style={{
                    background: 'rgba(102, 126, 234, 0.1)',
                    border: '1px solid rgba(102, 126, 234, 0.3)',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '16px',
                }}>
                    <div style={{
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: '#667eea',
                        marginBottom: '8px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                    }}>
                        Definição
                    </div>
                    <p style={{
                        margin: 0,
                        fontSize: '0.95rem',
                        lineHeight: '1.6',
                        color: 'rgba(255, 255, 255, 0.9)',
                    }}>
                        {currentConcept.description}
                    </p>
                </div>

                <div style={{
                    background: 'rgba(240, 147, 251, 0.1)',
                    border: '1px solid rgba(240, 147, 251, 0.3)',
                    borderRadius: '12px',
                    padding: '16px',
                }}>
                    <div style={{
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: '#f093fb',
                        marginBottom: '8px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                    }}>
                        💡 Exemplo Prático
                    </div>
                    <p style={{
                        margin: 0,
                        fontSize: '0.95rem',
                        lineHeight: '1.6',
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontStyle: 'italic',
                    }}>
                        {currentConcept.example}
                    </p>
                </div>
            </div>

            {/* Navigation */}
            <div style={{
                padding: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <button
                    onClick={prevConcept}
                    disabled={filteredConcepts.length <= 1}
                    style={{
                        background: 'rgba(102, 126, 234, 0.2)',
                        border: '1px solid rgba(102, 126, 234, 0.3)',
                        borderRadius: '10px',
                        padding: '10px 16px',
                        color: 'white',
                        cursor: filteredConcepts.length <= 1 ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        opacity: filteredConcepts.length <= 1 ? 0.5 : 1,
                    }}
                >
                    <ChevronLeft size={18} />
                    Anterior
                </button>

                <div style={{
                    fontSize: '0.85rem',
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontWeight: '600',
                }}>
                    {currentIndex + 1} / {filteredConcepts.length}
                </div>

                <button
                    onClick={nextConcept}
                    disabled={filteredConcepts.length <= 1}
                    style={{
                        background: 'rgba(102, 126, 234, 0.2)',
                        border: '1px solid rgba(102, 126, 234, 0.3)',
                        borderRadius: '10px',
                        padding: '10px 16px',
                        color: 'white',
                        cursor: filteredConcepts.length <= 1 ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        opacity: filteredConcepts.length <= 1 ? 0.5 : 1,
                    }}
                >
                    Próximo
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    )
}
