"use client";

import { useState } from "react";
import { passwordStrength } from "@/lib/validation";

export default function PasswordStrengthField({ name = "password" }: { name?: string }) {
  const [value, setValue] = useState("");
  const strength = value ? passwordStrength(value) : null;
  const color =
    strength === "strong" ? "text-success" : strength === "okay" ? "text-warning" : "text-danger";

  return (
    <div className="flex flex-col gap-1">
      <input
        name={name}
        type="password"
        required
        minLength={8}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="input"
      />
      {strength && <span className={`text-xs font-medium ${color}`}>Strength: {strength}</span>}
    </div>
  );
}
