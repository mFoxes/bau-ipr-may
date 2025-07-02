import styled, { css } from "styled-components";

export const Styled = {
    Wrapper: styled.div`
        display: flex;
        gap: 10px;
        align-items: center;
    `,

    Button: styled.button<{ $active: boolean }>`
        padding: 10px 20px;
        border: 1px solid #ccc;
        border-radius: 5px;
        cursor: pointer;
        background-color: #fff;
        color: #000;
        &:hover {
            background-color: #f0f0f0;
        }
        ${({ $active }) =>
            $active &&
            css`
                background-color: #ccc;
            `}
    `,
};
