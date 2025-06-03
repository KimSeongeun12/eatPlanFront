// app/noticeWrite/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import './noticeWrite.css';

export default function NoticeWritePage() {
    const router = useRouter();

    // ─── 1) 폼 상태 관리 ──────────
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState(''); // 단순 텍스트
    const [highlight, setHighlight] = useState('false'); // 'true' or 'false'

    // ─── 2) 관리자 여부 체크 ───
    const [currentUser, setCurrentUser] = useState(null);
    useEffect(() => {
        const storedUser = sessionStorage.getItem('user_id');
        setCurrentUser(storedUser);
        if (storedUser !== 'admin') {
            router.push('/noticeList'); // 관리자 아니면 목록으로 리다이렉트
        }
    }, [router]);

    // ─── 3) Change 핸들러 ───────
    const handleSubjectChange = (e) => setSubject(e.target.value);
    const handleContentChange = (e) => setContent(e.target.value);
    const handleHighlightChange = (e) => setHighlight(e.target.value);

    // ─── 4) “내용이 비어 있는지” 체크 ───
    const isContentEmpty = () => content.trim() === '';

    // ─── 5) 폼 제출(공지 등록) ───
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!subject.trim() || isContentEmpty()) {
            alert('제목과 내용을 모두 입력해주세요.');
            return;
        }

        try {
            const payload = {
                user_id: currentUser,
                subject: subject.trim(),
                content: content,
                highlight: highlight === 'true',
            };
            const res = await axios.post('http://localhost/notice_write', payload);
            if (res.data.success) {
                alert('공지사항이 정상 등록되었습니다.');
                router.push('/noticeList');
            } else {
                alert('공지사항 등록에 실패했습니다.');
            }
        } catch (err) {
            console.error('[NoticeWrite] error:', err);
            alert('오류가 발생했습니다. 콘솔을 확인해주세요.');
        }
    };

    // ─── 6) 취소 버튼 핸들러 ───────
    const handleCancel = () => {
        router.push('/noticeList');
    };

    return (
        <div className="notice-write-container">
            <form onSubmit={handleSubmit}>
                <table className="notice-form-table">
                    <tbody>
                    {/* 제목 행 */}
                    <tr>
                        <th>
                            제목<span className="required-star">*</span>
                        </th>
                        <td>
                            <input
                                type="text"
                                className="notice-input-title"
                                placeholder="제목을 입력해주세요."
                                value={subject}
                                onChange={handleSubjectChange}
                                maxLength={100}
                                required
                            />
                        </td>
                    </tr>

                    {/* 내용 행 */}
                    <tr>
                        <th>
                            내용<span className="required-star">*</span>
                        </th>
                        <td>
                <textarea
                    className="notice-textarea-content"
                    placeholder="내용을 입력해주세요."
                    value={content}
                    onChange={handleContentChange}
                    required
                />
                        </td>
                    </tr>
                    </tbody>
                </table>

                {/* 중요 공지 설정(라디오) */}
                <div className="bottom-radio-group">
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

                {/* 등록 / 취소 버튼 (컨테이너 바닥 우측에 고정) */}
                <div className="button-group">
                    <button type="submit" className="btn-submit">
                        등록
                    </button>
                    <button type="button" className="btn-cancel" onClick={handleCancel}>
                        취소
                    </button>
                </div>
            </form>
        </div>
    );
}
