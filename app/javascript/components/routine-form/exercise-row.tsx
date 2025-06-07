import {
	getInputProps,
	type FormMetadata,
} from "@conform-to/react";
import { z } from "zod";
import { TrashIcon } from "@heroicons/react/24/outline";
import type { Exercise, RoutineSchema } from "./types";

export function ExerciseRow({
	blockIndex,
	dayIndex,
	exercises,
	form,
}: {
	blockIndex: number;
	dayIndex: number;
	exercises: Exercise[];
	form: FormMetadata<z.infer<typeof RoutineSchema>>;
}) {
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
		</>
	);
} 