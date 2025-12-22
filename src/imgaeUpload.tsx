import React, { useState } from 'react';
import axios from 'axios';

function ImageUpload() {
	const [file, setFile] = useState<File | null>(null);
	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setFile(e.target.files[0]);
			setError(null);
		}
	};

	const uploadFileToS3 = async () => {
		if (!file) {
			setError('Please select a file first');
			return;
		}

		setLoading(true);
		setError(null);

		try {
			// 1️⃣ Get presigned URL (DO NOT encode filename)
			const res = await axios.get('/uploads/presign', {
				params: {
					filename: file.name, // ✅ correct
					type: file.type || 'application/octet-stream',
					// folder: 'general', // optional
				},
			});

			const { uploadUrl, publicUrl } = res.data;

			// 2️⃣ Upload directly to S3 (PUT only)
			await fetch(uploadUrl, {
				method: 'PUT',
				body: file,
				headers: {
					'Content-Type': file.type || 'application/octet-stream',
				},
			});

			// 3️⃣ Success
			setImageUrl(publicUrl);
			setFile(null);

			// Reset file input
			const input = document.querySelector('input[type="file"]') as HTMLInputElement;
			if (input) input.value = '';
		} catch (err: any) {
			console.error('Upload failed:', err);

			let message = 'Upload failed';
			if (err.response?.data?.error) {
				message = err.response.data.error;
			} else if (err.message) {
				message = err.message;
			}

			setError(message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
			<h3>Upload Image</h3>

			<input type="file" accept="image/*" onChange={handleFileChange} disabled={loading} />

			<button onClick={uploadFileToS3} disabled={!file || loading} style={{ marginLeft: '10px' }}>
				{loading ? 'Uploading...' : 'Upload'}
			</button>

			{error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

			{imageUrl && (
				<div style={{ marginTop: '20px' }}>
					<h4>Uploaded Image:</h4>
					<img
						src={imageUrl}
						alt="Uploaded"
						style={{
							maxWidth: '400px',
							borderRadius: '8px',
							boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
						}}
					/>
					<p
						style={{
							marginTop: '10px',
							wordBreak: 'break-all',
							fontSize: '12px',
							color: '#555',
						}}
					>
						{imageUrl}
					</p>
				</div>
			)}
		</div>
	);
}

export default ImageUpload;
