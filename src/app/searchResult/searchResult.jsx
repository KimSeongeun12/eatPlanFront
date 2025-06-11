'use client'

import Link from "next/link";
import {CircularProgress, Pagination, Popover, Stack} from "@mui/material";
import {useSearchParams} from "next/navigation";
import {Suspense, useEffect, useRef, useState} from "react";
import axios from "axios";
import qs from "qs";

function FuspSearchResult() {

    const searchParams = useSearchParams();
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    //const url = process.env.NEXT_PUBLIC_BASIC_URL;

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
            setIsLoading(true);
            const {data} = await axios.get('http://192.168.0.120/search_course',{
                params,
                paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })});
            setItems(Array.isArray(data) ? data : []);
            console.log('데이터: ',data);
        } catch (error) {
            console.log('검색 실패', error);
            setItems([]);
        } finally {
            setIsLoading(false); // 👉 요청 끝나면 로딩 종료
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
        location.href = `/courseDetail/${post_idx}`;
    }

    const user_id = useRef('');

    // 작성자에게 쪽지보내기, 작성자 정보보기 팝업
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedUser, setSelectedUser] = useState({ user_id: '', nickname: '' });

    const handleAuthorClick = (event, user_id, nickname) => {
        setAnchorEl(event.currentTarget);
        setSelectedUser({ user_id, nickname });
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const memberInfo = (selectedUser) => {
        location.href = `/mypage?user_id=${selectedUser.user_id}`
    }
    const sendMsg = (selectedUser) => {
        if (typeof window !== 'undefined') {
            user_id.current = sessionStorage.getItem('user_id');
            if (!user_id.current) {
                alert('로그인이 필요한 서비스입니다.');
            } else {
                location.href = `/message/messageWrite?recip=${selectedUser.user_id}&nickname=${selectedUser.nickname}`
            }
        }
    };

    return(
        <>
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
                    {isLoading ? (
                        <CircularProgress />
                    ) : items.length > 0 ? (
                        <>
                            {currentItems.map((item, index) => (
                                <div key={index} className="listItem">
                                    <div className="mainImage">
                                        <img
                                            src={item.blind ? '/blind.svg' : `http://192.168.0.120/image/${item.thumbnail}`}
                                            alt="썸네일"
                                        />
                                    </div>
                                    <span className="courseTitle"
                                          onClick={item.blind
                                              ? ()=>alert("관리자가 블라인드 처리한 코스입니다.")
                                              : ()=>courseDetail(item.post_idx)}>
                                            {item.subject}
                                        </span>
                                    <span className="courseComment">[{item.total_comment_count}]</span><br/>
                                    <span className="courseAuthor" onClick={(e) => handleAuthorClick(e, item.user_id, item.nickname)}>
                                            {item.nickname}
                                        </span>
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
            {/*회원 닉네임 누르면 뜨는 팝업창*/}
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <div style={{
                    padding: '12px',
                    minWidth: '145px', // 기존 대비 약 10% 증가
                    backgroundColor: '#f9f9f9',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    fontFamily: 'Segoe UI, Noto Sans KR, Roboto, Helvetica, Arial, sans-serif',
                    color: '#222',
                    textAlign: 'left', // 전체 텍스트 기본 왼쪽 정렬
                    border: '1px solid #ddd'
                }}>
                    <p style={{
                        margin: '0 0 12px 0',
                        fontWeight: '600',
                        fontSize: '12px',
                        color: '#111'
                    }}>
                        <b>{selectedUser.nickname}</b> 님
                    </p>
                    <button
                        onClick={() => memberInfo(selectedUser)}
                        style={{
                            width: '100%',
                            padding: '7px',
                            marginBottom: '4px',  // 간격 절반으로 줄임
                            backgroundColor: '#CC503B',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '10px',
                            letterSpacing: '0.3px',
                            transition: 'background-color 0.3s ease'
                        }}
                        onMouseOver={e => e.currentTarget.style.backgroundColor = '#b64532'}
                        onMouseOut={e => e.currentTarget.style.backgroundColor = '#CC503B'}
                    >
                        회원정보 보기
                    </button>
                    <button
                        onClick={() => sendMsg(selectedUser)}
                        style={{
                            width: '100%',
                            padding: '7px',
                            backgroundColor: '#CC503B',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '10px',
                            letterSpacing: '0.3px',
                            transition: 'background-color 0.3s ease'
                        }}
                        onMouseOver={e => e.currentTarget.style.backgroundColor = '#b64532'}
                        onMouseOut={e => e.currentTarget.style.backgroundColor = '#CC503B'}
                    >
                        쪽지 보내기
                    </button>
                </div>
            </Popover>
        </>
    );
}

export default function SearchResult(){
    return (
        <Suspense fallback={<div>로딩 중...</div>}>
            <FuspSearchResult/>
        </Suspense>
    );
}