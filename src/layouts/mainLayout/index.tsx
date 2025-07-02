"use client";

import { Header } from "@/components/header";
import { Styled } from "./styled";

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Header />
            <Styled.Wrapper>
                <Styled.Container>{children}</Styled.Container>
            </Styled.Wrapper>
        </>
    );
};
