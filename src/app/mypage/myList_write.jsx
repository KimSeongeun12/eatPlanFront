'use client'
import {Pagination, Stack} from "@mui/material";
import {useEffect, useRef, useState} from "react";

export default function myList_write() {
    const [list, setList] = useState([]);
    const [totalPages, setTotalPages] = useState(7);
    const page = useRef(1);

    const makeList = (pageNum) => {
        // 임시 더미 데이터
        const dummyData = Array.from({ length: 10 }, (_, index) => ({
            id: (pageNum - 1) * 10 + index + 1,
            title: `제목 ${index + 1}`,
            writer: `작성자`,
            date: `2025-05-26`,
            views: Math.floor(Math.random() * 100),
            likes: Math.floor(Math.random() * 50),
            public: Math.random() > 0.5 ? '공개' : '비공개',
        }));

        const content = dummyData.map((item, index) => (
            <tr key={isNaN(item.id) ? `fallback-${index}` : item.id}>
                <td className={"counseTd"}>{item.id}</td>
                <td>{item.title}</td>
                <td>{item.writer}</td>
                <td>{item.date}</td>
                <td>{item.views}</td>
                <td>{item.likes}</td>
                <td>{item.public}</td>
            </tr>
        ));
        setList(content);
    }

    const changePage = (e, val) => {
        page.current = val;
        makeList();
    }

    useEffect(() => {
        makeList(page.current);
    }, []);

    return (
        <>
            <table className={"courseTable"}>
                <tbody>
                <tr className={"courseTr"}>
                    <th className={"courseTh"}>No</th>
                    <th>제목</th>
                    <th>글쓴이</th>
                    <th>작성 날짜</th>
                    <th>조회수</th>
                    <th>좋아요</th>
                    <th>공개 여부</th>
                </tr>
                </tbody>
                <tbody>{list}</tbody>
            </table>
            <Stack spacing={2}>
                <Pagination
                    count={totalPages}
                    color={"primary"}
                    variant={"outlined"}
                    shape={"rounded"}
                    siblingCount={0}
                    onChange={changePage}
                />
            </Stack>
        </>
    );
}