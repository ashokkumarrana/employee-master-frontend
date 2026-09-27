import {
    Autocomplete,
    TextField,
} from "@mui/material";

export interface AutoCompleteOption {
    label: string;
    value: string | number;
    disabled?: boolean;
}

export interface AutoCompleteProps {
    value?: AutoCompleteOption | null;
    onChange?: (value: AutoCompleteOption | null,) => void;
    options: AutoCompleteOption[];
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

const AutoComplete = ({
    value = null,
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
}: AutoCompleteProps) => {
    return (
        <Autocomplete
            id={id}
            value={value}
            options={options}
            disabled={disabled}
            fullWidth={fullWidth}
            size={size}
            getOptionLabel={(option) => option.label}
            getOptionDisabled={(option) => Boolean(option.disabled)}
            isOptionEqualToValue={(option, selected) =>
                option.value === selected.value
            }
            onChange={(_, selectedValue) => {
                onChange?.(selectedValue);
            }}
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

export default AutoComplete;