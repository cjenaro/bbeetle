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
			<form onSubmit={handleSubmit} encType="multipart/form-data">
				<label>
					Name:
					<input name="exercise[name]" required />
				</label>
				<label>
					Description:
					<textarea name="exercise[description]" required />
				</label>
				<label>
					Media (image or video):
					<input type="file" accept="image/*,video/*" ref={fileInput} />
				</label>
				<button type="submit">Create Exercise</button>
				{errors.length > 0 && (
					<ul>
						{errors.map((e) => (
							<li key={e}>{e}</li>
						))}
					</ul>
				)}
			</form>
		</>
	);
}

NewExercise.layout = (page: ReactNode) => <AuthLayout>{page}</AuthLayout>;
