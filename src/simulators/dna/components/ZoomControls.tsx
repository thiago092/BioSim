import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import type { ZoomLevel } from '../data/educational-content'
import { ZOOM_LEVELS } from '../data/educational-content'

interface ZoomControlsProps {
    currentLevel: ZoomLevel
    onZoomIn: () => void
    onZoomOut: () => void
    onReset: () => void
}

export function ZoomControls({ currentLevel, onZoomIn, onZoomOut, onReset }: ZoomControlsProps) {
    const currentIndex = ZOOM_LEVELS.indexOf(currentLevel)
    const canZoomIn = currentIndex < ZOOM_LEVELS.length - 1
    const canZoomOut = currentIndex > 0

    return (
        <div style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            display: 'flex',
            gap: '12px',
            zIndex: 100,
        }}>
            {/* Zoom Out */}
            <button
                onClick={onZoomOut}
                disabled={!canZoomOut}
                style={{
                    background: canZoomOut ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    padding: '14px',
                    color: 'white',
                    cursor: canZoomOut ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    opacity: canZoomOut ? 1 : 0.4,
                }}
                onMouseEnter={(e) => {
                    if (canZoomOut) {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
                        e.currentTarget.style.transform = 'scale(1.05)'
                    }
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                    e.currentTarget.style.transform = 'scale(1)'
                }}
            >
                <ZoomOut size={24} />
            </button>

            {/* Reset */}
            <button
                onClick={onReset}
                style={{
                    background: 'rgba(245, 87, 108, 0.2)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(245, 87, 108, 0.4)',
                    borderRadius: '12px',
                    padding: '14px',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(245, 87, 108, 0.3)'
                    e.currentTarget.style.transform = 'scale(1.05)'
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(245, 87, 108, 0.2)'
                    e.currentTarget.style.transform = 'scale(1)'
                }}
            >
                <RotateCcw size={24} />
            </button>

            {/* Zoom In */}
            <button
                onClick={onZoomIn}
                disabled={!canZoomIn}
                style={{
                    background: canZoomIn ? 'rgba(74, 222, 128, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: canZoomIn ? '1px solid rgba(74, 222, 128, 0.4)' : '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    padding: '14px',
                    color: 'white',
                    cursor: canZoomIn ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    opacity: canZoomIn ? 1 : 0.4,
                }}
                onMouseEnter={(e) => {
                    if (canZoomIn) {
                        e.currentTarget.style.background = 'rgba(74, 222, 128, 0.3)'
                        e.currentTarget.style.transform = 'scale(1.05)'
                    }
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(74, 222, 128, 0.2)'
                    e.currentTarget.style.transform = 'scale(1)'
                }}
            >
                <ZoomIn size={24} />
            </button>

            {/* Level Indicator */}
            <div style={{
                background: 'rgba(15, 15, 20, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                padding: '14px 20px',
                color: 'white',
                fontSize: '0.9rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
            }}>
                <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#4ade80',
                    boxShadow: '0 0 10px #4ade80',
                }} />
                Nível {currentIndex + 1}/4
            </div>
        </div>
    )
}
