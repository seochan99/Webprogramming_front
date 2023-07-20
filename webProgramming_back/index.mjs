import express, { query } from "express";
import pg from "pg";
import bodyParser from "body-parser";
import cors from "cors";

// const express = require("express");
const app = express();
app.use(bodyParser.json());
// Allow requests only from http://localhost:5173
const corsOptions = {
  // origin: "http://localhost:5173",
  origin: "",
  credentials: true,
  // 다른 도메인간 쿠키 공유 허락 옵션
};

app.use(cors(corsOptions));

const pool = new pg.Pool({
  host: "",
  user: "",
  password: "",
  database: "postgres",
});
// const client = await pool.connect();
// const result = await client.query("SELECT * FROM student");
// console.log(result);

let visit = 1;

app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

// DELETE-------------------------------------------------------------------
app.delete("/student", async (req, res) => {
  // GET, DELETE METHOD ->  query에 Data 삽입
  // const id = req.query.id;
  const client = await pool.connect();

  const result = await client.query("delete from student WHERE id = $1", [
    req.query.id,
  ]);

  client.release();
  res.json("삭제 시도");
});

// POST-------------------------------------------------------------------
app.post("/student", async (req, res) => {
  // POST METHOD -> body에 Data 삽입
  const client = await pool.connect();

  if (!req.body.id) {
    // 요청 본문에서 id 값이 제공되지 않은 경우
    return res.status(400).json({ error: "ID value is required." });
  }

  const check = await client.query(`SELECT * FROM student WHERE id = $1`, [
    req.body.id,
  ]);

  if (check.rowCount === 0) {
    const result = await client.query(
      "insert into student (id, gpa, name, major) values ($1, $2, $3, $4)",
      [req.body.id, req.body.gpa, req.body.name, req.body.major]
    );
  } else {
    const result = await client.query(
      "update student set gpa = $1, name = $2, major = $3 WHERE id = $4",
      [req.body.gpa, req.body.name, req.body.major, req.body.id]
    );
  }

  res.json("TRY POST");

  client.release();
});

// GET-------------------------------------------------------------------
app.get("/student", async (req, res) => {
  const client = await pool.connect();

  // req.query.id에 데이터가 있으면 일치하는 id 하나를 찾아서 반환
  // req.query.id에 데이터가 없으면 전체 학생 정보를 반환

  // For문을 이용한 id 필터링-----------------------------------------
  // if (req.query.id) {
  //   const result = await client.query(`SELECT * FROM student`);
  //   for (let i = 0; i < req.query.length; i++) {
  //     if (result.rows[i].id === req.query.id) {
  //       res.json(result.rows[i]);
  //       break;
  //     }
  //   }
  // } else {
  //   const result = await client.query("SELECT * FROM student");
  //   res.json(result.rows);
  // }

  // 선호 id 필터링---------------------------------------------
  if (req.query.id) {
    const result = await client.query(`SELECT * FROM student WHERE id = $1`, [
      req.query.id,
    ]);
    res.json(result.rows[0]);
  } else {
    const result = await client.query(`SELECT * FROM student`);
    res.json(result.rows);
  }

  client.release();
  // student 받아서 query 돌려서 DB 결과값 반환하면서 Connection 끊어줌
});

app.get("/home", (req, res) => {
  visit += 1;
  res.json({ message: "Server Okay" });
});

app.get("/show", (req, res) => {
  res.json({ message: `${visit}회 방문` });
});

// 서버에 접속하기 위해 필요한 메소드
app.listen(5000, () => {
  console.log("Server Open!");
});
