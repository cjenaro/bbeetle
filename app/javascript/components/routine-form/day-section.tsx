import {
	getInputProps,
	getFieldsetProps,
	type FormMetadata,
} from "@conform-to/react";
import { z } from "zod";
import { TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import type { Exercise } from "./routine_schema";
import { RoutineSchema } from "./routine_schema";
import { BlockSection } from "./block-section";

export function DaySection({
	exercises,
	form,
}: {
	exercises: Exercise[];
	form: FormMetadata<z.infer<typeof RoutineSchema>>;
}) {
	const fields = form.getFieldset();
	const daysField = fields.days;

	return (
		<>
			{daysField.getFieldList().map((dayField, dayIndex) => {
				const day = dayField.getFieldset();

				return (
					<div key={dayField.key} className="border p-4 mb-4 rounded">
						<div className="flex items-center mb-2">
							{day.id.value ? (
								<input {...getInputProps(day.id, { type: "hidden" })} />
							) : null}

							<input
								{...getInputProps(day.name, { type: "text" })}
								className="input input-bordered mr-2"
								placeholder={`Day ${dayIndex + 1} Name`}
							/>

							<button
								{...form.remove.getButtonProps({
									name: daysField.name,
									index: dayIndex,
								})}
								className="btn btn-error btn-xs"
								disabled={daysField.getFieldList().length === 1}
							>
								<TrashIcon className="size-4" />
							</button>
						</div>

						<div className="text-error">{dayField.errors}</div>

						<fieldset {...getFieldsetProps(day.blocks)}>
							<legend className="font-semibold mb-2">Blocks</legend>
							<BlockSection
								dayIndex={dayIndex}
								exercises={exercises}
								form={form}
							/>

							<button
								{...form.insert.getButtonProps({ 
									name: day.blocks.name,
									defaultValue: { 
										title: '', 
										weeks: [{ 
											week_number: 1, 
											week_exercises: [{ exercise_id: 0, sets: 1, reps: 1 }] 
										}] 
									}
								})}
								className="btn btn-primary btn-xs mt-2"
							>
								<PlusIcon className="size-4" /> Block
							</button>
						</fieldset>
					</div>
				);
			})}
		</>
	);
} 