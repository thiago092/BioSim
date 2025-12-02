interface StructureLabelProps {
    name: string
    description: string
    position: [number, number]
}

export function StructureLabel({ name, description, position }: StructureLabelProps) {
    const [x, y] = position

    return (
        <div style={{
            position: 'fixed',
            left: `${x}px`,
            top: `${y}px`,
            transform: 'translate(-50%, calc(-100% - 15px))',
            background: 'rgba(157, 78, 221, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(224, 170, 255, 0.8)',
            borderRadius: '12px',
            padding: '12px 16px',
            minWidth: '200px',
            maxWidth: '300px',
            boxShadow: '0 4px 20px rgba(157, 78, 221, 0.4)',
            pointerEvents: 'none',
            zIndex: 10001,
            animation: 'labelFadeIn 0.2s ease-out',
        }}>
            {/* Nome da Estrutura */}
            <div style={{
                fontSize: '0.95rem',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
            }}>
                {name}
            </div>

            {/* Descrição */}
            <div style={{
                fontSize: '0.85rem',
                lineHeight: '1.4',
                color: 'rgba(255, 255, 255, 0.9)'
            }}>
                {description}
            </div>

            {/* Seta apontando para estrutura */}
            <div style={{
                position: 'absolute',
                bottom: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '0',
                height: '0',
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderTop: '8px solid rgba(224, 170, 255, 0.8)',
            }} />

            <style>{`
                @keyframes labelFadeIn {
                    from {
                        opacity: 0;
                        transform: translate(-50%, calc(-100% - 10px)) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translate(-50%, calc(-100% - 15px)) scale(1);
                    }
                }
            `}</style>
        </div>
    )
}
