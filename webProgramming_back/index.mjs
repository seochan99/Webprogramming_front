import express, { query } from "express";
import pg from "pg";
import bodyParser from "body-parser";
import cors from "cors";

import { Strategy } from "passport-http-bearer";
import { sign } from "jsonwebtoken";
import passport from "passport";

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

// 새로운 라이브러리 선택해서 추가할거면 use 를 작성해야함
passport.use(
    new Strategy(
        {
            usernameField: "id",
            passwordField: "pw",
        },
        function (username, password, done) {
            // 디비가 있다면 일치하는 회원 정보가 있다면 처리
            if (username === "admin" && password === "1234") {
                return done(null, { username: "admin" });
            } else {
                return done(null, false);
            }
        }
    )
);

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

app.post("/login", async (req, res) => {
    passport.authenticate("local", { session: false }, (err, user, info) => {
        if (user) {
            // jwt 토큰 발급
            const token = sign(user, "aaaa", { expiresIn: "1h" });
            // 로그인 체크

            return res.json({ user, token });
        } else {
            return res.status(401).json({ message: "Login Fail" });
        }
    })(req, res);
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
        const result = await client.query(
            `SELECT * FROM student WHERE id = $1`,
            [req.query.id]
        );
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
