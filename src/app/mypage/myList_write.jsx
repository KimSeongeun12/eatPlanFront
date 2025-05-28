'use client'
import {Pagination, Stack} from "@mui/material";
import {useEffect, useRef, useState} from "react";
import axios from "axios";

export default function MyList_write() {
    const [list, setList] = useState([]);
    const [page, setPage] = useState(1); // 현재 페이지
    const [totalPages, setTotalPages] = useState(1); // 총 페이지 수

    const makeList = async (p = 1) => {
        const user_id = sessionStorage.getItem("user_id");
        const {data} = await axios.get(`http://localhost/my_course_list/${user_id}/${p}`)
        console.log(data.list.totalCount);

        const content = data.list.list.map((item) => {
            return (
                <tr key={item.post_idx} style={{height: '60px'}}>
                    <td className={"item_td"}>{item.post_idx}</td>
                    <td className={"item_td"}>{item.subject}</td>
                    <td className={"item_td"}>{item.user_id}</td>
                    <td className={"item_td"}>{item.reg_date}</td>
                    <td className={"item_td"}>{item.b_hit}</td>
                    <td className={"item_td"}>{item.public === 1 ? "공개" : "비공개"}</td>
                </tr>
            );
        });

        const emptyRows = 10 - content.length;
        for (let i = 0; i < emptyRows; i++) {
            content.push(
                <tr key={`empty-${i}`} style={{ height: '60px' }}>
                    <td colSpan={6}></td>
                </tr>
            );
        }

        setList(content);
        setTotalPages(data.list.totalCount);

    }

    useEffect(() => {
        makeList(page);
    }, [page]);

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    return (
        <div className={"courseTable"}>
            <table className={"myList_table"}>
                <thead>
                <tr className={"courseTr"}>
                    <th>No</th>
                    <th className={"subjectTable"}>제목</th>
                    <th>글쓴이</th>
                    <th>작성 날짜</th>
                    <th>조회수</th>
                    {/*<th>좋아요</th>*/}
                    <th>공개 여부</th>
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
        </div>
    );
}