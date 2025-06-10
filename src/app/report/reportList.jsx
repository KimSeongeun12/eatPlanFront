// reportList.jsx
'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Stack, Pagination } from "@mui/material";
import { useRouter } from "next/navigation";
import "./reportList.css";

export default function ReportListPage() {
    const [reportList, setReportList] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();

    // --- 1) 토큰에서 user_id만 파싱한 뒤, user API로 admin 여부 조회 ---
    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) return;
        try {
            const [, payload] = token.split('.');
            const { user_id } = JSON.parse(atob(payload));
            axios
                .get(`http://localhost/member/${user_id}`)
                .then(res => setIsAdmin(res.data.admin === true))
                .catch(() => setIsAdmin(false));
        } catch {
            setIsAdmin(false);
        }
    }, []);

    // --- 2) 리포트 리스트 가져오기 ---
    useEffect(() => {
        fetchReports(page);
    }, [page]);

    const fetchReports = (pageNum) => {
        const token = sessionStorage.getItem('token');
        const config = token
            ? { headers: { Authorization: `Bearer ${token}` } }
            : {};
        axios
            .get(`http://localhost/report_list/${pageNum}`, config)
            .then((res) => {
                setReportList(res.data.list);
                setTotalPage(res.data.pages);
            })
            .catch((err) => {
                console.log("신고 목록 불러오기 실패", err);
            });
    };

    // --- 3) 상태 변경 핸들러 ---
    const onChangeStatus = (reportIdx, value) => {
        axios
            .patch(`http://localhost/report_done/${reportIdx}`, { done: value === 'true' })
            .then(() => fetchReports(page))
            .catch((err) => {
                console.error('상태 변경 실패', err);
                alert('처리 상태 변경 중 오류가 발생했습니다.');
            });
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
                                {new Date(report.report_date).toLocaleDateString("ko-KR")}
                            </td>
                            <td>
                                {isAdmin ? (
                                    <select
                                        value={report.done ? "true" : "false"}
                                        onChange={(e) =>
                                            onChangeStatus(report.report_idx, e.target.value)
                                        }
                                    >
                                        <option value="false">미처리</option>
                                        <option value="true">처리완료</option>
                                    </select>
                                ) : (
                                    <span>{report.done ? "처리됨" : "미처리"}</span>
                                )}
                            </td>
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
                        onChange={(_, value) => setPage(value)}
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
                            '& .MuiPaginationItem-root.Mui-selected': {
                                backgroundColor: '#CC503B',
                                color: '#ffffff',
                                borderColor: '#d29292',
                            },
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
