namespace SPECTOR {
    export class ReadPixelsHelper {
        public static isSupportedCombination(type: number, format: number, internalFormat: number) {
            // Only reads RGB RGBA.
            if (format !== WebGlConstants.RGB.value &&
                format !== WebGlConstants.RGBA.value) {
                return false;
            }

            // Only reads 8 16 32.
            if (internalFormat !== WebGlConstants.RGB.value &&
                internalFormat !== WebGlConstants.RGBA.value &&
                internalFormat !== WebGlConstants.RGBA16F.value &&
                internalFormat !== WebGlConstants.RGBA32F.value &&
                internalFormat !== WebGlConstants.RGB16F.value &&
                internalFormat !== WebGlConstants.RGB32F.value) {
                return false;
            }

            // Only reads https://www.khronos.org/registry/webgl/specs/latest/2.0/ texImage2D supported combination.
            if (type !== WebGlConstants.UNSIGNED_BYTE.value &&
                type !== WebGlConstants.UNSIGNED_SHORT_4_4_4_4.value &&
                type !== WebGlConstants.UNSIGNED_SHORT_5_5_5_1.value &&
                type !== WebGlConstants.UNSIGNED_SHORT_5_6_5.value &&
                type !== WebGlConstants.HALF_FLOAT.value &&
                type !== WebGlConstants.FLOAT.value) {
                return false;
            }

            return true;
        }

        public static readPixels(gl: WebGLRenderingContext, x: number, y: number, width: number, height: number, type: number): Uint8Array {
            // Empty error list.
            gl.getError();

            // prepare destination storage.
            const size = width * height * 4;
            let pixels: ArrayBufferView;
            if (type === WebGlConstants.UNSIGNED_BYTE.value) {
                pixels = new Uint8Array(size);
            }
            else if (type === WebGlConstants.FLOAT.value) {
                pixels = new Float32Array(size);
            }

            // Read the pixels from the frame buffer.
            gl.readPixels(x, y, width, height, gl.RGBA, type, pixels);
            if (gl.getError()) {
                return undefined;
            }

            // In case of unsigned bytes, return directly.
            if (type === WebGlConstants.UNSIGNED_BYTE.value) {
                return pixels as Uint8Array;
            }

            // Else, attempt to convert.
            const newPixels = new Uint8Array(width * height * 4);
            for (let i = 0; i < height; i++) {
                for (let j = 0; j < width; j++) {
                    newPixels[i * width * 4 + j * 4 + 0] = Math.min(Math.max((pixels as any)[i * width * 4 + j * 4 + 0], 0), 1) * 255;
                    newPixels[i * width * 4 + j * 4 + 1] = Math.min(Math.max((pixels as any)[i * width * 4 + j * 4 + 1], 0), 1) * 255;
                    newPixels[i * width * 4 + j * 4 + 2] = Math.min(Math.max((pixels as any)[i * width * 4 + j * 4 + 2], 0), 1) * 255;
                    newPixels[i * width * 4 + j * 4 + 3] = Math.min(Math.max((pixels as any)[i * width * 4 + j * 4 + 3], 0), 1) * 255;
                }
            }

            return newPixels;
        }
    }
}