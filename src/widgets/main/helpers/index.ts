import { ICalculationResult } from "../types";

export const performStandardCalculation = (
    pointerCount: number
): ICalculationResult => {
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
