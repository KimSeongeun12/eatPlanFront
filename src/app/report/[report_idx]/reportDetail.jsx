'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './reportDetail.css';

export default function ReportDetail() {
    const router = useRouter();
    const { report_idx } = useParams();

    const [detail, setDetail] = useState(null);

    // 분류 코드 → 한글 매핑
    const categoryMap = {
        course:  '게시글',
        comment: '댓글',
        message: '쪽지',
    };

    useEffect(() => {
        if (!report_idx) return;

        axios
            .get(`http://localhost/report_detail/${report_idx}`)
            .then(({ data }) => {
                setDetail(data.detail);
            })
            .catch((err) => console.error('신고 상세 불러오기 실패', err));
    }, [report_idx]);

    if (!detail) {
        return <div className="detail-wrapper">로딩 중…</div>;
    }

    // 현재 탭 텍스트
    const currentTab = categoryMap[detail.class] || '기타';

    return (
        <div className="detail-wrapper">
            <h2>신고 상세보기</h2>

            {/* ── 상단 헤더: 분류 탭 + 작성자·신고번호 ── */}
            <div className="report-detail-header">
                <div className="header-row">
                    {/* 분류 탭 */}
                    <div className="classification">
                        <span className="label">분류</span>
                        {['댓글', '게시글', '쪽지'].map((tab) => (
                            <button
                                key={tab}
                                className={tab === currentTab ? 'tab active' : 'tab'}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* 작성자 */}
                    <div className="meta-item">
                        <span className="meta-label">작성자</span>
                        <span className="meta-value">{detail.reporter_id}</span>
                    </div>

                    {/* 신고번호 */}
                    <div className="meta-item">
                        <span className="meta-label">신고번호</span>
                        <span className="meta-value">{detail.report_idx}</span>
                    </div>
                </div>
            </div>

            {/* ── 신고 대상자 / 제목 / 내용 폼 ── */}
            <div className="detail-field">
                <label>신고 대상자</label>
                <input type="text" value={detail.suspect_id} readOnly />
            </div>

            <div className="detail-field">
                <label>제목</label>
                <input type="text" value={detail.subject} readOnly />
            </div>

            <div className="detail-field">
                <label>내용</label>
                <textarea value={detail.content} readOnly />
            </div>

            {/* ── 목록 버튼 ── */}
            <div className="button-wrapper">
                <button onClick={() => router.push('/report')}>목록</button>
            </div>
        </div>
    );
}