import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'

const vfs: any = (pdfFonts as any).default || pdfFonts
if (vfs && typeof vfs === 'object' && Object.keys(vfs).length > 0) {
  if (typeof (pdfMake as any).addVirtualFileSystem === 'function') {
    ;(pdfMake as any).addVirtualFileSystem(vfs)
  } else {
    ;(pdfMake as any).vfs = vfs
  }
}

export default pdfMake
