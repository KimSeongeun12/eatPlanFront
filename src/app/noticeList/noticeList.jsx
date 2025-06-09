'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Stack, Pagination } from '@mui/material';
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
            <h2 className="notice-List-notice-title">공지사항</h2>

            <table className="notice-List-notice-table">
                <colgroup>
                    <col className="notice-List-col-no" />
                    <col className="notice-List-col-subject" />
                    <col className="notice-List-col-writer" />
                    <col className="notice-List-col-date" />
                    <col className="notice-List-col-hit" />
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
                                <span className="notice-List-title-link">{item.subject}</span>
                            </Link>
                        </td>
                        <td>{item.user_id}</td>
                        <td>{new Date(item.reg_date).toLocaleDateString()}</td>
                        <td>{item.b_Hit}</td>
                    </tr>
                ))}

                {notices.length === 0 && (
                    <tr>
                        <td colSpan="5" className="notice-List-no-data">
                            등록된 공지가 없습니다.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>

            <div className="notice-List-pagination-wrapper">
                <Stack spacing={2} sx={{ mt: 2 }} alignItems="center">
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={(_, value) => setCurrentPage(value)}
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
            </div>

            {isAdmin && (
                <div className="notice-write-button-wrapper">
                    <Link href="/noticeWrite">
                        <button className="notice-List-write-btn">작성</button>
                    </Link>
                </div>
            )}
        </div>
    );
}
