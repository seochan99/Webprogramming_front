import axios from "./api/axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

const AppContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Heading = styled.h1`
  margin-bottom: 10px;
`;
const SubHeading = styled.h2`
`
const List = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const ListItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const DeleteButton = styled.button`
  background-color: #ff0000;
  color: #ffffff;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  font-weight: bold;
`;

const Input = styled.input`
  margin-bottom: 10px;
  padding: 3px;
`;

const AddButton = styled.button`
  background-color: #008000;
  color: #ffffff;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  font-weight: bold;
`;

const App = () => {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({ id: "", name: "", gpa: "", major: "" });

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
      const confirmed = window.confirm("학생 정보를 정말 추가하시겠습니까??");
      if (confirmed) {
        await axios.post("student", newStudent);
        setNewStudent({ id: "", name: "", gpa: "", major: "" });
        fetchStudents();
      }
      else{
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
    const confirmed = window.confirm("학생 정보를 정말 삭제하시겠습니까?");
    if (confirmed) {
      const response = await axios.delete(`student?id=${id}`);
      if (response.status === 200) {
        fetchStudents();
      } 
    }else{
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
    <AppContainer>
      <Heading>학생 관리 시스템</Heading>
      <hr/>
      <SubHeading>학생 정보</SubHeading>
      <List>
        {students.map((student) => (
          <ListItem key={student.id}>
            {student.id} - {student.name} - {student.major} - {student.gpa} 
            <DeleteButton onClick={() => deleteStudent(student.id)}>Delete</DeleteButton>
          </ListItem>
        ))}
      </List>

      <SubHeading>학생 추가하기</SubHeading>
      <p>이미 있는 id를 추가하기 할시에는 해당 id의 정보가 업데이트 됩니다.</p>
      <Input
        type="text"
        placeholder="ID"
        value={newStudent.id}
        onChange={(e) => setNewStudent({ ...newStudent, id: e.target.value })}
      />
      <Input
        type="text"
        placeholder="Name"
        value={newStudent.name}
        onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
      />
      <Input
        type="text"
        placeholder="GPA"
        value={newStudent.gpa}
        onChange={(e) => setNewStudent({ ...newStudent, gpa: e.target.value })}
      />
      <Input
        type="text"
        placeholder="Major"
        value={newStudent.major}
        onChange={(e) => setNewStudent({ ...newStudent, major: e.target.value })}
      />
      <AddButton onClick={addStudent}>Add</AddButton>
    </AppContainer>
  );
};

export default App;
