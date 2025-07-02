"use client";
import { Button } from "@/components/button";
import { Input } from "@/components/input/input";
import { ResultsTable } from "@/components/resultsTable";
import { Switcher } from "@/components/switcher";
import { useEffect, useRef, useState } from "react";
import { performStandardCalculation } from "./helpers";
import { Styled } from "./styled";
import { IHistoryItem, ICalculationResult, IWorkerMessage } from "./types";

export const Main = () => {
    const [value, setValue] = useState(1);
    const [inputValue, setInputValue] = useState("");
    const [isCalculating, setIsCalculating] = useState(false);
    const [history, setHistory] = useState<IHistoryItem[]>([]);
    const workerRef = useRef<Worker | null>(null);

    const handleInputChange = (value: string) => {
        setInputValue(value);
    };

    const getWorker = () => {
        if (!workerRef.current) {
            workerRef.current = new Worker("/calculator-worker.js");
        }

        return workerRef.current;
    };

    const handleMessage = (e: MessageEvent<IWorkerMessage>) => {
        const { type, data } = e.data;

        const { calculationId, ...restData } = data as ICalculationResult & {
            calculationId: string;
        };

        console.log("data", data);

        if (type === "result") {
            const completedItem: Partial<IHistoryItem> = {
                status: "completed",
                ...(restData as ICalculationResult),
            };

            setHistory((prev) =>
                prev.map((item) =>
                    item.id === calculationId
                        ? { ...item, ...completedItem }
                        : item
                )
            );
        } else if (type === "error") {
            alert("Произошла ошибка при выполнении вычислений");
            setHistory((prev) =>
                prev.filter((item) => item.id !== calculationId)
            );
        }

        setIsCalculating(false);
    };

    const performWebWorkerCalculation = (
        pointerCount: number,
        calculationId: string
    ) => {
        const worker = getWorker();

        worker.postMessage({
            type: "calculate",
            data: { pointerCount, calculationId },
        });
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
                performWebWorkerCalculation(pointerCount, calculationId);

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

    useEffect(() => {
        const worker = getWorker();

        worker.addEventListener("message", handleMessage);

        return () => {
            if (workerRef.current) {
                worker.removeEventListener("message", handleMessage);
                workerRef.current.terminate();
            }
        };
    }, []);

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
