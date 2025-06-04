// reportList.jsx
'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function ReportList() {
    const [reportList, setReportList] = useState([]);
    const [page, setPage]         = useState(1);
    const [totalPage, setTotalPage] = useState(1);

    useEffect(() => {
        fetchReports(page);
    }, [page]);

    const fetchReports = (pageNum) => {
        axios
            .get(`http://localhost/report_list/${pageNum}`)
            .then(res => {
                setReportList(res.data.list);
                setTotalPage(res.data.pages);
            })
            .catch(err => {
                console.log("신고 목록 불러오기 실패", err);
            });
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPage) {
            setPage(newPage);
        }
    };

    const convertCategory = (code) => {
        switch (code) {
            case 'course':  return '게시글';
            case 'comment': return '댓글';
            case 'message': return '쪽지';
            default:        return '기타';
        }
    };

    // ─────────────────────────────────────────────────────
    // 페이지 숫자를 “1  2  3  … 13” 형태로 렌더링하기 위해
    // 간단히 1 ~ totalPage까지 반복문을 돌려서 JSX를 생성합니다.
    const renderPageNumbers = () => {
        let arr = [];
        for (let i = 1; i <= totalPage; i++) {
            arr.push(
                <button
                    key={i}
                    className={i === page ? "page-btn active" : "page-btn"}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </button>
            );
        }
        return arr;
    };

    return (
        <>
            {/* ── 1) 테이블 ── */}
            <table className="report-table">
                <thead>
                <tr>
                    <th>No</th>
                    <th>제목</th>
                    <th>신고자</th>
                    <th>피신고자</th>
                    <th>신고 날짜</th>
                    <th>처리 여부</th>
                </tr>
                </thead>
                <tbody>
                {reportList.length > 0 ? (
                    reportList.map((report, idx) => (
                        <tr key={report.report_idx}>
                            <td>{(page - 1) * 10 + idx + 1}</td>
                            <td className="title-cell">
                                <Link href={`/report/${report.report_idx}?index=${(page - 1) * 10 + idx + 1}`}>
                                    [{convertCategory(report.isClass)}]&nbsp;{report.subject}
                                </Link>
                            </td>
                            <td>{report.reporter_id}</td>
                            <td>{report.suspect_id}</td>
                            <td>{new Date(report.report_date).toLocaleDateString()}</td>
                            <td>{report.done ? "처리됨" : "미처리"}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={6} style={{ textAlign: "center", color: "#777" }}>
                            신고 내역이 없습니다.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>

            {/* ── 2) 페이징 ── */}
            <div className="pagenation">
                {/* 좌측 화살표 */}
                <button
                    className="arrow-btn"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                >
                    &lt;
                </button>

                {/* 숫자 버튼들 */}
                {renderPageNumbers()}

                {/* 우측 화살표 */}
                <button
                    className="arrow-btn"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPage}
                >
                    &gt;
                </button>
            </div>
        </>
    );
}
