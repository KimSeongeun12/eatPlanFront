// File: /app/message/messageDetail/messageDetail.jsx
'use client';

import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useSearchParams, useRouter} from 'next/navigation';
import './messageDetail.css';

export default function MessageDetail() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const msgIdx = searchParams.get('msgIdx');   // 쪽지 번호
    const mode = searchParams.get('page');       // 'inbox' or 'outbox'

    const [message, setMessage] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);

    // sessionStorage에 저장된 user_id, token 가져오기
    const userId = typeof window !== 'undefined' ? sessionStorage.getItem('user_id') : null;
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('token') : null;

    // 쪽지 상세 조회
    useEffect(() => {
        if (!userId || !token || !msgIdx) return;

        axios
            .get(`http://localhost/${userId}/${msgIdx}/msg_detail`, {
                headers: {Authorization: token},
            })
            .then(res => {
                if (res.data.success) {
                    setMessage(res.data.message);
                } else {
                    console.error(res.data.error);
                }
            })
            .catch(err => {
                console.error('쪽지 상세 조회 실패', err);
            });
    }, [userId, token, msgIdx]);

    // 날짜 포맷 헬퍼
    const formatDate = isoString => {
        if (!isoString) return '';
        return new Date(isoString).toISOString().slice(0, 10);
    };

    // 답장 (받은쪽지일 때만 활성화)
    const handleReply = () => {
        if (!message) return;
        if (mode === 'inbox') {
            router.push(`/message/messageWrite?recip=${message.sender}`);
        }
    };

    // 삭제
    const handleDeleteClick = () => {
        setShowConfirm(true);
    };
    const handleConfirmDelete = () => {
        if (!userId || !token || !msgIdx) return;
        const delUrl =
            mode === 'inbox'
                ? `http://localhost/${userId}/${msgIdx}/recip_del`
                : `http://localhost/${userId}/${msgIdx}/send_del`;

        axios
            .get(delUrl, {headers: {Authorization: token}})
            .then(res => {
                if (res.data.success) {
                    router.push('/message');
                } else {
                    console.error('삭제 실패');
                }
            })
            .catch(err => {
                console.error('삭제 중 오류 발생', err);
            });
    };
    const handleCancelDelete = () => setShowConfirm(false);

    // 신고 → “/report/write” 경로로 이동하도록 수정해야 함
    const handleReport = () => {
        if (!message) return;
        // query parameter로 suspect, isClass, idx 전달
        router.push(
            `/report/write?` +
            `suspect=${message.sender}` +
            `&isClass=message` +
            `&idx=${message.msg_idx}`
        );
    };


    // 목록 버튼 (항상 보이도록)
     const handleList = () => {
           router.push('/message');
        };

    if (!message) {
        return (
            <div className="message-detail-container">
                <p>쪽지 정보를 불러오는 중...</p>
            </div>
        );
    }

    return (
        <div className="message-detail-container">
            <table className="detail-table">
                <tbody>
                <tr>
                    <th className="cell-header">No</th>
                    <td className="cell-value">{message.msg_idx}</td>
                    <th className="cell-header">작성 날짜</th>
                    <td className="cell-value">{formatDate(message.msg_date)}</td>
                </tr>
                <tr>
                    <th className="cell-header">보내는 사람</th>
                    <td className="cell-value">{message.senderNickname || message.sender}</td>
                    <th className="cell-header">받는 사람</th>
                    <td className="cell-value">{message.recipNickname || message.recip}</td>
                </tr>
                <tr>
                    <th className="cell-header">제목</th>
                    <td className="cell-value" colSpan="3">
                        {message.subject}
                    </td>
                </tr>
                <tr>
                    <th className="content-header" colSpan="4">
                        내용
                    </th>
                </tr>
                <tr>
                    <td className="content-cell" colSpan="4">
                        {message.content}
                    </td>
                </tr>
                </tbody>
            </table>

            <div className="detail-button-group">
                <button className="action-btn" onClick={handleList}>
                            목록
                           </button>
                {mode === 'inbox' && (
                    <button className="action-btn" onClick={handleReply}>
                        답장
                    </button>
                )}
                <button className="action-btn" onClick={handleDeleteClick}>
                    삭제
                </button>
                {/* 보낸쪽지(outbox)일 경우 신고 버튼은 숨김 */}
                {mode === 'inbox' && (
                    <button className="action-btn" onClick={handleReport}>
                        신고
                    </button>
                )}
            </div>

            {showConfirm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <p className="confirm-text">이 쪽지를 정말 삭제하시겠습니까?</p>
                        <div className="confirm-buttons">
                            <button className="confirm-btn" onClick={handleConfirmDelete}>
                                확인
                            </button>
                            <button className="cancel-btn" onClick={handleCancelDelete}>
                                취소
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
