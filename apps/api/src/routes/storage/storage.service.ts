import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from 'src/env.js';
import { r2 } from 'src/lib/r2.js';

class StorageService {
	async getUploadUrl(key: string, contentType: string) {
		const command = new PutObjectCommand({
			Bucket: env.R2_BUCKET,
			Key: key,
			ContentType: contentType,
		});

		const url = await getSignedUrl(r2, command, { expiresIn: 300 });
		return { uploadUrl: url, key };
	}

	getPublicUrl(key: string) {
		return `${env.R2_PUBLIC_URL}/${key}`;
	}

	async deleteFile(key: string) {
		await r2.send(new DeleteObjectCommand({ Bucket: env.R2_BUCKET, Key: key }));
	}
}

export const storageService = new StorageService();
