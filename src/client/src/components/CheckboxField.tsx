import { createSignal, ParentComponent } from "solid-js";

interface CheckboxFieldProps {
  label: string;
  name: string;
  selected?: boolean;
  onChange?: (checked: boolean) => void;
}

export const CheckboxField: ParentComponent<CheckboxFieldProps> = (
  props: CheckboxFieldProps,
) => {
  const { label, selected = false, name, onChange = () => {} } = props;
  const [checked, setChecked] = createSignal(selected);

  const handleChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    setChecked(target.checked);
    if (typeof onChange === "function") {
      onChange(target.checked);
    }
  };

  return (
    <span className="inline-flex items-center">
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-gray-300 text-indigo-600"
        id={name}
        name={name}
        checked={checked()}
        onChange={handleChange}
      />
      <label for={name} className="ml-2 text-gray-900">
        {label}
      </label>
    </span>
  );
};
