import {
	getInputProps,
	useFormMetadata,
} from "@conform-to/react";
import { z } from "zod";
import { TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import type { Exercise } from "./routine_schema";
import { RoutineSchema } from "./routine_schema";
import { ExerciseRow } from "./exercise-row";

export function BlockSection({
	dayIndex,
	exercises,
}: {
	dayIndex: number;
	exercises: Exercise[];
}) {
	const form = useFormMetadata<z.infer<typeof RoutineSchema>>();
	const fields = form.getFieldset();
	const dayField = fields.days.getFieldList()[dayIndex];
	const day = dayField.getFieldset();

	return (
		<>
			{day.blocks.getFieldList().map((blockField, blockIndex) => {
				const block = blockField.getFieldset();

				return (
					<div key={blockField.key} className="border p-2 mb-2 rounded">
						<div className="flex items-center mb-2">
							{block.id.value ? (
								<input {...getInputProps(block.id, { type: "hidden" })} />
							) : null}

							<input
								{...getInputProps(block.title, { type: "text" })}
								className="input input-bordered mr-2"
								placeholder="Block Title"
							/>

							<button
								{...form.insert.getButtonProps({
									name: block.weeks.name,
									defaultValue: { 
										week_number: block.weeks.getFieldList().length + 1,
										week_exercises: [{
											exercise_id: 0,
											sets: 1,
											reps: 1
										}]
									}
								})}
								className="btn btn-primary btn-xs"
							>
								<PlusIcon className="size-4" /> Week
							</button>
							<button
								{...form.remove.getButtonProps({
									name: day.blocks.name,
									index: blockIndex,
								})}
								className="btn btn-error btn-xs"
								disabled={day.blocks.getFieldList().length === 1}
							>
								<TrashIcon className="w-4 h-4" />
							</button>
						</div>

						<div className="text-error">{block.title.errors}</div>

						<div>
							<h3 className="font-semibold mb-2">Weeks & Exercises</h3>
							<ExerciseRow
								blockIndex={blockIndex}
								dayIndex={dayIndex}
								exercises={exercises}
							/>
						</div>
					</div>
				);
			})}
		</>
	);
} 