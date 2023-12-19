import { Card, CardContent, useTheme } from "@mui/material";

interface StylizedCardProps {
  children: React.ReactNode;
}

export const AnalyticsCard: React.FC<StylizedCardProps> = ({ children }) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        margin: 2,
        backgroundColor: "rgba(245, 250, 255, 0.90)",
        elevation: 3,
        borderColor: theme.palette.primary.main,
        borderWidth: 1,
        borderRadius: 10,
        boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.5)",
        borderStyle: "solid",
        padding: theme.spacing(2),
      }}
    >
      <CardContent>{children}</CardContent>
    </Card>
  );
};
