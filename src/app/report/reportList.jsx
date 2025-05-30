'use client'


import {useEffect, useState} from "react";
import axios from "axios";
import Link from "next/link";
import './reportList.css';

export default function ReportList() {

    const [reportList, setReportList] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);

    useEffect(() => {
        fetchReports(page);
    },[page]);

    const fetchReports = (pageNum) => {
        axios.get(`http://localhost/report_list/${pageNum}`).then(res => {
            console.log(res.data.list[1]);
            setReportList(res.data.list);
            setTotalPage(res.data.pages);
    }).catch(err => {
        console.log("신고 목록 불러오기 실패",err);
    });
};

const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPage) {
        setPage(newPage);
    }
};

    const convertCategory = (code) => {
        switch (code) {
            case 'course':
                return '게시글';
            case 'comment':
                return '댓글';
            case 'message':
                return '쪽지';
            default:
                return '기타';
        }
    };


    return (
        <div>
            <h2>신고목록</h2>
            <table className="report-table">
                <thead>
                <tr>
                    <th>NO</th>
                    <th>제목</th>
                    <th>신고자</th>
                    <th>피신고자</th>
                    <th>신고날짜</th>
                    <th>처리여부</th>
                </tr>
                </thead>
                <tbody>
                {reportList && reportList.length > 0 ? (
                    reportList.map((report, idx) => (
                        <tr key={report.report_idx}>
                            <td>{(page -1) * 10 + idx + 1}</td>
                            <td>
                                <Link href={`/report/${report.report_idx}?index=${
                                    (page - 1) * 10 + idx + 1
                                }`}>
                                    [{convertCategory(report.isClass)}] {report.subject}
                                </Link>
                            </td>
                            <td>{report.reporter_id}</td>
                            <td>{report.suspect_id}</td>
                            <td>{new Date(report.report_date).toLocaleDateString()}</td>
                            <td>{report.done ? "처리됨" : "미처리"}</td>
                        </tr>
                    ))
                ):(
                    <tr>
                        <td colSpan={6} style={{textAlign: "center"}}>
                            신고 내역이 없습니다.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>

            {/*페이징 버튼*/}
            <div className="pagenation">
                <button onClick={()=> handlePageChange(page - 1)} disabled={page === 1}>
                    이전
                </button>
                <span>{page} / {totalPage}</span>
                <button onClick={()=> handlePageChange(page + 1)} disabled={page === totalPage}>
                    다음
                </button>
            </div>
        </div>
    );
}