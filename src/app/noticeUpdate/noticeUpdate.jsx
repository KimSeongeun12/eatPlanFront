'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import './noticeUpdate.css';

export default function noticeUpdate() {
    const router = useRouter();
    const params = useSearchParams();
    const noticeIdx = params.get('id');

    // ─── 1) 폼 상태 ──────────────────
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [highlight, setHighlight] = useState('false'); // 'true' or 'false'
    const [loading, setLoading] = useState(true);

    // ─── 2) 관리자 체크 ───────────────
    const [isAdmin, setIsAdmin] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // 세션에서 사용자 정보 조회
        const storedUser = sessionStorage.getItem('user_id');
        setCurrentUser(storedUser);

        // isAdmin 정보 (예: sessionStorage에 isAdmin='1' 세팅되어 있다고 가정)
        const adminFlag = sessionStorage.getItem('admin') === 'true';
        setIsAdmin(adminFlag);

        // 관리자 아니라면 상세 페이지로 리다이렉트
        if (storedUser !== 'admin' && !adminFlag) {
            alert('권한이 없습니다.');
            router.push('/noticeList');
            return;
        }

        // 수정 모드라면 (id가 있다면) 기존 공지 데이터 fetch
        if (noticeIdx) {
            axios
                .get(`http://localhost/notice_detail/${noticeIdx}`)
                .then((res) => {
                    const data = res.data.detail;
                    // 기존 공지 데이터를 상태에 세팅
                    setSubject(data.subject);
                    setContent(data.content);
                    setHighlight(data.highlight ? 'true' : 'false');
                })
                .catch((err) => {
                    console.error('[NoticeUpdate] fetch error:', err);
                    alert('공지 정보를 불러오는 중 오류가 발생했습니다.');
                    router.push(`/noticeDetail?id=${noticeIdx}`);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            // noticeIdx가 없는 경우 잘못된 접근: 목록으로 돌려보낸다.
            alert('잘못된 접근입니다.');
            router.push('/noticeList');
        }
    }, [noticeIdx, router]);

    // ─── 3) Change 핸들러 ─────────────────
    const handleSubjectChange = (e) => setSubject(e.target.value);
    const handleContentChange = (e) => setContent(e.target.value);
    const handleHighlightChange = (e) => setHighlight(e.target.value);

    // ─── 4) 유효성 검증: 내용이 비어 있는지 ───
    const isContentEmpty = () => content.trim() === '';

    // ─── 5) 폼 제출 (공지 수정 요청) ───────
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 제목/내용 빈 칸 체크
        if (!subject.trim() || isContentEmpty()) {
            alert('제목과 내용을 모두 입력해주세요.');
            return;
        }

        try {
            const payload = {
                notice_idx: noticeIdx,     // 반드시 백엔드 DTO와 동일한 필드명
                subject: subject.trim(),
                content: content,
                highlight: highlight === 'true'
            };

            const res = await axios.put(`http://localhost/notice_update`, payload);

            if (res.data.success) {
                alert('공지사항이 성공적으로 수정되었습니다.');
                // 수정 완료 후 상세 페이지로 리다이렉트
                router.push(`/noticeDetail?id=${noticeIdx}`);
            } else {
                alert('공지 수정에 실패했습니다.');
            }
        } catch (err) {
            console.error('[NoticeUpdate] submit error:', err);
            alert('수정 중 오류가 발생했습니다. 콘솔을 확인해주세요.');
        }
    };

    // ─── 6) 취소 버튼 핸들러 ───────────────
    const handleCancel = () => {
        // 상세 페이지로 돌아가기
        router.push(`/noticeDetail?id=${noticeIdx}`);
    };

    // ─── 7) 로딩 중 처리 ──────────────────
    if (loading) {
        return <div className="notice-update-loading">로딩 중...</div>;
    }

    return (
        <div className="notice-update-container">
            <form onSubmit={handleSubmit}>
                <table className="update-form-table">
                    <tbody>
                    {/* 제목 입력 */}
                    <tr>
                        <th>
                            제목<span className="required-star">*</span>
                        </th>
                        <td>
                            <input
                                type="text"
                                className="update-input-title"
                                placeholder="제목을 입력해주세요."
                                value={subject}
                                onChange={handleSubjectChange}
                                maxLength={100}
                                required
                                maxLength={66}
                            /><small>{subject.length} / 66자 제한</small>
                        </td>
                    </tr>

                    {/* 내용 입력 */}
                    <tr>
                        <th>
                            내용<span className="required-star">*</span>
                        </th>
                        <td>
                <textarea
                    className="update-textarea-content"
                    placeholder="내용을 입력해주세요."
                    value={content}
                    onChange={handleContentChange}
                    required
                    maxLength={1000}
                /><small>{content.length} / 1000자 제한</small>
                        </td>
                    </tr>
                    </tbody>
                </table>

                {/* 중요 공지 설정 (라디오) */}
                <div className="update-radio-group">
                    <span className="radio-label">중요 공지 설정</span>
                    <label className="radio-item">
                        <input
                            type="radio"
                            name="highlight"
                            value="true"
                            checked={highlight === 'true'}
                            onChange={handleHighlightChange}
                        />
                        설정
                    </label>
                    <label className="radio-item">
                        <input
                            type="radio"
                            name="highlight"
                            value="false"
                            checked={highlight === 'false'}
                            onChange={handleHighlightChange}
                        />
                        비설정
                    </label>
                </div>

                {/* 수정/취소 버튼 (컨테이너 바닥 우측 고정) */}
                <div className="update-button-group">
                    <button type="submit" className="update-btn submit">
                        수정
                    </button>
                    <button type="button" className="update-btn cancel" onClick={handleCancel}>
                        취소
                    </button>
                </div>
            </form>
        </div>
    );
}
