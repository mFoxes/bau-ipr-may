"use client";
import { Styled } from "./styled";
import { Switcher } from "@/components/switcher";
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/input/input";
import { Button } from "@/components/button";
import { ResultsTable } from "@/components/resultsTable";

interface CalculationResult {
    executionTime: number;
    pointerCount: number;
}

interface HistoryItem extends CalculationResult {
    id: string;
    timestamp: Date;
    method: "Standard" | "Webworker";
    status: "completed" | "in_progress";
}

export const Main = () => {
    const [value, setValue] = useState(1);
    const [inputValue, setInputValue] = useState("");
    const [isCalculating, setIsCalculating] = useState(false);
    const [history, setHistory] = useState<HistoryItem[]>([]);

    const handleInputChange = (value: string) => {
        setInputValue(value);
    };

    const performStandardCalculation = (
        pointerCount: number
    ): CalculationResult => {
        const startTime = performance.now();

        let count = 0;

        for (let i = 0; i < pointerCount; i++) {
            const x = i * 0.1;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const y = Math.sin(x) * Math.cos(x * 2);

            count += 1;
        }

        console.log("count", count);

        const endTime = performance.now();
        const executionTime = endTime - startTime;

        return {
            executionTime,
            pointerCount,
        };
    };
    const handleCalculate = async () => {
        const pointerCount = parseInt(inputValue) || 1000;

        const calculationId = Date.now().toString();
        const method = value === 1 ? "Standard" : "Webworker";

        const inProgressItem: HistoryItem = {
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
            let calculationResult: CalculationResult;

            if (value === 1) {
                calculationResult = performStandardCalculation(pointerCount);
            } else {
                return;
            }

            console.log("calculationResult", calculationResult);

            const completedItem: HistoryItem = {
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
        <Styled.Wrapper>
            <Styled.Container>
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
            </Styled.Container>
        </Styled.Wrapper>
    );
};
