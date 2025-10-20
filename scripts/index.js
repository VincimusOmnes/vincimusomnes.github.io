import { markdownToHtml } from './markdown.js';

const postsContainer = document.createElement('div');
postsContainer.className = 'posts-container';
document.body.appendChild(postsContainer);

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

// There's a tradeoff for posts here, either
// put them into published-posts in reverse order
// order them reversed by number
// or order them by date
// Simplest is to have them reverse order in published-posts.json
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
    postsContainer.appendChild(postContainer);
}



displayAllPosts()