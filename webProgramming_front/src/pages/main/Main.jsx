import React, { useEffect, useState } from "react";
import * as S from "./style";
import axios from "../../api/axios";

function Main() {
    const [students, setStudents] = useState([]);
    const [newStudent, setNewStudent] = useState({
        id: "",
        name: "",
        gpa: "",
        major: "",
    });

    const [user, setUser] = useState();

    useEffect(() => {
        // 토큰 가져오기
        try {
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
                        console.error(
                            "사용자 정보를 가져오는 데 실패했습니다."
                        );
                    });
            }
        } catch (error) {
            console.error(error);
        }
    }, []);

    // student 정보 가져오기
    const fetchStudents = async () => {
        try {
            const response = await axios.get("student");
            setStudents(response.data);
        } catch (error) {
            console.error(error);
            alert("학생 정보 가져오기 실패!");
        }
    };

    // student 정보 추가
    const addStudent = async () => {
        try {
            const confirmed = window.confirm(
                "학생 정보를 정말 추가하시겠습니까??"
            );
            if (confirmed) {
                await axios.post("student", newStudent);
                setNewStudent({ id: "", name: "", gpa: "", major: "" });
                fetchStudents();
            } else {
                return;
            }
        } catch (error) {
            console.error(error);
            alert("학생 정보 추가 실패!");
        }
    };
    // student 정보 삭제
    // student 정보 삭제
    const deleteStudent = async (id) => {
        try {
            const confirmed = window.confirm(
                "학생 정보를 정말 삭제하시겠습니까?"
            );
            if (confirmed) {
                await axios.delete(`student?id=${id}`);
                fetchStudents();
            } else {
                return;
            }
        } catch (error) {
            console.error(error);
            alert("학생 정보 삭제 실패!");
        }
    };

    // 정보 패치
    useEffect(() => {
        fetchStudents();
    }, []);

    return (
        <S.AppContainer>
            <S.HeaddingWrapper>
                <S.Heading>학생 관리 시스템</S.Heading>
            </S.HeaddingWrapper>

            <hr />
            <S.SubHeading>학생 정보</S.SubHeading>
            <S.List>
                {students.map((student) => (
                    <S.ListItem key={student.id}>
                        {student.id} - {student.name} - {student.major} -{" "}
                        {student.gpa}
                        {user ? (
                            <>
                                <S.DeleteButton
                                    onClick={() => deleteStudent(student.id)}
                                >
                                    Delete
                                </S.DeleteButton>
                            </>
                        ) : (
                            <>
                                <S.DeleteButton
                                    onClick={() => {
                                        alert(
                                            "로그인 후 삭제하실 수 있습니다."
                                        );
                                    }}
                                    style={{ backgroundColor: "gray" }}
                                >
                                    Delete
                                </S.DeleteButton>
                            </>
                        )}
                    </S.ListItem>
                ))}
            </S.List>

            <S.SubHeading>학생 추가하기</S.SubHeading>
            <p>
                이미 있는 id를 추가하기 할시에는 해당 id의 정보가 업데이트
                됩니다.
            </p>
            {user ? (
                <>
                    <S.Input
                        type="text"
                        placeholder="ID"
                        value={newStudent.id}
                        onChange={(e) =>
                            setNewStudent({ ...newStudent, id: e.target.value })
                        }
                    />
                    <S.Input
                        type="text"
                        placeholder="Name"
                        value={newStudent.name}
                        onChange={(e) =>
                            setNewStudent({
                                ...newStudent,
                                name: e.target.value,
                            })
                        }
                    />
                    <S.Input
                        type="text"
                        placeholder="GPA"
                        value={newStudent.gpa}
                        onChange={(e) =>
                            setNewStudent({
                                ...newStudent,
                                gpa: e.target.value,
                            })
                        }
                    />
                    <S.Input
                        type="text"
                        placeholder="Major"
                        value={newStudent.major}
                        onChange={(e) =>
                            setNewStudent({
                                ...newStudent,
                                major: e.target.value,
                            })
                        }
                    />
                    <S.AddButton onClick={addStudent}>Add</S.AddButton>
                </>
            ) : (
                <>
                    <S.Paragraph>
                        로그인 후 학생 추가를 이용하실 수 있습니다.
                    </S.Paragraph>
                </>
            )}
        </S.AppContainer>
    );
}

export default Main;
