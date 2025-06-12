import {
	useForm,
	getInputProps,
	getFieldsetProps,
	getFormProps,
	FormProvider,
} from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useState } from "react";
import type { Errors } from "@inertiajs/core";
import { router } from "@inertiajs/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import type { Exercise, Routine } from "./routine-form/routine_schema";
import { RoutineSchema } from "./routine-form/routine_schema";
import { DaySection } from "./routine-form/day-section";

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
		<FormProvider context={form.context}>
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
		</FormProvider>
	);
}