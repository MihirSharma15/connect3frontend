import React from 'react';
import { motion } from 'framer-motion';

const Graph = () => {
    // Single duration for each segment
    const animDuration = 0.40;

    // Circle #1: center (150,300), radius = 40
    // Circle #2: center (250,150), radius = 40
    // Circle #3: center (100,  0), radius = 40

    // ----------------------------
    // LINE 1: from Circle #1 to Circle #2 (edge to edge)
    // ----------------------------
    // Vector from (150,300) to (250,150) is (100, -150)
    // Distance ~180.277
    // Normalized direction ~ (0.5547, -0.83205)
    // Start = circle #1 center + 40 * direction
    // End   = circle #2 center - 40 * direction
    const line1Start = { x: 150 + 40 * 0.5547, y: 300 + 40 * (-0.83205) }; // ~ (172.2, 266.7)
    const line1End = { x: 250 - 40 * 0.5547, y: 150 - 40 * (-0.83205) }; // ~ (227.8, 183.3)

    // ----------------------------
    // LINE 2: from Circle #2 to Circle #3 (edge to edge)
    // ----------------------------
    // Vector from (250,150) to (100,0) is (-150, -150)
    // Distance ~212.132
    // Normalized direction ~ (-0.7071, -0.7071)
    // Start = circle #2 center + 40 * direction
    // End   = circle #3 center - 40 * direction
    const line2Start = { x: 250 + 40 * (-0.7071), y: 150 + 40 * (-0.7071) }; // ~ (221.716, 121.716)
    const line2End = { x: 100 - 40 * (-0.7071), y: 0 - 40 * (-0.7071) }; // ~ (128.284, 28.284)

    return (
        <svg width="500" height="500" viewBox="0 0 400 400">
            {/* 1) Circle #1 (no delay) */}
            <motion.circle
                cx="150"
                cy="300"
                r="40"
                fill="white"
                stroke="black"
                strokeWidth="5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                    duration: animDuration,
                    ease: 'easeInOut',
                    delay: 0
                }}
            />

            {/* 2) Line 1 (draw after Circle #1 finishes => delay: 2) */}
            <motion.line
                x1={line1Start.x}
                y1={line1Start.y}
                x2={line1End.x}
                y2={line1End.y}
                stroke="black"
                strokeWidth="5"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                    duration: animDuration,
                    ease: 'easeInOut',
                    delay: animDuration
                }}
            />

            {/* 3) Circle #2 (draw after Line 1 finishes => delay: 4) */}
            <motion.circle
                cx="250"
                cy="150"
                r="40"
                fill="white"
                stroke="black"
                strokeWidth="5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                    duration: animDuration,
                    ease: 'easeInOut',
                    delay: animDuration * 2
                }}
            />

            {/* 4) Line 2 (draw after Circle #2 finishes => delay: 6) */}
            <motion.line
                x1={line2Start.x}
                y1={line2Start.y}
                x2={line2End.x}
                y2={line2End.y}
                stroke="black"
                strokeWidth="5"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                    duration: animDuration,
                    ease: 'easeInOut',
                    delay: animDuration * 3
                }}
            />

            {/* 5) Circle #3 (draw after Line 2 finishes => delay: 8) */}
            <motion.circle
                cx="100"
                cy="0"
                r="40"
                fill="white"
                stroke="black"
                strokeWidth="5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                    duration: animDuration,
                    ease: 'easeInOut',
                    delay: animDuration * 4
                }}
            />
        </svg>
    );
};

export default Graph;