import { useEffect, useState } from 'react'
import { Trophy, Star, Zap, X } from 'lucide-react'

export interface Notification {
    id: string
    type: 'achievement' | 'reward' | 'mission' | 'level-up'
    title: string
    message: string
    icon?: string
    points?: number
    xp?: number
}

interface NotificationSystemProps {
    notifications: Notification[]
    onDismiss: (id: string) => void
}

export function NotificationSystem({ notifications, onDismiss }: NotificationSystemProps) {
    return (
        <div style={{
            position: 'fixed',
            top: '100px',
            right: '30px',
            zIndex: 3000,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            maxWidth: '350px',
        }}>
            {notifications.map((notification) => (
                <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onDismiss={() => onDismiss(notification.id)}
                />
            ))}
        </div>
    )
}

function NotificationCard({ notification, onDismiss }: {
    notification: Notification
    onDismiss: () => void
}) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Animação de entrada
        setTimeout(() => setIsVisible(true), 10)

        // Auto-dismiss após 5 segundos
        const timer = setTimeout(() => {
            setIsVisible(false)
            setTimeout(onDismiss, 300)
        }, 5000)

        return () => clearTimeout(timer)
    }, [onDismiss])

    const getBackgroundColor = () => {
        switch (notification.type) {
            case 'achievement':
                return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
            case 'level-up':
                return 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
            case 'mission':
                return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            default:
                return 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)'
        }
    }

    const getIcon = () => {
        if (notification.icon) return notification.icon

        switch (notification.type) {
            case 'achievement':
                return <Trophy size={24} />
            case 'level-up':
                return <Zap size={24} />
            case 'mission':
                return <Star size={24} />
            default:
                return <Star size={24} />
        }
    }

    return (
        <div
            style={{
                background: getBackgroundColor(),
                borderRadius: '16px',
                padding: '16px',
                color: 'white',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                transform: isVisible ? 'translateX(0)' : 'translateX(400px)',
                opacity: isVisible ? 1 : 0,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
            }}
        >
            <button
                onClick={() => {
                    setIsVisible(false)
                    setTimeout(onDismiss, 300)
                }}
                style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '4px',
                    cursor: 'pointer',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <X size={16} />
            </button>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    padding: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    {getIcon()}
                </div>

                <div style={{ flex: 1 }}>
                    <div style={{
                        fontSize: '1rem',
                        fontWeight: '700',
                        marginBottom: '4px',
                    }}>
                        {notification.title}
                    </div>
                    <div style={{
                        fontSize: '0.85rem',
                        opacity: 0.9,
                        lineHeight: '1.4',
                    }}>
                        {notification.message}
                    </div>

                    {(notification.points || notification.xp) && (
                        <div style={{
                            display: 'flex',
                            gap: '8px',
                            marginTop: '8px',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                        }}>
                            {notification.points && (
                                <span style={{
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    padding: '4px 8px',
                                    borderRadius: '6px',
                                }}>
                                    +{notification.points} pts
                                </span>
                            )}
                            {notification.xp && (
                                <span style={{
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    padding: '4px 8px',
                                    borderRadius: '6px',
                                }}>
                                    +{notification.xp} XP
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// Hook para gerenciar notificações
export function useNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([])

    const addNotification = (notification: Omit<Notification, 'id'>) => {
        const id = `notif-${Date.now()}-${Math.random()}`
        setNotifications(prev => [...prev, { ...notification, id }])
    }

    const dismissNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id))
    }

    const showAchievement = (title: string, message: string, points: number, icon?: string) => {
        addNotification({
            type: 'achievement',
            title,
            message,
            points,
            icon,
        })
    }

    const showReward = (points: number, xp: number, message: string) => {
        addNotification({
            type: 'reward',
            title: 'Recompensa!',
            message,
            points,
            xp,
        })
    }

    const showMissionComplete = (title: string, points: number, xp: number) => {
        addNotification({
            type: 'mission',
            title: 'Missão Completa!',
            message: `Você completou: ${title}`,
            points,
            xp,
        })
    }

    const showLevelUp = (level: number, levelName: string) => {
        addNotification({
            type: 'level-up',
            title: `Nível ${level}!`,
            message: `Você alcançou: ${levelName}`,
            icon: '🎉',
        })
    }

    return {
        notifications,
        addNotification,
        dismissNotification,
        showAchievement,
        showReward,
        showMissionComplete,
        showLevelUp,
    }
}
