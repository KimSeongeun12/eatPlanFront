// src/app/report/[report_idx]/page.jsx
'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, {Suspense, useEffect, useState} from 'react';
import axios from 'axios';
import './reportDetail.css';

function FuspReportDetail(){
    const router = useRouter();
    const { report_idx } = useParams();
    const searchParams = useSearchParams();

    const [detail, setDetail] = useState(null);
    const [photo, setPhoto] = useState(null);
    const [listIndex, setListIndex] = useState(null);

    // 쿼리스트링 index 파싱
    useEffect(() => {
        const idx = searchParams.get('index');
        if (idx) setListIndex(idx);
    }, [searchParams]);

    // 상세 데이터 로드
    useEffect(() => {
        if (!report_idx) return;

        const token = sessionStorage.getItem('token');
        if (!token) {
            alert('로그인이 필요합니다.');
            router.push('/login');
            return;
        }

        // 콘솔에 헤더 확인
        console.log('▶ 보내는 Authorization 헤더:', `Bearer ${token}`);

        axios
            .get(`http://192.168.0.120/report_detail/${report_idx}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(res => {
                if (res.data.error) {
                    alert(res.data.error);
                    router.push('/report');
                    return;
                }
                setDetail(res.data.detail);
                setPhoto(res.data.photo !== 'no_image' ? res.data.photo : null);
            })
            .catch(err => {
                console.error('상세 조회 실패:', err);
                if (err.response?.status === 401) {
                    alert('인증 정보가 유효하지 않습니다. 다시 로그인해주세요.');
                    router.push('/login');
                } else {
                    alert('서버 오류가 발생했습니다.');
                    router.push('/report');
                }
            });
    }, [report_idx]);

    if (!detail) {
        return <div className="detail-wrapper">로딩 중…</div>;
    }

    // 분류 매핑
    const categoryMap = { course: '게시글', comment: '댓글', message: '쪽지' };
    const categoryText = categoryMap[detail.isClass] || '기타';

    // 처리 상태 변경 핸들러
    const onChangeStatus = (e) => {
        const done = e.target.value === 'true';
        const token = sessionStorage.getItem('token');
        axios
            .patch(`http://192.168.0.120/report_done/${detail.report_idx}`, { done }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(() => {
                setDetail({ ...detail, done });
                alert('처리 상태가 변경되었습니다.');
            })
            .catch(err => {
                console.error('처리 업데이트 실패:', err);
                alert('처리 상태 변경 중 오류가 발생했습니다.');
            });
    };
    return (
        <div className="report_container">
            <h2>신고 상세보기</h2>
            <table className="report_detail_table">
                <tbody>
                <tr>
                    <th>분류</th>
                    <td>{categoryText}</td>
                    <th>작성자</th>
                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                        {detail.reporter_nickname || detail.reporter_id}
                    </td>
                    <th>신고번호</th>
                    <td>{listIndex ?? detail.report_idx}</td>
                </tr>
                <tr>
                    <th>신고대상자</th>
                    <td colSpan={3}>
                        <input
                            type="text"
                            value={detail.suspect_nickname || detail.suspect_id}
                            readOnly
                        />
                    </td>
                    <th>처리여부</th>
                    <td>
                        {detail.admin ? /* 만약 detail.admin 필드로 */ (
                            <select
                                value={detail.done ? 'true' : 'false'}
                                onChange={onChangeStatus}
                            >
                                <option value="false">미처리</option>
                                <option value="true">처리완료</option>
                            </select>
                        ) : (
                            <span>{detail.done ? '처리완료' : '미처리'}</span>
                        )}
                    </td>
                </tr>
                <tr>
                    <th>제목</th>
                    <td colSpan={5}>
                        <input type="text" value={detail.subject} readOnly />
                    </td>
                </tr>
                <tr>
                    <th colSpan={6} className="content-label">내용 *</th>
                </tr>
                <tr>
                    <td colSpan={6}>
                        <textarea value={detail.content} readOnly />
                    </td>
                </tr>
                {photo && (
                    <tr>
                        <th>첨부 이미지</th>
                        <td colSpan={5}>
                            <img
                                src={`http://192.168.0.120/image/${photo.new_filename}`}
                                alt="신고 첨부파일"
                                className="report-detail-image"
                            />
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
            <div className="button-wrapper">
                <a href="/report"><button>목록</button></a>
            </div>
        </div>
    );
}

export default function ReportDetail() {
    return(
        <Suspense fallback={<div>로딩 중...</div>}>
            <FuspReportDetail/>
        </Suspense>
    );
}
