import { createClient } from "@libsql/client";
import { BlobServiceClient } from "@azure/storage-blob";

async function purgeOrphanImages() {
	const turso = createClient({
		url: process.env.TURSO_DATABASE_URL!,
		authToken: process.env.TURSO_AUTH_TOKEN!,
	});

	const container = BlobServiceClient.fromConnectionString(
		process.env.AZURE_CONNECTION_STRING!,
	).getContainerClient("images");

	const { rows } = await turso.execute(
		"SELECT image_url FROM stars WHERE image_url IS NOT NULL",
	);

	const active = new Set(
		rows.map((r) => new URL(r.image_url as string).pathname.split("/").pop()),
	);

	if (!active.size) throw new Error("Active set empty. Abort.");

	for await (const blob of container.listBlobsFlat()) {
		if (!active.has(blob.name)) {
			await container.deleteBlob(blob.name);
		}
	}

	console.log("Purge complete.");
}

purgeOrphanImages().catch((err) => {
	console.error(err);
	process.exit(1);
});
