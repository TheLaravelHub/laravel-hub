import React from 'react'
import { motion } from 'framer-motion'

interface FloatingElementProps {
    children: React.ReactNode
    delay?: number
    duration?: number
    className?: string
    distance?: number
    onClick?: () => void
}

export const FloatingElement = ({
    children,
    delay = 0,
    duration = 4,
    className = '',
    distance = 15,
    onClick,
}: FloatingElementProps) => {
    return (
        <motion.div
            className={className}
            animate={{
                y: [`-${distance}px`, `${distance}px`],
            }}
            transition={{
                y: {
                    duration,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    ease: 'easeInOut',
                    delay,
                },
            }}
            onClick={onClick}
        >
            {children}
        </motion.div>
    )
}

export default FloatingElement
