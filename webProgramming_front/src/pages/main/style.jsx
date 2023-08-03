import styled from "styled-components";

export const AppContainer = styled.div`
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
`;

export const Heading = styled.h1`
    margin-bottom: 10px;
`;
export const SubHeading = styled.h2``;
export const List = styled.ul`
    list-style-type: none;
    padding: 0;
`;

export const HeaddingWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
`;
export const ListItem = styled.li`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
`;

export const DeleteButton = styled.button`
    background-color: #ff0000;
    color: #ffffff;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    font-weight: bold;
`;

export const Input = styled.input`
    margin-bottom: 10px;
    padding: 3px;
`;

export const AddButton = styled.button`
    background-color: #008000;
    color: #ffffff;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    font-weight: bold;
`;

export const LoginButton = styled.button`
    background-color: #008000;
    color: #ffffff;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    font-weight: bold;
`;

export const Paragraph = styled.p`
    font-weight: 700;
    color: #ff0000;
    text-align: center;
    font-size: larger;
`;
