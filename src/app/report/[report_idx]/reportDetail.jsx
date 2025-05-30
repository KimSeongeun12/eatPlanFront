'use client';

import {useParams, useRouter, useSearchParams} from 'next/navigation';
import {useEffect, useState} from 'react';
import axios from 'axios';

export default function ReportDetail() {

    const router = useRouter();
    const {report_idx} = useParams();
    const searchParams = useSearchParams();

    const [detail, setDetail] = useState(null);
    const [listIndex, setListIndex] = useState(null);

    // 1) 리스트에서 넘긴 index 쿼리 파라 읽어오기
    useEffect(() => {
        const idx = searchParams.get('index');
        if (idx) setListIndex(idx);
    }, [searchParams]);

    // 2) 백엔드에서 신고 상세 가져오기
    useEffect(() => {
        if (!report_idx) return;
        console.log("report_idx:", report_idx);
        axios.get(`http://localhost/report_detail/${report_idx}`)
            .then(res => {
                if(res.data.error){
                    alert(res.data.error);
                    return;
                }
                setDetail(res.data.detail);
            })
            .catch((err) => {
                console.error(err);
                alert("서버 오류가 발생했습니다.");
            });
    }, [report_idx]);

    if (!detail) {
        return <div className="detail-wrapper">로딩 중…</div>;
    }

    // 3) 분류 코드 → 한글 매핑
    const categoryMap = {
        course: '게시글',
        comment: '댓글',
        message: '쪽지',
    };

    // 4) 실제 화면에 보여줄 분류 텍스트
    const categoryText = categoryMap[detail.class] || '기타';

    return (
        <div className={"report_container"}>
            <h2>신고 상세보기</h2>

            <table className="report_detail_table">
                <tbody>
                {/* 1. 헤더 행 */}
                <tr>
                    <th>분류</th>
                    <td>{categoryMap[detail.isClass] || '기타'}</td>
                    <th>작성자</th>
                    <td
                        style={{
                            textAlign: 'center',
                            verticalAlign: 'middle',
                        }}>{detail.reporter_id}</td>
                    <th>신고번호</th>
                    <td>{listIndex ?? detail.report_idx}</td>
                </tr>

                {/* 2. 신고 대상자 */}
                <tr>
                    <th>신고대상자</th>
                    <td colSpan={5}>
                        <input type="text" value={detail.suspect_id} readOnly/>
                    </td>
                </tr>

                {/* 3. 제목 */}
                <tr>
                    <th>제목</th>
                    <td colSpan={5}>
                        <input type="text" value={detail.subject} readOnly/>
                    </td>
                </tr>

                {/* 4. 내용 레이블 */}
                <tr>
                    <th colSpan={6} className="content-label">내용 *</th>
                </tr>

                {/* 5. 내용 텍스트영역 */}
                <tr>
                    <td colSpan={6}>
                        <textarea value={detail.content} readOnly/>
                    </td>
                </tr>

                {detail.files && detail.files.length > 0 && (
                    <tr>
                        <th>첨부파일</th>
                        <td colSpan={5}>
                            <ul className="attachments">
                                {detail.files.map((file) => (
                                    <li key={file.img_idx}>
                                        <a
                                            href={`http://localhost/files/${file.new_filename}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {file.originalFileName}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </td>
                    </tr>
                )}
                </tbody>
            </table>

            <div className="button-wrapper">
                <a href="/report">
                <button>목록</button>
                </a>
            </div>
        </div>
    );
}