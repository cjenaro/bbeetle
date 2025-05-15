import { Link } from "@inertiajs/react";
import type { ReactNode } from "react";

export default function UnauthLayout({ children }: { children: ReactNode }) {
	return (
		<div className="grid grid-rows-[auto_1fr] h-full min-h-screen">
			<header className="flex p-4 bg-white/10 justify-end items-center gap-4">
				<div className="flex gap-2">
					<Link href="/session/new" className="btn btn-primary btn-sm">
						Sign In
					</Link>
				</div>
			</header>
			<div className="p-4">{children}</div>
		</div>
	);
}
