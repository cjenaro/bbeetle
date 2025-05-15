import { Head } from "@inertiajs/react";

import AuthLayout from "../../components/auth-layout";
import { type Exercise, RoutineForm } from "../../components/routine-form";

export default function RoutineNew({ exercises }: { exercises: Exercise[] }) {
	return (
		<>
			<Head title="Create New Routine" />
			<h1 className="text-3xl font-bold mb-4">Create New Routine</h1>
			<RoutineForm exercises={exercises} />
		</>
	);
}

RoutineNew.layout = (page: React.ReactNode) => <AuthLayout>{page}</AuthLayout>;
