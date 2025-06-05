// File: /app/message/messageWrite/messageWrite.jsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import './messageWrite.css';

export default function MessageWrite() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // 1) 로그인된 사용자(user_id)와 토큰(token) 가져오기
    const userId =
        typeof window !== 'undefined' ? sessionStorage.getItem('user_id') : null;
    const token =
        typeof window !== 'undefined' ? sessionStorage.getItem('token') : null;

    // 2) 쿼리로 전달된 받는 사람(recipient)이 있으면 미리 채워주기
    const initialRecip = searchParams.get('recip') || '';
    const [recip, setRecip] = useState(initialRecip);

    // 3) 제목, 내용 상태
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');

    // 4) 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userId || !token) {
            alert('로그인이 필요합니다.');
            return;
        }
        if (!recip.trim()) {
            alert('받는 사람을 입력해주세요.');
            return;
        }
        if (!subject.trim()) {
            alert('제목을 입력해주세요.');
            return;
        }
        if (!content.trim()) {
            alert('내용을 입력해주세요.');
            return;
        }

        try {
            // 백엔드 호출: POST /{userId}/write_msg
            const body = {
                sender: userId,
                recip: recip.trim(),
                subject: subject.trim(),
                content: content.trim(),
            };

            await axios.post(
                `http://localhost/${userId}/write_msg`,
                body,
                {
                    headers: {
                        Authorization: token,
                        'Content-Type': 'application/json',
                    },
                }
            );

            // 전송 성공 후 쪽지 목록 페이지로 이동
            router.push('/message');
        } catch (err) {
            console.error('쪽지 전송 중 오류 발생:', err);
            alert('쪽지 전송에 실패했습니다.');
        }
    };

    return (
        <div className="message-write-container">
            <form onSubmit={handleSubmit} className="message-write-form">
                <table className="write-table">
                    <colgroup>
                        <col style={{ width: '120px' }} />
                        <col />
                        <col style={{ width: '120px' }} />
                        <col />
                    </colgroup>
                    <tbody>
                    {/* 보내는 사람 / 받는 사람 */}
                    <tr>
                        <th>보내는 사람</th>
                        <td>
                            <input
                                type="text"
                                value={userId || ''}
                                readOnly
                                className="readonly-input"
                            />
                        </td>
                        <th>받는 사람 <span className="required">*</span></th>
                        <td>
                            <input
                                type="text"
                                value={recip}
                                onChange={(e) => setRecip(e.target.value)}
                                placeholder="받는 사람 아이디"
                                required
                            />
                        </td>
                    </tr>

                    {/* 제목 */}
                    <tr>
                        <th>제목 <span className="required">*</span></th>
                        <td colSpan={3}>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="제목을 입력하세요."
                                required
                                className="full-width-input"
                            />
                        </td>
                    </tr>

                    {/* 내용 */}
                    <tr>
                        <th>내용 <span className="required">*</span></th>
                        <td colSpan={3}>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={12}
                    placeholder="내용을 입력하세요."
                    required
                    className="full-width-textarea"
                />
                        </td>
                    </tr>
                    </tbody>
                </table>

                {/* 보내기 버튼 */}
                <div className="write-submit-area">
                    <button type="submit" className="btn-submit">
                        보내기
                    </button>
                </div>
            </form>
        </div>
    );
}
