import { Head, router } from "@inertiajs/react";
import type { ReactNode } from "react";
import AuthLayout from "../../components/auth-layout";
import ExerciseForm from "./form";

export default function NewExercise({ errors = [] }: { errors: string[] }) {
	function handleSubmit(data: FormData) {
		router.post("/exercises", data);
	}

	return (
		<>
			<Head title="New Exercise" />
			<ExerciseForm
				errors={errors}
				onSubmit={handleSubmit}
				submitButtonText="Create Exercise"
			/>
		</>
	);
}

NewExercise.layout = (page: ReactNode) => <AuthLayout>{page}</AuthLayout>;
