export function formatJSON(input: string, indent: number = 2): string {
  return JSON.stringify(JSON.parse(input), null, indent);
}

export function validateJSON(input: string): { valid: boolean; error?: string } {
  try {
    JSON.parse(input);
    return { valid: true };
  } catch (e) {
    return { valid: false, error: (e as Error).message };
  }
}

export function minifyJSON(input: string): string {
  return JSON.stringify(JSON.parse(input));
}

export function encodeBase64(input: string): string {
  return btoa(unescape(encodeURIComponent(input)));
}

export function decodeBase64(input: string): string {
  return decodeURIComponent(escape(atob(input)));
}

export function encodeURL(input: string): string {
  return encodeURIComponent(input);
}

export function decodeURL(input: string): string {
  return decodeURIComponent(input);
}

export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function timestampToDate(ts: string): Date {
  const num = Number(ts);
  if (num > 1e12) return new Date(num);
  return new Date(num * 1000);
}

export function dateToTimestamp(date: Date): number {
  return Math.floor(date.getTime() / 1000);
}

export function countWords(text: string) {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, "").length;
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim()).length;
  const paragraphs = text.split(/\n\n+/).filter((s) => s.trim()).length;
  const readingTime = Math.max(1, Math.ceil(words / 200));
  return { words, chars, charsNoSpaces, sentences, paragraphs, readingTime };
}

export function testRegex(pattern: string, flags: string, testString: string) {
  try {
    const matches = [...testString.matchAll(new RegExp(pattern, flags.includes("g") ? flags : flags + "g"))];
    return { valid: true, matches: matches.map((m) => ({ value: m[0], index: m.index })), groups: matches.map((m) => m.slice(1)) };
  } catch (e) {
    return { valid: false, error: (e as Error).message, matches: [], groups: [] };
  }
}

export function generateLorem(paragraphs: number, wordsPerParagraph: number = 50): string {
  const words = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum".split(" ");
  const result: string[] = [];
  for (let p = 0; p < paragraphs; p++) {
    const paraWords: string[] = [];
    for (let w = 0; w < wordsPerParagraph; w++) {
      paraWords.push(words[Math.floor(Math.random() * words.length)]);
    }
    paraWords[0] = paraWords[0][0].toUpperCase() + paraWords[0].slice(1);
    result.push(paraWords.join(" ") + ".");
  }
  return result.join("\n\n");
}
