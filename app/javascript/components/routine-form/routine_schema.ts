import { z } from "zod";

export const RoutineSchema = z.object({
  title: z.string().min(1, { message: "Required" }),
  description: z.string().optional(),
  is_active: z.coerce.boolean(),
  days: z.array(z.object({
    id: z.number().optional(),
    name: z.string().min(1, { message: "Required" }),
    blocks: z.array(z.object({
      id: z.number().optional(),
      title: z.string().min(1, { message: "Required" }),
      weeks: z.array(z.object({
        id: z.number().optional(),
        week_number: z.coerce.number().int().min(1).max(12),
        week_exercises: z.array(z.object({
          id: z.number().optional(),
          exercise_id: z.coerce.number().int().positive({ message: "Required" }),
          sets: z.coerce.number().int().min(1, { message: "Required" }),
          reps: z.coerce.number().int().min(1, { message: "Required" }),
        })).min(1, { message: "Add at least one exercise" }),
      })).min(1, { message: "Add at least one week" }),
    })).min(1, { message: "Add at least one block" }),
  })).min(1, { message: "Add at least one day" }),
});

export type Exercise = { id: number; name: string };
export type Routine = z.infer<typeof RoutineSchema>; 