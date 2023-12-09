// components/buttons/AnimatedButton.tsx
import React, { useEffect, useState } from "react";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import { styled, useTheme } from "@mui/material/styles";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";

// Define a custom interface that extends IconButtonProps and includes the 'animate' prop
interface AnimatedIconButtonProps extends IconButtonProps {
  animate: boolean;
}

const AnimatedIconButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== "animate", // Prevent 'animate' prop from being forwarded to the DOM element
})<AnimatedIconButtonProps>(({ theme, animate }) => ({
  position: "fixed",
  bottom: "20px",
  right: "20px",
  animation: animate ? "float 3s ease-in-out infinite" : "none",
  boxShadow: "0px 0px 15px 5px rgba(0, 0, 0, 0.6)",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
  "@keyframes float": {
    "0%, 100%": { transform: "translateY(0)" },
    "50%": { transform: "translateY(-20px)" },
  },
}));

interface AnimatedButtonProps {
  onClick: () => void;
}

const AnimatedAboutButton: React.FC<AnimatedButtonProps> = ({ onClick }) => {
  const theme = useTheme();
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(false);
    }, 15000); // Set the animation to stop after 10 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatedIconButton
      color="primary"
      theme={theme}
      onClick={onClick}
      animate={animate} // Pass the animate state
    >
      <QuestionMarkIcon style={{ fontSize: "3rem" }} />
    </AnimatedIconButton>
  );
};

export default AnimatedAboutButton;
