import React from "react";
import { useSpring, animated } from "react-spring";

const HandwritingSpinner = () => {
  const props = useSpring({
    strokeDashoffset: 0,
    from: { strokeDashoffset: 1000 },
    config: { duration: 2000 },
    reset: true,
    loop: true,
  });

  return (
    <svg width="200" height="100" viewBox="0 0 200 100">
      <path id="text-path" d="M10,50 C100,0 100,100 190,50" fill="transparent" />
      <text>
        <textPath href="#text-path" startOffset="0%">
          Handwriting Effect
        </textPath>
      </text>
      <animated.path d="M10,50 C100,0 100,100 190,50" fill="transparent" stroke="black" strokeWidth="2" strokeDasharray="1000" style={props} />
    </svg>
  );
};

export default HandwritingSpinner;
