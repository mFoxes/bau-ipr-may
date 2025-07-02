import { useRef, useEffect } from "react";
import { HistoryItem } from "../types";

interface IUseWebWorkerProps {
    setHistory: (fn: (prev: HistoryItem[]) => HistoryItem[]) => void;
    setIsCalculating: (value: boolean) => void;
}

export const useWebWorker = ({
    setHistory,
    setIsCalculating,
}: IUseWebWorkerProps) => {
    const workerRef = useRef<Worker | null>(null);

    const getWorker = () => {
        if (!workerRef.current) {
            workerRef.current = new Worker("/calculator-worker.js");
        }

        return workerRef.current;
    };

    const handleMessage = (e: MessageEvent<WorkerMessage>) => {
        const { type, data } = e.data;

        const { calculationId, ...restData } = data as CalculationResult & {
            calculationId: string;
        };

        if (type === "result") {
            const completedItem: Partial<HistoryItem> = {
                status: "completed",
                ...(restData as CalculationResult),
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

    return { performWebWorkerCalculation };
};
