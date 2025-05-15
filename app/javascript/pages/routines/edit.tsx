import { Head } from "@inertiajs/react";

import AuthLayout from "../../components/auth-layout";
import {
	type Exercise,
	type Routine,
	RoutineForm,
} from "../../components/routine-form";

export default function RoutineEdit({
	exercises,
	routine,
}: {
	exercises: Exercise[];
	routine: Routine & { id: number };
}) {
	return (
		<>
			<Head title="Edit Routine" />
			<h1 className="text-3xl font-bold mb-4">Edit Routine</h1>
			<RoutineForm exercises={exercises} routine={routine} />
		</>
	);
}

RoutineEdit.layout = (page: React.ReactNode) => <AuthLayout>{page}</AuthLayout>;
