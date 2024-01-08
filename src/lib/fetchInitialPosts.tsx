// lib/fetchInitialPosts.ts

import axiosInstance from "./axios";

const POSTS_PER_PAGE = 3; // Or whatever your default number of posts per page is

// Assuming you have a function to fetch posts from your API or database
const fetchPosts = async (startDate: string, endDate: string, postPerPage: number) => {
  const url = `/thoughts?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}&postPerPage=${postPerPage}`;

  const response = await axiosInstance.get(url);

  const data = await response.data;
  return data.posts;
};

const fetchInitialPosts = async () => {
  const endDate = new Date().toISOString(); // Fetch posts up to the current date
  // Define a startDate for your posts, e.g., a week ago, a month ago, etc.
  // This is just an example, adjust according to your needs
  const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const initialPosts = await fetchPosts(startDate, endDate, POSTS_PER_PAGE);
  return initialPosts;
};

export default fetchInitialPosts;
