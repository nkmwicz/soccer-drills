import { useState } from "react";
import { Button } from "../buttons";

export function Dropdown({
  options,
  value,
  onSelect,
}: {
  options: string[];
  value: string;
  onSelect: (option: string) => void;
}) {
  const [currentValue, setCurrentValue] = useState(value);
  return (
    <div className="flex flex-col gap-2">
      <select
        className="p-2 border border-black rounded-lg bg-white text-black cursor-pointer"
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
      >
        {options.map((option, i) => (
          <option key={`${option}-${i}`} value={option}>
            {option}
          </option>
        ))}
      </select>
      <Button title="Submit" onClick={() => onSelect(currentValue)}></Button>
    </div>
  );
}
