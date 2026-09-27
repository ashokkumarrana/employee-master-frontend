import {
    Checkbox,
    FormControl,
    FormHelperText,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
    type SelectChangeEvent,
} from "@mui/material";

export interface MultiselectOption {
    label: string;
    value: string | number;
    disabled?: boolean;
}

export interface MultiselectProps {
    value?: Array<string | number>;
    onChange?: (value: Array<string | number>) => void;
    options: MultiselectOption[];
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

const Multiselect = ({
    value = [],
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
}: MultiselectProps) => {
    const labelId = `${id || name || "multiselect"}-label`;

    const handleChange = (event: SelectChangeEvent<Array<string | number>>) => {
        const selectedValues = event.target.value;

        const normalizedValues =
            typeof selectedValues === "string"
                ? selectedValues.split(",")
                : selectedValues;

        onChange?.(normalizedValues);
    };

    return (
        <FormControl
            fullWidth={fullWidth}
            size={size}
            required={required}
            disabled={disabled}
            error={error}
        >
            {label && (
                <InputLabel id={labelId}>
                    {label}
                </InputLabel>
            )}

            <Select
                labelId={labelId}
                id={id}
                name={name}
                multiple
                value={value}
                onChange={handleChange}
                input={<OutlinedInput label={label} />}
                renderValue={(selected) => {
                    if (selected.length === 0 && placeholder) {
                        return placeholder;
                    }

                    return options
                        .filter((option) =>
                            selected.some(
                                (selectedValue) =>
                                    String(selectedValue) === String(option.value),
                            ),
                        )
                        .map((option) => option.label)
                        .join(", ");
                }}
            >
                {options.map((option) => {
                    const selected = value.some(
                        (selectedValue) =>
                            String(selectedValue) === String(option.value),
                    );

                    return (
                        <MenuItem
                            key={String(option.value)}
                            value={option.value}
                            disabled={option.disabled}
                        >
                            <Checkbox checked={selected} />
                            <ListItemText primary={option.label} />
                        </MenuItem>
                    );
                })}
            </Select>

            {helperText && (
                <FormHelperText>
                    {helperText}
                </FormHelperText>
            )}
        </FormControl>
    );
};

export default Multiselect;