import { Container, Title, Table, Th, Td, Tr } from "./styles";

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

interface ResultsTableProps {
    history: HistoryItem[];
}

export const ResultsTable = ({ history }: ResultsTableProps) => {
    if (history.length === 0) {
        return null;
    }

    return (
        <Container>
            <Title>История расчетов</Title>
            <Table>
                <thead>
                    <Tr>
                        <Th>Время</Th>
                        <Th>Метод</Th>
                        <Th>Количество точек</Th>
                        <Th>Время выполнения</Th>
                        <Th>Статус</Th>
                    </Tr>
                </thead>
                <tbody>
                    {history.map((item) => (
                        <Tr key={item.id}>
                            <Td>{item.timestamp.toLocaleTimeString()}</Td>
                            <Td>{item.method}</Td>
                            <Td>{item.pointerCount}</Td>
                            <Td>
                                {item.status === "completed"
                                    ? `${item.executionTime.toFixed(2)} мс`
                                    : "-"}
                            </Td>
                            <Td>
                                {item.status === "completed"
                                    ? "Завершено"
                                    : "In progress..."}
                            </Td>
                        </Tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};
