import { useRef, useState } from "react";
import type { ChangeEvent, FocusEvent } from "react";
import * as Yup from "yup";
import type { SelectChangeEvent } from "@mui/material/Select";

export type ArrayFormErrors<T> = Partial<Record<keyof T, string>>;

interface UseArrayFormOptions<T extends object> {
    initialItem: T;
    validationSchema: Yup.Schema<any>;
    requiredFieldOrder?: (keyof T)[];
    remainingDisabledField?: keyof T;
}

export function useArrayForm<T extends object>({
    initialItem,
    validationSchema,
    requiredFieldOrder = [],
    remainingDisabledField,
}: UseArrayFormOptions<T>) {
    const [items, setItems] = useState<T[]>([{ ...initialItem }]);
    const [errors, setErrors] = useState<ArrayFormErrors<T>[]>([{}]);
    const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

    const hasFieldValue = (index: number, field: keyof T): boolean => {
        const value = items[index][field];
        if (Array.isArray(value)) return value.length > 0;
        if (value instanceof File) return true;
        if (typeof value === "boolean") return true;
        return String(value ?? "").trim().length > 0;
    };

    const isFieldValid = (index: number, field: keyof T): boolean => {
        if (!hasFieldValue(index, field)) return false;
        try {
            validationSchema.validateSyncAt(field as string, items[index]);
            return true;
        } catch {
            return false;
        }
    };

    const validateField = async (index: number, fieldName: keyof T) => {
        try {
            await validationSchema.validateAt(fieldName as string, items[index]);
            setErrors((prev) => {
                const updated = [...prev];
                updated[index] = { ...updated[index] };
                delete updated[index][fieldName];
                return updated;
            });
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                setErrors((prev) => {
                    const updated = [...prev];
                    updated[index] = { ...updated[index], [fieldName]: error.message };
                    return updated;
                });
            }
        }
    };

    const validateLiveField = async (index: number, fieldName: keyof T, updatedItem: T) => {
        try {
            await validationSchema.validateAt(fieldName as string, updatedItem);
            setErrors((prev) => {
                const updated = [...prev];
                updated[index] = { ...(updated[index] || {}) };
                delete updated[index][fieldName];
                return updated;
            });
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                setErrors((prev) => {
                    const updated = [...prev];
                    updated[index] = { ...(updated[index] || {}), [fieldName]: error.message };
                    return updated;
                });
            }
        }
    };

    const setFieldValue = async <K extends keyof T>(index: number, fieldName: K, value: T[K]) => {
        const updatedItem: T = { ...items[index], [fieldName]: value };
        setItems((prev) => prev.map((item, i) => (i === index ? updatedItem : item)));
        await validateLiveField(index, fieldName, updatedItem);
        return updatedItem;
    };

    const handleChange = async (index: number, event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        await setFieldValue(index, name as keyof T, value as T[keyof T]);
    };

    const handleSelectChange = async (
        index: number,
        event: SelectChangeEvent<any>,
        numericFields: (keyof T)[] = []
    ) => {
        const { name, value } = event.target;
        const fieldName = name as keyof T;
        const fieldValue = numericFields.includes(fieldName) ? (value === "" ? "" : Number(value)) : value;
        await setFieldValue(index, fieldName, fieldValue as T[keyof T]);
    };

    const handleNumericChange = async (index: number, event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        const numericValue = value.replace(/\D/g, "").slice(0, 10);
        await setFieldValue(index, name as keyof T, numericValue as T[keyof T]);
    };

    const handleBlur = async (index: number, event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const fieldName = event.target.name as keyof T;
        if (fieldName in items[index]) {
            await validateField(index, fieldName);
        }
    };

    const handleSelectBlur = handleBlur;

    const handleFileChange = async (
        index: number,
        event: ChangeEvent<HTMLInputElement>,
        allowedFields: (keyof T)[]
    ) => {
        const { name, files } = event.target;
        if (!files?.length) return;
        const fieldName = name as keyof T;
        if (!allowedFields.includes(fieldName)) return;
        const selectedFile = files[0];
        event.target.value = "";

        setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [fieldName]: selectedFile } : item)));

        try {
            await validationSchema.validateAt(String(fieldName), { ...items[index], [fieldName]: selectedFile });
            setErrors((prev) =>
                prev.map((error, i) => {
                    if (i !== index) return error;
                    const updated = { ...error };
                    delete updated[fieldName];
                    return updated;
                })
            );
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                setErrors((prev) =>
                    prev.map((item, i) => (i === index ? { ...item, [fieldName]: error.message } : item))
                );
            }
        }
    };

    const handleRemoveFile = (index: number, field: keyof T) => {
        setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: null } : item)));
        setErrors((prev) =>
            prev.map((error, i) => {
                if (i !== index) return error;
                const updated = { ...error };
                delete updated[field];
                return updated;
            })
        );
    };

    const handleAddMore = () => {
        const newIndex = items.length;
        setItems((prev) => [...prev, { ...initialItem }]);
        setErrors((prev) => [...prev, {}]);
        setTimeout(() => {
            sectionRefs.current[newIndex]?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 0);
    };

    const handleRemoveItem = (index: number) => {
        setItems((prev) => prev.filter((_, i) => i !== index));
        setErrors((prev) => prev.filter((_, i) => i !== index));
    };

    const handleReset = () => {
        setItems([{ ...initialItem }]);
        setErrors([{}]);
    };

    const scrollToFirstError = (validationErrors: ArrayFormErrors<T>[]) => {
        const firstInvalidIndex = validationErrors.findIndex((e) => Object.keys(e).length > 0);
        if (firstInvalidIndex === -1) return;
        const firstInvalidField = requiredFieldOrder.find((field) => validationErrors[firstInvalidIndex][field]);
        const sectionEl = sectionRefs.current[firstInvalidIndex];
        setTimeout(() => {
            if (firstInvalidField && sectionEl) {
                const element = sectionEl.querySelector(`[name="${String(firstInvalidField)}"]`);
                if (element instanceof HTMLElement) {
                    element.scrollIntoView({ behavior: "smooth", block: "center" });
                    element.focus();
                    return;
                }
            }
            sectionEl?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 0);
    };

    const validateAll = async (): Promise<{ valid: boolean; errors: ArrayFormErrors<T>[] }> => {
        try {
            await Promise.all(items.map((item) => validationSchema.validate(item, { abortEarly: false })));
            const cleared = items.map(() => ({}));
            setErrors(cleared);
            return { valid: true, errors: cleared };
        } catch (error) {
            if (error instanceof Yup.ValidationError) {
                const validationErrors: ArrayFormErrors<T>[] = items.map(() => ({}));
                for (let index = 0; index < items.length; index++) {
                    try {
                        await validationSchema.validate(items[index], { abortEarly: false });
                    } catch (itemError) {
                        if (itemError instanceof Yup.ValidationError) {
                            itemError.inner.forEach((innerError) => {
                                if (!innerError.path) return;
                                const fieldName = innerError.path as keyof T;
                                if (!validationErrors[index][fieldName]) {
                                    validationErrors[index][fieldName] = innerError.message;
                                }
                            });
                        }
                    }
                }
                setErrors(validationErrors);
                scrollToFirstError(validationErrors);
                return { valid: false, errors: validationErrors };
            }
            throw error;
        }
    };

    const lastIndex = items.length - 1;
    const canAddMore = requiredFieldOrder.every((field) => isFieldValid(lastIndex, field));
    const remainingDisabledFor = (index: number) =>
        remainingDisabledField ? !isFieldValid(index, remainingDisabledField) : false;

    return {
        items,
        setItems,
        errors,
        setErrors,
        sectionRefs,
        hasFieldValue,
        isFieldValid,
        validateField,
        validateLiveField,
        setFieldValue,
        handleChange,
        handleSelectChange,
        handleNumericChange,
        handleBlur,
        handleSelectBlur,
        handleFileChange,
        handleRemoveFile,
        handleAddMore,
        handleRemoveItem,
        handleReset,
        validateAll,
        canAddMore,
        remainingDisabledFor,
    };
}