## prompt

I'm developing a Next.js v13 app with MUI v5, NextAuth v4, Prisma, and TypeScript, jest for a blog-like website where i can post thoughts that my father wrote down with some pictures. I would like the style to be like the user is reading someone's journal.
My goal is a modern, mobile-responsive design like GitHub or Vercel.
I need guidance on ensuring code accuracy and maintainability.
I'm trying to work on getting the thought posts content rendered properly across the two book page components. i have a book component that has pages on the screen. What i'd like it to do is take the content (which is html with text elements and images) do the following:
parse the html
loop through each node and measure the height of the content using react-measure. Then if the height of the content is not greater than the height of the main container, then add it to the page object.
move onto the next node, and if the height of that plus the height of the page object is not over the height of the container, then add the new node to the page object.
once the page object has a height that is greater than the main container, then add the page to the array, and start a brand new page. that way the content never goes over the height of the container and new pages are added to the book. Here is my code so far:
