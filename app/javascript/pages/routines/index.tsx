import { Head, Link, router } from "@inertiajs/react";
import type { ReactNode } from "react";
import { useState } from "react";
import AuthLayout from "../../components/auth-layout";
import {
	PencilIcon,
	TrashIcon,
	DocumentTextIcon,
} from "@heroicons/react/24/outline";

type BlockExercise = {
	exercise_id: number;
	sets: number;
	reps: number;
};

type Block = {
	title: string;
	block_exercises: BlockExercise[];
};

type Day = {
	id: number;
	blocks: Block[];
};

type Routine = {
	id: number;
	title: string;
	description: string;
	is_active: boolean;
	days: Day[];
};

export default function RoutinesIndex({ routines }: { routines: Routine[] }) {
	const [filter, setFilter] = useState("");

	function handleFilter(e: React.ChangeEvent<HTMLInputElement>) {
		setFilter(e.target.value);
	}

	return (
		<>
			<Head title="Routines" />
			<div className="flex justify-end my-4">
				<Link href="/routines/new" className="btn btn-primary">
					New Routine
				</Link>
			</div>
			<input
				type="search"
				placeholder="Filter"
				aria-label="Filter"
				onChange={handleFilter}
				className="input input-bordered w-full max-w-xs my-4"
			/>
			<div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
				{routines
					.filter((r) => r.title.toLowerCase().includes(filter.toLowerCase()))
					.map((routine) => (
						<RoutineCard key={routine.id} {...routine} />
					))}
			</div>
		</>
	);
}

RoutinesIndex.layout = (page: ReactNode) => <AuthLayout>{page}</AuthLayout>;

function RoutineCard({ id, title, description, is_active }: Routine) {
	return (
		<div className="card bg-primary/5 text-primary-content">
			<div className="card-body gap-5">
				<div className="flex justify-between">
					<h2 className="card-title">{title}</h2>
					<div className="card-actions">
						<Link
							href={`/routines/${id}/edit`}
							className="btn btn-primary btn-sm bg-indigo-400/20 text-indigo-200"
						>
							<PencilIcon className="w-4 h-4" />
						</Link>
						<button
							onClick={() => router.delete(`/routines/${id}`)}
							className="btn btn-error btn-sm bg-red-400/20 text-red-400"
							aria-label="Delete"
							type="button"
						>
							<TrashIcon className="w-4 h-4" />
						</button>
					</div>
				</div>
				<p className="text-zinc-500 dark:text-zinc-300 text-sm">
					{description}
				</p>
				<p className="text-xs">
					{is_active ? (
						<span className="text-green-500">Active</span>
					) : (
						<span className="text-gray-400">Inactive</span>
					)}
				</p>
				<Link href={`/routines/${id}`} className="btn btn-outline w-fit">
					<DocumentTextIcon className="w-4 h-4" />
					Details
				</Link>
			</div>
		</div>
	);
}
