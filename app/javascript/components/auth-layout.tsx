import { Link, router, usePage } from "@inertiajs/react";
import type { ReactNode } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";

export default function AuthLayout({ children }: { children: ReactNode }) {
	const { user } = usePage<{ user: { id: number; email_address: string } }>()
		.props;

	function handleSignOut() {
		router.delete("/session");
	}

	return (
		<div className="grid grid-rows-[auto_1fr] h-full min-h-screen">
			<input type="checkbox" id="drawer" className="drawer-toggle" />
			<header className="flex p-4 bg-white/10 justify-between items-center gap-4">
				<label
					htmlFor="drawer"
					className="btn btn-ghost btn-square"
					aria-label="open sidebar"
				>
					<Bars3Icon className="w-6 h-6" />
				</label>
				<div className="flex gap-2">
					<Link href={`/user/${user.id}`} className="btn btn-secondary">
						{user.email_address.split("@")[0]}
					</Link>
					<button
						className="btn btn-ghost"
						type="button"
						onClick={handleSignOut}
					>
						Sign Out
					</button>
				</div>
			</header>
			<aside className="drawer-side">
				<label
					htmlFor="drawer"
					aria-label="close sidebar"
					className="drawer-overlay"
				/>
				<label
					htmlFor="drawer"
					className="btn btn-square absolute top-4 right-4"
				>
					<XMarkIcon className="w-6 h-6" />
				</label>
				<ul className="menu menu-vertical bg-base-100 w-80 h-full gap-4">
					<li>
						<Link
							href="/"
							className="btn btn-outline border-secondary/30 group"
						>
							Dashboard{" "}
							<span className="ml-2 group-hover:translate-x-1 transition-transform duration-100 text-secondary">
								&rarr;
							</span>
						</Link>
					</li>
					<li>
						<Link
							href="/exercises"
							className="btn btn-outline border-secondary/30 group"
						>
							Exercises{" "}
							<span className="ml-2 group-hover:translate-x-1 transition-transform duration-100 text-secondary">
								&rarr;
							</span>
						</Link>
					</li>
					<li>
						<Link
							href="/routines"
							className="btn btn-outline border-secondary/30 group"
						>
							Routines{" "}
							<span className="ml-2 group-hover:translate-x-1 transition-transform duration-100 text-secondary">
								&rarr;
							</span>
						</Link>
					</li>
				</ul>
			</aside>
			<div className="p-4">{children}</div>
		</div>
	);
}
