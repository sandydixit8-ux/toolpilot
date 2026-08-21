function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderInline(text: string): string {
  let result = escapeHtml(text);
  result = result.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  result = result.replace(/\*(.*?)\*/g, "<em>$1</em>");
  result = result.replace(/`([^`]+)`/g, "<code>$1</code>");
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" rel="noopener">$1</a>');
  return result;
}

export function renderBlogContent(content: string): string {
  const paragraphs = content.split("\n\n");
  const htmlParts: string[] = [];

  for (const paragraph of paragraphs) {
    if (paragraph.startsWith("## ")) {
      htmlParts.push(`<h2>${renderInline(paragraph.replace("## ", ""))}</h2>`);
    } else if (paragraph.startsWith("### ")) {
      htmlParts.push(`<h3>${renderInline(paragraph.replace("### ", ""))}</h3>`);
    } else if (paragraph.startsWith("- ")) {
      const items = paragraph.split("\n").filter((l) => l.startsWith("- "));
      const lis = items
        .map((item) => `<li>${renderInline(item.replace(/^- /, ""))}</li>`)
        .join("");
      htmlParts.push(`<ul>${lis}</ul>`);
    } else if (paragraph.match(/^\d+\./)) {
      const items = paragraph.split("\n").filter((l) => l.match(/^\d/));
      const lis = items
        .map((item) => `<li>${renderInline(item.replace(/^\d+\.\s*/, ""))}</li>`)
        .join("");
      htmlParts.push(`<ol>${lis}</ol>`);
    } else if (paragraph.startsWith("> ")) {
      htmlParts.push(`<blockquote>${renderInline(paragraph.replace(/^> /gm, ""))}</blockquote>`);
    } else {
      htmlParts.push(`<p>${renderInline(paragraph).replace(/\n/g, "<br/>")}</p>`);
    }
  }

  return htmlParts.join("\n");
}
