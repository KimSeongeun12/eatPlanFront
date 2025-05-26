'use client'
import {Pagination, Stack} from "@mui/material";
import {useRef, useState} from "react";

export default function myList_write() {
    const [list, setList] = useState([]);
    let page = useRef(1);
    let count = [1, 2, 3, 4, 5, 6, 7];

    const makeList = () => {
        let content = count.map((item) => {
            return (
                <tr key={item.idx}>
                    <td className={"counseTd"}>No</td>
                    <td>제목</td>
                    <td>글쓴이</td>
                    <td>작성 날짜</td>
                    <td>조회수</td>
                    <td>좋아요</td>
                    <td>공개 여부</td>
                </tr>
            );
        });
        setList(content);
    }

    const changePage = (e, val) => {
        page.current = val;
        makeList();
    }

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
                    count={count}
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