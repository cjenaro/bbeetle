import { Head, Link, router } from "@inertiajs/react";
import { type FormEvent } from "react";

export default function NewSession({ errors }: { errors?: string }) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    router.post("/session", Object.fromEntries(data));
  }

  return (
    <>
      <Head title="BBeetle | New Session" />

      <div className="w-full h-screen grid place-items-center">
        <div className="container flex flex-col items-center mx-auto">
          <h1 className="text-2xl mb-6">Login</h1>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <fieldset className="fieldset">
              <label htmlFor="email" className="label text-sm">
                Email:{" "}
              </label>
              <input
                className="input input-xl"
                name="email_address"
                type="email"
                id="email"
              />
            </fieldset>

            <fieldset className="fieldset">
              <label htmlFor="password" className="label text-sm">
                Password:{" "}
              </label>
              <input
                className="input input-xl"
                name="password"
                type="password"
                id="password"
              />
            </fieldset>

            <button className="btn btn-primary" type="submit">
              Login
            </button>

            {errors && <p className="text-sm text-red-300">{errors}</p>}
          </form>

          <p className="mt-6">
            Don't have an account?{" "}
            <Link className="hover:underline text-indigo-300" href="/user/new">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
