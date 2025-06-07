import { z } from "zod";

export const WeekExerciseSchema = z.object({
	id: z.number().optional(),
	exercise_id: z.coerce.number().int().positive({ message: "Required" }),
	sets: z.coerce.number().int().min(1, { message: "Required" }),
	reps: z.coerce.number().int().min(1, { message: "Required" }),
});

export const WeekSchema = z.object({
	id: z.number().optional(),
	week_number: z.coerce.number().int().min(1).max(12),
	week_exercises: z.array(WeekExerciseSchema),
});

export const BlockExerciseSchema = z.object({
	id: z.number().optional(),
	exercise_id: z.coerce.number().int().positive({ message: "Required" }),
});

export const BlockSchema = z.object({
	id: z.number().optional(),
	title: z.string().min(1, { message: "Required" }),
	block_exercises: z
		.array(BlockExerciseSchema)
		.min(1, { message: "Add at least one exercise" }),
	weeks: z.array(WeekSchema).min(1, { message: "Add at least one week" }),
});

export const DaySchema = z.object({
	id: z.number().optional(),
	name: z.string().min(1, { message: "Required" }),
	blocks: z.array(BlockSchema).min(1, { message: "Add at least one block" }),
});

export const RoutineSchema = z.object({
	title: z.string().min(1, { message: "Required" }),
	description: z.string().optional(),
	is_active: z.coerce.boolean(),
	days: z.array(DaySchema).min(1, { message: "Add at least one day" }),
});

export type Exercise = { id: number; name: string };
export type Routine = z.infer<typeof RoutineSchema>; 