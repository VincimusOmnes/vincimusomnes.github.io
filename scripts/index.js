const getFile = async (filePath) => {
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        // Return promise resolving to text content
        return await response.text();
    } catch (error) {
        console.error('Error fetching file:', error);
        throw error;
    }
};

// Okay so the obvious issue with this file layout
// Is that getting the posts folders is difficult
// Obviously I don't want to hardcode each post path

// We want to make adding posts as simple as possible.
// We want to keep everything organised

// Is there a way to get all files in a directory with JS?
// Not really, due to security reasons.
// We could have a published posts file that lists all posts.
// That would allow us to write posts in advance and publish
// by adding them to that file.

// We could probably write a github action to post new posts.

// Is it better to have a key value pair with path and
// published status?

// Is there any point using markdown instead of HTML directly?

console.log("JavaScript is working!");

const displayAllPosts = () => {
    getFile('posts/published-posts.json').then(data => {
        const publishedPosts = JSON.parse(data)["published-posts"];
        publishedPosts.forEach(post => {
            const index = post.path + "/index.md";
            getFile(`posts/${index}`).then(markdown => {
                console.log(markdown);
                displayPost(markdownToHtml(markdown, post.path));
            });
        });
    });
}

const displayPost = (html) => {
    const postContainer = document.createElement('div');
    postContainer.className = 'post';
    postContainer.innerHTML = html;
    document.body.appendChild(postContainer);
}

const markdownToHtml = (markdown, path) => {
    let html = markdown;
    // This needs to be escaped if open to untrusted input
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>')
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
    html = html.replace(/^##### (.*$)/gim, '<h5>$1</h5>');
    html = html.replace(/^###### (.*$)/gim, '<h6>$1</h6>');
    // ![Alt text](url "a title")
    const imgReg = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)/g;
    html = html.replace(imgReg, `<img src="posts/${path}/images/$2" alt="$1" title="$3">`);
    // Links
    // Text styles
    // Syntax highlighting
    // Tables
    // Lists
    // Escape characters
    
    return html;
}

displayAllPosts()