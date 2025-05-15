import { Head, Link } from "@inertiajs/react";
import type { ReactNode } from "react";
import AuthLayout from "../../components/auth-layout";

type BlockExercise = {
	exercise_id: number;
	sets: number;
	reps: number;
	// Optionally, add exercise name if you preload it
	exercise?: { name: string };
};

type Block = {
	title: string;
	block_exercises: BlockExercise[];
};

type Day = {
	id: number;
	blocks: Block[];
};

type Routine = {
	id: number;
	title: string;
	description: string;
	is_active: boolean;
	days: Day[];
};

export default function RoutineShow({ routine }: { routine: Routine }) {
	return (
		<>
			<Head title={routine.title} />
			<div className="mb-6">
				<h1 className="text-3xl font-bold">{routine.title}</h1>
				<p className="text-zinc-500 dark:text-zinc-300">
					{routine.description}
				</p>
				<p className="text-xs mt-2">
					{routine.is_active ? (
						<span className="text-green-500">Active</span>
					) : (
						<span className="text-gray-400">Inactive</span>
					)}
				</p>
				<Link
					href={`/routines/${routine.id}/edit`}
					className="btn btn-primary mt-4"
				>
					Edit Routine
				</Link>
			</div>
			<div>
				<h2 className="text-xl font-semibold mb-2">Days</h2>
				{routine.days.length === 0 && <p>No days in this routine.</p>}
				{routine.days.map((day, dayIdx) => (
					<div key={day.id} className="mb-6">
						<h3 className="font-bold mb-2">Day {dayIdx + 1}</h3>
						{day.blocks.length === 0 && <p className="ml-4">No blocks.</p>}
						{day.blocks.map((block, blockIdx) => (
							<div key={blockIdx} className="ml-4 mb-2">
								<div className="font-semibold">{block.title}</div>
								{block.block_exercises.length === 0 && (
									<p className="ml-4">No exercises.</p>
								)}
								<ul className="ml-4 list-disc">
									{block.block_exercises.map((ex, exIdx) => (
										<li key={exIdx}>
											{ex.exercise?.name || `Exercise #${ex.exercise_id}`} —{" "}
											{ex.sets} sets × {ex.reps} reps
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				))}
			</div>
		</>
	);
}

RoutineShow.layout = (page: ReactNode) => <AuthLayout>{page}</AuthLayout>;
