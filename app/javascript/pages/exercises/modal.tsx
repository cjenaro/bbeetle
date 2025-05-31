import { router } from "@inertiajs/react";

interface DeleteExerciseModalProps {
	id: string;
	exerciseId: number;
	exerciseName: string;
}

export default function DeleteExerciseModal({
	id,
	exerciseId,
	exerciseName,
}: DeleteExerciseModalProps) {
	function handleDelete() {
		router.delete(`/exercises/${exerciseId}`);
	}

	return (
		<dialog id={id} className="modal">
			<div className="modal-box">
				<h3 className="font-bold text-lg">Delete Exercise</h3>
				<div className="py-4">
					Are you sure you want to delete <strong>"{exerciseName}"</strong>?
					This action cannot be undone.
				</div>
				<div className="modal-action">
					<form method="dialog">
						<button type="submit" className="btn btn-ghost">
							Cancel
						</button>
					</form>
					<button
						type="button"
						className="btn btn-error"
						onClick={handleDelete}
					>
						Delete
					</button>
				</div>
			</div>
		</dialog>
	);
}
