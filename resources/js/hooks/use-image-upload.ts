import { useState } from "react";

interface UseImageUploadReturn {
    preview: string | null;
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => void;
}

export const useImageUpload = (
    initialPreview: string | null,
    setData: (key: string, value: File | null) => void
): UseImageUploadReturn => {
    const [preview, setPreview] = useState<string | null>(initialPreview);

    const handleImageUpload = (
        e: React.ChangeEvent<HTMLInputElement>,
        fieldName: string
    ) => {
        const file = e.target.files?.[0] || null;

        // Set preview URL for the selected file
        setPreview(file ? URL.createObjectURL(file) : null);

        // Update form data with the selected file
        setData(fieldName, file);
    };

    return {
        preview,
        handleImageUpload,
    };
};
