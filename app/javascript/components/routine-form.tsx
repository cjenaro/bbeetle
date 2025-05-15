import {
	useForm,
	getInputProps,
	getFieldsetProps,
	getFormProps,
} from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { z } from "zod";
import { useState } from "react";
import type { Errors } from "@inertiajs/core";
import { router } from "@inertiajs/react";

const BlockExerciseSchema = z.object({
	id: z.number().optional(),
	exercise_id: z.coerce.number().int().positive({ message: "Required" }),
	sets: z.coerce.number().int().min(1, { message: "Required" }),
	reps: z.coerce.number().int().min(1, { message: "Required" }),
});

const BlockSchema = z.object({
	id: z.number().optional(),
	title: z.string().min(1, { message: "Required" }),
	block_exercises: z
		.array(BlockExerciseSchema)
		.min(1, { message: "Add at least one exercise" }),
});

const DaySchema = z.object({
	id: z.number().optional(),
	name: z.string().min(1, { message: "Required" }),
	blocks: z.array(BlockSchema).min(1, { message: "Add at least one block" }),
});

const RoutineSchema = z.object({
	title: z.string().min(1, { message: "Required" }),
	description: z.string().optional(),
	is_active: z.coerce.boolean(),
	days: z.array(DaySchema).min(1, { message: "Add at least one day" }),
});

export type Exercise = { id: number; name: string };
export type Routine = z.infer<typeof RoutineSchema>;

export function RoutineForm({
	exercises,
	routine,
}: {
	exercises: Exercise[];
	routine?: Routine & { id: number };
}) {
	const [lastResult, setLastResult] = useState<Errors>();
	const isEditing = !!routine;

	const [form, fields] = useForm({
		lastResult,
		defaultValue: routine,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: RoutineSchema });
		},
		onSubmit(event, context) {
			event.preventDefault();
			if (isEditing) {
				router.patch(`/routines/${routine.id}`, context.submission?.payload, {
					onError: (errors) => setLastResult(errors),
				});
			} else {
				router.post("/routines", context.submission?.payload, {
					onError: (errors) => setLastResult(errors),
				});
			}
		},
	});

	const days = fields.days.getFieldList();
	return (
		<form {...getFormProps(form)} className="space-y-8">
			<div>
				<input
					{...getInputProps(fields.title, { type: "text" })}
					className="input input-bordered w-full mb-2"
					placeholder="Routine Name"
				/>
				<div className="text-error">{fields.title.errors}</div>
				<textarea
					{...getInputProps(fields.description, { type: "text" })}
					className="textarea textarea-bordered w-full"
					placeholder="Description"
				/>
				<div className="mt-2">
					<label>
						<input
							{...getInputProps(fields.is_active, { type: "checkbox" })}
							className="checkbox"
							defaultChecked
						/>{" "}
						Active
					</label>
				</div>
			</div>
			<fieldset {...getFieldsetProps(fields.days)}>
				<legend className="text-xl font-semibold mb-2">Days</legend>
				{days.map((dayField, dayIdx) => {
					const day = dayField.getFieldset();
					return (
						<div key={dayField.key} className="border p-4 mb-4 rounded">
							<div className="flex items-center mb-2">
								{day.id.value ? (
									<input
										{...getInputProps(day.id, {
											type: "hidden",
										})}
									/>
								) : null}
								<input
									{...getInputProps(day.name, { type: "text" })}
									className="input input-bordered mr-2"
									placeholder={`Day ${dayIdx + 1} Name`}
								/>
								<button
									{...form.remove.getButtonProps({
										name: fields.days.name,
										index: dayIdx,
									})}
									className="btn btn-error btn-xs"
									disabled={days.length === 1}
								>
									Remove Day
								</button>
							</div>
							<div className="text-error">{dayField.errors}</div>
							<fieldset {...getFieldsetProps(day.blocks)}>
								<legend className="font-semibold mb-2">Blocks</legend>
								{day.blocks.getFieldList().map((blockField, blockIdx) => {
									const block = blockField.getFieldset();
									return (
										<div
											key={blockField.key}
											className="border p-2 mb-2 rounded"
										>
											<div className="flex items-center mb-2">
												{block.id.value ? (
													<input
														{...getInputProps(block.id, {
															type: "hidden",
														})}
													/>
												) : null}
												<input
													{...getInputProps(block.title, {
														type: "text",
													})}
													className="input input-bordered mr-2"
													placeholder="Block Title"
												/>
												<button
													{...form.remove.getButtonProps({
														name: day.blocks.name,
														index: blockIdx,
													})}
													className="btn btn-error btn-xs"
													disabled={day.blocks.getFieldList().length === 1}
												>
													Remove Block
												</button>
											</div>
											<div className="text-error">{block.title.errors}</div>
											<fieldset {...getFieldsetProps(block.block_exercises)}>
												<legend className="font-semibold mb-1">
													Exercises
												</legend>
												{block.block_exercises
													.getFieldList()
													.map((exField, exIdx) => {
														const ex = exField.getFieldset();
														return (
															<div
																key={exField.key}
																className="flex gap-2 mb-1"
															>
																{ex.id.value ? (
																	<input
																		{...getInputProps(ex.id, {
																			type: "hidden",
																		})}
																	/>
																) : null}
																<select
																	{...getInputProps(ex.exercise_id, {
																		type: "number",
																	})}
																	className="select select-bordered"
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
																	{...getInputProps(ex.sets, {
																		type: "number",
																	})}
																	className="input input-bordered w-20"
																	placeholder="Sets"
																	min={1}
																	required
																/>
																<input
																	{...getInputProps(ex.reps, {
																		type: "number",
																	})}
																	className="input input-bordered w-20"
																	placeholder="Reps"
																	min={1}
																	required
																/>
																<button
																	{...form.remove.getButtonProps({
																		name: block.block_exercises.name,
																		index: exIdx,
																	})}
																	className="btn btn-error btn-xs"
																	disabled={
																		block.block_exercises.getFieldList()
																			.length === 1
																	}
																>
																	Remove
																</button>
															</div>
														);
													})}
												<button
													{...form.insert.getButtonProps({
														name: block.block_exercises.name,
													})}
													className="btn btn-secondary btn-xs mt-1"
												>
													Add Exercise
												</button>
											</fieldset>
										</div>
									);
								})}
								<button
									{...form.insert.getButtonProps({
										name: day.blocks.name,
									})}
									className="btn btn-primary btn-xs mt-2"
								>
									Add Block
								</button>
							</fieldset>
						</div>
					);
				})}
				<button
					{...form.insert.getButtonProps({
						name: fields.days.name,
					})}
					className="btn btn-primary"
				>
					Add Day
				</button>
			</fieldset>
			<button type="submit" className="btn btn-success w-full">
				{isEditing ? "Update Routine" : "Create Routine"}
			</button>
		</form>
	);
}
