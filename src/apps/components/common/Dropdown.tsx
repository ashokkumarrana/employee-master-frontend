import {
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    type SelectChangeEvent,
} from "@mui/material";

export interface DropdownOption {
    label: string;
    value: string | number;
    disabled?: boolean;
}

export interface DropdownProps {
    value?: string | number;
    onChange?: (event: SelectChangeEvent<string | number>) => void;
    options: DropdownOption[];
    label?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    error?: boolean;
    helperText?: string;
    fullWidth?: boolean;
    size?: "small" | "medium";
    name?: string;
    id?: string;
}

const Dropdown = ({
    value = "",
    onChange,
    options,
    label,
    placeholder,
    required = false,
    disabled = false,
    error = false,
    helperText,
    fullWidth = true,
    size = "small",
    name,
    id,
}: DropdownProps) => {
    const labelId = `${id || name || "dropdown"}-label`;

    return (
        <FormControl
            fullWidth={fullWidth}
            size={size}
            required={required}
            disabled={disabled}
            error={error}
        >
            {label && <InputLabel id={labelId}>{label}</InputLabel>}

            <Select
                labelId={labelId}
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                label={label}
                displayEmpty={Boolean(placeholder)}
            >
                {placeholder && (
                    <MenuItem value="">
                        <em>{placeholder}</em>
                    </MenuItem>
                )}

                {options.map((option) => (
                    <MenuItem
                        key={String(option.value)}
                        value={option.value}
                        disabled={option.disabled}
                    >
                        {option.label}
                    </MenuItem>
                ))}
            </Select>

            {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
    );
};

export default Dropdown;