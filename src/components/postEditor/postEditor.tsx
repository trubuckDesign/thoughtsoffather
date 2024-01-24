import React, { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Box, Button, TextField, useMediaQuery, useTheme } from "@mui/material";
import { Thought } from "../landingPage";

interface PostEditorProps {
  existingTitle?: string;
  existingContent?: string;
  existingThoughtId?: number;
  existingCreatedAt?: Date;
  setThoughtSummary: React.Dispatch<React.SetStateAction<Thought[]>>;
  setSelectedThought: React.Dispatch<
    React.SetStateAction<{
      thoughtId: number;
      title: string;
      content: string;
      createdAt: Date;
      updatedAt: Date;
      isExpired: boolean;
    } | null>
  >;
}

const PostEditor: React.FC<PostEditorProps> = ({
  existingTitle,
  existingContent,
  existingThoughtId,
  existingCreatedAt,

  setThoughtSummary,
  setSelectedThought,
}) => {
  const [content, setContent] = useState<string>(existingContent || "");
  const [title, setTitle] = useState<string>(existingTitle || "");
  const [postDate, setPostDate] = useState<Date>(existingCreatedAt || new Date());
  const editorRef = useRef<any>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const handleEditorChange = (content: string) => {
    setContent(content);
  };

  interface BlobInfo {
    id: () => string;
    name: () => string;
    filename: () => string;
    blob: () => Blob;
    base64: () => string;
    blobUri: () => string;
    uri: () => string | undefined;
  }
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };
  const postDateString = postDate.toISOString().split("T")[0];
  const handlePostDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const updatedDate = new Date(event.target.value);
      if (!isNaN(updatedDate.getTime())) {
        // Check if the date is valid
        setPostDate(updatedDate);
      } else {
        // Handle invalid date (e.g., set to current date or a default value)
        setPostDate(new Date());
      }
    } catch (error) {
      console.log("PostDateError", error);
      // Optionally, handle the error case
    }
  };

  const uploadImage = (blobInfo: BlobInfo, progress: (percent: number) => void): Promise<string> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `/api/images?filename=${blobInfo.filename}`, true);

      xhr.upload.onprogress = (e) => {
        progress((e.loaded / e.total) * 100);
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          resolve(response.url);
        } else {
          reject("Image upload failed");
        }
      };

      xhr.onerror = () => {
        reject("Image upload failed");
      };

      // Send the blob directly
      xhr.send(blobInfo.blob());
    });
  };
  const postThought = async () => {
    try {
      const method = existingThoughtId ? "PUT" : "POST";
      const url = existingThoughtId ? `/api/thoughts/${existingThoughtId}` : "/api/thoughts";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content, postDateString, thoughtId: existingThoughtId }), // Include thoughtId if editing
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      if (response.ok) {
        // Assuming post creation/updation is successful
        const secretToken = process.env.NEXT_PUBLIC_MY_SECRET_TOKEN; // Ensure this is set in your environment variables
        const revalidateResponse = await fetch(`/api/revalidate?secret=${secretToken}`);

        if (!revalidateResponse.ok) {
          throw new Error("Revalidation failed");
        }

        console.log("Revalidation successful");
        // Rest of your success handling code
      }

      const { newThought } = await response.json();

      if (method === "POST") {
        // Add the new thought to the thoughtSummary state
        setThoughtSummary((prevThoughts) => [newThought, ...prevThoughts]);
      } else {
        // Update the existing thought in the thoughtSummary state
        setThoughtSummary((prevThoughts) => prevThoughts.map((thought) => (thought.thoughtId === newThought.thoughtId ? newThought : thought)));
      }
      setContent("");
      setTitle("");
      if (editorRef.current) {
        editorRef.current.setContent(""); // Reset the editor content
      }
      // Handle success (e.g., showing a success message or redirecting)
    } catch (error) {
      console.error("Failed to post thought", error);
      // Handle failure (e.g., showing an error message)
    }
  };
  const handleReset = () => {
    setContent("");
    setTitle("");
    setPostDate(new Date());
    setSelectedThought(null);
    if (editorRef.current) {
      editorRef.current.setContent("");
    }
  };
  const editorInitConfig = {
    height: isMobile ? "80vh" : "68vh",
    width: isMobile ? "98vw" : "60vw",
    menubar: false,
    plugins: [
      "advlist table media autolink lists link image charmap print preview anchor",
      "searchreplace visualblocks code fullscreen",
      "insertdatetimetable paste code help wordcount",
      "image",
    ],
    table_toolbar:
      "tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol",
    table_responsive_width: true,
    toolbar: isMobile
      ? ["undo redo | formatselect | bold italic", "alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | image"]
      : "undo redo | formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table | help | image",
    content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
    images_upload_handler: uploadImage,
  };
  useEffect(() => {
    if (existingContent && editorRef.current) {
      editorRef.current.setContent(existingContent);
    }
  }, [existingContent]);

  useEffect(() => {
    if (existingTitle) {
      setTitle(existingTitle);
    }
  }, [existingTitle]);
  useEffect(() => {
    if (existingCreatedAt) {
      const newPostDate = new Date(existingCreatedAt);
      if (!isNaN(newPostDate.getTime())) {
        setPostDate(newPostDate);
      }
    }
  }, [existingCreatedAt]);
  useEffect(() => {
    if (existingContent) {
      if (editorRef.current) {
        editorRef.current.setContent(existingContent, { format: "raw" });
      }
    } else {
    }
  }, [existingContent]);

  return (
    <Box>
      <TextField
        label="Title"
        variant="outlined"
        value={title}
        onChange={handleTitleChange}
        margin="normal"
        sx={{ backgroundColor: "rgba(255, 255, 255, 0.8)", width: isMobile ? "95vw" : "60vw" }}
      />
      <TextField
        label="Post Date"
        variant="outlined"
        type="date"
        name="PostedDate"
        value={postDateString} // Use the string format of the date
        onChange={handlePostDateChange}
        sx={{ backgroundColor: "rgba(255, 255, 255, 0.8)", marginBottom: 1, width: isMobile ? "200px" : "250px" }}
      />

      <Editor
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue=""
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_KEY}
        init={editorInitConfig}
        onEditorChange={handleEditorChange}
      />

      <Button variant="contained" sx={{ margin: 2 }} onClick={postThought}>
        {existingThoughtId ? "Update Thought" : "Post Thought"}
      </Button>
      {content && (
        <Button variant="contained" onClick={handleReset}>
          Reset
        </Button>
      )}
    </Box>
  );
};

export default PostEditor;
