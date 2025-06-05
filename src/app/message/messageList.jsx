'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import './messageList.css';

export default function MessageList() {
    const router = useRouter();
    const [mode, setMode] = useState('inbox');
    const [page, setPage] = useState(1);
    const [messages, setMessages] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);

    // sessionStorage에서 user_id, token 가져오기
    const userId = typeof window !== 'undefined' ? sessionStorage.getItem('user_id') : null;
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('token') : null;

    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        if (!userId || !token) return;

        const endpoint =
            mode === 'inbox'
                ? `http://localhost/${userId}/recip_msg?page=${page}`
                : `http://localhost/${userId}/send_msg?page=${page}`;

        axios
            .get(endpoint, { headers: { Authorization: token } })
            .then(res => {
                const key = mode === 'inbox' ? 'recip_msg' : 'send_msg';
                setMessages(res.data[key] || []);
                setTotalPages(res.data.pages || 1);
                setSelectedIds([]);
            })
            .catch(err => {
                console.error('쪽지 목록 조회 실패', err);
            });
    }, [mode, page, userId, token]);

    const handleCheckboxChange = (msgIdx) => {
        setSelectedIds(prev =>
            prev.includes(msgIdx) ? prev.filter(id => id !== msgIdx) : [...prev, msgIdx]
        );
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(messages.map(msg => msg.msg_idx));
        } else {
            setSelectedIds([]);
        }
    };

    const handleDeleteClick = () => {
        if (selectedIds.length === 0) return;
        setShowConfirm(true);
    };
    const handleConfirmDelete = () => {
        if (!userId || !token) return;

        const deletePromises = selectedIds.map(msgIdx => {
            const delUrl =
                mode === 'inbox'
                    ? `http://localhost/${userId}/${msgIdx}/recip_del`
                    : `http://localhost/${userId}/${msgIdx}/send_del`;
            return axios.get(delUrl, { headers: { Authorization: token } });
        });

        Promise.all(deletePromises)
            .then(() => {
                setShowConfirm(false);
                setSelectedIds([]);
                setPage(1);
                const endpoint =
                    mode === 'inbox'
                        ? `http://localhost/${userId}/recip_msg?page=1`
                        : `http://localhost/${userId}/send_msg?page=1`;
                return axios.get(endpoint, { headers: { Authorization: token } });
            })
            .then(res => {
                const key = mode === 'inbox' ? 'recip_msg' : 'send_msg';
                setMessages(res.data[key] || []);
                setTotalPages(res.data.pages || 1);
            })
            .catch(err => {
                console.error('삭제 중 오류 발생', err);
                setShowConfirm(false);
            });
    };
    const handleCancelDelete = () => setShowConfirm(false);

    const handleTitleClick = (msgIdx) => {
        router.push(`/message/messageDetail?page=${mode}&msgIdx=${msgIdx}`);
    };

    const handlePrevPage = () => { if (page > 1) setPage(page - 1); };
    const handleNextPage = () => { if (page < totalPages) setPage(page + 1); };

    return (
        <div className="message-list-container">
            {/* 탭 바 */}
            <div className="tabs">
                <button
                    className={mode === 'inbox' ? 'tab-active' : ''}
                    onClick={() => setMode('inbox')}
                >
                    받은쪽지
                </button>
                <button
                    className={mode === 'outbox' ? 'tab-active' : ''}
                    onClick={() => setMode('outbox')}
                >
                    보낸쪽지
                </button>
            </div>

            <h1 className="page-title">
                {mode === 'inbox' ? 'Inbox 받은쪽지' : 'Outbox 보낸쪽지'}
            </h1>

            <table className="message-table">
                <thead>
                <tr>
                    <th>No.</th>
                    <th>
                        <input
                            type="checkbox"
                            onChange={handleSelectAll}
                            checked={messages.length > 0 && selectedIds.length === messages.length}
                        />
                    </th>
                    <th>제목</th>
                    <th>{mode === 'inbox' ? '보낸 사람' : '받는 사람'}</th>
                    <th>작성 날짜</th>
                </tr>
                </thead>
                <tbody>
                {messages.length > 0 ? (
                    messages.map((msg, idx) => (
                        <tr key={msg.msg_idx}>
                            <td>{(page - 1) * 10 + idx + 1}</td>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedIds.includes(msg.msg_idx)}
                                    onChange={() => handleCheckboxChange(msg.msg_idx)}
                                />
                            </td>
                            <td
                                className="message-subject"
                                onClick={() => handleTitleClick(msg.msg_idx)}
                            >
                                {msg.subject}
                            </td>
                            <td>{mode === 'inbox' ? msg.sender : msg.recip}</td>
                            <td>{new Date(msg.msg_date).toISOString().slice(0, 10)}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '16px' }}>
                            쪽지가 없습니다.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>

            {/* 하단 (페이징 + 삭제 버튼) */}
            <div className="bottom-bar">
                <div className="pagination-wrapper">
                    <div className="pagination">
                        <button
                            className="page-btn"
                            onClick={handlePrevPage}
                            disabled={page === 1}
                        >
                            ◀
                        </button>
                        <span className="current-page">{page}</span>
                        <button
                            className="page-btn"
                            onClick={handleNextPage}
                            disabled={page === totalPages}
                        >
                            ▶
                        </button>
                    </div>
                </div>
                <button
                    className="delete-selected-btn"
                    onClick={handleDeleteClick}
                    disabled={selectedIds.length === 0}
                >
                    선택 삭제
                </button>
            </div>

            {/* 삭제 확인 팝업 */}
            {showConfirm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <p className="confirm-text">선택한 쪽지를 삭제 하시겠습니까?</p>
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
