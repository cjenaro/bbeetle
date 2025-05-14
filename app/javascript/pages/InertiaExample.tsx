import { Head } from "@inertiajs/react";
import { ReactNode, useState } from "react";

import inertiaSvg from "/assets/inertia.svg";
import reactSvg from "/assets/react.svg";
import viteRubySvg from "/assets/vite_ruby.svg";
import AuthLayout from "../components/auth-layout";

export default function InertiaExample({ name }: { name: string }) {
  const [count, setCount] = useState(0);

  return (
    <>
      <Head title="Inertia + Vite Ruby + React Example" />

      <div className="w-full h-full">
        <h1 className="text-xl">Hello {name}!</h1>

        <div className="flex gap-2">
          <a href="https://inertia-rails.dev" target="_blank">
            <img className="size-2" src={inertiaSvg} alt="Inertia logo" />
          </a>
          <a href="https://vite-ruby.netlify.app" target="_blank">
            <img className="size-2" src={viteRubySvg} alt="Vite Ruby logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img className="size-2" src={reactSvg} alt="React logo" />
          </a>
        </div>

        <h2>Inertia + Vite Ruby + React</h2>

        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Edit <code>app/frontend/pages/InertiaExample.jsx</code> and save to
            test HMR
          </p>
        </div>
        <p>Click on the Inertia, Vite Ruby, and React logos to learn more</p>
      </div>
    </>
  );
}

InertiaExample.layout = (page: ReactNode) => <AuthLayout children={page} />;
