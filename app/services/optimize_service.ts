import sharp from 'sharp'

export class OptimizeService {
  async compressImage(filePath: string, outputName: string): Promise<void> {
    await sharp(filePath)
      .resize({
        width: 1024,
        withoutEnlargement: true,
      })
      .jpeg({
        quality: 75,
        progressive: true,
        mozjpeg: true
      })
      .toFile(outputName);
  }
}
