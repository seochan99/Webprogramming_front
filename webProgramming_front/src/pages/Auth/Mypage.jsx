import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import * as S from "./style";

function Mypage() {
    const [user, setUser] = useState();

    useEffect(() => {
        // 토큰 가져오기
        const token = localStorage.getItem("token");

        // 토큰이 있을 경우에만 사용자 정보 요청
        if (token) {
            // 서버에 사용자 정보 요청
            axios
                .get("/mypage", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    setUser(response.data[0]);
                })
                .catch((error) => {
                    console.error("사용자 정보를 가져오는 데 실패했습니다.");
                });
        }
    }, []);

    if (!user) {
        return <S.Header>로딩중.....</S.Header>;
    }

    return (
        <S.Container>
            <S.Header>마이페이지</S.Header>
            <S.content>사용자 아이디: {user.name}</S.content>
            <S.content>사용자 닉네임: {user.nickname}</S.content>
        </S.Container>
    );
}

export default Mypage;
