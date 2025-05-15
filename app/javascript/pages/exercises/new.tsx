import { Head, router } from "@inertiajs/react";
import type { ReactNode } from "react";
import { useRef } from "react";
import AuthLayout from "../../components/auth-layout";

export default function NewExercise({ errors = [] }: { errors: string[] }) {
	const fileInput = useRef<HTMLInputElement>(null);

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const data = new FormData(e.currentTarget);
		if (fileInput.current?.files?.[0]) {
			data.append("exercise[media]", fileInput.current.files[0]);
		}
		router.post("/exercises", data);
	}

	return (
		<>
			<Head title="New Exercise" />
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
					/>
				</fieldset>
				<fieldset className="fieldset">
					<label className="label" htmlFor="exercise-media">
						Media (image or video):
					</label>
					<input
						type="file"
						accept="image/*,video/*"
						ref={fileInput}
						id="exercise-media"
						className="file-input file-input-bordered w-full"
					/>
				</fieldset>
				<button type="submit" className="btn btn-primary">
					Create Exercise
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
		</>
	);
}

NewExercise.layout = (page: ReactNode) => <AuthLayout>{page}</AuthLayout>;
