export interface CertificateStorageProvider {
  /**
   * Store the generated PDF certificate buffer
   */
  storePdf(certificateNumber: string, pdfBuffer: Buffer): Promise<string>;
  
  /**
   * Retrieve the PDF URL
   */
  getPdfUrl(certificateNumber: string): Promise<string>;
}

export class ProductionStorageProvider implements CertificateStorageProvider {
  async storePdf(certificateNumber: string, pdfBuffer: Buffer): Promise<string> {
    if (!process.env.STORAGE_ACCESS_KEY_ID || !process.env.STORAGE_SECRET_ACCESS_KEY) {
      throw new Error("Production storage credentials not configured. Please see DEPLOYMENT.md");
    }
    // E.g. using AWS S3 client:
    // const s3 = new S3Client({...})
    // await s3.send(new PutObjectCommand({...}))
    const bucketUrl = process.env.NEXT_PUBLIC_STORAGE_URL || `https://${process.env.STORAGE_BUCKET_NAME}.r2.cloudflarestorage.com`;
    return `${bucketUrl}/certs/${certificateNumber}.pdf`;
  }

  async getPdfUrl(certificateNumber: string): Promise<string> {
    const bucketUrl = process.env.NEXT_PUBLIC_STORAGE_URL || `https://${process.env.STORAGE_BUCKET_NAME}.r2.cloudflarestorage.com`;
    return `${bucketUrl}/certs/${certificateNumber}.pdf`;
  }
}

export class MockStorageProvider implements CertificateStorageProvider {
  async storePdf(certificateNumber: string, pdfBuffer: Buffer): Promise<string> {
    return `https://mock-storage.learning-hub-by-kd.vercel.app/certs/${certificateNumber}.pdf`;
  }
  async getPdfUrl(certificateNumber: string): Promise<string> {
    return `https://mock-storage.learning-hub-by-kd.vercel.app/certs/${certificateNumber}.pdf`;
  }
}

export function getCertificateStorage(): CertificateStorageProvider {
  if (process.env.NODE_ENV === 'production') {
    return new ProductionStorageProvider();
  }
  return new MockStorageProvider();
}
