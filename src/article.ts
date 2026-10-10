import MarkdownIt from 'markdown-it'

const md = new MarkdownIt('commonmark')

// Renders a blog post or story, for the site and the admin's preview alike.
// Images under ../assets load from the CDN.
export const renderArticle = (text: string) => md
  .render(text.split('../assets').join('https://cdn.jsdelivr.net/gh/mohaelder/me/src/assets'))
  .replaceAll('<img ', '<img class="md-img" ')
