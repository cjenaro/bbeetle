import { Head, Link } from "@inertiajs/react";
import type { ReactNode } from "react";
import AuthLayout from "../../components/auth-layout";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import DeleteExerciseModal from "./modal.tsx";

export default function ShowExercise({
	exercise,
}: {
	exercise: {
		id: number;
		name: string;
		description: string;
		media_url: string;
	};
}) {
	return (
		<>
			<Head title={exercise.name} />

			<div className="container mx-auto max-w-4xl">
				<div className="mb-6">
					<div className="flex justify-between items-start">
						<div>
							<h1 className="text-3xl font-bold mb-4">{exercise.name}</h1>
							<p className="text-zinc-500 dark:text-zinc-300 text-lg">
								{exercise.description}
							</p>
						</div>
						<div className="flex gap-2">
							<Link
								href={`/exercises/${exercise.id}/edit`}
								className="btn btn-primary btn-sm bg-indigo-400/20 text-indigo-200 border-indigo-400/30 hover:bg-indigo-400/30"
								aria-label="Edit Exercise"
							>
								<PencilIcon className="w-4 h-4" />
							</Link>
							<button
								type="button"
								onClick={() => {
									(
										document.getElementById("delete_modal") as HTMLDialogElement
									)?.showModal();
								}}
								className="btn btn-error btn-sm bg-red-400/20 text-red-400 border-red-400/30 hover:bg-red-400/30"
								aria-label="Delete Exercise"
							>
								<TrashIcon className="w-4 h-4" />
							</button>
						</div>
					</div>
				</div>

				<div className="grid gap-6 lg:grid-cols-1">
					{/* Media Section */}
					{exercise.media_url && (
						<div className="card bg-primary/5">
							<div className="card-body">
								<h2 className="card-title text-lg mb-4">Exercise Media</h2>
								<div className="flex justify-center">
									{exercise.media_url.match(/\.mp4|webm|ogg$/i) ? (
										<video
											src={exercise.media_url}
											controls
											className="w-full max-w-md rounded-lg shadow-lg"
											aria-label={`Video demonstration of ${exercise.name}`}
										>
											<track
												kind="captions"
												srcLang="en"
												label="English captions"
												default
											/>
											Your browser does not support the video tag.
										</video>
									) : (
										<img
											src={exercise.media_url}
											alt={`Demonstration of ${exercise.name} exercise`}
											className="w-full max-w-md rounded-lg shadow-lg object-cover"
										/>
									)}
								</div>
							</div>
						</div>
					)}
				</div>

				<div className="mt-8">
					<Link href="/exercises" className="btn btn-outline">
						← Back to Exercises
					</Link>
				</div>

				<DeleteExerciseModal
					id="delete_modal"
					exerciseId={exercise.id}
					exerciseName={exercise.name}
				/>
			</div>
		</>
	);
}

ShowExercise.layout = (page: ReactNode) => <AuthLayout>{page}</AuthLayout>;
