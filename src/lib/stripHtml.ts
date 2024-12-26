export const stripHtml = (html: string): string => {
    // Remove all HTML tags
    const text = html.replace(/<\/?[^>]+(>|$)/g, "");
    // Decode HTML entities
    const textArea = document.createElement("textarea");
    textArea.innerHTML = text;
    return textArea.value;
  };
  