const getMarkdown = () => {
    fetch('../test.md')
    .then(response => response.text())
    .then(text => {
        // Process the Markdown text here
        console.log(text);
    })
    .catch(error => console.error('Error fetching the Markdown file:', error));
};

console.log("JavaScript is working!");
getMarkdown();