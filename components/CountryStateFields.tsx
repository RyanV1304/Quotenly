"use client";

import { useState } from "react";
import { COUNTRIES, stateLabelForCountry, isStateRequired } from "@/lib/countries";

export default function CountryStateFields({
  initialCountry = "US",
  initialStateRegion = "",
}: {
  initialCountry?: string;
  initialStateRegion?: string;
}) {
  const [country, setCountry] = useState(initialCountry);
  const label = stateLabelForCountry(country);
  const required = isStateRequired(country);

  return (
    <div className="grid grid-cols-2 gap-4">
      <label className="field-label">
        Country
        <select
          name="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
          className="input"
        >
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <label className="field-label">
        {label}
        <input
          name="stateRegion"
          defaultValue={initialStateRegion}
          required={required}
          placeholder={label}
          className="input"
        />
      </label>
    </div>
  );
}
