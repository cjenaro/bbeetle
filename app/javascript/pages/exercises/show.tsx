import { Head, Link, router } from "@inertiajs/react";
import type { ReactNode } from "react";
import AuthLayout from "../../components/auth-layout";

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
			<h1>{exercise.name}</h1>
			<p>{exercise.description}</p>
			{exercise.media_url &&
				(exercise.media_url.match(/\.mp4|webm|ogg$/i) ? (
					<video src={exercise.media_url} controls width={400} />
				) : (
					<img src={exercise.media_url} alt="media" width={400} />
				))}
			<div>
				<Link href={`/exercises/${exercise.id}/edit`}>Edit</Link>
				<button
					type="button"
					onClick={() => router.delete(`/exercises/${exercise.id}`)}
				>
					Delete
				</button>
			</div>
		</>
	);
}

ShowExercise.layout = (page: ReactNode) => <AuthLayout>{page}</AuthLayout>;
