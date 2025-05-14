import { useState } from "react";

export function PasswordInput({
  className = "input input-xl w-full pr-10",
  name = "password",
  id = "password",
}) {
  const [type, setType] = useState("password");

  function toggle() {
    setType((old) => (old === "password" ? "text" : "password"));
  }

  return (
    <div className="relative">
      <input className={className} name={name} type={type} id={id} />
      <button
        type="button"
        className="absolute top-[50%] size-4 -translate-y-[50%] right-4"
        onClick={toggle}
      >
        see
      </button>
    </div>
  );
}
