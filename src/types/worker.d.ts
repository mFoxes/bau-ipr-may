interface WorkerMessage {
    type: "calculate" | "result" | "error";
    data: CalculationData | CalculationResult | string;
}

interface CalculationData {
    pointerCount: number;
}

interface CalculationResult {
    results: Array<{ x: number; y: number }>;
    executionTime: number;
    pointerCount: number;
}
