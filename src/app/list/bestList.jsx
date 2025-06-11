'use client'

import {useEffect, useRef, useState} from "react";
import axios from "axios";
import Link from "next/link";
import {Popover} from "@mui/material";

export default function bestList() {
    const [weeklyList, setWeeklyList] = useState([]);
    const [monthlyList, setMonthlyList] = useState([]);

    useEffect(() => {
        weekly();
        monthly();
    }, []);

    const weekly = async () => {
        const {data} = await axios.get('http://192.168.0.120/weekly_best_list');
        console.log("course_img 값들: ", data.list.map(item => item.course_img));
        console.log(data.list);
        setWeeklyList(data.list);
    }

    const monthly = async () => {
        const {data} = await axios.get('http://192.168.0.120/monthly_best_list');
        console.log("월간 베스트 코스: ", data.list[0].course_img);
        setMonthlyList(data.list);
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

    return (
        <>
            <div className={"rightMenu-bottom"}>
                <div className={"weekly"}>
                    <span className={"weeklySpan"}>Weekly 주간 베스트</span>
                    <div className={"weeklyDiv"}>
                        {weeklyList.map(item => (
                            <div key={item.course.post_idx} className={"best_listItem"}>
                                <img
                                    className={"mainImage"}
                                    src={`http://192.168.0.120/image/${item.course_img}`}
                                    onError={(e) => {
                                        e.target.src = '/no_image.png';
                                    }}
                                    alt="코스 이미지"
                                />
                                <span className="courseTitle">
                                    <Link className={"courseTitle_link"} href={`/courseDetail/${item.course.post_idx}`}>
                                        {item.course.subject}
                                    </Link>
                                </span>
                                <span className="courseComment">[{item.cmt_cnt}]</span><br/>
                                <span className="courseAuthor" onClick={(e) => handleAuthorClick(e, item.user_id, item.nickname)}>{item.nickname}</span>
                                <span className="courseViews">조회 {item.course.b_hit}</span><br/>
                                <span className="courseScope">별점 {item.star_avg}</span>
                                <span className="courseLike">좋아요 {item.course.like_cnt}</span><br/>
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
                </div>

                <div className={"monthly"}>
                    <span className={"monthlySpan"}>Monthly 월간 베스트</span>
                    <div className={"monthlyDiv"}>
                        {monthlyList.map(item => (
                            <div key={item.course.post_idx} className={"listItem"}>
                                <img
                                    className={"mainImage"}
                                    src={`http://192.168.0.120/image/${item.course_img}`}
                                    onError={(e) => {
                                        e.target.src = '/no_image.png';
                                    }}
                                    alt="코스 이미지"
                                />
                                <span className="courseTitle">
                                    <Link className={"courseTitle_link"} href={`/courseDetail/${item.course.post_idx}`}>
                                        {item.course.subject}
                                    </Link>
                                </span>
                                <span className="courseComment">[{item.cmt_cnt}]</span><br/>
                                <span className="courseAuthor" onClick={(e) => handleAuthorClick(e, item.user_id, item.nickname)}>{item.nickname}</span>
                                <span className="courseViews">조회 {item.course.b_hit}</span><br/>
                                <span className="courseScope">별점 {item.star_avg}</span>
                                <span className="courseLike">좋아요 {item.course.like_cnt}</span><br/>
                                {/*<span className="courseLike">좋아요: {item.like_cnt}</span><br /> 혹시 문제 있으면 이걸로*/}
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