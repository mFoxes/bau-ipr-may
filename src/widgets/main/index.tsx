"use client";
import { Button } from "@/components/button";
import { Input } from "@/components/input/input";
import { ResultsTable } from "@/components/resultsTable";
import { Switcher } from "@/components/switcher";
import { useState } from "react";
import { performStandardCalculation } from "./helpers";
import { IHistoryItem, ICalculationResult } from "./types";

export const Main = () => {
    const [value, setValue] = useState(1);
    const [inputValue, setInputValue] = useState("");
    const [isCalculating, setIsCalculating] = useState(false);
    const [history, setHistory] = useState<IHistoryItem[]>([]);

    const handleInputChange = (value: string) => {
        setInputValue(value);
    };

    const handleCalculate = async () => {
        const pointerCount = parseInt(inputValue) || 1000;

        const calculationId = Date.now().toString();
        const method = value === 1 ? "Standard" : "Webworker";

        const inProgressItem: IHistoryItem = {
            id: calculationId,
            timestamp: new Date(),
            method,
            status: "in_progress",
            executionTime: 0,
            pointerCount,
        };

        setHistory((prev) => [...prev, inProgressItem]);
        setIsCalculating(true);

        try {
            let calculationResult: ICalculationResult;

            if (value === 1) {
                calculationResult = performStandardCalculation(pointerCount);
            } else {
                return;
            }

            const completedItem: IHistoryItem = {
                ...inProgressItem,
                ...calculationResult,
                status: "completed",
            };

            setHistory((prev) =>
                prev.map((item) =>
                    item.id === calculationId ? completedItem : item
                )
            );
        } catch {
            alert("Произошла ошибка при выполнении вычислений");
            setHistory((prev) =>
                prev.filter((item) => item.id !== calculationId)
            );
        } finally {
            setIsCalculating(false);
        }
    };

    return (
        <>
            <Input
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Pointer count"
                type="number"
            />
            <Switcher
                value={value}
                onChange={setValue}
                buttons={[
                    { label: "Standard", value: 1 },
                    { label: "Webworker", value: 2 },
                ]}
            />
            <Button
                label={isCalculating ? "Calculating..." : "Calculate"}
                onClick={handleCalculate}
            />

            <ResultsTable history={history} />
        </>
    );
};
