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

			{/* Week Selector */}
			<div className="mb-4">
				<label htmlFor="week-select" className="block text-sm font-medium mb-2">
					Select Week (max {maxWeeks} weeks)
				</label>
				<select
					id="week-select"
					value={selectedWeek}
					onChange={(e) => setSelectedWeek(Number(e.target.value))}
					className="select select-bordered"
				>
					{Array.from({ length: maxWeeks }, (_, i) => i + 1).map((week) => (
						<option key={week} value={week}>
							Week {week}
						</option>
					))}
				</select>
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
												<th>Weeks</th>
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
	const hasProgression = ex.weeks_count > 1;
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
				<td className="text-center">
					<span
						className={`badge ${hasProgression ? "badge-primary" : "badge-neutral"} badge-sm`}
					>
						{ex.weeks_count} week{ex.weeks_count !== 1 ? "s" : ""}
					</span>
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
					<td colSpan={5} className="bg-zinc-50 dark:bg-zinc-800 p-4">
						<p className="text-zinc-500 mb-2">{ex.exercise.description}</p>
						{hasProgression && (
							<div className="mt-3">
								<h4 className="font-semibold text-sm mb-2">
									Weekly Progression:
								</h4>
								<div
									className="grid gap-2 text-xs"
									style={{
										gridTemplateColumns: `repeat(${ex.weeks_count}, 1fr)`,
									}}
								>
									{Array.from({ length: ex.weeks_count }, (_, i) => {
										const weekNum = i + 1;
										let reps = 0;

										// Handle both array and object formats
										if (Array.isArray(ex.weekly_reps)) {
											reps = ex.weekly_reps[i] || 0;
										} else {
											const weekKey = `week_${weekNum}`;
											const legacyReps = ex.weekly_reps as Record<
												string,
												number
											>;
											reps = legacyReps[weekKey] || 0;
										}

										const isCurrentWeek = weekNum === selectedWeek;

										return (
											<div
												key={weekNum}
												className={`text-center p-2 rounded ${isCurrentWeek ? "bg-primary text-primary-content" : "bg-base-200"}`}
											>
												<div className="font-semibold">Week {weekNum}</div>
												<div>{reps} reps</div>
											</div>
										);
									})}
								</div>
							</div>
						)}
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
