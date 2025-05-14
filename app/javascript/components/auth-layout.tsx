import { Link, router, usePage } from "@inertiajs/react";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const { user } = usePage<{ user: { id: number; email_address: string } }>()
    .props;

  function handleSignOut() {
    router.delete("/session");
  }

  return (
    <div className="grid grid-rows-[auto_1fr] h-full min-h-screen">
      <header className="flex p-4 bg-white/10 justify-end items-center">
        <Link href={`/user/${user.id}`} className="btn btn-primary">
          {user.email_address.split("@")[0]}
        </Link>
        <button className="btn btn-ghost" onClick={handleSignOut}>
          Sign Out
        </button>
      </header>
      <div className="p-4">{children}</div>
    </div>
  );
}
