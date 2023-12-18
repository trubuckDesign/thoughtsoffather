// Import necessary MUI components
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

// Define your sentiment data type
interface SentimentData {
  date: string;
  sentimentValue: number;
}

interface SentimentTableProps {
  data: SentimentData[];
}

const SentimentTable: React.FC<SentimentTableProps> = ({ data }) => {
  // Render the table with your data
  return (
    <TableContainer component={Paper} sx={{ margin: 2, elevation: 3 }}>
      <Table aria-label="sentiment table">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell align="right">Sentiment Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.date}>
              <TableCell component="th" scope="row">
                {row.date}
              </TableCell>
              <TableCell align="right">{row.sentimentValue}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SentimentTable;
