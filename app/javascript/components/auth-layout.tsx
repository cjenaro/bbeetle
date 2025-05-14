import { router } from "@inertiajs/react";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  function handleSignOut() {
    router.delete("/session");
  }

  return (
    <div className="grid grid-rows-[auto_1fr] h-full min-h-screen">
      <header className="flex p-4 bg-white/10 justify-end">
        <button className="btn btn-ghost" onClick={handleSignOut}>
          Sign Out
        </button>
      </header>
      <div className="p-4">{children}</div>
    </div>
  );
}
