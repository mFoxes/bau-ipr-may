"use client";

import { useState } from "react";
import { Input } from "@/components/input/input";
import { useCatSays } from "./hooks/useCatSays";

export const Cats = () => {
    const [value, setValue] = useState("");
    const { image, isLoading, fetch } = useCatSays();

    const handleChange = async (value: string) => {
        setValue(value);
        fetch(value);
    };

    return (
        <>
            <Input
                value={value}
                onChange={handleChange}
                placeholder="Cat says..."
                type="text"
            />

            {isLoading ? (
                <div>Loading...</div>
            ) : image ? (
                <img src={image} alt="cat" width={500} height={500} />
            ) : (
                <div>No image</div>
            )}
        </>
    );
};
