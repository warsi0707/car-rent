
interface CarInputProps {
    name: string;
    type: string;
    placeholder: string;
    options?: string[]; // For select inputs
    lable: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    classname?: string;
}

export default function CarInput({ name, type, placeholder, options, lable, value, onChange, classname }: CarInputProps) {
  return (
    <div className={`space-y-2 ${classname || ''}`}>
      <label className="text-sm font-medium text-slate-700">{lable}</label>
      {options ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
        >
          <option value="">Select {lable}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
        />
      )}
    </div>
  );
}
