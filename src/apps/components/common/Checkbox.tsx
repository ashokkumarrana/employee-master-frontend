import {
    Checkbox as MuiCheckbox,
    FormControlLabel,
    FormHelperText,
} from "@mui/material";

export interface CheckboxProps {
    checked?: boolean;
    onChange?: (checked: boolean) => void;

    label?: string;

    required?: boolean;
    disabled?: boolean;
    error?: boolean;
    helperText?: string;

    size?: "small" | "medium";
    color?:
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning"
    | "default";

    name?: string;
    id?: string;
}

const Checkbox = ({
    checked = false,
    onChange,
    label,
    required = false,
    disabled = false,
    error = false,
    helperText,
    size = "medium",
    color = "primary",
    name,
    id,
}: CheckboxProps) => {
    return (
        <>
            <FormControlLabel
                control={
                    <MuiCheckbox
                        id={id}
                        name={name}
                        checked={checked}
                        disabled={disabled}
                        required={required}
                        size={size}
                        color={color}
                        onChange={(event) => {
                            onChange?.(event.target.checked);
                        }}
                    />
                }
                label={label}
            />

            {error && helperText && (
                <FormHelperText error>
                    {helperText}
                </FormHelperText>
            )}
        </>
    );
};

export default Checkbox;