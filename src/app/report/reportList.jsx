// reportList.jsx
'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Stack, Pagination } from "@mui/material";
import "./reportList.css";

export default function ReportListPage() {
    const [reportList, setReportList] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);

    useEffect(() => {
        fetchReports(page);
    }, [page]);

    const fetchReports = (pageNum) => {
        axios
            .get(`http://localhost/report_list/${pageNum}`)
            .then((res) => {
                setReportList(res.data.list);
                setTotalPage(res.data.pages);
            })
            .catch((err) => {
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
            case "course":
                return "게시글";
            case "comment":
                return "댓글";
            case "message":
                return "쪽지";
            default:
                return "기타";
        }
    };

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
            <div className="report-rightMenu">
                <h2>신고 목록</h2>
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
                                    <Link
                                        href={`/report/${report.report_idx}?index=${
                                            (page - 1) * 10 + idx + 1
                                        }`}
                                    >
                                        [{convertCategory(report.isClass)}]&nbsp;
                                        {report.subject}
                                    </Link>
                                </td>
                                <td>{report.reporter_nickname || report.reporter_id}</td>
                                <td>{report.suspect_nickname || report.suspect_id}</td>
                                <td>
                                    {new Date(report.report_date).toLocaleDateString()}
                                </td>
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

                <div className="reportList-pagenation">
                    <Stack spacing={2} sx={{ mt: 2 }} alignItems="center">
                        <Pagination
                            count={totalPage}
                            page={page}
                            onChange={(_, value) => handlePageChange(value)}
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
        </div>
    );
}
