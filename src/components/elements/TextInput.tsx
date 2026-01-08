export function TextInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label?: string;
  value: string;
  onChange: (newValue: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="font-semibold text-sm text-secondary">{label}</label>
      )}
      <input
        type="text"
        className="p-2 border border-gray-400 rounded-lg bg-white"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
