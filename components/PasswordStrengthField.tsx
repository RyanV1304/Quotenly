"use client";

import { useState } from "react";
import { passwordStrength } from "@/lib/validation";

const fieldClass =
  "rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-sm text-black outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15";

export default function PasswordStrengthField({ name = "password" }: { name?: string }) {
  const [value, setValue] = useState("");
  const strength = value ? passwordStrength(value) : null;
  const color =
    strength === "strong" ? "text-green-600" : strength === "okay" ? "text-amber-600" : "text-red-500";

  return (
    <div className="flex flex-col gap-1">
      <input
        name={name}
        type="password"
        required
        minLength={8}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={fieldClass}
      />
      {strength && <span className={`text-xs font-medium ${color}`}>Strength: {strength}</span>}
    </div>
  );
}
