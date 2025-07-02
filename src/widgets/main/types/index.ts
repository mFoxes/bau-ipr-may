export interface IWorkerMessage {
    type: "calculate" | "result" | "error";
    data: ICalculationData | ICalculationResult | string;
}

export interface ICalculationData {
    pointerCount: number;
}

export interface ICalculationResult {
    executionTime: number;
    pointerCount: number;
}

export interface ICalculationResult {
    executionTime: number;
    pointerCount: number;
}

export interface IHistoryItem extends ICalculationResult {
    id: string;
    timestamp: Date;
    method: "Standard" | "Webworker";
    status: "completed" | "in_progress";
}
