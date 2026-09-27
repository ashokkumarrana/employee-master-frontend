import {
    FormControl,
    FormControlLabel,
    FormHelperText,
    FormLabel,
    Radio,
    RadioGroup,
} from "@mui/material";

export interface RadioButtonOption {
    label: string;
    value: string;
    disabled?: boolean;
}

export interface RadioButtonProps {
    value?: string;
    onChange?: (value: string) => void;

    options: RadioButtonOption[];

    label?: string;

    required?: boolean;
    disabled?: boolean;
    error?: boolean;
    helperText?: string;

    row?: boolean;

    name?: string;
}

const RadioButton = ({
    value = "",
    onChange,
    options,
    label,
    required = false,
    disabled = false,
    error = false,
    helperText,
    row = false,
    name = "radio-button",
}: RadioButtonProps) => {
    return (
        <FormControl
            required={required}
            disabled={disabled}
            error={error}
        >
            {label && (
                <FormLabel>
                    {label}
                </FormLabel>
            )}

            <RadioGroup
                name={name}
                value={value}
                onChange={(event) => {
                    onChange?.(event.target.value);
                }}
                row={row}
            >
                {options.map((option) => (
                    <FormControlLabel
                        key={option.value}
                        value={option.value}
                        control={<Radio />}
                        label={option.label}
                        disabled={option.disabled}
                    />
                ))}
            </RadioGroup>

            {helperText && (
                <FormHelperText>
                    {helperText}
                </FormHelperText>
            )}
        </FormControl>
    );
};

export default RadioButton;