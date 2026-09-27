import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

import {
    IconButton,
    InputAdornment,
    TextField,
} from "@mui/material";

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
}

const SearchInput = ({
    value,
    onChange,
    placeholder = "Search...",
    disabled = false,
}: SearchInputProps) => {
    const handleClear = () => {
        onChange("");
    };

    return (
        <TextField
            fullWidth
            size="small"
            value={value}
            disabled={disabled}
            placeholder={placeholder}
            onChange={(event) =>
                onChange(event.target.value)
            }
            slotProps={{
                input: {
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon
                                sx={{
                                    fontSize: 20,
                                    color: "#94a3b8",
                                }}
                            />
                        </InputAdornment>
                    ),

                    endAdornment: value ? (
                        <InputAdornment position="end">
                            <IconButton
                                size="small"
                                onClick={handleClear}
                                disabled={disabled}
                                aria-label="Clear search"
                                sx={{
                                    color: "#94a3b8",

                                    "&:hover": {
                                        color: "#475569",
                                        backgroundColor:
                                            "#f1f5f9",
                                    },
                                }}
                            >
                                <ClearIcon
                                    sx={{
                                        fontSize: 18,
                                    }}
                                />
                            </IconButton>
                        </InputAdornment>
                    ) : undefined,
                },
            }}
            sx={{
                maxWidth: 360,

                "& .MuiOutlinedInput-root": {
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                },

                "& .MuiOutlinedInput-input": {
                    fontSize: "0.8125rem",
                    py: "9px",
                },
            }}
        />
    );
};

export default SearchInput;