

export default async function uploadOnCloudinary(file: File) {
	console.log("Upload started");
	const responseData = await fetch(`/api/cloudinary`).then((res) => res.json());

	if (!responseData.success) {
		console.error("Failed to get signature:", responseData.message);
		return;
	}

	const signedURL = responseData.data;
	const form = new FormData();
	form.append("file", file);
	form.append("api_key", signedURL.apiKey);
	form.append("timestamp", signedURL.timestamp);
	form.append("folder", signedURL.folder);
	form.append("signature", signedURL.signature);

	try {
		const res = await fetch(signedURL.uploadUrl, {
			method: "POST",
			body: form,
		}).then((res) => res.json());
		console.log(res);
		const url = res.secure_url?.trim();
		return url;
	} catch (error) {
		console.error("Failed to upload image", error);
	}
};
