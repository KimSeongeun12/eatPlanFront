import {useEffect, useRef, useState} from 'react';
import axios from "axios";
import { Pagination, Stack, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import Link from "next/link";

export default function CommonList() {
    const [page, setPage] = useState(1);
    const [items, setItems] = useState([]);

    const [sort, setSort] = useState('date_desc');  // 초기 정렬: 최신순 (내림차순)
    const [totalPages, setTotalPages] = useState(1); // 총 페이지 수
    const pageSize = 10;  // 한 페이지에 보여줄 아이템 수

    useEffect(() => {
        renderList();
    }, [page, sort]);

    const renderList = async () => {
        try {
            const { data } = await axios.get(`http://localhost/course_list/${page}/${sort}`);

            // 서버가 데이터와 총 아이템 수를 준다고 가정 (필요에 따라 수정)
            setItems(data.items || data); // 데이터 배열
            if (data.totalCount) {
                setTotalPages(Math.ceil(data.totalCount / pageSize));
            } else {
                // totalCount 없으면 임의로 10페이지 지정
                setTotalPages(10);
            }
        } catch (error) {
            console.error("데이터 로드 실패", error);
        }
    };

    return (
        <>
            <FormControl sx={{ minWidth: 200, mb: 2 }}>
                <InputLabel id="sort-select-label">정렬 기준</InputLabel>
                <Select
                    labelId="sort-select-label"
                    value={sort}
                    label="정렬 기준"
                    onChange={(e) => {
                        setPage(1);  // 정렬 변경 시 1페이지로 초기화
                        setSort(e.target.value);
                    }}
                >
                    <MenuItem value="date_desc">등록일 (최신순)</MenuItem>
                    <MenuItem value="date_asc">등록일 (오래된 순)</MenuItem>
                    <MenuItem value="hit_desc">조회수 (많은 순)</MenuItem>
                    <MenuItem value="hit_asc">조회수 (적은 순)</MenuItem>
                    {/* 필요에 따라 항목 추가 */}
                </Select>
            </FormControl>

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
