// components/buttons/AnimatedButton.tsx
import React from "react";
import { IconButton } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";

const AnimatedIconButton = styled(IconButton)(({ theme }) => ({
  position: "fixed",
  bottom: "20px",
  right: "20px",
  animation: "float 3s ease-in-out infinite",
  boxShadow: "0px 0px 15px 5px rgba(0, 0, 0, 0.6)",
  "@keyframes float": {
    "0%, 100%": { transform: "translateY(0)" },
    "50%": { transform: "translateY(-20px)" },

    backgroundColor: theme.palette.primary.main, // Theme primary color
    color: theme.palette.primary.contrastText, // Contrast text color for the primary color
    "&:hover": {
      backgroundColor: theme.palette.primary.dark, // Darker shade for hover state
    },
  },
}));

interface AnimatedButtonProps {
  onClick: () => void;
}

const AnimatedAboutButton: React.FC<AnimatedButtonProps> = ({ onClick }) => {
  const theme = useTheme(); // Use the useTheme hook to access the theme

  return (
    <AnimatedIconButton
      color="primary"
      theme={theme} // Pass the theme to the styled component
      onClick={onClick}
    >
      <QuestionMarkIcon style={{ fontSize: "3rem" }} />
    </AnimatedIconButton>
  );
};

export default AnimatedAboutButton;
