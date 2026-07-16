declare module 'pdfmake/build/pdfmake' {
  interface PdfMake {
    createPdf: (docDef: any) => PdfDocument
    addVirtualFileSystem: (vfs: Record<string, string>) => void
    vfs: any
    fonts: any
    virtualfs: any
    urlAccessPolicy: string[]
    localAccessPolicy: string[]
  }

  interface PdfDocument {
    download: (filename?: string) => void
    open: () => void
    print: () => void
    getBlob: (callback: (blob: Blob) => void) => void
    getBase64: (callback: (data: string) => void) => void
    getDataUrl: (callback: (data: string) => void) => void
    getBuffer: (callback: (buffer: ArrayBuffer) => void) => void
  }

  const pdfMake: PdfMake
  export default pdfMake
}

declare module 'pdfmake/build/vfs_fonts' {
  const vfs: any
  export default vfs
}
