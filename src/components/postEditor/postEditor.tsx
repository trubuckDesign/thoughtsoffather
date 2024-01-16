import React, { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Box, Button, CircularProgress, TextField, useMediaQuery, useTheme } from "@mui/material";

interface PostEditorProps {
  existingTitle?: string;
  existingContent?: string;
  existingThoughtId?: number;
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

const PostEditor: React.FC<PostEditorProps> = ({ existingTitle, existingContent, existingThoughtId, setSelectedThought }) => {
  const [content, setContent] = useState<string>(existingContent || "");
  const [title, setTitle] = useState<string>(existingTitle || "");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const editorRef = useRef<any>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (existingContent) {
      setIsLoading(true);
      if (editorRef.current) {
        editorRef.current.setContent(existingContent, { format: "raw" });
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [existingContent]);
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
      console.log("currentThought:", existingThoughtId);
      const method = existingThoughtId ? "PUT" : "POST";
      const url = existingThoughtId ? `/api/thoughts/${existingThoughtId}` : "/api/thoughts";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content, thoughtId: existingThoughtId }), // Include thoughtId if editing
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      if (response.ok) {
        // Assuming post creation/updation is successful
        const revalidateResponse = await fetch("/api/revalidate");
        if (!revalidateResponse.ok) {
          throw new Error("Revalidation failed");
        }

        console.log("Revalidation successful");
        // Rest of your success handling code
      }

      const data = await response.json();

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
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
          <CircularProgress />
        </Box>
      ) : (
        <Editor
          onInit={(evt, editor) => (editorRef.current = editor)}
          initialValue=""
          apiKey={process.env.NEXT_PUBLIC_TINYMCE_KEY}
          init={editorInitConfig}
          onEditorChange={handleEditorChange}
        />
      )}
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
