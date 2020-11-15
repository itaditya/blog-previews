const fs = require('fs');
const nodeHtmlToImage = require('node-html-to-image');
const fetch = require('node-fetch');

function getShortDate(isoString) {
  const dateInstance = new Date(isoString);
  const month = dateInstance.toLocaleString('default', { month: 'short' });
  const year = dateInstance.getFullYear();
  const date = dateInstance.getDate();

  return `${date} ${month} ${year}`;
}

async function getContent() {
  const res = await fetch('http://localhost:3000/_next/data/development/blog.json');
  const data = await res.json();

  const posts = Object.values(data.pageProps.postsMap);

  const content = posts.map((post) => {
    const publishDate = getShortDate(post.date);
    const output = `./previews/${post.slug}.jpg`;

    return {
      ...post,
      publishDate,
      output,
    };
  });
  return content;
}

async function init() {
  const html = fs.readFileSync('./template.html').toString('utf8');
  const content = await getContent();
  await nodeHtmlToImage({
    html,
    quality: 30,
    type: 'jpeg',
    content,
  });
}

init();
