import express, { query } from "express";
import pg from "pg";
import bodyParser from "body-parser";
import cors from "cors";
import passport from "passport";
import { Strategy } from "passport-local";
import jwt from "jsonwebtoken";
import jwtPass from "passport-jwt";
import localPass from "passport-local";

// const express = require("express");
const app = express();
app.use(bodyParser.json());
// Allow requests only from http://localhost:5173
const corsOptions = {
    origin: "http://localhost:5173",
    // origin: "http://3.35.167.3:5000",
    credentials: true,
    // 다른 도메인간 쿠키 공유 허락 옵션
};

app.use(cors(corsOptions));

const pool = new pg.Pool({
    host: "ls-ff80743064e11459f554d70cc21e07f49d1050f0.cbcinokpwf4o.ap-northeast-2.rds.amazonaws.com",
    user: "dbmasteruser",
    password: "?FmG#?BAqI4V)Q33sRy{cN?qosn?,Xl[",
    database: "postgres",
});
// const client = await pool.connect();
// const result = await client.query("SELECT * FROM student");
// console.log(result);
// 다른 함수에서 토큰을 이용한 인증을 사용할 수 있도록 설정
passport.use(
    "jwt",
    new jwtPass.Strategy(
        {
            jwtFromRequest: jwtPass.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: "secret",
        },
        (jwt_payload, done) => {
            done(null, {
                id: jwt_payload.id,
            });
        }
    )
);
// 처음 로그인 할 때 사용되는 함수
passport.use(
    "local",
    new localPass.Strategy(
        { usernameField: "userId", passwordField: "password" },
        async (username, password, done) => {
            const client = await pool.connect();
            const result = await client.query(
                "select * from public.user where name=$1 and password = $2",
                [username, password]
            );
            client.release();
            if (result.rows.length > 0) {
                return done(null, { username });
            }
            return done(null, false, {
                reason: "Invalid username or password",
            });
        }
    )
);

app.use(passport.initialize());

// 로그인 정보를 받아서 토큰 결과를 제공하는 함수
app.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err || !user) {
            return next(err);
        }
        if (info) {
            return res.status(410).send(info.reason);
        }
        return req.login(user, { session: false }, (loginErr) => {
            if (loginErr) {
                return next(loginErr);
            }
            // jwt.sign을 통해 jwt token을 생성
            const token = jwt.sign({ id: user.username }, "secret");
            return res.json({ token: token });
        });
    })(req, res, next);
});

app.get(
    `/mypage`,
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const client = await pool.connect();
        const result = await client.query(
            "SELECT * from public.user where name = $1",
            [req.user.id]
        );
        res.json(result.rows);
        client.release();
    }
);

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

app.get("/fresh", async (req, res) => {
    const client = await pool.connect();
    const result = await client.query(`SELECT * FROM student`);
    const fresh = [];
    for (let i = 0; i < result.rowCount; i++) {
        let high_num = result.rows[i].id.slice(0, 4);
        if (high_num > "2014") {
            fresh.push(i);
        }
    }
    res.json({ message: "succeed!" });
    client.release();
});

app.post("/login", (req, res) => {
    passport.authenticate("local", { session: false }, (err, user) => {
        if (!user) {
            res.status(403).send("로그인을 실패했습니다.");
            const token = jwt.sign(user, "wnstj701");
            return res.json(user, token);
        }
    })(req, res);
});
passport.initialize();

// 서버에 접속하기 위해 필요한 메소드
app.listen(5005, () => {
    console.log("Server Open!");
});
