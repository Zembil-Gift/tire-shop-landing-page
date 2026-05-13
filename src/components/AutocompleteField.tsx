import { useState } from "react";

type AutocompleteFieldProps = {
    label: string;
    required?: boolean;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    suggestions: readonly string[];
    error?: string;
};

export default function AutocompleteField({
    label,
    required = false,
    value,
    onChange,
    placeholder,
    suggestions,
    error,
}: AutocompleteFieldProps) {
    const [isOpen, setIsOpen] = useState(false);

    const showSuggestions = isOpen && suggestions.length > 0;

    return (
        <label className="flex flex-col">
            <span className="mb-1 text-sm font-medium text-slate-700">
                {label} {required && <span className="text-red-600">*</span>}
            </span>
            <div className="relative">
                <input
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    onFocus={() => setIsOpen(true)}
                    onBlur={() => setIsOpen(false)}
                    className={`w-full rounded-xl border px-4 py-3 outline-none focus:border-red-600 ${
                        error ? "border-red-500" : "border-slate-300"
                    }`}
                    placeholder={placeholder}
                    autoComplete="off"
                    required={required}
                />

                {showSuggestions && (
                    <ul className="absolute top-full right-0 left-0 z-20 mt-1 max-h-48 overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                        {suggestions.map((suggestion) => (
                            <li key={suggestion}>
                                <button
                                    type="button"
                                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                                    onMouseDown={(event) => {
                                        event.preventDefault();
                                        onChange(suggestion);
                                        setIsOpen(false);
                                    }}
                                >
                                    {suggestion}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
        </label>
    );
}
