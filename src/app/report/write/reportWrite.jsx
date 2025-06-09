// File: /app/report/reportWrite.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import './reportWrite.css';

export default function ReportWrite() {
    const router = useRouter();

    // 1) 신고자 정보 (sessionStorage가 아니라 login 시에 localStorage.setItem('userId')를 가정)
    const [reporterId, setReporterId] = useState('');
    const [reporterNickname, setReporterNickname] = useState('');

    useEffect(() => {
        const id = sessionStorage.getItem('user_id') || '';
        setReporterId(id);
        if (!id) {
            console.warn('⚠️ sessionStorage에 userId가 없습니다.');
            return;
        }
        // (수정) /{id}/profile 과 같은 유저 프로필 조회 API를 가정
        axios
            .get(`http://localhost/${id}`, {
                headers: { Authorization: sessionStorage.getItem('token') || '' },
            })
            .then((res) => {
                setReporterNickname(res.data.nickname || '');
            })
            .catch((err) => {
                console.error('신고자 닉네임 조회 실패 : ', err);
                setReporterNickname('');
            });
    }, []);

    // 2) URL 쿼리에서 넘어온 suspect, isClass, idx 가져오기
    const searchParams = useSearchParams();
    const initialSuspect = searchParams.get('suspect') || '';
    const initialClass = searchParams.get('isClass') || 'course';
    const initialIdx = searchParams.get('idx') || '';

    const [suspectId, setSuspectId] = useState(initialSuspect);
    const [suspectNickname, setSuspectNickname] = useState('');
    const [classification, setClassification] = useState(initialClass);
    const [reportedIdx, setReportedIdx] = useState(initialIdx);

    useEffect(() => {
        if (!suspectId) return;
        // (수정) /{suspectId}/profile 과 같은 유저 프로필 조회 API를 가정
        axios
            .get(`http://localhost/${suspectId}/profile`, {
                headers: { Authorization: sessionStorage.getItem('token') || '' },
            })
            .then((res) => {
                setSuspectNickname(res.data.nickname || '');
            })
            .catch((err) => {
                console.error('닉네임 조회 실패:', err);
                setSuspectNickname('');
            });
    }, [suspectId]);

    // 3) 신고 양식 상태
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState([]);
    const [isPublic, setIsPublic] = useState(false);

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!reporterId) {
            alert('로그인이 필요합니다');
            return;
        }
        if (!suspectId || !subject.trim() || !content.trim()) {
            alert('필수 항목을 모두 입력해주세요.');
            return;
        }

        const formData = new FormData();
        formData.append('isClass', classification);
        formData.append('suspect_id', suspectId);
        formData.append('suspect_nickname', suspectNickname || '');
        formData.append('reporter_id', reporterId);
        formData.append('reporter_nickname', reporterNickname || '');
        formData.append('reported_idx', reportedIdx);
        formData.append('subject', subject);
        formData.append('content', content);
        formData.append('isPublic', isPublic ? '1' : '0');
        files.forEach((f) => formData.append('files', f));

        try {
            const res = await axios.post(
                'http://localhost/report_write', // 백엔드의 신고 등록 API
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            if (res.data.success) {
                router.push('/report'); // 신고 목록 페이지로 이동
            } else {
                alert('작성에 실패했습니다.');
            }
        } catch (err) {
            console.error(err);
            alert('서버 에러가 발생했습니다.');
        }
    };

    return (
        <div>
            <h2>신고작성</h2>
            <form onSubmit={handleSubmit} className="report-form">
                <table className="report-table">
                    <colgroup>
                        <col style={{ width: 120 }} />
                        <col />
                        <col style={{ width: 120 }} />
                        <col />
                    </colgroup>
                    <tbody>
                    {/* 분류 / 작성자 */}
                    <tr>
                        <th>분류</th>
                        <td>
                            <select
                                name="isClass"
                                value={classification}
                                onChange={(e) => setClassification(e.target.value)}
                                required
                            >
                                <option value="course">게시글</option>
                                <option value="message">쪽지</option>
                                <option value="comment">댓글</option>
                            </select>
                        </td>
                        <th>작성자</th>
                        <td>
                            <input type="text" value={reporterNickname || reporterId} readOnly />
                        </td>
                    </tr>

                    {/* 2. 신고 대상자 */}
                    <tr>
                        <th>신고 대상자</th>
                        <td colSpan={3}>
                            <input
                                type="text"
                                value={suspectNickname || suspectId}
                                placeholder="신고 대상자 아이디"
                                readOnly
                            />
                        </td>
                    </tr>

                    {/* 3. 제목 */}
                    <tr>
                        <th>제목</th>
                        <td colSpan={3}>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="제목을 입력해주세요."
                                required
                            />
                        </td>
                    </tr>

                    {/* 4. 내용 */}
                    <tr>
                        <th>
                            내용 <span className="required">*</span>
                        </th>
                        <td colSpan={3}>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={10}
                    placeholder="신고 내용을 작성해주세요."
                    required
                />
                        </td>
                    </tr>

                    {/* 5. 첨부파일 */}
                    <tr>
                        <th>첨부파일</th>
                        <td colSpan={3}>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileChange}
                            />
                        </td>
                    </tr>

                    {/* 6. 공개 설정 */}
                    <tr>
                        <th>공개 설정</th>
                        <td colSpan={3}>
                            <label>
                                <input
                                    type="radio"
                                    name="public"
                                    checked={isPublic}
                                    onChange={() => setIsPublic(true)}
                                />{' '}
                                공개
                            </label>
                            <label className="radio-spacer">
                                <input
                                    type="radio"
                                    name="public"
                                    checked={!isPublic}
                                    onChange={() => setIsPublic(false)}
                                />{' '}
                                비공개
                            </label>
                        </td>
                    </tr>
                    </tbody>
                </table>

                {/* 7. 등록 버튼 (플로팅) */}
                <div className="submit-area">
                    <button type="submit" className="btn-submit">
                        등록
                    </button>
                </div>
            </form>
        </div>
    );
}
