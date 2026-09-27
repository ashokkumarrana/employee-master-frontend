import {
    TextField as MuiTextField,
    type TextFieldProps as MuiTextFieldProps,
} from "@mui/material";

export type ReusableTextFieldProps = MuiTextFieldProps;

const TextField = ({
    value = "",
    onChange,
    label,
    placeholder,
    required = false,
    disabled = false,
    error = false,
    helperText,
    fullWidth = true,
    size = "small",
    variant = "outlined",
    ...rest
}: ReusableTextFieldProps) => {
    return (
        <MuiTextField
            {...rest}
            value={value}
            onChange={onChange}
            label={label}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            error={error}
            helperText={helperText}
            fullWidth={fullWidth}
            size={size}
            variant={variant}
        />
    );
};

export default TextField;