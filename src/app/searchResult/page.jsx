'use client'

import {Pagination, Stack} from "@mui/material";
import {useEffect, useState} from "react";
import axios from "axios";
import {useSearchParams} from "next/navigation";
import LeftMenu from '../leftMenu';
import "./searchResult.css";

export default function SearchResult() {

    const searchParams = useSearchParams();
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [items, setItems] = useState([]);
    const [totalItems, setTotalItems] = useState(0);

    // url로 넘어온 검색조건들을 이어붙이고 요청 보내기
    const fetchSearchKeywords = async() => {
        const subject = searchParams.get("subject");
        const user_id = searchParams.get("user_id");
        const tag = searchParams.getAll("tag");

        const params = {
            ...(subject && {subject}),
            ...(user_id && {user_id}),
            ...(tag.length > 0 && {tag})
        };

        try {
            const {data} = await axios.get('http://localhost/search_course',{params});
            setItems(data)
            console.log('데이터 : ',data);
        } catch (error) {
            console.log('검색 실패', error);
        }
    };

    // 페이지 입장시 최초 1회 실행
    useEffect(() => {
        fetchSearchKeywords();
    },[]);

    // 페이지당 보여줄 코스 갯수
    const indexOfLastItem = page * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <>
            <LeftMenu />
            <div className="commonList">
            {Array.isArray(items) && items.length > 0 ?
                (
                    <>
                        {currentItems.map((item, index) => (
                            <div key={index} className="listItem">
                                <div className="mainImage">
                                </div>
                                <span className="courseTitle">{item.subject}</span>
                                <span className="courseComment">[{item.total_comment_count}]</span><br/>
                                <span className="courseAuthor">{item.nickname}</span>
                                <span className="courseViews">조회 {item.b_hit}</span><br/>
                                <span className="courseScope">별점 {item.star_average}</span>
                                <span className="courseLike">좋아요 {item.total_like_count}</span><br/>
                                <span className="courseDate">{item.reg_date}</span>
                            </div>
                        ))}
                        <Stack spacing={2} sx={{ mt: 2 }} className={"courseStack"}>
                            <Pagination
                                count={Math.ceil(items.length / itemsPerPage)}
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
                ) : (
                    <p className="noResult">검색 결과가 없습니다.</p>
                )}
            </div>
        </>
    );
}