import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiOptions } from 'cloudinary';
// import { Readable } from 'stream';

@Injectable()
export class ImagesService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(
    buffer: Buffer,
    folder: string = 'uploads',
    options?: UploadApiOptions,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder, ...options },
        (error, result) => {
          if (error) {
            reject(new Error(`Image upload failed: ${error.message}`));
          } else if (result && result.secure_url) {
            resolve(result.secure_url);
          } else {
            reject(
              new Error(
                'Image upload failed: No result returned from Cloudinary.',
              ),
            );
          }
        },
      );
      uploadStream.end(buffer);
    });
  }
}
//   async deleteImage(publicId: string): Promise<void> {
//     return new Promise((resolve, reject) => {
//       cloudinary.uploader.destroy(
//         publicId,
//         (
//           error: { message?: string } | null,
//           result: { result?: string } | undefined
//         ) => {
//           if (error) {
//             reject(new Error(`Image deletion failed: ${error.message ?? 'Unknown error'}`));
//           } else if (result && result.result === 'ok') {
//             resolve();
//           } else {
//             reject(
//               new Error(
//                 'Image deletion failed: No result returned from Cloudinary.',
//               ),
//             );
//           }
//         }
//       );
//     });
//   }
// }
