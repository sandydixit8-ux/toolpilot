const MAX_FILE_SIZE = 50 * 1024 * 1024;
const ALLOWED_EXTENSIONS = ['.docx', '.doc'];
const ALLOWED_MIMES = [
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'application/octet-stream',
];

export interface SecurityCheck {
  valid: boolean;
  error?: string;
}

export function validateFile(file: File): SecurityCheck {
  const ext = '.' + file.name.split('.').pop()?.toLowerCase();

  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return { valid: false, error: 'Unsupported file format. Only .doc and .docx files are accepted.' };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.` };
  }

  if (file.size === 0) {
    return { valid: false, error: 'File is empty.' };
  }

  if (!ALLOWED_MIMES.includes(file.type) && file.type !== '') {
    return { valid: false, error: 'Invalid file type.' };
  }

  return { valid: true };
}

export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9_\-.]/g, '_')
    .replace(/_{2,}/g, '_')
    .substring(0, 200);
}

export function getDocxMimeType(filename: string): boolean {
  const ext = filename.split('.').pop()?.toLowerCase();
  return ext === 'docx' || ext === 'doc';
}
