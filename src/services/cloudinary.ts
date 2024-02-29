/**
 * Uploads a file to Cloudinary.
 *
 * @param {File} file - the file to be uploaded
 * @return {string} the URL of the uploaded image
 */
export const uploadToCloudinary = async (
	file: File
): Promise<string | null> => {
	const formData = new FormData();
	formData.append('file', file);
	formData.append('upload_preset', 'image-editor');

	try {
		const response = await fetch(
			'https://api.cloudinary.com/v1_1/developermaxenius/image/upload',
			{
				method: 'POST',
				body: formData,
			}
		);
		const data = await response.json();
		return data.secure_url; // Return the uploaded image URL
	} catch (error) {
		console.error('Error uploading image:', error);
		return null;
	}
};
