import React from "react";
import { motion } from "framer-motion";

const Graph = () => {
  const animDuration = 0.4;
  const colorOfGraph = "black";

  // Predefined coordinates for circles and lines
  const line1Start = { x: 172.2, y: 266.7 };
  const line1End = { x: 227.8, y: 183.3 };
  const line2Start = { x: 221.716, y: 121.716 };
  const line2End = { x: 128.284, y: 28.284 };

  return (
    <svg
      viewBox="-50 -50 500 500"
      preserveAspectRatio="xMidYMid meet"
      className="w-full max-w-[400px] h-auto"
      className="w-full h-auto"
    >
      {/* Circle 1 */}
      <motion.circle
        cx="150"
        cy="300"
        r="40"
        fill="white"
        stroke={colorOfGraph}
        strokeWidth="5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: animDuration, ease: "easeInOut", delay: 0 }}
      />
      {/* Line 1 */}
      <motion.line
        x1={line1Start.x}
        y1={line1Start.y}
        x2={line1End.x}
        y2={line1End.y}
        stroke={colorOfGraph}
        strokeWidth="5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: animDuration, ease: "easeInOut", delay: animDuration }}
      />
      {/* Circle 2 */}
      <motion.circle
        cx="250"
        cy="150"
        r="40"
        fill="white"
        stroke={colorOfGraph}
        strokeWidth="5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: animDuration, ease: "easeInOut", delay: animDuration * 2 }}
      />
      {/* Line 2 */}
      <motion.line
        x1={line2Start.x}
        y1={line2Start.y}
        x2={line2End.x}
        y2={line2End.y}
        stroke={colorOfGraph}
        strokeWidth="5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: animDuration, ease: "easeInOut", delay: animDuration * 3 }}
      />
      {/* Circle 3 */}
      <motion.circle
        cx="100"
        cy="0"
        r="40"
        fill="white"
        stroke={colorOfGraph}
        strokeWidth="5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: animDuration, ease: "easeInOut", delay: animDuration * 4 }}
      />
    </svg>
  );
};

export default Graph;
