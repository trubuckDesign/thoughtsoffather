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

const GeneralStats: React.FC<GeneralStatsProps> = ({ stats }) => {
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
        borderStyle: "solid",
        padding: theme.spacing(2),
      }}
    >
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
          General Statistics
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
      </CardContent>
    </Card>
  );
};

export default GeneralStats;
