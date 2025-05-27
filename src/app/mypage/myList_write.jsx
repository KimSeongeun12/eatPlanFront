'use client'
import {Pagination, Stack} from "@mui/material";
import {useEffect, useRef, useState} from "react";
import axios from "axios";

export default function MyList_write() {
    const [list, setList] = useState([]);
    const [totalPages, setTotalPages] = useState(7);
    const page = useRef(1);

    const makeList = async () => {
        const user_id = sessionStorage.getItem("user_id");
        const {data} = await axios.get(`http://localhost/my_course_list/${user_id}`)
        console.log(data);

        const content = data.list.map((item) => {
            return (
                <tr key={item.post_idx} style={{height: '60px'}}>
                    <td>{item.post_idx}</td>
                    <td>{item.subject}</td>
                    <td>{item.user_id}</td>
                    <td>{item.reg_date}</td>
                    <td>{item.b_hit}</td>
                    <td>{item.public === 1 ? "공개" : "비공개"}</td>
                </tr>
            );
        });
        setList(content);
    }

    useEffect(() => {
        makeList();
    }, []);

    return (
        <div className={"courseTable"}>
            <table>
                <thead>
                <tr className={"courseTr"}>
                    <th>No</th>
                    <th>제목</th>
                    <th>글쓴이</th>
                    <th>작성 날짜</th>
                    <th>조회수</th>
                    {/*<th>좋아요</th>*/}
                    <th>공개 여부</th>
                </tr>
                </thead>
                <tbody>{list}</tbody>
            </table>
        </div>
    );
}