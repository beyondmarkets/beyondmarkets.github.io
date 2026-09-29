/**
 * BEYOND MARKETS — Zero-Dependency Lightweight Markdown Parser
 * Parses standard Markdown, frontmatter, tables, images, and pullquotes.
 */
(function(window) {
  'use strict';

  function parseFrontmatter(rawText) {
    if (!rawText.startsWith('---')) {
      return { metadata: {}, body: rawText };
    }
    const endIdx = rawText.indexOf('\n---', 3);
    if (endIdx === -1) {
      return { metadata: {}, body: rawText };
    }
    const yamlBlock = rawText.substring(3, endIdx).trim();
    const body = rawText.substring(endIdx + 4).trim();
    const metadata = {};
    yamlBlock.split('\n').forEach(line => {
      const colonIdx = line.indexOf(':');
      if (colonIdx > -1) {
        const key = line.substring(0, colonIdx).trim();
        let val = line.substring(colonIdx + 1).trim();
        // Strip quotes
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.substring(1, val.length - 1);
        }
        // Handle comma-separated arrays like [FX, Rates]
        if (val.startsWith('[') && val.endsWith(']')) {
          val = val.substring(1, val.length - 1).split(',').map(s => s.trim().replace(/^["']|["']$/g, ''));
        }
        metadata[key] = val;
      }
    });
    return { metadata, body };
  }

  function markdownToHtml(md) {
    if (!md) return '';
    let html = md;

    // Escape basic raw HTML brackets inside code to avoid injection
    html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    // Allow explicit line breaks (used inside table cells)
    html = html.replace(/&lt;br\s*\/?&gt;/g, '<br>');

    // Code blocks ```...```
    html = html.replace(/```([a-z0-9_-]*)\n([\s\S]*?)```/g, function(match, lang, code) {
      return `<pre class="code-block font-mono"><code class="lang-${lang}">${code.trim()}</code></pre>`;
    });

    // Inline code `...`
    html = html.replace(/`([^`]+)`/g, '<code class="inline-code font-mono">$1</code>');

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3 class="article-h3 font-serif">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="article-h2 font-serif">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="article-h1 font-serif">$1</h1>');

    // Horizontal Rule
    html = html.replace(/^---$/gim, '<hr class="editorial-divider" />');

    // Images with caption
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, function(match, alt, src) {
      return `<figure class="article-figure"><img src="${src}" alt="${alt}" loading="lazy" />${alt ? `<figcaption class="figure-caption">${alt}</figcaption>` : ''}</figure>`;
    });

    // Links (in-site hash links stay in the same tab)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function(match, text, href) {
      if (href.startsWith('#')) return `<a href="${href}" class="editorial-link">${text}</a>`;
      return `<a href="${href}" class="editorial-link" target="_blank" rel="noopener noreferrer">${text}</a>`;
    });

    // Blockquotes
    html = html.replace(/^\> (.*$)/gim, '<blockquote class="article-pull-quote"><div class="pull-quote-text font-serif">“$1”</div></blockquote>');

    // Bold & Italic
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // Simple markdown tables
    html = html.replace(/((?:\|[^\n]+\|\r?\n)+)/g, function(tableMatch) {
      const rows = tableMatch.trim().split('\n');
      if (rows.length < 2) return tableMatch;
      let tableHtml = '<div class="table-responsive"><table class="editorial-table">';
      rows.forEach((row, idx) => {
        const cells = row.split('|').filter((_, i, arr) => i > 0 && i < arr.length - 1);
        if (row.includes('---')) return; // separator
        const tag = idx === 0 ? 'th' : 'td';
        tableHtml += '<tr>';
        cells.forEach(c => {
          tableHtml += `<${tag}>${c.trim()}</${tag}>`;
        });
        tableHtml += '</tr>';
      });
      tableHtml += '</table></div>\n\n';
      return tableHtml;
    });

    // Unordered lists
    html = html.replace(/^[ \t]*[-*][ \t]+(.*$)/gim, '<li class="article-li">$1</li>');
    html = html.replace(/(<li class="article-li">.*<\/li>\n?)+/g, '<ul class="article-ul">$&</ul>\n\n');

    // Ordered lists
    html = html.replace(/^[ \t]*\d+\.[ \t]+(.*$)/gim, '<li class="article-oli">$1</li>');
    html = html.replace(/(<li class="article-oli">.*<\/li>\n?)+/g, '<ol class="article-ol">$&</ol>\n\n');

    // Paragraphs
    const paragraphs = html.split(/\n{2,}/);
    html = paragraphs.map(p => {
      p = p.trim();
      if (!p) return '';
      if (/^<(h[1-6]|ul|ol|li|blockquote|pre|figure|hr|div|table)/i.test(p)) {
        return p;
      }
      // A paragraph that is entirely bold is a finding sentence; entirely italic is a small note
      if (/^<strong>[^]*<\/strong>$/.test(p) && p.indexOf('</strong>') === p.length - 9) {
        return `<p class="article-finding">${p.slice(8, -9)}</p>`;
      }
      if (/^<em>[^]*<\/em>$/.test(p) && p.indexOf('</em>') === p.length - 5) {
        return `<p class="article-note">${p.slice(4, -5)}</p>`;
      }
      return `<p class="article-p">${p}</p>`;
    }).join('\n\n');

    return html;
  }

  window.MarkdownParser = {
    parse: markdownToHtml,
    parseFrontmatter: parseFrontmatter
  };
})(window);
