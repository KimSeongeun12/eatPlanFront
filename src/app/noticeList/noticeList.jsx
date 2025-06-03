'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './noticeList.css';

export default function NoticeList() {
    const [notices, setNotices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isAdmin, setIsAdmin] = useState(false);

    const goToPage = (pageNum) => {
        if (pageNum < 1 || pageNum > totalPages) return;
        setCurrentPage(pageNum);
    };

    const fetchNotices = async (pageNum) => {
        try {
            const res = await axios.get(`http://localhost/notice_list/${pageNum}`);
            const data = res.data.noticeList;

            // 단일 list 방식: data.list에 필독, 일반 모두 정렬된 상태로 내려온다
            setNotices(data.list || []);
            setTotalPages(data.pages || 1);
        } catch (err) {
            console.error('[NoticeList] fetch error:', err);
            setNotices([]);
            setTotalPages(1);
        }
    };

    useEffect(() => {
        // (1) 관리자 여부 확인
        const adminFlag = sessionStorage.getItem('isAdmin') === '1';
        setIsAdmin(adminFlag);

        // (2) 현재 페이지 데이터 불러오기
        fetchNotices(currentPage);
    }, [currentPage]);

    return (
        <div className="notice-list-container">
            <h2 className="notice-title">공지사항</h2>

            <table className="notice-table">
                <colgroup>
                    <col className="col-no" />
                    <col className="col-subject" />
                    <col className="col-writer" />
                    <col className="col-date" />
                    <col className="col-hit" />
                </colgroup>
                <thead>
                <tr>
                    <th>No.</th>
                    <th>제목</th>
                    <th>글쓴이</th>
                    <th>작성날짜</th>
                    <th>조회수</th>
                </tr>
                </thead>
                <tbody>
                {notices.map((item) => (
                    <tr
                        key={item.notice_idx}
                        className={item.highlight ? 'highlight-row' : 'normal-row'}
                    >
                        <td>{item.notice_idx}</td>
                        <td className="cell-title">
                            <Link href={`/noticeDetail?id=${item.notice_idx}`}>
                                <span className="title-link">{item.subject}</span>
                            </Link>
                        </td>
                        <td>{item.user_id}</td>
                        <td>{new Date(item.reg_date).toLocaleDateString()}</td>
                        <td>{item.b_Hit}</td>
                    </tr>
                ))}

                {notices.length === 0 && (
                    <tr>
                        <td colSpan="5" className="no-data">
                            등록된 공지가 없습니다.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>

            <div className="pagination-wrapper">
                {currentPage > 1 ? (
                    <button className="page-btn" onClick={() => goToPage(currentPage - 1)}>
                        &lt;
                    </button>
                ) : (
                    <button className="page-btn disabled" disabled>
                        &lt;
                    </button>
                )}

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                    <button
                        key={num}
                        className={`page-btn ${num === currentPage ? 'active' : ''}`}
                        onClick={() => goToPage(num)}
                    >
                        {num}
                    </button>
                ))}

                {currentPage < totalPages ? (
                    <button className="page-btn" onClick={() => goToPage(currentPage + 1)}>
                        &gt;
                    </button>
                ) : (
                    <button className="page-btn disabled" disabled>
                        &gt;
                    </button>
                )}
            </div>

            {isAdmin && (
                <div className="write-button-wrapper">
                    <Link href="/noticeWrite">
                        <button className="write-btn">작성</button>
                    </Link>
                </div>
            )}
        </div>
    );
}
