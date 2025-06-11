'use client'
import {Pagination, Stack} from "@mui/material";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import Link from "next/link";

export default function MyList_write() {
    const [list, setList] = useState([]);
    const [page, setPage] = useState(1); // 현재 페이지
    const [totalPages, setTotalPages] = useState(1); // 총 페이지 수

    const makeList = async (p = 1) => {
        const user_id = sessionStorage.getItem("user_id");
        const {data} = await axios.get(`http://192.168.0.120/my_course_list/${user_id}/${p}`)
        console.log(data);

        const content = data.list.list.map((item) => {
            return (
                <tr key={item.post_idx} style={{height: '60px'}}>
                    <td className={"item_td"}>{item.post_idx}</td>
                    <td className={"item_td"}>
                        <Link href={`/courseDetail/${item.post_idx}`}>
                            {item.subject}
                        </Link>
                    </td>
                    <td className={"item_td"}>{item.user_id}</td>
                    <td className={"item_td"}>{new Date(item.reg_date).toLocaleDateString()}</td>
                    <td className={"item_td"}>{item.b_hit}</td>
                    <td className={"item_td"}>{item.public === 0 ? "공개" : "비공개"}</td>
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

            <Stack spacing={2} sx={{ mt: 2 }} className={"courseStack"} alignItems="center">
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    variant="outlined"
                    shape="rounded"
                    siblingCount={1}
                    boundaryCount={1}
                    showFirstButton
                    showLastButton
                    sx={{
                        '& .MuiPaginationItem-root': {
                            color: '#c9c9c9',
                            borderColor: '#d29292',
                            border: 3,
                            borderRadius: '10px',
                            minWidth: '50px',
                            height: '50px',
                            padding: '10px',
                            fontSize: '20px',
                        },
                        // 선택된 페이지 아이템 스타일
                        '& .MuiPaginationItem-root.Mui-selected': {
                            backgroundColor: '#CC503B',  // 배경색을 CC503B로
                            color: '#ffffff',            // 글자색을 흰색으로
                            borderColor: '#d29292',
                        },
                        // 선택된 상태에서 호버했을 때도 동일 컬러 유지
                        '& .MuiPaginationItem-root.Mui-selected:hover': {
                            backgroundColor: '#CC503B',
                        },
                    }}
                />
            </Stack>
        </div>
    );
}