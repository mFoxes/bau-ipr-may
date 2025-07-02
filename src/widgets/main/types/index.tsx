export interface CalculationResult {
    executionTime: number;
    pointerCount: number;
}

export interface HistoryItem extends CalculationResult {
    id: string;
    timestamp: Date;
    method: "Standard" | "Webworker";
    status: "completed" | "in_progress";
}
