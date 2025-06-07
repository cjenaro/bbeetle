import {
	getInputProps,
	type FormMetadata,
} from "@conform-to/react";
import { z } from "zod";
import { useState } from "react";
import type { Exercise, RoutineSchema } from "./types";

export function WeekExerciseRow({
	blockIndex,
	dayIndex,
	weekIndex,
	exercises,
	form,
}: {
	blockIndex: number;
	dayIndex: number;
	weekIndex: number;
	exercises: Exercise[];
	form: FormMetadata<z.infer<typeof RoutineSchema>>;
}) {
	const fields = form.getFieldset();
	const dayField = fields.days.getFieldList()[dayIndex];
	const day = dayField.getFieldset();
	const blockField = day.blocks.getFieldList()[blockIndex];
	const block = blockField.getFieldset();
	const weekField = block.weeks.getFieldList()[weekIndex];
	const week = weekField.getFieldset();

	const [sameForAllExercises, setSameForAllExercises] = useState(false);
	const [sharedSets, setSharedSets] = useState<number | ''>('');
	const [sharedReps, setSharedReps] = useState<number | ''>('');

	function handleSameForAllChange(checked: boolean) {
		setSameForAllExercises(checked);
		if (checked && sharedSets && sharedReps) {
			// Update all exercise inputs with shared values
			week.week_exercises.getFieldList().forEach((_, exerciseIndex) => {
				const setsInput = document.querySelector(`input[name="${week.week_exercises.name}[${exerciseIndex}].sets"]`) as HTMLInputElement;
				const repsInput = document.querySelector(`input[name="${week.week_exercises.name}[${exerciseIndex}].reps"]`) as HTMLInputElement;
				if (setsInput) {
					setsInput.value = sharedSets.toString();
					setsInput.dispatchEvent(new Event('input', { bubbles: true }));
				}
				if (repsInput) {
					repsInput.value = sharedReps.toString();
					repsInput.dispatchEvent(new Event('input', { bubbles: true }));
				}
			});
		}
	}

	return (
		<div className="pl-4 mt-2 border-l-2 border-gray-200">
			<div className="flex items-center gap-2 mb-2">
				<h5 className="text-sm font-medium">Week {weekIndex + 1}</h5>
				<label className="flex items-center gap-1 text-xs">
					<input
						type="checkbox"
						className="checkbox checkbox-xs"
						checked={sameForAllExercises}
						onChange={(e) => handleSameForAllChange(e.target.checked)}
					/>
					Same sets/reps for all exercises
				</label>
			</div>

			{week.id.value ? (
				<input {...getInputProps(week.id, { type: "hidden" })} />
			) : null}

			<input
				{...getInputProps(week.week_number, { type: "hidden" })}
				value={weekIndex + 1}
			/>

			{sameForAllExercises && (
				<div className="flex gap-2 mb-2 text-xs">
					<input
						type="number"
						className="input input-bordered input-xs w-16"
						placeholder="Sets"
						min={1}
						value={sharedSets}
						onChange={(e) => setSharedSets(Number(e.target.value))}
					/>
					<input
						type="number"
						className="input input-bordered input-xs w-16"
						placeholder="Reps"
						min={1}
						value={sharedReps}
						onChange={(e) => setSharedReps(Number(e.target.value))}
					/>
					<span className="text-xs self-center">for all exercises</span>
				</div>
			)}

			{week.week_exercises.getFieldList().map((weekExerciseField, exerciseIndex) => {
				const weekExercise = weekExerciseField.getFieldset();
				const blockExercises = block.block_exercises.getFieldList();
				const blockExercise = blockExercises[exerciseIndex];
				
				if (!blockExercise) return null;
				
				const blockEx = blockExercise.getFieldset();
				const selectedExercise = exercises.find(ex => ex.id === Number(blockEx.exercise_id.value));

				return (
					<div key={weekExerciseField.key} className="flex gap-2 mb-1 items-center text-sm">
						{weekExercise.id.value ? (
							<input {...getInputProps(weekExercise.id, { type: "hidden" })} />
						) : null}

						<input
							{...getInputProps(weekExercise.exercise_id, { type: "hidden" })}
							value={blockEx.exercise_id.value || ''}
						/>

						<span className="w-32 text-xs">{selectedExercise?.name || 'Unknown'}</span>

						<input
							{...getInputProps(weekExercise.sets, { type: "number" })}
							className={`input input-bordered input-sm w-16 ${sameForAllExercises ? 'hidden' : ''}`}
							placeholder="Sets"
							min={1}
							required
						/>

						<input
							{...getInputProps(weekExercise.reps, { type: "number" })}
							className={`input input-bordered input-sm w-16 ${sameForAllExercises ? 'hidden' : ''}`}
							placeholder="Reps"
							min={1}
							required
						/>
					</div>
				);
			})}
		</div>
	);
} 