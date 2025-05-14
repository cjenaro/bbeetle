import { Link, router, usePage } from "@inertiajs/react";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
	const { user } = usePage<{ user: { id: number; email_address: string } }>()
		.props;

	function handleSignOut() {
		router.delete("/session");
	}

	return (
		<div className="grid grid-rows-[auto_1fr] h-full min-h-screen">
			<header className="flex p-4 bg-white/10 justify-end items-center gap-4">
				<button className="btn btn-ghost" type="button" onClick={handleSignOut}>
					Sign Out
				</button>
				<Link href={`/user/${user.id}`} className="btn btn-secondary">
					{user.email_address.split("@")[0]}
				</Link>
			</header>
			<div className="p-4">{children}</div>
		</div>
	);
}
