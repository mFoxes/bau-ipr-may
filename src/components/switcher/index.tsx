import { Styled } from "./styled";
import { useState } from "react";

interface SwitcherProps {
    onChange: (value: number) => void;
    buttons: {
        label: string;
        value: number;
    }[];
    value: number;
}

export const Switcher = ({
    onChange,
    buttons,
    value: initialValue,
}: SwitcherProps) => {
    const [value, setValue] = useState(initialValue);

    const handleChange = (value: number) => {
        setValue(value);
        onChange(value);
    };

    return (
        <Styled.Wrapper>
            {buttons.map((button) => (
                <Styled.Button
                    key={button.value}
                    onClick={() => handleChange(button.value)}
                    $active={value === button.value}
                >
                    {button.label}
                </Styled.Button>
            ))}
        </Styled.Wrapper>
    );
};
