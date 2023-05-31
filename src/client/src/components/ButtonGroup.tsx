import type { ParentComponent } from "solid-js";
import { createSignal } from "solid-js";
import { BaseSize } from "./interface.ts";

interface ButtonGroupOption {
  label: string;
  value: string;
  selected?: boolean;
}
interface ButtonGroupProps {
  size?: BaseSize;
  options: ButtonGroupOption[];
  selected?: string;
  onChange?: (item: ButtonGroupOption) => void;
}

const sizes: Record<BaseSize, string> = {
  xs: "px-2 py-1 text-xs",
  sm: "px-2 py-1 text-sm",
  md: "px-2.5 py-1.5 text-sm",
  lg: "px-3 py-2 text-sm",
  xl: "px-3.5 py-2.5 text-sm",
};

export const ButtonGroup: ParentComponent<ButtonGroupProps> = (props) => {
  const { options, selected, size = "md", onChange = () => {} } = props;
  const selectedValue = options.find((item) => item.selected)?.value ||
    selected;
  const [selectedItem, setSelectedItem] = createSignal(selectedValue);

  const handleItemClick = (item: ButtonGroupOption) => {
    setSelectedItem(item.value);
    onChange(item);
  };
  const getItemClass = (item: any) => {
    let className = "";
    if (item.value === options[0].value) {
      className += " rounded-l-md";
    } else {
      className += " -ml-px";
    }
    if (item.value === options[options.length - 1].value) {
      className += " rounded-r-md";
    }
    return className;
  };

  return (
    <span className="isolate inline-flex rounded-md shadow-sm" id="btn-group">
      {options.map((item) => (
        <button
          type="button"
          className={`relative inline-flex items-center ${sizes[size]} ${
            selectedItem() === item.value ? "bg-gray-200" : "bg-white"
          } ${
            getItemClass(item)
          } text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10`}
          onClick={() => handleItemClick(item)}
        >
          {item.label}
        </button>
      ))}
    </span>
  );
};
