import React from "react";
import {
  Box,
  Modal,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { stripHtml } from "@/lib/stripHtml";

interface SearchResultsModalProps {
  isOpen: boolean;
  results: Array<{ thoughtId: number; title: string; content: string }>;
  onClose: () => void;
}

const SearchResultsModal: React.FC<SearchResultsModalProps> = ({
  isOpen,
  results,
  onClose,
}) => {
  const router = useRouter();

  const handleResultClick = (thoughtId: number) => {
    onClose(); // Close modal
    router.push(`/${thoughtId}`); // Navigate to the thought detail page
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="search-results-title"
      aria-describedby="search-results-description"
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: 2,
          boxShadow: 24,
          p: 3,
          maxWidth: 600,
          width: "90%",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <Typography id="search-results-title" variant="h6" sx={{ mb: 2 }}>
          Search Results
        </Typography>

        <List>
          {results.map((result) => (
            <ListItem
              key={result.thoughtId}
              sx={{
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "grey.100",
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                },
              }}
              onClick={() => handleResultClick(result.thoughtId)}
            >
              <ListItemText
                primary={result.title}
                secondary={`${stripHtml(result.content).substring(0, 500)}...`}
              />
            </ListItem>
          ))}
        </List>

        <Box sx={{ textAlign: "right", mt: 2 }}>
          <Button onClick={onClose} variant="text">
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default SearchResultsModal;
