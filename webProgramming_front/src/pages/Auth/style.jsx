import { styled } from "styled-components";

export const Container = styled.div`
    width: 300px;
    margin: 150px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
    text-align: center;
`;

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    align-items: start;
`;

export const content = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const Header = styled.h2`
    margin-bottom: 20px;
`;

export const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
    margin-bottom: 10px;
`;

export const Input = styled.input`
    padding: 5px;
    border-radius: 3px;
    border: 1px solid #ccc;
`;
export const FormLabel = styled.label`
    margin-bottom: 5px;
`;
export const Button = styled.button`
    padding: 8px 12px;
    border-radius: 5px;
    background-color: #007bff;
    color: #fff;
    border: none;
    cursor: pointer;
`;
