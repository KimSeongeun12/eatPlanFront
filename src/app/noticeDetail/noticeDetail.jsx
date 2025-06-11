'use client'

import React, {Suspense, useEffect, useState} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import './noticeDetail.css';

function FuspNoticeDetail(){
    const router = useRouter();
    const searchParams = useSearchParams();
    const noticeIdx = searchParams.get('id');

    const [notice, setNotice] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // 상세 데이터 가져오기
    const fetchDetail = async () => {
        try {
            const res = await axios.get(`http://192.168.0.120/notice_detail/${noticeIdx}`);
            setNotice(res.data.detail);
        } catch (err) {
            console.error('[NoticeDetail] fetch error:', err);
        }
    };

    useEffect(() => {
        const storedUser = sessionStorage.getItem('user_id');

        if (!storedUser) {
            alert('로그인이 필요한 서비스입니다.');
            router.push('/login');
            return;
        }

        const adminFlag = sessionStorage.getItem('isAdmin') === '1';
        setCurrentUser(storedUser);
        setIsAdmin(adminFlag);

        if (noticeIdx) {
            fetchDetail();
        }
    }, [noticeIdx]);

    // 실제 삭제 요청 함수 (모달에서 '확인'을 눌렀을 때 호출)
    const confirmDelete = async () => {
        try {
            const res = await axios.delete(`http://192.168.0.120/notice_del/${noticeIdx}`);
            if (res.data.success) {
                alert('삭제되었습니다.');
                router.push('/noticeList');
            } else {
                alert('삭제에 실패했습니다.');
            }
        } catch (err) {
            console.error('[NoticeDetail] delete error:', err);
            alert('삭제 중 오류가 발생했습니다.');
        }
    };

    // "삭제" 버튼 눌렀을 때 모달 열기
    const handleDeleteClick = () => {
        setShowModal(true);
    };

    //  모달에서 “확인” 누르면 실제 삭제 실행 후 모달 닫기
    const handleModalConfirm = () => {
        setShowModal(false);
        confirmDelete();
    };

    // 모달에서 “취소” 누르면 단순히 모달 닫기
    const handleModalCancel = () => {
        setShowModal(false);
    };

    if (!notice) {
        return <div className="notice-detail-loading">로딩 중...</div>;
    }

    const canModify = isAdmin || currentUser === notice.user_id;

    return (
        <div className="notice-detail-container">
            {/* ───────── 상세 상단 테이블 ───────── */}
            <table className="detail-table">
                <tbody>
                <tr>
                    <th>No.</th>
                    <td>{notice.notice_idx}</td>
                    <th>작성 날짜</th>
                    <td>{new Date(notice.reg_date).toLocaleDateString()}</td>
                </tr>
                <tr>
                    <th>글쓴이</th>
                    <td>{notice.writerNickname || notice.user_id}</td>
                    <th>조회수</th>
                    <td>{notice.b_Hit}</td>
                </tr>
                <tr>
                    <th>제목</th>
                    <td colSpan={3}>{notice.subject}</td>
                </tr>
                </tbody>
            </table>

            {/* ───────── 내용 영역 ───────── */}
            <div className="notice-detail-content">
                <h4 className="notice-content-label">내용</h4>
                <div className="notice-content-text">{notice.content}</div>
            </div>

            {/* ───────── 버튼 영역 ───────── */}
            <div className="notice-detail-button-wrapper">
                {canModify && (
                    <>
                        <button className="notice-detail-btn edit" onClick={() => router.push(`/noticeUpdate?id=${noticeIdx}`)}>
                            수정
                        </button>
                        <button className="notice-detail-btn delete" onClick={handleDeleteClick}>
                            삭제
                        </button>
                    </>
                )}
                <button className="notice-detail-btn list" onClick={() => router.push('/noticeList')}>
                    목록
                </button>
            </div>

            {/* ───────── 삭제 확인 모달 ───────── */}
            {showModal && (
                <div className="notice-modal-overlay">
                    <div className="notice-modal-box">
                        <p className="notice-modal-text">게시글을 삭제 하시겠습니까?</p>
                        <div className="notice-modal-button-wrapper">
                            <button className="notice-modal-btn confirm" onClick={handleModalConfirm}>확인</button>
                            <button className="notice-modal-btn cancel" onClick={handleModalCancel}>취소</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function NoticeDetail() {
    return(
        <Suspense fallback={<div>로딩 중...</div>}>
            <FuspNoticeDetail/>
        </Suspense>
    );
}
