import { Link } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import { useState } from 'react'

interface SimulatorCardProps {
    title: string
    description: string
    icon: LucideIcon
    path: string
    isNew?: boolean
    gradient: string
}

export function SimulatorCard({ title, description, icon: Icon, path, isNew, gradient }: SimulatorCardProps) {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <Link
            to={path}
            style={{
                textDecoration: 'none',
                position: 'relative',
                display: 'block',
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div style={{
                background: 'rgba(20, 20, 25, 0.6)',
                backdropFilter: 'blur(20px)',
                border: isHovered ? '2px solid rgba(68, 136, 255, 0.5)' : '2px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '24px',
                padding: '40px',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
                boxShadow: isHovered
                    ? '0 20px 60px rgba(68, 136, 255, 0.3), 0 0 80px rgba(68, 136, 255, 0.1)'
                    : '0 8px 32px rgba(0, 0, 0, 0.4)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* Background gradient effect */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: gradient,
                    opacity: isHovered ? 0.15 : 0.05,
                    transition: 'opacity 0.4s ease',
                    pointerEvents: 'none',
                }} />

                {/* New badge */}
                {isNew && (
                    <div style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        background: 'linear-gradient(135deg, #ff6b6b, #ee5a6f)',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        letterSpacing: '0.5px',
                        boxShadow: '0 4px 12px rgba(238, 90, 111, 0.4)',
                    }}>
                        NOVO!
                    </div>
                )}

                {/* Icon */}
                <div style={{
                    marginBottom: '24px',
                    position: 'relative',
                    zIndex: 1,
                }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '20px',
                        background: gradient,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transform: isHovered ? 'rotate(5deg) scale(1.1)' : 'rotate(0) scale(1)',
                        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: isHovered
                            ? '0 12px 24px rgba(68, 136, 255, 0.3)'
                            : '0 4px 12px rgba(0, 0, 0, 0.2)',
                    }}>
                        <Icon size={40} color="white" strokeWidth={2.5} />
                    </div>
                </div>

                {/* Content */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <h2 style={{
                        margin: '0 0 16px 0',
                        fontSize: '2rem',
                        fontWeight: '800',
                        color: 'white',
                        letterSpacing: '-0.02em',
                    }}>
                        {title}
                    </h2>
                    <p style={{
                        margin: 0,
                        fontSize: '1.1rem',
                        lineHeight: '1.6',
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontWeight: '400',
                    }}>
                        {description}
                    </p>
                </div>

                {/* Arrow indicator */}
                <div style={{
                    position: 'absolute',
                    bottom: '30px',
                    right: '30px',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
                    transition: 'all 0.3s ease',
                    opacity: isHovered ? 1 : 0.6,
                }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M7.5 15L12.5 10L7.5 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>
        </Link>
    )
}
