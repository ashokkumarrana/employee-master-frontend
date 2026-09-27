import React from "react";
import {
    TextField as MuiTextField,
    type TextFieldProps as MuiTextFieldProps,
} from "@mui/material";

export interface ReusableTextAreaProps
    extends Omit<MuiTextFieldProps, "value" | "onChange" | "multiline"> {
    value?: string;
    onChange?: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => void;
    rows?: number;
    minRows?: number;
    maxRows?: number;
}

const TextArea = ({
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
    rows = 4,
    minRows,
    maxRows,
    ...rest
}: ReusableTextAreaProps) => {
    return (
        <MuiTextField
            {...rest}
            multiline
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
            rows={rows}
            minRows={minRows}
            maxRows={maxRows}
        />
    );
};

export default TextArea;