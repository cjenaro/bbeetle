import { router } from "@inertiajs/react";
import { useRef, useState } from "react";
import imageCompression from "browser-image-compression";

interface ExerciseFormProps {
	errors: string[];
	onSubmit: (data: FormData) => void;
	submitButtonText: string;
	initialValues?: {
		name?: string;
		description?: string;
		media_url?: string;
		id?: string;
	};
}

export default function ExerciseForm({
	errors,
	onSubmit,
	submitButtonText,
	initialValues = {},
}: ExerciseFormProps) {
	const fileInput = useRef<HTMLInputElement>(null);
	const [isCompressing, setIsCompressing] = useState(false);
	const [fileErrors, setFileErrors] = useState<string[]>([]);

	const MAX_FILE_SIZE_MB = 50; // 50MB limit
	const MAX_COMPRESSED_SIZE_MB = 5; // Target compressed size

	async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;

		setFileErrors([]);

		// Check initial file size
		if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
			setFileErrors([`File too large. Maximum size is ${MAX_FILE_SIZE_MB}MB`]);
			if (fileInput.current) fileInput.current.value = "";
			return;
		}

		// Compress if it's an image
		if (file.type.startsWith("image/")) {
			setIsCompressing(true);
			try {
				const options = {
					maxSizeMB: MAX_COMPRESSED_SIZE_MB,
					maxWidthOrHeight: 1920,
					useWebWorker: true,
					fileType: "image/jpeg",
				};

				const compressedFile = await imageCompression(file, options);

				// Create a new file input with the compressed file
				const dt = new DataTransfer();
				dt.items.add(
					new File([compressedFile], file.name.replace(/\.[^/.]+$/, ".jpg"), {
						type: "image/jpeg",
					}),
				);

				if (fileInput.current) {
					fileInput.current.files = dt.files;
				}

				console.log(
					`Compressed from ${(file.size / 1024 / 1024).toFixed(2)}MB to ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`,
				);
			} catch (error) {
				setFileErrors([
					"Failed to compress image. Please try a different file.",
				]);
				if (fileInput.current) fileInput.current.value = "";
			}
			setIsCompressing(false);
		}
	}

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (isCompressing) return;

		const data = new FormData(e.currentTarget);
		if (fileInput.current?.files?.[0]) {
			data.append("exercise[media]", fileInput.current.files[0]);
		}
		onSubmit(data);
	}

	return (
		<form
			onSubmit={handleSubmit}
			encType="multipart/form-data"
			className="grid grid-cols-1 gap-4"
		>
			<fieldset className="fieldset">
				<label className="label" htmlFor="exercise-name">
					Name:
				</label>
				<input
					className="input input-xl w-full"
					id="exercise-name"
					name="exercise[name]"
					required
					defaultValue={initialValues.name}
				/>
			</fieldset>
			<fieldset className="fieldset">
				<label className="label" htmlFor="exercise-description">
					Description:
				</label>
				<textarea
					className="textarea textarea-xl w-full"
					id="exercise-description"
					name="exercise[description]"
					required
					defaultValue={initialValues.description}
				/>
			</fieldset>
			<fieldset className="fieldset">
				<label className="label" htmlFor="exercise-media">
					Media (image or video - max {MAX_FILE_SIZE_MB}MB):
				</label>
				{initialValues.media_url && (
					<div className="mb-2 p-2 border rounded">
						<p className="text-sm text-gray-600 mb-2">Current media:</p>
						{initialValues.media_url.match(/\.mp4|webm|ogg$/i) ? (
							<video src={initialValues.media_url} controls width={200}>
								<track kind="captions" />
							</video>
						) : (
							<img
								src={initialValues.media_url}
								alt="Current media"
								width={200}
							/>
						)}
						<button
							type="button"
							className="btn btn-sm btn-error mt-2"
							onClick={() =>
								router.delete(`/exercises/${initialValues.id}/delete_media`)
							}
						>
							Remove Media
						</button>
					</div>
				)}
				<input
					type="file"
					accept="image/*,video/*"
					ref={fileInput}
					id="exercise-media"
					className="file-input file-input-bordered w-full"
					onChange={handleFileChange}
					disabled={isCompressing}
				/>
				{isCompressing && (
					<p className="text-sm text-blue-600 mt-1">Compressing image...</p>
				)}
				{fileErrors.length > 0 && (
					<ul className="flex flex-col gap-1 mt-1">
						{fileErrors.map((error) => (
							<li key={error} className="text-red-500 text-sm">
								{error}
							</li>
						))}
					</ul>
				)}
			</fieldset>
			<button
				type="submit"
				className="btn btn-primary"
				disabled={isCompressing}
			>
				{isCompressing ? "Processing..." : submitButtonText}
			</button>
			{errors.length > 0 && (
				<ul className="flex flex-col gap-2">
					{errors.map((e) => (
						<li key={e} className="text-red-500">
							{e}
						</li>
					))}
				</ul>
			)}
		</form>
	);
}
