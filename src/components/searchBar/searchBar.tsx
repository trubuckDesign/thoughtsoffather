import React, { useState } from "react";
import { Box, TextField, Button, IconButton, useMediaQuery, useTheme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SearchResultsModal from "./searchResults";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<
    Array<{ thoughtId: number; title: string; content: string }>
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);

    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      setResults(data);
      setIsModalOpen(true); // Open modal with results
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setResults([]);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <TextField
        placeholder="Search thoughts..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        variant="outlined"
        sx={{
          flex: 1,
          maxWidth: 400,
          height: "36px",
          "& .MuiInputBase-root": {
            height: "36px",
            fontSize: "0.875rem",
          },
        }}
      />
      {isMobile ? (
        <IconButton
          color="primary"
          onClick={handleSearch}
          sx={{
            marginLeft: 1,
            height: "36px",
            width: "36px",
          }}
        >
          <SearchIcon />
        </IconButton>
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          startIcon={<SearchIcon />}
          sx={{
            marginLeft: 1,
            height: "36px",
            fontSize: "0.875rem",
          }}
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </Button>
      )}

      {/* Render the modal */}
      <SearchResultsModal
        isOpen={isModalOpen}
        results={results}
        onClose={closeModal}
      />
    </Box>
  );
}
