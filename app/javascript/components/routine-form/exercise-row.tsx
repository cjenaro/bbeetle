import {
	getInputProps,
	useFormMetadata,
} from "@conform-to/react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { Exercise } from "./routine_schema";
import { RoutineSchema } from "./routine_schema";
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
	const form = useFormMetadata<z.infer<typeof RoutineSchema>>();
	const fields = form.getFieldset();
	const dayField = fields.days.getFieldList()[dayIndex];
	const day = dayField.getFieldset();
	const blockField = day.blocks.getFieldList()[blockIndex];
	const block = blockField.getFieldset();

	return (
		<div className="space-y-4">
			{block.weeks.getFieldList().map((weekField, weekIndex) => {
				const week = weekField.getFieldset();
				
				return (
					<div key={weekField.key} className="border p-2 rounded" >
						{week.id.value ? (
							<input {...getInputProps(week.id, { type: "hidden" })} />
						) : null}
						<input 
							{...getInputProps(week.week_number, { type: "hidden" })} 
							value={weekIndex + 1} 
						/>
						
						<div className="flex items-center justify-between mb-2">
							<h4 className="font-medium">Week {weekIndex + 1}</h4>
							<div className="flex gap-1">
								<button
									{...form.insert.getButtonProps({
										name: week.week_exercises.name,
										defaultValue: { 
											exercise_id: 0,
											sets: 1,
											reps: 1
										}
									})}
									className="btn btn-primary btn-xs"
								>
									<PlusIcon className="size-3" /> Exercise
								</button>
								<button
									{...form.insert.getButtonProps({
										name: block.weeks.name,
										index: weekIndex + 1,
										defaultValue: {
											week_number: weekIndex + 2,
											week_exercises: week.week_exercises.getFieldList().map(field => {
												const exercise = field.getFieldset();
												return {
													exercise_id: exercise.exercise_id.value || 0,
													sets: exercise.sets.value || 1,
													reps: exercise.reps.value || 1
												};
											})
										}
									})}
									className="btn btn-secondary btn-xs"
								>
									<PlusIcon className="size-3" /> Clone Week
								</button>
								<button
									{...form.remove.getButtonProps({
										name: block.weeks.name,
										index: weekIndex,
									})}
									className="btn btn-error btn-xs"
									disabled={block.weeks.getFieldList().length === 1}
								>
									<TrashIcon className="size-3" />
								</button>
							</div>
						</div>

						<div className="space-y-2">
							{week.week_exercises.getFieldList().map((weekExerciseField, exerciseIndex) => {
								const exercise = weekExerciseField.getFieldset();
								
								return (
									<div key={weekExerciseField.key} className="flex gap-2 items-center">
										{exercise.id.value ? (
											<input {...getInputProps(exercise.id, { type: "hidden" })} />
										) : null}

										<select
											{...getInputProps(exercise.exercise_id, { type: "number" })}
											className="select select-bordered select-sm flex-1"
											required
										>
											<option value="">Select Exercise</option>
											{exercises.map((ex) => (
												<option key={ex.id} value={ex.id}>
													{ex.name}
												</option>
											))}
										</select>

										<input
											{...getInputProps(exercise.sets, { type: "number" })}
											className="input input-bordered input-sm w-16"
											placeholder="Sets"
											min="1"
										/>

										<input
											{...getInputProps(exercise.reps, { type: "number" })}
											className="input input-bordered input-sm w-16"
											placeholder="Reps"
											min="1"
										/>

										<button
											{...form.remove.getButtonProps({
												name: week.week_exercises.name,
												index: exerciseIndex,
											})}
											className="btn btn-error btn-xs"
											disabled={week.week_exercises.getFieldList().length === 1}
										>
											<TrashIcon className="size-3" />
										</button>
									</div>
								);
							})}
						</div>

						<div className="text-error text-xs mt-1">
							{week.week_exercises.errors}
						</div>
					</div>
				);
			})}
		</div>
	);
}