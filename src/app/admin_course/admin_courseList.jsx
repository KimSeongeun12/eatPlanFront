'use client'

import {useEffect, useRef, useState} from 'react';
import axios from "axios";
import {Pagination, Stack, Select, MenuItem, FormControl, InputLabel, Popover} from '@mui/material';
import Link from "next/link";

export default function Admin_courseList({sort}) {
    const [page, setPage] = useState(1);
    const [items, setItems] = useState([]);

    const [totalPages, setTotalPages] = useState(1); // 총 페이지 수
    const pageSize = 10;  // 한 페이지에 보여줄 아이템 수

    const [info, setInfo] = useState({
        user_id: '',
    });

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

    useEffect(() => {
        const user_id = sessionStorage.getItem('user_id');
        if (user_id) {
            setInfo(prev => ({
                ...prev,
                user_id: user_id
            }));
        }
        renderList();
    }, [page, sort]);

    const renderList = async () => {
        try {
            const {data} = await axios.get(`http://192.168.0.120/course_list/${page}/${sort}`);
            console.log(data.list);
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

    const [selectedCourse, setSelectedCourse] = useState([]);

    // 선택된 아이템
    const selectItem = (e, postIdx) => {
        if (e.target.checked) {
            setSelectedCourse(prev => [
                ...prev,
                postIdx
            ]);
        } else {
            setSelectedCourse(prev => prev.filter((user_id) => user_id !== postIdx));
        }
    }

    // 선택 블라인드 기능
    const selectBlind = async () => {
        const blind = selectedCourse.map(post_idx =>
            axios.patch(`http://192.168.0.120/${post_idx}/course_blind`)
        );
        await Promise.all(blind);
        console.log(selectedCourse);
        if (selectedCourse.length > 0) {
            alert('선택된 항목이 블라인드 처리 되었습니다.');
            renderList();
        } else {
            alert('항목을 선택해주세요.');
        }
    }

    // 선택 삭제 기능
    const selectDelete = async () => {
        if (selectedCourse.length === 0) {
            alert("항목을 선택해주세요.");
            return;
        }

        const token = sessionStorage.getItem('token');
        const {data} = await axios.delete('http://192.168.0.120/delete', {
            headers: {
                Authorization: token
            },
            data: selectedCourse.map(post_idx => ({ post_idx }))
        });
        console.log(data);

        if (data.success === true) {
            alert('게시글이 성공적으로 삭제되었습니다.');
            setSelectedCourse([]);
            renderList();
        } else {
            alert('게시글 삭제에 실패했습니다.');
        }
    };

    return (
        <>
            <div className="commonList">
                {Array.isArray(items) && items.map((item) => (
                    <div key={item.course.post_idx} className="listItem">
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                            <img
                                className={"mainImage"}
                                src={item.course.blind === true ? '/blind.svg' : `http://192.168.0.120/image/${item.course_img}`}
                                alt="코스 이미지"
                                onError={(e) => { e.target.src = '/no_image.png'; }}
                            />
                            <input
                                className={"admin_checkBox"}
                                type={"checkbox"}
                                onChange={(e) => selectItem(e, item.course.post_idx)}
                                checked={selectedCourse.includes(item.course.post_idx)}
                                style={{
                                    position: 'absolute',
                                    top: '0px',
                                    left: '0px',
                                    zIndex: 10,
                                    width: '25px',
                                    height: '25px',
                                }}
                            />
                        </div>

                        <span className="courseTitle">
                            <Link href={`/courseDetail/${item.course.post_idx}`}>
                                {item.course?.subject}
                            </Link>
                        </span>
                        <span className="courseComment">[{item.cmt_cnt}]</span><br/>
                        <span className="courseAuthor" onClick={(e) => handleAuthorClick(e, item.user_id, item.nickname)}>{item.nickname}</span>
                        <span className="courseViews">조회 {item.course?.b_hit}</span><br/>
                        <span className="courseScope">별점 {item.star_avg}</span>
                        <span className="courseLike">좋아요 {item.total_like_count}</span><br/>
                        <span className="courseDate">{item.course?.reg_date}</span>
                    </div>
                ))}
            </div>
            <div>
                <Stack spacing={2} sx={{mt: 2}} className={"courseStack"} alignItems="center">
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
            </div>

            <div className={"admin_buttons"} style={{display: 'flex', justifyContent: 'flex-end'}}>
                <button onClick={selectBlind} className={"admin_button"}>선택 블라인드 / 블라인드 해제</button>
                <button onClick={selectDelete} className={"admin_button_delete"}>선택 삭제</button>
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
