import { createSignal, splitProps } from "solid-js";
import { shortUuid, uuidv4 } from "../../utils.ts";

interface Option {
  label: string;
  value: string;
  selected?: boolean;
}

interface SelectFieldProps {
  label?: string;
  options: Option[];
  onChange: (value: string) => void;
}

export function SelectField(props: SelectFieldProps) {
  const [local, rest] = splitProps(props, [
    "label",
    "className",
    "options",
    "onChange",
    "id",
  ]);
  const [selectedOption, setSelectedOption] = createSignal(
    local.options.find((option) => option.selected)?.value || "",
  );
  const id = local.id || `select-${shortUuid()}`;

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
    local.onChange(event.target.value);
  };

  return (
    <div className="inline-block">
      <label
        htmlFor={id}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {local.label || ""}
      </label>
      <select
        id={id}
        name={id}
        className={`block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
          local.className || ""
        }`}
        value={selectedOption()}
        onChange={handleSelectChange}
        {...rest}
      >
        {local.options.map((option) => (
          <option value={option.value} selected={option.selected}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
