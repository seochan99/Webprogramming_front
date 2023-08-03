import React, { useState } from "react";
import * as S from "./style";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // username input 값 변경 시 실행되는 함수
    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    // password input 값 변경 시 실행되는 함수
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    // form submit 시 실행되는 함수
    // Login 컴포넌트에서 로그인 성공 시 토큰 저장
    const handleFormSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post("/login", {
                userId: username,
                password: password,
            });

            // 토큰 값을 가져옴
            const { token } = response.data;

            // 토큰을 LocalStorage에 저장
            localStorage.setItem("token", token);

            // 로그인 성공 처리
            console.log("로그인 성공:", response.data);
            // "/" 로 이동
            navigate("/");
            // 새로고침
            window.location.reload();
            // 로그인 성공 시 다음 동작을 추가할 수 있습니다.
            // 예를 들면, 로그인 정보를 저장하고 홈페이지로 리다이렉트하는 등의 동작을 수행할 수 있습니다.
        } catch (error) {
            // 로그인 실패 처리
            console.error("로그인 실패:", error.response.data.reason);

            // 로그인 실패 시 사용자에게 알림을 보여줄 수 있습니다.
        }
    };

    return (
        <S.Container>
            <S.Header>로그인</S.Header>
            <S.Form onSubmit={handleFormSubmit}>
                <S.FormGroup>
                    <S.FormLabel htmlFor="username">아이디</S.FormLabel>
                    <S.Input
                        type="text"
                        id="username"
                        value={username}
                        onChange={handleUsernameChange}
                    />
                </S.FormGroup>

                <S.FormGroup>
                    <S.FormLabel htmlFor="password">비밀번호</S.FormLabel>
                    <S.Input
                        type="password"
                        id="password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                </S.FormGroup>

                <S.Button type="submit">로그인</S.Button>
            </S.Form>
        </S.Container>
    );
}

export default Login;
