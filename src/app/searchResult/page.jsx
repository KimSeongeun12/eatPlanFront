'use client'

import {Pagination, Stack} from "@mui/material";
import {useEffect, useState} from "react";
import axios from "axios";
import {useSearchParams} from "next/navigation";
import LeftMenu from '../leftMenu';
import "./searchResult.css";
import Link from "next/link";
// import qs from "qs";


export default function SearchResult() {

    const searchParams = useSearchParams();
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;
    const [items, setItems] = useState([]);

    // url로 넘어온 검색조건들을 이어붙이고 요청 보내기
    const fetchSearchKeywords = async() => {
        const subject = searchParams.get("subject");
        const nickname = searchParams.get("nickname");
        const tag = searchParams.getAll("tag");

        const params = {
            ...(subject && {subject}),
            ...(nickname && {nickname}),
            ...(tag.length > 0 && {tag})
        };

        console.log(params);

        try {
            const {data} = await axios.get('http://localhost/search_course',{
                params,
                paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })});
            setItems(Array.isArray(data) ? data : []);
            console.log('데이터 : ',data);
        } catch (error) {
            console.log('검색 실패', error);
        }
    };

    // 페이지 입장시 최초 1회 실행
    useEffect(() => {
        fetchSearchKeywords();
    },[]);

    // 받아온 리스트 기준에 따라 정렬하기
    const [sortBy, setSortBy] = useState('b_hit');

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    const sortedItems = [...items].sort((a, b) => {
        if (sortBy === 'b_hit') {
            return b.b_hit - a.b_hit;
        } else if (sortBy === 'total_like_count') {
            return b.total_like_count - a.total_like_count;
        } else if (sortBy === 'reg_date') {
            return new Date(b.reg_date) - new Date(a.reg_date);
        } else {
            return 0;
        }
    });

    // 페이지당 보여줄 코스 갯수
    const indexOfLastItem = page * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);

    // 코스 디테일 보기
    const courseDetail = (post_idx) => {
        location.href = `/courseDetail?post_idx=${post_idx}`;
    }

    return (
        <>
            <LeftMenu />

            <div className={"resultContainer"}>
                <div className={"topMenu"}>
                    <div className="leftGroup">
                        <Link href={"/courseSearch"} className={"toSearch"}>
                            검색창으로 돌아가기
                        </Link>

                        <span className={"selectedTag"}>
                            <span className={"head"}>선택된 태그</span>
                            <span className={"body"}>{searchParams.getAll("tag").join(" ")}</span>
                        </span>
                    </div>

                    <select className={"sorting"} value={sortBy} onChange={handleSortChange}>
                        <option value={"b_hit"}>조회수 많은 순</option>
                        <option value={"total_like_count"}>좋아요 많은 순</option>
                        <option value={"reg_date"}>작성일</option>
                    </select>

                </div>
                <div className="commonList">
                {Array.isArray(items) && items.length > 0 ?
                    (
                        <>
                            {currentItems.map((item, index) => (
                                <div key={index} className="listItem">
                                    <div className="mainImage">
                                        {/*이미지 여기입니다 여기에요!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/}
                                        <img src={`C:/upload/${item.photos.new_filename}`} alt="썸네일" />
                                    </div>
                                    <span className="courseTitle"
                                          onClick={()=>courseDetail(item.post_idx)}>{item.subject}</span>
                                    <span className="courseComment">[{item.total_comment_count}]</span><br/>
                                    <span className="courseAuthor">{item.nickname}</span>
                                    <span className="courseViews">조회 {item.b_hit}</span><br/>
                                    <span className="courseScope">별점 {item.star_average}</span>
                                    <span className="courseLike">좋아요 {item.total_like_count}</span><br/>
                                    <span className="courseDate">{item.reg_date?.slice(0, 16).replace('T', ' ')}</span>
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
            </div>
        </>
    );
}