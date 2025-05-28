'use client'

import {useParams, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import axios from "axios";
import './reportDetail.css';

export default function ReportDetail() {
    const router = useRouter();
    const {report_idx}  = useParams();
    const [detail, setDetail] = useState(null);

    useEffect(() => {
        if(report_idx){
            axios.get(`http://localhost/report/${report_idx}`).then((res) => {
                setDetail(res.data);
            }).catch((err) => {
                console.error('신고 상세 불러오기 실패', err);
            });
        }
    },[report_idx]);

    if(!detail){
        return(
        <div className="report-page-wrapper">
            <LeftMenu/>
            <div className="detail-wrapper">로딩 중...</div>
        </div>
        );
    }

    const category = {
        post : '게시글',
        comment : '댓글',
        msg : '쪽지'
    };

    return (
        <div className="report-page-wrapper">
            <LeftMenu/>
            <div className="detail-wrapper">
                <h2>신고 상세보기</h2>

                <table className="detail-header">
                    <tbody>
                    <tr>
                        <th>분류</th>
                        <td>{categoryMap[detail.category]}</td>
                        <th>작성자</th>
                        <td>{detail.reporter_id}</td>
                        <th>신고번호</th>
                        <td>{detail.report_idx}</td>
                    </tr>
                    </tbody>
                </table>

                <div className="detail-field">
                    <label>신고 대상자</label>
                    <input type="text" value={detail.suspect_id} readOnly/>
                </div>

                <div className="detail-field">
                    <label>제목</label>
                    <input type="text" value={detail.subject} readOnly/>
                </div>

                <div className="detail-field">
                    <label>내용</label>
                    <input type="text" value={detail.content} readOnly/>
                </div>

                <div className="button-wrapper">
                    <button onClick={()=>router.push('/reportList')}>목록</button>
                </div>
            </div>
        </div>
    );
}