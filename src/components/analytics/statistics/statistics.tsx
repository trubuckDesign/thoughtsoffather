import { Card, CardContent, Typography } from "@mui/material";

interface GeneralStatsProps {
  wordCount: number;
  averageLength: number;
}

const GeneralStats: React.FC<GeneralStatsProps> = ({ wordCount, averageLength }) => {
  return (
    <Card sx={{ margin: 2, elevation: 3 }}>
      <CardContent>
        <Typography variant="h5">General Statistics</Typography>
        <Typography>Word Count: {wordCount}</Typography>
        <Typography>Average Length: {averageLength} words</Typography>
      </CardContent>
    </Card>
  );
};

export default GeneralStats;
