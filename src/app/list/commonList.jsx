import {useEffect, useRef, useState} from 'react';
import axios from "axios";
import { Pagination, Stack, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import Link from "next/link";

export default function CommonList({sort}) {
    const [page, setPage] = useState(1);
    const [items, setItems] = useState([]);

    const [totalPages, setTotalPages] = useState(1); // 총 페이지 수
    const pageSize = 10;  // 한 페이지에 보여줄 아이템 수

    useEffect(() => {
        renderList();
    }, [page, sort]);

    const renderList = async () => {
        try {
            const { data } = await axios.get(`http://localhost/course_list/${page}/${sort}`);
            console.log(data);
            setItems(data.list);
            if (data.totalCount) {
                setTotalPages(Math.ceil(data.totalCount / pageSize));
            } else {
                setTotalPages(10);
            }
        } catch (error) {
            console.error("데이터 로드 실패", error);
        }
    };

    return (
        <>
            <div className="commonList">
                {Array.isArray(items) && items.map((item) => (
                    <div key={item.course.post_idx} className="listItem">
                        <div className="mainImage">
                            <img
                                src={`http://localhost/image/${item.course_img}`}
                                onError={(e) => {
                                    e.target.src = '/no_image.png';
                                }}
                                alt="코스 이미지"
                            />
                        </div>

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
                    count={totalPages}
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
