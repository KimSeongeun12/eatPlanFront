import { useEffect, useState } from 'react';
import axios from "axios";
import { Pagination, Stack } from '@mui/material';
import Link from "next/link";

export default function CommonList() {
    const [page, setPage] = useState(1);
    const [items, setItems] = useState([]);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        renderList(page);
    }, [page]);

    const renderList = async (p) => {
        try {
            const res = await axios.get(`http://localhost/course_list/${p}`);
            const data = res.data;
            console.log(data.list[0].course.post_idx);
            setItems(data.list);
            setTotalItems(data.pages);
        } catch (error) {
            console.error('데이터 로딩 실패:', error);
        }
    };

    return (
        <>
            <div className="commonList">
                {Array.isArray(items) && items.map((item) => (
                    <div key={item.course.post_idx} className="listItem">
                        <div className="mainImage"></div>
                        <span className="courseTitle">
                            <Link href={`/courseDetail/${item.course.post_idx}`}>
                                {item.course?.subject}
                            </Link>
                        </span>
                        <span className="courseComment">[{item.cmt_cnt}]</span><br />
                        <span className="courseAuthor">{item.nickname}</span>
                        <span className="courseViews">조회 {item.course?.b_hit}</span><br />
                        <span className="courseScope">별점 {item.star_avg}</span>
                        <span className="courseLike">좋아요 {item.like_cnt}</span><br />
                        <span className="courseDate">{item.course?.reg_date}</span>
                    </div>
                ))}
            </div>
            <Stack spacing={2} sx={{ mt: 2 }} className={"courseStack"} alignItems="center">
                <Pagination
                    count={totalItems}
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
        </>
    );
}
