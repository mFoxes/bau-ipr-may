import { Styled } from "./styled";

interface IProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: string;
}

export const Input = ({ onChange, placeholder, value, type }: IProps) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value);
    };

    return (
        <Styled.Input
            onChange={handleChange}
            placeholder={placeholder}
            value={value}
            type={type}
        />
    );
};
