import { Card, CardContent, Typography, Grid, useTheme } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info"; // Example icon

interface Stat {
  label: string;
  value: string | number;
  icon?: React.ReactElement; // Optional icon for each stat
}

interface GeneralStatsProps {
  stats: Stat[];
}

export const DevelopmentStats: React.FC<GeneralStatsProps> = ({ stats }) => {
  const theme = useTheme();

  return (
    <>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
        Development Statistics
      </Typography>
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index} sx={{ textAlign: "center" }}>
            {stat.icon || <InfoIcon color="primary" />} {/* Default to InfoIcon if no icon provided */}
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: theme.palette.primary.main }}>
              {stat.label}
            </Typography>
            <Typography variant="body1">{stat.value}</Typography>
          </Grid>
        ))}
      </Grid>
    </>
  );
};
