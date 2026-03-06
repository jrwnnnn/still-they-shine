import { createClient } from "@libsql/client";
import { BlobServiceClient } from "@azure/storage-blob";

async function purgeOrphanImages() {
	console.log("Starting purge...");

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

	console.log(`Active images in DB: ${active.size}`);

	if (!active.size) throw new Error("Active set empty. Abort.");

	let checked = 0;
	let deleted = 0;

	for await (const blob of container.listBlobsFlat()) {
		checked++;
		if (!active.has(blob.name)) {
			console.log(`Deleting: ${blob.name}`);
			await container.deleteBlob(blob.name);
			deleted++;
		}
	}

	console.log(`Purge complete. Checked: ${checked}, Deleted: ${deleted}`);
}

purgeOrphanImages().catch((err) => {
	console.error("Error:", err);
	process.exit(1);
});
