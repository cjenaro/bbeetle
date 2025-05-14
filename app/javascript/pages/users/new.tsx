import { Head, Link, router } from "@inertiajs/react";
import { type FormEvent } from "react";
import { PasswordInput } from "../../components/password-input";

export default function NewUser({ errors }: { errors?: string[] }) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const data = new FormData(e.currentTarget);
    router.post("/user", Object.fromEntries(data));
  }

  return (
    <>
      <Head title="BBeetle | New User" />

      <div className="w-full h-screen grid place-items-center">
        <div className="container flex flex-col items-center mx-auto">
          <h1 className="text-2xl mb-6">Sign up</h1>

          <form
            onSubmit={handleSubmit}
            className="grid gap-4 max-w-[450px] w-full px-4"
          >
            <fieldset className="fieldset">
              <label htmlFor="email" className="label text-sm">
                Email:{" "}
              </label>
              <input
                className="input input-xl w-full"
                name="email_address"
                type="email"
                id="email"
              />
            </fieldset>

            <fieldset className="fieldset">
              <label htmlFor="password" className="label text-sm">
                Password:{" "}
              </label>
              <PasswordInput
                className="input input-xl w-full"
                name="password"
                id="password"
              />
            </fieldset>

            <fieldset className="fieldset">
              <label htmlFor="password_confirmation" className="label text-sm">
                Confirm Password:{" "}
              </label>
              <PasswordInput
                className="input input-xl w-full"
                name="password_confirmation"
                id="password_confirmation"
              />
            </fieldset>

            <button className="btn btn-primary" type="submit">
              Sign up
            </button>

            {errors && errors.length > 0 && (
              <ul className="flex flex-col gap-2">
                {errors.map((e) => (
                  <p key={e} className="text-sm text-red-300 w-fit">
                    {e}
                  </p>
                ))}
              </ul>
            )}
          </form>

          <p className="mt-6">
            Already have an account?{" "}
            <Link
              className="hover:underline text-indigo-300"
              href="/sessions/new"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
