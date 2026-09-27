import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import type { Dayjs } from "dayjs";

interface CommonDatePickerProps {
    label: string;
    value: Dayjs | null;
    onChange: (value: Dayjs | null) => void;
    disabled?: boolean;
    required?: boolean;
    error?: boolean;
    helperText?: string;
    minDate?: Dayjs;
    maxDate?: Dayjs;
    referenceDate?: Dayjs;
    size?: "small" | "medium";
}

const CommonDatePicker = ({
    label,
    value,
    onChange,
    disabled = false,
    required = false,
    error = false,
    helperText,
    minDate,
    maxDate,
    referenceDate,
    size = "small",
}: CommonDatePickerProps) => {

    return (
        <DatePicker
            label={label}
            value={value}
            onChange={onChange}
            disabled={disabled}
            minDate={minDate}
            maxDate={maxDate}
            referenceDate={referenceDate}
            format="DD-MM-YYYY"
            slotProps={{
                textField: {
                    size,
                    fullWidth: true,
                    required,
                    error,
                    helperText,
                    sx: {
                        "& .MuiInputLabel-asterisk": {
                            color: "red",
                        },
                    },
                },
            }}
        />
    );
};

export default CommonDatePicker;