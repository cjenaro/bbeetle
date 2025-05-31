import { Head, Link } from "@inertiajs/react";
import type { ReactNode } from "react";
import AuthLayout from "../../components/auth-layout";
import { useState } from "react";
import UnauthLayout from "../../components/unauth-layout";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";

type BlockExercise = {
	exercise_id: number;
	sets: number;
	weeks_count: number;
	weekly_reps: number[] | Record<string, number>; // Support both formats for backward compatibility
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

export default function RoutineShow({
	routine,
	user,
	current_week = 1,
}: {
	routine: Routine;
	user?: { id: number };
	current_week?: number;
}) {
	const [selectedDayId, setSelectedDayId] = useState(routine.days[0].id);
	const [selectedWeek, setSelectedWeek] = useState(current_week);
	const selectedDay = routine.days.find((d) => d.id === selectedDayId);
	const isLoggedIn = user !== undefined;

	// Get the maximum weeks across all exercises to show in week selector
	const maxWeeks = selectedDay
		? Math.max(
				...selectedDay.blocks.flatMap((block) =>
					block.block_exercises.map((ex) => ex.weeks_count || 1),
				),
				1,
			)
		: 1;

	const getRepsForWeek = (exercise: BlockExercise) => {
		// New array format
		if (Array.isArray(exercise.weekly_reps)) {
			return exercise.weekly_reps[selectedWeek - 1] || 10;
		}

		// Legacy object format
		const weekKey = `week_${selectedWeek}`;
		const legacyReps = exercise.weekly_reps as Record<string, number>;
		return legacyReps[weekKey] || legacyReps.week_1 || 10;
	};

	return (
		<>
			<Head title={routine.title} />
			<div className="mb-6 grid grid-cols-[auto_1fr] justify-items-start gap-4">
				<h1 className="text-xl font-bold">{routine.title}</h1>
				<p className="text-xs">
					{routine.is_active ? (
						<span className="badge badge-accent">Active</span>
					) : (
						<span className="badge badge-secondary">Inactive</span>
					)}
				</p>

				<p className="text-zinc-500 dark:text-zinc-300 col-span-2">
					{routine.description}
				</p>

				{isLoggedIn && (
					<Link
						href={`/routines/${routine.id}/edit`}
						className="btn btn-primary mt-4"
					>
						Edit Routine
					</Link>
				)}
			</div>

			<div className="mb-4">
				<span className="text-sm font-medium mb-2">
					Week {selectedWeek} of {maxWeeks}
				</span>
				<div role="tablist" className="tabs tabs-box overflow-x-auto">
					{Array.from({ length: maxWeeks }, (_, i) => i + 1).map((week) => (
						<button
							role="tab"
							key={week}
							className={`tab${week === selectedWeek ? " tab-active" : ""}`}
							onClick={() => setSelectedWeek(week)}
							type="button"
						>
							Week {week}
						</button>
					))}
				</div>
			</div>

			<div role="tablist" className="tabs tabs-box mb-4 overflow-x-auto">
				{routine.days.map((day) => (
					<button
						role="tab"
						key={day.id}
						className={`tab${day.id === selectedDayId ? " tab-active" : ""}`}
						onClick={() => setSelectedDayId(day.id)}
						type="button"
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
												<th>Reps (Week {selectedWeek})</th>
												<th />
											</tr>
										</thead>
										<tbody>
											{block.block_exercises.map((ex) => (
												<ExerciseRow
													key={ex.id}
													ex={ex}
													selectedWeek={selectedWeek}
													getRepsForWeek={getRepsForWeek}
												/>
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

function ExerciseRow({
	ex,
	selectedWeek,
	getRepsForWeek,
}: {
	ex: BlockExercise;
	selectedWeek: number;
	getRepsForWeek: (exercise: BlockExercise) => number;
}) {
	const [expanded, setExpanded] = useState(false);
	const isWeekAvailable = selectedWeek <= ex.weeks_count;

	return (
		<>
			<tr className={!isWeekAvailable ? "opacity-50" : ""}>
				<td>{ex.exercise.name}</td>
				<td className="text-center">{ex.sets}</td>
				<td className="text-center">
					{isWeekAvailable ? getRepsForWeek(ex) : "-"}
					{!isWeekAvailable && (
						<span className="text-xs text-gray-500 ml-1">(N/A)</span>
					)}
				</td>
				<td className="text-right">
					<button
						type="button"
						className="btn btn-sm btn-outline"
						onClick={() => setExpanded((v) => !v)}
					>
						{expanded ? (
							<MinusIcon className="size-4 text-current" />
						) : (
							<PlusIcon className="size-4 text-current" />
						)}
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

RoutineShow.layout = (
	page: ReactNode & { props: { user?: { id: number } } },
) =>
	page.props.user ? (
		<AuthLayout>{page}</AuthLayout>
	) : (
		<UnauthLayout>{page}</UnauthLayout>
	);
