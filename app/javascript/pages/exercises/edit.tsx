import { Head, router } from "@inertiajs/react";
import type { ReactNode } from "react";
import AuthLayout from "../../components/auth-layout";
import ExerciseForm from "./form";

export default function EditExercise({
	errors = [],
	exercise,
}: {
	errors: string[];
	exercise: {
		id: string;
		name: string;
		description: string;
		media_url: string;
	};
}) {
	function handleSubmit(data: FormData) {
		router.patch(`/exercises/${exercise.id}`, data);
	}

	return (
		<>
			<Head title="Edit Exercise" />
			<ExerciseForm
				errors={errors}
				onSubmit={handleSubmit}
				submitButtonText="Update Exercise"
				initialValues={{
					name: exercise.name,
					description: exercise.description,
					media_url: exercise.media_url,
					id: exercise.id,
				}}
			/>
		</>
	);
}

EditExercise.layout = (page: ReactNode) => <AuthLayout>{page}</AuthLayout>;
