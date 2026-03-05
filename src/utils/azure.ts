import { BlobServiceClient } from "@azure/storage-blob";
import sharp from "sharp";

export async function uploadImage(image: File): Promise<string | null> {
	try {
		const connectionString =
			import.meta.env.AZURE_CONNECTION_STRING ||
			process.env.AZURE_CONNECTION_STRING;
		const blobService =
			BlobServiceClient.fromConnectionString(connectionString);
		const container = blobService.getContainerClient("images");

		const fileName = `${Date.now()}-${image.name.replace(/\s+/g, "-")}`;
		const buffer = await sharp(Buffer.from(await image.arrayBuffer()))
			.rotate()
			.toBuffer();

		const blobClient = container.getBlockBlobClient(fileName);
		await blobClient.uploadData(buffer, {
			blobHTTPHeaders: { blobContentType: image.type },
		});

		return blobClient.url;
	} catch (e) {
		console.error("Upload error:", e);
		return null;
	}
}
