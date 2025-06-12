import { Head, Link } from "@inertiajs/react";
import type { ReactNode } from "react";
import AuthLayout from "../../components/auth-layout";
import { useState } from "react";
import UnauthLayout from "../../components/unauth-layout";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import AnimatedTabs from "../../components/animated-tabs";
import { motion, AnimatePresence } from "motion/react";

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

type Block = {
  id: number;
  title: string;
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
        <p className="text-sm font-medium mb-2">
          Week {selectedWeek} of {maxWeeks}
        </p>
        <AnimatedTabs
          tabs={Array.from({ length: maxWeeks }, (_, i) => ({
            id: i + 1,
            label: `Week ${i + 1}`
          }))}
          activeTab={selectedWeek}
          onTabChange={(tabId) => setSelectedWeek(tabId as number)}
        />
      </div>

      <AnimatedTabs
        tabs={routine.days.map((day) => ({
          id: day.id,
          label: day.name
        }))}
        activeTab={selectedDayId}
        onTabChange={(tabId) => setSelectedDayId(tabId as number)}
        className="mb-4"
      />
      {!selectedDay ? (
        <p>No day selected.</p>
      ) : (
        <Blocks blocks={selectedDay.blocks} selectedWeek={selectedWeek} />
      )}
    </>
  );
}

function Blocks({
  blocks,
  selectedWeek,
}: {
  blocks: Block[];
  selectedWeek: number;
}) {
  const [openBlockId, setOpenBlockId] = useState<number | null>(null);

  return (
    <div>
      {blocks.length === 0 && <p>No blocks.</p>}
      <div className="join join-vertical bg-base-100 w-full">
        {blocks.map((block) => (
          <BlockComponent
            key={block.id}
            block={block}
            selectedWeek={selectedWeek}
            isOpen={openBlockId === block.id}
            onToggle={() => setOpenBlockId(openBlockId === block.id ? null : block.id)}
          />
        ))}
      </div>
    </div>
  );
}

function BlockComponent({
  block,
  selectedWeek,
  isOpen,
  onToggle,
}: {
  block: Block;
  selectedWeek: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  // Find the week data for the selected week
  const selectedWeekData = block.weeks.find(
    (w) => w.week_number === selectedWeek
  );

  // Get all unique exercises across all weeks in this block
  const allExercises = block.weeks
    .flatMap((week) => week.week_exercises)
    .reduce((acc, we) => {
      if (!acc.find((ex) => ex.id === we.exercise.id)) {
        acc.push(we.exercise);
      }
      return acc;
    }, [] as Exercise[]);

  // If no week data exists, show the exercises without sets/reps
  const hasWeekData = selectedWeekData !== undefined;

  return (
    <div className="join-item border-base-300 border">
      <button
        className="w-full px-4 py-3 text-left font-semibold hover:bg-base-200 flex items-center justify-between"
        onClick={onToggle}
        type="button"
      >
        {block.title}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <ChevronDownIcon className="w-5 h-5" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 text-sm">
              {allExercises.length === 0 && <p>No exercises.</p>}
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
                  {allExercises.map((exercise) => {
                    // Find the week exercise for this exercise in the selected week
                    const weekExercise = selectedWeekData?.week_exercises.find(
                      (we) => we.exercise_id === exercise.id
                    );

                    return (
                      <ExerciseRow
                        key={exercise.id}
                        exercise={exercise}
                        weekExercise={weekExercise}
                        hasWeekData={hasWeekData}
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ExerciseRow({
  exercise,
  weekExercise,
  hasWeekData,
}: {
  exercise: Exercise;
  weekExercise?: WeekExercise;
  hasWeekData: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr className={!hasWeekData ? "opacity-50" : ""}>
        <td>{exercise.name}</td>
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
      <AnimatePresence>
        {expanded && (
          <motion.tr
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            layout
          >
            <td colSpan={4} className="bg-zinc-50 dark:bg-zinc-800 p-0 overflow-hidden">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <div className="p-4">
                  <p className="text-zinc-800 dark:text-zinc-200 mb-2">{exercise.description}</p>
                  {exercise.media_url && (
                    <div className="mt-2">
                      <img
                        src={exercise.media_url}
                        alt={exercise.name}
                        className="max-w-xs rounded"
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            </td>
          </motion.tr>
        )}
      </AnimatePresence>
    </>
  );
}

RoutineShow.layout = (page: ReactNode & { props: { user?: { id: number } } }) =>
  page.props.user ? (
    <AuthLayout>{page}</AuthLayout>
  ) : (
    <UnauthLayout>{page}</UnauthLayout>
  );
