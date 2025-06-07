import { Head, Link } from "@inertiajs/react";
import type { ReactNode } from "react";
import AuthLayout from "../../components/auth-layout";
import { useState } from "react";
import UnauthLayout from "../../components/unauth-layout";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";

type Exercise = {
  id: number;
  name: string;
  description: string;
  media_url?: string;
};

type WeekExercise = {
  id: number;
  exercise_id: number;
  sets: number;
  reps: number;
  exercise: Exercise;
};

type Week = {
  id: number;
  week_number: number;
  week_exercises: WeekExercise[];
};

type BlockExercise = {
  id: number;
  exercise_id: number;
  exercise: Exercise;
};

type Block = {
  id: number;
  title: string;
  block_exercises: BlockExercise[];
  weeks: Week[];
};

type Day = {
  id: number;
  name: string;
  blocks: Block[];
};

type Routine = {
  id: number;
  title: string;
  description: string;
  is_active: boolean;
  days: Day[];
};

export default function RoutineShow({
  routine,
  user,
  current_week = 1,
}: {
  routine: Routine;
  user?: { id: number };
  current_week?: number;
}) {
  const [selectedDayId, setSelectedDayId] = useState(routine.days[0].id);
  const [selectedWeek, setSelectedWeek] = useState(current_week);
  const selectedDay = routine.days.find((d) => d.id === selectedDayId);
  const isLoggedIn = user !== undefined;

  // Get the maximum weeks across all blocks
  const maxWeeks = selectedDay
    ? Math.max(
        ...selectedDay.blocks.map((block) =>
          Math.max(...block.weeks.map((w) => w.week_number), 0)
        ),
        1
      )
    : 1;

  return (
    <>
      <Head title={routine.title} />
      <div className="mb-6 grid grid-cols-[auto_1fr] justify-items-start gap-4">
        <h1 className="text-xl font-bold">{routine.title}</h1>
        <p className="text-xs">
          {routine.is_active ? (
            <span className="badge badge-accent">Active</span>
          ) : (
            <span className="badge badge-secondary">Inactive</span>
          )}
        </p>

        <p className="text-zinc-500 dark:text-zinc-300 col-span-2">
          {routine.description}
        </p>

        {isLoggedIn && (
          <Link
            href={`/routines/${routine.id}/edit`}
            className="btn btn-primary mt-4"
          >
            Edit Routine
          </Link>
        )}
      </div>

      <div className="mb-4">
        <span className="text-sm font-medium mb-2">
          Week {selectedWeek} of {maxWeeks}
        </span>
        <div role="tablist" className="tabs tabs-box overflow-x-auto">
          {Array.from({ length: maxWeeks }, (_, i) => i + 1).map((week) => (
            <button
              role="tab"
              key={week}
              className={`tab${week === selectedWeek ? " tab-active" : ""}`}
              onClick={() => setSelectedWeek(week)}
              type="button"
            >
              Week {week}
            </button>
          ))}
        </div>
      </div>

      <div role="tablist" className="tabs tabs-box mb-4 overflow-x-auto">
        {routine.days.map((day) => (
          <button
            role="tab"
            key={day.id}
            className={`tab${day.id === selectedDayId ? " tab-active" : ""}`}
            onClick={() => setSelectedDayId(day.id)}
            type="button"
          >
            {day.name}
          </button>
        ))}
      </div>
      {!selectedDay ? (
        <p>No day selected.</p>
      ) : (
        <div>
          {selectedDay.blocks.length === 0 && <p>No blocks.</p>}
          <div className="join join-vertical bg-base-100 w-full">
            {selectedDay.blocks.map((block) => (
              <BlockComponent
                key={block.id}
                block={block}
                selectedWeek={selectedWeek}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function BlockComponent({
  block,
  selectedWeek,
}: {
  block: Block;
  selectedWeek: number;
}) {
  // Find the week data for the selected week
  const selectedWeekData = block.weeks.find(
    (w) => w.week_number === selectedWeek
  );

  // If no week data exists, show the block exercises without sets/reps
  const hasWeekData = selectedWeekData !== undefined;

  return (
    <div className="collapse collapse-arrow join-item border-base-300 border">
      <input type="radio" name="block-accordion" />
      <div className="collapse-title font-semibold">{block.title}</div>
      <div className="collapse-content text-sm">
        {block.block_exercises.length === 0 && <p>No exercises.</p>}
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th className="text-left">Name</th>
              <th className="text-center">Sets</th>
              <th className="text-center">Reps</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {block.block_exercises.map((blockExercise) => {
              // Find the week exercise for this exercise in the selected week
              const weekExercise = selectedWeekData?.week_exercises.find(
                (we) => we.exercise_id === blockExercise.exercise_id
              );

              return (
                <ExerciseRow
                  key={blockExercise.id}
                  blockExercise={blockExercise}
                  weekExercise={weekExercise}
                  hasWeekData={hasWeekData}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ExerciseRow({
  blockExercise,
  weekExercise,
  hasWeekData,
}: {
  blockExercise: BlockExercise;
  weekExercise?: WeekExercise;
  hasWeekData: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr className={!hasWeekData ? "opacity-50" : ""}>
        <td>{blockExercise.exercise.name}</td>
        <td className="text-center">
          {weekExercise ? weekExercise.sets : hasWeekData ? "-" : "N/A"}
        </td>
        <td className="text-center">
          {weekExercise ? weekExercise.reps : hasWeekData ? "-" : "N/A"}
          {!hasWeekData && (
            <span className="text-xs text-gray-500 ml-1">(No data)</span>
          )}
        </td>
        <td className="text-right">
          <button
            type="button"
            className="btn btn-sm btn-outline"
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? (
              <MinusIcon className="size-4 text-current" />
            ) : (
              <PlusIcon className="size-4 text-current" />
            )}
          </button>
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={4} className="bg-zinc-50 dark:bg-zinc-800 p-4">
            <p className="text-zinc-500 mb-2">
              {blockExercise.exercise.description}
            </p>
            {blockExercise.exercise.media_url && (
              <div className="mt-2">
                <img
                  src={blockExercise.exercise.media_url}
                  alt={blockExercise.exercise.name}
                  className="max-w-xs rounded"
                />
              </div>
            )}
          </td>
        </tr>
      )}
    </>
  );
}

RoutineShow.layout = (page: ReactNode & { props: { user?: { id: number } } }) =>
  page.props.user ? (
    <AuthLayout>{page}</AuthLayout>
  ) : (
    <UnauthLayout>{page}</UnauthLayout>
  );
