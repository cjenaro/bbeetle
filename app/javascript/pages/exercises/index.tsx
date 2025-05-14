import { Head, Link, router } from "@inertiajs/react";
import type { ReactNode } from "react";
import { useState } from "react";
import AuthLayout from "../../components/auth-layout";
import {
	PencilIcon,
	TrashIcon,
	DocumentTextIcon,
} from "@heroicons/react/24/outline";

type Exercise = {
	id: number;
	name: string;
	description: string;
};

export default function ExercisesIndex({
	exercises,
}: {
	exercises: Exercise[];
}) {
	const [filter, setFilter] = useState("");

	function handleFilter(e: React.ChangeEvent<HTMLInputElement>) {
		setFilter(e.target.value);
	}

	return (
		<>
			<Head title="Exercises" />
			<div className="flex justify-end my-4">
				<Link href="/exercises/new" className="btn btn-primary">
					New Exercise
				</Link>
			</div>
			<input
				type="search"
				placeholder="Filter"
				aria-label="Filter"
				onChange={handleFilter}
				className="input input-bordered w-full max-w-xs my-4"
			/>
			<div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
				{exercises
					.filter((ex) => ex.name.toLowerCase().includes(filter.toLowerCase()))
					.map((ex) => (
						<ExerciseCard
							key={ex.id}
							id={ex.id}
							name={ex.name}
							description={ex.description}
						/>
					))}
			</div>
		</>
	);
}

ExercisesIndex.layout = (page: ReactNode) => <AuthLayout>{page}</AuthLayout>;

function ExerciseCard({ id, name, description }: Exercise) {
	return (
		<div className="card bg-primary/5 text-primary-content w-96">
			<div className="card-body gap-5">
				<div className="flex justify-between">
					<h2 className="card-title">{name}</h2>
					<div className="card-actions">
						<Link
							href={`/exercises/${id}/edit`}
							className="btn btn-primary btn-sm bg-indigo-400/20 text-indigo-200"
						>
							<PencilIcon className="w-4 h-4" />
						</Link>
						<button
							onClick={() => router.delete(`/exercises/${id}`)}
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
				<Link href={`/exercises/${id}`} className="btn btn-outline w-fit">
					<DocumentTextIcon className="w-4 h-4" />
					Details
				</Link>
			</div>
		</div>
	);
}
