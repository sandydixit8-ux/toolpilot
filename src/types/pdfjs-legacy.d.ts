// pdfjs-dist ships no types for the legacy build path; mirror the API surface
// the tools use (see pdf-to-jpg.tsx for why we import the legacy build).
declare module 'pdfjs-dist/legacy/build/pdf.min.mjs' {
  interface LegacyPdfPage {
    getViewport(params: { scale: number }): { width: number; height: number };
    render(params: {
      canvasContext: CanvasRenderingContext2D;
      viewport: { width: number; height: number };
      canvas?: HTMLCanvasElement;
    }): { promise: Promise<void> };
    getTextContent(): Promise<{
      items: Array<{ str?: string; transform?: number[]; width?: number; hasEOL?: boolean }>;
    }>;
    getOperatorList(): Promise<{ fnArray: number[] }>;
  }

  export const GlobalWorkerOptions: { workerSrc: string };
  export function getDocument(src: unknown): {
    promise: Promise<{
      numPages: number;
      getPage(n: number): Promise<LegacyPdfPage>;
      getMetadata(): Promise<{ info?: Record<string, string | Date | undefined> }>;
    }>;
  };
}
