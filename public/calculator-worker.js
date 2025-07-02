self.onmessage = function (e) {
    const { type, data } = e.data;

    switch (type) {
        case "calculate":
            const result = performCalculation(data);
            self.postMessage({
                type: "result",
                data: result,
            });
            break;
        default:
            self.postMessage({
                type: "error",
                data: "Unknown message type",
            });
    }
};

function performCalculation(inputData) {
    const { pointerCount, calculationId } = inputData;

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
        calculationId,
    };
}
