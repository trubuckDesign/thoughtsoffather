import React, { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Box, Button, TextField } from "@mui/material";

const PostEditor: React.FC = () => {
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const editorRef = useRef<any>(null); // Add a ref for the TinyMCE editor
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
      const response = await fetch("/api/thoughts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
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
  return (
    <Box>
      <TextField label="Title" variant="outlined" value={title} onChange={handleTitleChange} fullWidth margin="normal" />
      <Editor
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue=""
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_KEY} // Access the API key from the environment variable
        init={{
          height: "50vh",
          width: "50vw",

          menubar: false,
          plugins: [
            "advlist table autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table paste code help wordcount",
            "image", // Include this line if not already included
          ],
          image_default_dimensions: {
            width: 300, // Default width
            height: 200, // Default height
          },
          table_toolbar:
            "tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol",

          table_responsive_width: true,
          toolbar:
            "table undo redo | formatselect | " +
            "bold italic | alignleft aligncenter " +
            "alignright alignjustify |  bullist numlist outdent indent | " +
            "help | image",
          content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
          images_upload_handler: uploadImage,
        }}
        onEditorChange={handleEditorChange}
      />
      <Button onClick={postThought}>Post Thought</Button>
    </Box>
  );
};

export default PostEditor;
