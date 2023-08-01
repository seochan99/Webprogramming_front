import { styled } from "styled-components";
import { Outlet } from "react-router-dom";
import { GlobalStyle } from "./style/globalStyle";
import NavBar from "./components/layouts/NavBar";

const Wrapper = styled.div`
    margin: 0 auto;
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
`;

function App() {
    return (
        <>
            <GlobalStyle />
            <Wrapper>
                <NavBar />
                <Outlet />
            </Wrapper>
        </>
    );
}

export default App;
