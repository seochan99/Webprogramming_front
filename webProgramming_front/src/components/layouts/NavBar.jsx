// NavBar 컴포넌트에서 로그인 상태에 따라 링크 변경
import React from "react";
import { Link } from "react-router-dom";
import { NavBarWrapper } from "./style";

export default function NavBar() {
    // 로그인 상태 확인
    const isLoggedIn = !!localStorage.getItem("token");

    return (
        <NavBarWrapper>
            <Link to={"/"}>학생관리</Link>
            {isLoggedIn ? (
                <Link to={`/mypage`}>마이페이지</Link>
            ) : (
                <Link to={`/login`}>Login</Link>
            )}
        </NavBarWrapper>
    );
}
