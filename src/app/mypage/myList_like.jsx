'use client'
import axios from "axios";
import {useEffect, useState} from "react";
import {Pagination, Stack} from "@mui/material";
import './myPageCss.css'

export default function myList_like() {
    const [list, setList] = useState([]);
    const [page, setPage] = useState(1); // 현재 페이지
    const [totalPages, setTotalPages] = useState(1); // 총 페이지 수

    const subject_style = {
        width: "0px",
    }

    const makeList = async (p = 1) => {
        const user_id = sessionStorage.getItem("user_id");
        const {data} = await axios.get(`http://localhost/like_course_list/${user_id}/${p}`)
        console.log(data.list);

        const content = data.list.list.map((item) => {
            return (
                <tr key={item.post_idx} style={{height: '60px'}}>
                    <td className={"item_td"}>{item.post_idx}</td>
                    <td className={"item_td"} style={subject_style}>{item.subject}</td>
                    <td className={"item_td"}>{item.user_id}</td>
                    <td className={"item_td"}>{item.reg_date}</td>
                    <td className={"item_td"}>{item.b_hit}</td>
                    <td className={"item_td"}>{item.total_like_count}</td>
                </tr>
            );
        });

        const emptyRows = 10 - content.length;
        for (let i = 0; i < emptyRows; i++) {
            content.push(
                <tr key={`empty-${i}`} style={{ height: '60px' }}>
                    <td className={"item_td"}></td>
                    <td className={"item_td"}></td>
                    <td className={"item_td"}></td>
                    <td className={"item_td"}></td>
                    <td className={"item_td"}></td>
                    <td className={"item_td"}></td>
                </tr>
            );
        }

        setList(content);
        const pageSize = 10;
        setTotalPages(data.list.totalCount);
    }

    useEffect(() => {
        makeList(page);
    }, [page]);

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    return (
        <>
            <table className={"courseTable"}>
                <thead>
                <tr className={"courseTr"}>
                    <th className={"courseTh"}>No</th>
                    <th className={"subjectTable"}>제목</th>
                    <th>글쓴이</th>
                    <th>작성 날짜</th>
                    <th>조회수</th>
                    <th>좋아요</th>
                    {/*<th>공개 여부</th>*/}
                </tr>
                </thead>
                <tbody>{list}</tbody>
            </table>

            <Stack spacing={2} mt={3} alignItems="center">
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    siblingCount={1}
                    boundaryCount={1}
                />
            </Stack>

        </>
    );
}