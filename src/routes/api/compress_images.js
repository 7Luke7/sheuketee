import sharp from "sharp"

export const compress_image = async (buffer, quality, width, height) => {
    try {
        const image = sharp(buffer);
        const metadata = await image.metadata();

        let formatOptions = {};
        switch (metadata.format) {
            case 'jpeg':
                formatOptions = { quality };
                break;
            case 'png':
                formatOptions = { quality: Math.floor(quality / 100 * 9) }; // PNG quality is 0-9
                break;
            case 'webp':
                formatOptions = { quality };
                break;
            case 'avif':
                formatOptions = { quality };
                break;
            default:
                throw new Error('Unsupported image format');
        }

        const compressedBuffer = await image
            .resize({ width: width, height: height, fit: 'cover' })
            [metadata.format](formatOptions).toFormat("webp").toBuffer()

        return compressedBuffer;
    } catch (error) {
        console.log(error)
    }
}