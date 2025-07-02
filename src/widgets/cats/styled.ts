import styled from "styled-components";

export const Styled = {
    Wrapper: styled.div`
        width: 100%;
        height: 100%;
        min-height: 100vh;
        display: flex;
        justify-content: center;
    `,
    Container: styled.div`
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
        width: 100%;
        height: 100%;
        gap: 20px;
        padding: 40px 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    `,
};
