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
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, linkText, href) => {
    const trimmed = href.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("/")) {
      return `<a href="${trimmed}" rel="noopener">${linkText}</a>`;
    }
    return `[${linkText}](${trimmed})`;
  });
  return result;
}

function isTableSeparator(cells: string[]): boolean {
  return cells.length > 0 && cells.every((c) => /^:?-{2,}:?$/.test(c.trim()));
}

function renderTable(paragraph: string): string {
  const rows = paragraph
    .split("\n")
    .filter((l) => l.trim().startsWith("|"))
    .map((line) =>
      line
        .trim()
        .replace(/^\|/, "")
        .replace(/\|$/, "")
        .split("|")
        .map((cell) => renderInline(cell.trim()))
    )
    .filter((row) => !isTableSeparator(row));

  if (rows.length < 2) return "";

  const [header, ...body] = rows;
  const thead = `<thead><tr>${header.map((h) => `<th>${h}</th>`).join("")}</tr></thead>`;
  const tbody = `<tbody>${body.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody>`;
  return `<table>${thead}${tbody}</table>`;
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
    } else if (paragraph.trim().startsWith("|") && paragraph.split("\n").filter((l) => l.trim().startsWith("|")).length >= 2) {
      htmlParts.push(renderTable(paragraph));
    } else {
      htmlParts.push(`<p>${renderInline(paragraph).replace(/\n/g, "<br/>")}</p>`);
    }
  }

  return htmlParts.join("\n");
}
