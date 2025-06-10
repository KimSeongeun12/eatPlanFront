'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ReportDetail() {
    const router = useRouter();
    const { report_idx } = useParams();
    const searchParams = useSearchParams();

    const [detail, setDetail] = useState(null);
    const [photo, setPhoto] = useState(null);
    const [listIndex, setListIndex] = useState(null);

    // 토큰에서 admin/user_id 꺼내기
    const [isAdmin, setIsAdmin] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) return;
        try {
            const [, payloadB64] = token.split('.');
            const payload = JSON.parse(atob(payloadB64));
            setIsAdmin(
                payload.admin === true ||
                payload.admin === 'true' ||
                payload.admin === 1
            );
            setCurrentUser(payload.user_id);
        } catch (e) {
            console.error('토큰 파싱 실패', e);
        }
    }, []);

    // 리스트에서 index 파라 가져오기
    useEffect(() => {
        const idx = searchParams.get('index');
        if (idx) setListIndex(idx);
    }, [searchParams]);

    // 상세 가져오기
    useEffect(() => {
        if (!report_idx) return;

        const token = sessionStorage.getItem('token');
        const config = {};
        if (token) {
            config.headers = { Authorization: `Bearer ${token}` };
        }

        axios
            .get(`http://localhost/report_detail/${report_idx}`, config)
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
                const status = err.response?.status;
                if (status === 401 || status === 403) {
                    alert('권한이 없습니다.');
                    router.push('/report');
                } else {
                    console.error(err);
                    alert('서버 오류가 발생했습니다.');
                }
            });
    }, [report_idx]);

    if (!detail) {
        return <div className="detail-wrapper">로딩 중…</div>;
    }

    // 분류 매핑
    const categoryMap = {
        course: '게시글',
        comment: '댓글',
        message: '쪽지'
    };
    const categoryText =
        categoryMap[detail.isClass] || '기타';

    return (
        <div className="report-detail-rightmenu">
            <div className="report_container">
                <h2>신고 상세보기</h2>
                <table className="report_detail_table">
                    <tbody>
                    <tr>
                        <th>분류</th>
                        <td>{categoryText}</td>
                        <th>작성자</th>
                        <td
                            style={{
                                textAlign: 'center',
                                verticalAlign: 'middle'
                            }}
                        >
                            {detail.reporter_nickname ||
                                detail.reporter_id}
                        </td>
                        <th>신고번호</th>
                        <td>
                            {listIndex ?? detail.report_idx}
                        </td>
                    </tr>
                    <tr>
                        <th>신고대상자</th>
                        <td colSpan={5}>
                            <input
                                type="text"
                                value={
                                    detail.suspect_nickname ||
                                    detail.suspect_id
                                }
                                readOnly
                            />
                        </td>
                    </tr>
                    <tr>
                        <th>제목</th>
                        <td colSpan={5}>
                            <input
                                type="text"
                                value={detail.subject}
                                readOnly
                            />
                        </td>
                    </tr>
                    <tr>
                        <th
                            colSpan={6}
                            className="content-label"
                        >
                            내용 *
                        </th>
                    </tr>
                    <tr>
                        <td colSpan={6}>
                <textarea
                    value={detail.content}
                    readOnly
                />
                        </td>
                    </tr>
                    {photo && (
                        <tr>
                            <th>첨부 이미지</th>
                            <td colSpan={5}>
                                <img
                                    src={`http://localhost/image/${photo.new_filename}`}
                                    alt="신고 첨부파일"
                                    className="report-detail-image"
                                />
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>

                {/* 관리자 전용 버튼 */}
                {isAdmin && (
                    <div
                        className="admin-actions"
                        style={{ textAlign: 'center' }}
                    >
                        <button
                            onClick={() => {
                                /* 처리 완료 로직 */
                            }}
                        >
                            신고 처리 완료
                        </button>
                    </div>
                )}

                <div className="button-wrapper">
                    <a href="/report">
                        <button>목록</button>
                    </a>
                </div>
            </div>
        </div>
    );
}
