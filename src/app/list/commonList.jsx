'use client'

import {useEffect, useRef, useState} from 'react';
import axios from "axios";
import {Pagination, Stack, Select, MenuItem, FormControl, InputLabel, Popover} from '@mui/material';
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
            const { data } = await axios.get(`http://192.168.0.120/course_list/${page}/${sort}`);
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

    return (
        <>
            <div className="commonList">
                {Array.isArray(items) && items.map((item) => (
                    <div key={item.course.post_idx} className="listItem">
                        <img
                            className={"mainImage"}
                            src={item.course.blind === true ? '/blind.svg' : `http://192.168.0.120/image/${item.course_img}`}
                            alt="코스 이미지"
                            onError={(e) => { e.target.src = '/no_image.png'; }}
                        />

                        <span className="courseTitle">
                            <Link className={"courseTitle_link"} href={`/courseDetail/${item.course.post_idx}`}>
                                {item.course?.subject}
                            </Link>
                        </span>
                        <span className="courseComment">[{item.cmt_cnt}]</span><br />
                        <span className="courseAuthor" onClick={(e) => handleAuthorClick(e, item.user_id, item.nickname)}>{item.nickname}</span>
                        <span className="courseViews">조회 {item.course?.b_hit}</span><br />
                        <span className="courseScope">별점 {item.star_avg}</span>
                        <span className="courseLike">좋아요 {item.like_cnt}</span><br />
                        <span className="courseDate">{new Date(item.course?.reg_date).toLocaleString('ko-KR', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true, // 오전/오후 나오게
                        })}</span>
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
