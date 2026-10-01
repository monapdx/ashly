# ASHLY.EXE blog

Open `blog.html` to browse, or `writer.html` to write. This is a static website; no installation or backend is required.

## Add a post
1. Open `writer.html` in your browser. Choose New post or an existing entry.
2. Fill in the title, unique ID, date, category, description, and HTML body. Use `<p>` for paragraphs, `<h2>` for headings, `<a href="...">` for links, and `<img src="assets/photo.jpg" alt="Description">` for images.
3. Save a draft and preview. Drafts live only in this browser and may be lost if browser storage is cleared.
4. Download POSTS.JS. Replace the website folder's `posts.js` with this downloaded file (rename if the browser added a number).
5. Upload the updated folder/files to your usual web host. Visitors will see the updated posts.

The editor is a local authoring convenience, not an authenticated CMS. You can omit `writer.html` and `writer.js` from your public site and keep them locally. Only put trusted HTML you authored in post bodies. Use Download before switching entries if you need a backup; unsaved form changes are not retained.

Delete the two sample entries before publishing real posts. Blog results sort by date, newest first. Post links use `post.html?id=your-post-id`; keep IDs stable to preserve links. Search checks titles, descriptions, and categories.

Files added: blog.html, blog.css, blog.js, post.html, post.js, posts.js, writer.html, writer.js. Homepage links updated to reach the blog; original assets and stylesheet retained.
