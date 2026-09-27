import {
    Autocomplete,
    Checkbox,
    TextField,
} from "@mui/material";

export interface MultiselectAutoCompleteOption {
    label: string;
    value: string | number;
    disabled?: boolean;
}

export interface MultiselectAutoCompleteProps {
    value?: MultiselectAutoCompleteOption[];
    onChange?: (
        value: MultiselectAutoCompleteOption[],
    ) => void;

    options: MultiselectAutoCompleteOption[];

    label?: string;
    placeholder?: string;

    required?: boolean;
    disabled?: boolean;
    error?: boolean;
    helperText?: string;

    fullWidth?: boolean;
    size?: "small" | "medium";

    id?: string;
    name?: string;
}

const MultiselectAutoComplete = ({
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
    id,
    name,
}: MultiselectAutoCompleteProps) => {
    return (
        <Autocomplete
            id={id}
            multiple
            disableCloseOnSelect
            options={options}
            value={value}
            disabled={disabled}
            fullWidth={fullWidth}
            size={size}
            getOptionLabel={(option) => option.label}
            getOptionDisabled={(option) => Boolean(option.disabled)}
            isOptionEqualToValue={(option, selected) =>
                option.value === selected.value
            }
            onChange={(_, selectedValues) => {
                onChange?.(selectedValues);
            }}
            renderOption={(props, option, { selected }) => (
                <li {...props} key={String(option.value)}>
                    <Checkbox
                        checked={selected}
                        sx={{ mr: 1 }}
                    />
                    {option.label}
                </li>
            )}
            renderInput={(params) => (
                <TextField
                    {...params}
                    name={name}
                    label={label}
                    placeholder={placeholder}
                    required={required}
                    error={error}
                    helperText={helperText}
                />
            )}
        />
    );
};

export default MultiselectAutoComplete;