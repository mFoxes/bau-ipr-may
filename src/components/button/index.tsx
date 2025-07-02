import { Styled } from "./styled";

interface IProps {
    onClick: () => void;
    label: string;
}

export const Button = ({ onClick, label }: IProps) => {
    return <Styled.Button onClick={onClick}>{label}</Styled.Button>;
};
