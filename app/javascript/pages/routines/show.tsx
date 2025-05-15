import { Head, Link } from "@inertiajs/react";
import type { ReactNode } from "react";
import AuthLayout from "../../components/auth-layout";
import { useState } from "react";

type BlockExercise = {
	exercise_id: number;
	sets: number;
	reps: number;
	id: number;
	exercise: Exercise;
};

type Exercise = {
	id: number;
	name: string;
	description: string;
	media_url?: string;
};

type Block = {
	id: number;
	title: string;
	block_exercises: BlockExercise[];
};

type Day = {
	id: number;
	name: string;
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
	const [selectedDayId, setSelectedDayId] = useState(
		routine.days[0]?.id ?? null,
	);
	const [expandedExercise, setExpandedExercise] = useState<{
		[blockId: number]: number | null;
	}>({});

	const selectedDay = routine.days.find((d) => d.id === selectedDayId);

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
			<div className="mb-4 flex gap-2 overflow-x-auto">
				{routine.days.map((day) => (
					<button
						type="button"
						key={day.id}
						className={`px-4 py-2 rounded ${
							day.id === selectedDayId
								? "bg-blue-600 text-white"
								: "bg-zinc-200 dark:bg-zinc-700"
						}`}
						onClick={() => {
							setSelectedDayId(day.id);
							setExpandedExercise({});
						}}
					>
						{day.name}
					</button>
				))}
			</div>
			{!selectedDay ? (
				<p>No day selected.</p>
			) : (
				<div>
					{selectedDay.blocks.length === 0 && <p>No blocks.</p>}
					<div className="join join-vertical bg-base-100 w-full">
						{selectedDay.blocks.map((block) => (
							<div
								key={block.id}
								className="collapse collapse-arrow join-item border-base-300 border"
							>
								<input type="radio" name="block-accordion" />
								<div className="collapse-title font-semibold">
									{block.title}
								</div>
								<div className="collapse-content text-sm">
									{block.block_exercises.length === 0 && <p>No exercises.</p>}
									<table className="table table-zebra w-full">
										<thead>
											<tr>
												<th>Name</th>
												<th>Sets</th>
												<th>Reps</th>
												<th />
											</tr>
										</thead>
										<tbody>
											{block.block_exercises.map((ex) => (
												<ExerciseRow key={ex.id} ex={ex} />
											))}
										</tbody>
									</table>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</>
	);
}

function ExerciseRow({ ex }: { ex: BlockExercise }) {
	const [expanded, setExpanded] = useState(false);
	return (
		<>
			<tr>
				<td>{ex.exercise.name}</td>
				<td className="text-center">{ex.sets}</td>
				<td className="text-center">{ex.reps}</td>
				<td className="text-right">
					<button
						type="button"
						className="btn btn-sm btn-outline"
						onClick={() => setExpanded((v) => !v)}
					>
						{expanded ? "Hide" : "See more"}
					</button>
				</td>
			</tr>
			{expanded && (
				<tr>
					<td colSpan={4} className="bg-zinc-50 dark:bg-zinc-800 p-4">
						<p className="text-zinc-500 mb-2">{ex.exercise.description}</p>
						{ex.exercise.media_url && (
							<div className="mt-2">
								<img
									src={ex.exercise.media_url}
									alt={ex.exercise.name}
									className="max-w-xs rounded"
								/>
							</div>
						)}
					</td>
				</tr>
			)}
		</>
	);
}

RoutineShow.layout = (page: ReactNode) => <AuthLayout>{page}</AuthLayout>;
