import { Head } from "@inertiajs/react";
import { type ReactNode } from "react";

import AuthLayout from "../components/auth-layout";

export default function InertiaExample({ name }: { name: string }) {
  return (
    <>
      <Head title="Inertia + Vite Ruby + React Example" />

      <div className="w-full h-full">
        <div className="card">plan</div>
      </div>
    </>
  );
}

InertiaExample.layout = (page: ReactNode) => <AuthLayout children={page} />;
