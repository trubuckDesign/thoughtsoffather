"use client";
// pages/[thoughtId].tsx
import { withRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import LandingPage from "@/components/landingPage";
import { Thoughts } from "@prisma/client";
import { usePathname } from "next/navigation";

export default function Page({ params }: { params: { thoughtId: string } }) {
  console.log("pathname", params.thoughtId);
  // const router = useRouter();
  // const thoughtId = router.query.thoughtId;
  const [post, setPost] = useState<Thoughts | null>(null);

  async function fetchPostById(id: string): Promise<Thoughts | null> {
    try {
      const response = await fetch(`/api/thoughts/${params.thoughtId}`); // Adjust the URL to match your API endpoint
      if (!response.ok) {
        throw new Error("Post not found");
      }
      const post: Thoughts = await response.json();
      return post;
    } catch (error) {
      console.error("Error fetching post:", error);
      return null;
    }
  }

  useEffect(() => {
    if (params.thoughtId) {
      fetchPostById(params.thoughtId as string).then(setPost);
    }
  }, [params.thoughtId]);

  if (!post) {
    return <div>Loading...</div>; // Replace with your loading component
  }

  return <LandingPage initialPosts={[post]} />;
}
