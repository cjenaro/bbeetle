import { z } from "zod/v4-mini";

// Configure English locale for proper error messages
z.config(z.locales.en());

export const RoutineSchema = z.object({
  title: z.string().check(z.minLength(1, { error: "Required" })),
  description: z.optional(z.string()),
  is_active: z.coerce.boolean(),
  days: z.array(z.object({
    id: z.optional(z.number()),
    name: z.string().check(z.minLength(1, { error: "Required" })),
    blocks: z.array(z.object({
      id: z.optional(z.number()),
      title: z.string().check(z.minLength(1, { error: "Required" })),
      weeks: z.array(z.object({
        id: z.optional(z.number()),
        week_number: z.coerce.number().check(
          z.gte(1),
          z.lte(12)
        ),
        week_exercises: z.array(z.object({
          id: z.optional(z.number()),
          exercise_id: z.coerce.number().check(z.positive({ error: "Required" })),
          sets: z.coerce.number().check(z.gte(1, { error: "Required" })),
          reps: z.coerce.number().check(z.gte(1, { error: "Required" })),
        })).check(z.minLength(1, { error: "Add at least one exercise" })),
      })).check(z.minLength(1, { error: "Add at least one week" })),
    })).check(z.minLength(1, { error: "Add at least one block" })),
  })).check(z.minLength(1, { error: "Add at least one day" })),
});

export type Exercise = { id: number; name: string };
export type Routine = z.infer<typeof RoutineSchema>; 