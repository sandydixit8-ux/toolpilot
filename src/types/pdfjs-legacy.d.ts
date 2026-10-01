// pdfjs-dist ships no types for the legacy build path; mirror the public API
// surface these tools use (see pdf-to-jpg.tsx for why we import the legacy build).
declare module 'pdfjs-dist/legacy/build/pdf.min.mjs' {
  export const GlobalWorkerOptions: { workerSrc: string };
  export function getDocument(src: unknown): {
    promise: Promise<{
      numPages: number;
      // The legacy build's real types aren't published for this path; the tools
      // only use the runtime API surface (getViewport/render/getTextContent).
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      getPage(n: number): Promise<any>;
      getMetadata(): Promise<any>;
    }>;
  };
}
