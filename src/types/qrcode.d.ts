declare module 'qrcode' {
  export interface QRCodeOptions {
    width?: number
    margin?: number
    color?: {
      dark?: string
      light?: string
    }
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'
  }
  
  export function toCanvas(
    canvas: HTMLCanvasElement,
    text: string,
    options?: QRCodeOptions
  ): Promise<void>
  
  export function toDataURL(
    text: string,
    options?: QRCodeOptions
  ): Promise<string>
} 
