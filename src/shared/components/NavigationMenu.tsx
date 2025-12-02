import { Link, useLocation } from 'react-router-dom'
import { Home, Dna, Microscope, Search, Sparkles } from 'lucide-react'

export function NavigationMenu() {
    const location = useLocation()

    const isActive = (path: string) => location.pathname === path

    const menuItems = [
        { path: '/', icon: Home, label: 'Início', color: '#4488ff' },
        { path: '/cell-division', icon: Microscope, label: 'Divisão Celular', color: '#667eea' },
        { path: '/genetics', icon: Dna, label: 'Genética', color: '#f093fb' },
        { path: '/dna', icon: Search, label: 'DNA Explorer', color: '#22c55e' },
    ]

    const linkStyle = (path: string, color: string) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 18px',
        borderRadius: '12px',
        textDecoration: 'none',
        color: isActive(path) ? '#fff' : 'rgba(255, 255, 255, 0.7)',
        background: isActive(path) ? `${color}30` : 'transparent',
        border: isActive(path) ? `1px solid ${color}60` : '1px solid transparent',
        fontWeight: isActive(path) ? '600' : '500',
        fontSize: '0.9rem',
        transition: 'all 0.3s ease',
        backdropFilter: isActive(path) ? 'blur(10px)' : 'none',
    })

    // Não mostrar menu na página inicial
    if (location.pathname === '/') return null

    return (
        <nav style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            background: 'rgba(10, 10, 15, 0.85)',
            backdropFilter: 'blur(20px)',
            padding: '8px 12px',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
            display: 'flex',
            gap: '6px',
            alignItems: 'center',
        }}>
            {/* Logo pequeno */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '0 12px 0 6px',
                borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                marginRight: '6px'
            }}>
                <Sparkles size={18} color="#4488ff" />
                <span style={{
                    fontWeight: '800',
                    fontSize: '1rem',
                    background: 'linear-gradient(135deg, #fff, #4488ff)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    BioSim
                </span>
            </div>

            {menuItems.map(({ path, icon: Icon, label, color }) => (
                <Link 
                    key={path}
                    to={path} 
                    style={linkStyle(path, color)}
                    onMouseEnter={(e) => {
                        if (!isActive(path)) {
                            e.currentTarget.style.background = `${color}20`
                            e.currentTarget.style.borderColor = `${color}40`
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!isActive(path)) {
                            e.currentTarget.style.background = 'transparent'
                            e.currentTarget.style.borderColor = 'transparent'
                        }
                    }}
                >
                    <Icon size={18} color={isActive(path) ? color : 'rgba(255,255,255,0.7)'} />
                    {label}
                </Link>
            ))}
        </nav>
    )
}
