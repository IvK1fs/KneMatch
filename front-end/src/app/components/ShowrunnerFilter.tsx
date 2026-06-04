import { useState } from 'react';

interface ShowrunnerFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function ShowrunnerFilter({ value, onChange }: ShowrunnerFilterProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor="showrunner-filter"
        className="text-xs font-medium text-zinc-400"
      >
        Showrunner / Criador
      </label>
      <input
        id="showrunner-filter"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Ex: Vince Gilligan"
        className={`w-full rounded-lg border bg-zinc-900 px-4 py-2 text-sm text-white placeholder-zinc-500 outline-none transition-colors ${
          focused ? 'border-white' : 'border-zinc-700'
        }`}
      />
    </div>
  );
}
