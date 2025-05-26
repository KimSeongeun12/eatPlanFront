'use client';
import {useEffect, useState} from 'react';
import { Pagination, Stack } from '@mui/material';
import axios from "axios";

export default function Admin_courseList() {
    const [page, setPage] = useState(1);
    const [items, setItems] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const count = 10;

    useEffect(() => {
        renderList(page);
        console.log('totalItems: ', totalItems);
    }, [page]);

    const renderList = async (p) => {
        try {
            const res = await axios.get(`http://localhost/course_list/${p}`);
            const data = res.data;
            console.log('응답 데이터:', res.data);

            setItems(data.list);
            setTotalItems(data.pages); // ✅ 서버에서 받은 전체 항목 수로 교체
        } catch (error) {
            console.error('데이터 로딩 실패:', error);
        }

    };

    return (
        <>
            <div className="commonList">
                {Array.isArray(items) && items.map((item, index) => (
                    <div key={index} className="listItem">
                        <div className="mainImage">
                            <input className={"admin_checkBox"} type={"checkbox"} />
                        </div>
                        <span className="courseTitle">{item.course?.subject}</span>
                        <span className="courseComment">[{item.cmt_cnt}]</span><br />
                        <span className="courseAuthor">{item.nickname}</span>
                        <span className="courseViews">조회 {item.course?.b_hit}</span><br />
                        <span className="courseScope">별점 {item.star_avg}</span>
                        <span className="courseLike">좋아요 {item.like_cnt}</span><br />
                        <span className="courseDate">{item.course?.reg_date}</span>
                    </div>
                ))}
            </div>

            <Stack spacing={2} sx={{ mt: 2 }} className={"courseStack"}>
                <Pagination
                    count={totalItems} // ✅ 동적으로 계산된 총 페이지 수
                    page={page}
                    onChange={(e, value) => setPage(value)}
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
                        '& .Mui-selected': {
                            backgroundColor: 'rgba(42,205,175,0.5)',
                            color: '#a17070',
                            borderColor: '#d29292',
                        },
                    }}
                />
            </Stack>

            <div className={"buttons"}>
                <button className={"admin_button"}>선택 블라인드</button>
                <button className={"admin_button_delete"}>선택 삭제</button>
            </div>
        </>
    );
}