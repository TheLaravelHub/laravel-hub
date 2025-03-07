import React from 'react'
import { motion } from 'framer-motion'

interface AnimatedGradientBackgroundProps {
    children: React.ReactNode
    className?: string
}

export const AnimatedGradientBackground = ({
    children,
    className = '',
}: AnimatedGradientBackgroundProps) => {
    return (
        <div className={`relative overflow-hidden ${className}`}>
            {/* Animated gradient blobs */}
            <motion.div
                className="absolute -left-1/4 -top-1/4 h-1/2 w-1/2 rounded-full bg-primary/10 blur-[100px]"
                animate={{
                    x: [0, 100, 0],
                    y: [0, 50, 0],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    repeatType: 'reverse',
                }}
            />
            <motion.div
                className="absolute -bottom-1/4 right-0 h-1/2 w-1/2 rounded-full bg-secondary/10 blur-[100px]"
                animate={{
                    x: [0, -100, 0],
                    y: [0, -50, 0],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    repeatType: 'reverse',
                }}
            />
            <motion.div
                className="absolute left-1/4 top-1/3 h-1/3 w-1/3 rounded-full bg-blue-500/10 blur-[100px]"
                animate={{
                    x: [0, -50, 0],
                    y: [0, 100, 0],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    repeatType: 'reverse',
                }}
            />

            {/* Content */}
            <div className="relative z-10">{children}</div>
        </div>
    )
}

export default AnimatedGradientBackground
