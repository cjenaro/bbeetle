import {
	useForm,
	getInputProps,
	getFieldsetProps,
	getFormProps,
	type FieldMetadata,
	type FormMetadata,
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
	weeks_count: z.coerce.number().int().min(1).max(12),
	weekly_reps: z.array(z.number().int().min(1)),
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

function WeeklyRepsInputs({
	weeklyRepsField,
	weeksCount,
}: {
	weeklyRepsField: FieldMetadata<number[]>;
	weeksCount: number;
}) {
	return (
		<div className="pl-4 mt-2">
			<div className="text-sm font-medium mb-1">Weekly Reps:</div>
			{Array.from({ length: weeksCount || 1 }, (_, weekIdx) => {
				const weekField = weeklyRepsField.getFieldList()[weekIdx];

				if (!weekField) {
					return (
						<div
							key={`${weeklyRepsField.name}-week-${weekIdx}-fallback`}
							className="flex gap-2 items-center mb-1"
						>
							<span className="text-sm">Week {weekIdx + 1}:</span>
							<input
								name={`${weeklyRepsField.name}[${weekIdx}]`}
								type="number"
								className="input input-bordered input-sm w-20"
								placeholder="Reps"
								min={1}
								required
							/>
						</div>
					);
				}

				return (
					<div key={weekField.key} className="flex gap-2 items-center mb-1">
						<span className="text-sm">Week {weekIdx + 1}:</span>
						<input
							{...getInputProps(weekField, { type: "number" })}
							className="input input-bordered input-sm w-20"
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

function ExerciseRow({
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

							<input
								{...getInputProps(ex.sets, { type: "number" })}
								className="input input-bordered w-20"
								placeholder="Sets"
								min={1}
								required
							/>

							<input
								{...getInputProps(ex.weeks_count, { type: "number" })}
								className="input input-bordered w-20"
								placeholder="Weeks"
								min={1}
								max={12}
								required
							/>

							<WeeklyRepsInputs
								weeklyRepsField={ex.weekly_reps}
								weeksCount={Number(ex.weeks_count.value)}
							/>

							<div className="flex justify-end">
								<button
									{...form.remove.getButtonProps({
										name: block.block_exercises.name,
										index: exerciseIndex,
									})}
									className="btn btn-error btn-xs"
									disabled={block.block_exercises.getFieldList().length === 1}
								>
									Remove Exercise
								</button>
							</div>
						</div>
					);
				})}
		</>
	);
}

function BlockSection({
	dayIndex,
	exercises,
	form,
}: {
	dayIndex: number;
	exercises: Exercise[];
	form: FormMetadata<z.infer<typeof RoutineSchema>>;
}) {
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
								{...form.remove.getButtonProps({
									name: day.blocks.name,
									index: blockIndex,
								})}
								className="btn btn-error btn-xs"
								disabled={day.blocks.getFieldList().length === 1}
							>
								Remove Block
							</button>
						</div>

						<div className="text-error">{block.title.errors}</div>

						<fieldset {...getFieldsetProps(block.block_exercises)}>
							<legend className="font-semibold mb-1">Exercises</legend>
							<ExerciseRow
								blockIndex={blockIndex}
								dayIndex={dayIndex}
								exercises={exercises}
								form={form}
							/>

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
		</>
	);
}

function DaySection({
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
								Remove Day
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
								{...form.insert.getButtonProps({ name: day.blocks.name })}
								className="btn btn-primary btn-xs mt-2"
							>
								Add Block
							</button>
						</fieldset>
					</div>
				);
			})}
		</>
	);
}

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
				<DaySection exercises={exercises} form={form} />

				<button
					{...form.insert.getButtonProps({ name: fields.days.name })}
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
