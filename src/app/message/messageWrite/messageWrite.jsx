'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import './messageWrite.css';

export default function MessageWrite() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // 로그인 정보
    const userId  = typeof window !== 'undefined' ? sessionStorage.getItem('user_id') : null;
    const token   = typeof window !== 'undefined' ? sessionStorage.getItem('token')  : null;

    // 보내는 사람 닉네임
    const [senderNickname, setSenderNickname] = useState('');

    // 받는 사람 닉네임 & ID
    const [recipientNickname, setRecipientNickname] = useState('');
    const [recipId, setRecipId] = useState('');

    // 제목, 내용
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');

    // (A) URL 쿼리에서 recip 파라미터 초기값 설정
    useEffect(() => {
        const r = searchParams.get('recip');
        if (!r) return;

           // 1) r이 userId 이므로, /member/{userId}로 닉네임 조회
            axios
                .get(`http://192.168.0.120/member/${r}`)
                .then((res) => {
                    setRecipientNickname(res.data.nickname || '');  // 닉네임 셋
                           setRecipId(r);                                // ID 셋
                })
                .catch(() => {
                          // 혹시 ID로 조회 실패 시 fallback: 입력값 그대로 닉네임으로 간주
                        setRecipientNickname(r);
                });
    }, [searchParams]);

    // (B) recipientNickname 변경 시 ID 조회 (디바운스)
    // 사용자 직접 수정했다면 recipientNickname은 닉네임이므로 byNickname 호출
    useEffect(() => {
    if (!recipientNickname.trim()) {
        setRecipId('');
        return;
    }
    const timeoutId = setTimeout(() => {
        axios
            .get(
                `http://192.168.0.120/member/byNickname/${encodeURIComponent(
                    recipientNickname.trim()
                )}`
            )
            .then((res) => setRecipId(res.data.user_id || ''))
            .catch(() => {
                setRecipId('');
                console.warn('닉네임으로 사용자 조회 실패');
            });
    }, 300);
    return () => clearTimeout(timeoutId);
}, [recipientNickname]);

    // (C) senderNickname 조회
    useEffect(() => {
        if (!userId) return;
        axios
            .get(`http://192.168.0.120/member/${userId}`)
            .then((res) => setSenderNickname(res.data.nickname || ''))
            .catch((err) => {
                console.warn('[MessageWrite] sender 조회 실패:', err);
                setSenderNickname('');
            });
    }, [userId]);

    // 쪽지 전송 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userId || !token) {
            alert('로그인이 필요합니다.');
            return;
        }
        if (!recipientNickname.trim() || !recipId) {
            alert('받는 사람 닉네임 또는 ID가 유효하지 않습니다.');
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
            const body = {
                sender: userId,
                recip: recipId,
                subject: subject.trim(),
                content: content.trim(),
            };

            await axios.post(`http://192.168.0.120/${userId}/write_msg`, body, {
                headers: {
                    Authorization: token,
                    'Content-Type': 'application/json',
                },
            });

            alert('쪽지를 성공적으로 보냈습니다.');
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
                    <tr>
                        <th>보내는 사람</th>
                        <td>
                            <input
                                type="text"
                                value={senderNickname}
                                readOnly
                                className="readonly-input"
                            />
                        </td>
                        <th>
                            받는 사람 <span className="required">*</span>
                        </th>
                        <td>
                            <input
                                type="text"
                                value={recipientNickname}
                                onChange={(e) => setRecipientNickname(e.target.value)}
                                placeholder="받는 사람 닉네임 입력"
                                required
                            />
                        </td>
                    </tr>
                    <tr>
                        <th>
                            제목 <span className="required">*</span>
                        </th>
                        <td colSpan={3}>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="제목을 입력하세요."
                                required
                                className="full-width-input"
                                maxLength={66}
                            /><small>{subject.length} / 66자 제한</small>
                        </td>
                    </tr>
                    <tr>
                        <th>
                            내용 <span className="required">*</span>
                        </th>
                        <td colSpan={3}>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={12}
                    placeholder="내용을 입력하세요."
                    required
                    className="full-width-textarea"
                    maxLength={333}
                /><small>{content.length} / 333자 제한</small>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div className="write-submit-area">
                    <button type="submit" className="btn-submit">
                        보내기
                    </button>
                </div>
            </form>
        </div>
    );
}
