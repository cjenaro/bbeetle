import {
	FieldMetadata,
	getInputProps,
	useFormMetadata,
} from "@conform-to/react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { Exercise, RoutineSchema } from "./types";
import { z } from "zod";

export function ExerciseRow({
	blockIndex,
	dayIndex,
	exercises,
}: {
	blockIndex: number;
	dayIndex: number;
	exercises: Exercise[];
}) {
	const form = useFormMetadata<z.infer<typeof RoutineSchema>>()
	const fields = form.getFieldset();
	const dayField = fields.days.getFieldList()[dayIndex];
	const day = dayField.getFieldset();
	const blockField = day.blocks.getFieldList()[blockIndex];
	const block = blockField.getFieldset();

	return (
		<>
			{block.block_exercises
				.getFieldList()
				.map((exerciseField, exerciseIndex) => {
					const ex = exerciseField.getFieldset();

					return (
						<div key={exerciseField.key} className="flex gap-2 mb-1">
							{ex.id.value ? (
								<input {...getInputProps(ex.id, { type: "hidden" })} />
							) : null}

							<select
								{...getInputProps(ex.exercise_id, { type: "number" })}
								className="select select-bordered"
								required
							>
								<option value="">Select Exercise</option>
								{exercises.map((exercise) => (
									<option key={exercise.id} value={exercise.id}>
										{exercise.name}
									</option>
								))}
							</select>
							

							<div className="flex justify-end">
								<button
									{...form.remove.getButtonProps({
										name: block.block_exercises.name,
										index: exerciseIndex,
									})}
									className="btn btn-error btn-xs"
									disabled={block.block_exercises.getFieldList().length === 1}
								>
									<TrashIcon className="w-4 h-4" />
								</button>
							</div>
						</div>
					);
				})}
							<Weeks blockIndex={blockIndex} dayIndex={dayIndex} />
		</>
	);
} 

function Weeks({ blockIndex, dayIndex }: { blockIndex: number, dayIndex: number }) {
	const form = useFormMetadata<z.infer<typeof RoutineSchema>>()
	const fields = form.getFieldset();
	const dayField = fields.days.getFieldList()[dayIndex];
	const day = dayField.getFieldset();
	const blockField = day.blocks.getFieldList()[blockIndex];
	const block = blockField.getFieldset();

	return (
		<>
			{block.weeks.getFieldList().map((weekField, index) => {
				const week = weekField.getFieldset();
				const weekExercises = week.week_exercises.getFieldList();
				return (
					<div key={weekField.key}>
						<input {...getInputProps(week.id, { type: "hidden" })} />
						<input {...getInputProps(week.week_number, { type: "hidden" })} value={index + 1} />
						
						{weekExercises.map((weekExercise) => {
							const exercise = weekExercise.getFieldset();
							return (	
								<div key={weekExercise.key} className="flex gap-2 mb-1">
									<input {...getInputProps(exercise.exercise_id, { type: "hidden", value: exercise.exercise_id.value })} />
									<input {...getInputProps(exercise.sets, { type: "number" })} className="input input-bordered input-xs size-8 appearance-none" />
									<input {...getInputProps(exercise.reps, { type: "number" })} className="input input-bordered input-xs size-8 appearance-none" />
								</div>
							);
						})}

						<button className="btn btn-error btn-xs" {...form.remove.getButtonProps({ name: block.weeks.name, index: index })}>
							<TrashIcon className="w-4 h-4" />
						</button>
					</div>
				);
			})}
		</>
	);
}