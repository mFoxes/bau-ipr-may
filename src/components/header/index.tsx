import Link from "next/link";
import { Styled } from "./styled";

export const Header = () => {
    return (
        <Styled.Wrapper>
            <Styled.Container>
                <Link href="/">Home</Link>
                <Link href="/cats">Cats</Link>
            </Styled.Container>
        </Styled.Wrapper>
    );
};
