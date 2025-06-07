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
import { TrashIcon, PlusIcon } from "@heroicons/react/24/outline";

const WeekExerciseSchema = z.object({
	id: z.number().optional(),
	exercise_id: z.coerce.number().int().positive({ message: "Required" }),
	sets: z.coerce.number().int().min(1, { message: "Required" }),
	reps: z.coerce.number().int().min(1, { message: "Required" }),
});

const WeekSchema = z.object({
	id: z.number().optional(),
	week_number: z.coerce.number().int().min(1).max(12),
	week_exercises: z.array(WeekExerciseSchema),
});

const BlockExerciseSchema = z.object({
	id: z.number().optional(),
	exercise_id: z.coerce.number().int().positive({ message: "Required" }),
});

const BlockSchema = z.object({
	id: z.number().optional(),
	title: z.string().min(1, { message: "Required" }),
	block_exercises: z
		.array(BlockExerciseSchema)
		.min(1, { message: "Add at least one exercise" }),
	weeks: z.array(WeekSchema).min(1, { message: "Add at least one week" }),
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

function WeekExerciseRow({
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
								<TrashIcon className="w-4 h-4" />
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
									defaultValue: { exercise_id: 0 }
								})}
								className="btn btn-primary btn-xs mt-1"
								onClick={() => {
									// Add corresponding week_exercises for all weeks when adding a new exercise
									setTimeout(() => {
										block.weeks.getFieldList().forEach((weekField) => {
											const week = weekField.getFieldset();
											const exerciseCount = block.block_exercises.getFieldList().length;
											const weekExerciseCount = week.week_exercises.getFieldList().length;
											
											// Add week_exercise if we have fewer than block_exercises
											if (weekExerciseCount < exerciseCount) {
												const insertButton = document.querySelector(
													`button[name="${week.week_exercises.name}"]`
												) as HTMLButtonElement;
												if (insertButton) insertButton.click();
											}
										});
									}, 100);
								}}
							>
								<PlusIcon className="size-4" /> Exercise
							</button>
						</fieldset>

						<fieldset {...getFieldsetProps(block.weeks)}>
							<legend className="font-semibold mb-1 mt-4">Weeks</legend>
							{block.weeks.getFieldList().map((weekField, weekIndex) => (
								<WeekExerciseRow
									key={weekField.key}
									blockIndex={blockIndex}
									dayIndex={dayIndex}
									weekIndex={weekIndex}
									exercises={exercises}
									form={form}
								/>
							))}

							<button
								{...form.insert.getButtonProps({
									name: block.weeks.name,
									defaultValue: { 
										week_number: block.weeks.getFieldList().length + 1,
										week_exercises: block.block_exercises.getFieldList().map((blockExField) => {
											const blockEx = blockExField.getFieldset();
											return {
												exercise_id: blockEx.exercise_id.value || 0,
												sets: 1,
												reps: 1
											};
										})
									}
								})}
								className="btn btn-primary btn-xs mt-2"
							>
								<PlusIcon className="size-4" /> Week
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
								{...form.insert.getButtonProps({ name: day.blocks.name })}
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
		defaultValue: routine || {
			title: '',
			description: '',
			is_active: false,
			days: []
		},
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: RoutineSchema });
		},
		onSubmit(event, context) {
			event.preventDefault();
			const payload = context.submission?.payload;
			if (isEditing) {
				router.patch(`/routines/${routine.id}`, payload, {
					onError: (errors) => setLastResult(errors),
				});
			} else {
				router.post("/routines", payload, {
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
					<PlusIcon className="size-4" /> Day
				</button>
			</fieldset>

			<button type="submit" className="btn btn-success w-full">
				{isEditing ? "Update Routine" : "Create Routine"}
			</button>
		</form>
	);
}
