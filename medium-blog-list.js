const fs = require('fs');

const MEDIUM_USERNAME = '@rajeshrathore05';
const MAX_POSTS = 5;

async function getMediumPosts() {
  const response = await fetch(`https://api.medium.com/v1/users/${MEDIUM_USERNAME}/posts`, {
    headers: {
      Authorization: `Bearer ${process.env.MEDIUM_TOKEN}`,
    },
  });
  const data = await response.json();
  return data.data.slice(0, MAX_POSTS);
}

async function updateReadme() {
  const posts = await getMediumPosts();
  const lines = posts.map(post => `- [${post.title}](${post.url})`);
  const readme = fs.readFileSync('README.md', 'utf-8');
  const startMarker = '<!-- MEDIUM POSTS START -->';
  const endMarker = '<!-- MEDIUM POSTS END -->';
  const startIndex = readme.indexOf(startMarker) + startMarker.length + 1;
  const endIndex = readme.indexOf(endMarker);
  const newReadme = `${readme.slice(0, startIndex)}\n${lines.join('\n')}\n${readme.slice(endIndex)}`;
  fs.writeFileSync('README.md', newReadme);
}

updateReadme().catch(console.error);
