'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import './reportWrite.css';

export default function ReportWrite() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const initialNickname = searchParams.get('suspect') || ''; // 닉네임
    const initialClass = searchParams.get('isClass') || 'course';
    const initialIdx = searchParams.get('idx') || '';

    const [reporterId, setReporterId] = useState('');
    const [reporterNickname, setReporterNickname] = useState('');

    const [suspectId, setSuspectId] = useState('');
    const [suspectNickname, setSuspectNickname] = useState(initialNickname);
    const [classification, setClassification] = useState(initialClass);
    const [reportedIdx, setReportedIdx] = useState(initialIdx);

    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState([]);
    const [isPublic, setIsPublic] = useState(false);

    useEffect(() => {
        const id = sessionStorage.getItem('user_id') || '';
        const token = sessionStorage.getItem('token') || '';
        setReporterId(id);
        if (!id) return;

        axios.get(`http://localhost/member/${id}`,
        { headers: { Authorization: token }
        })
            .then(res => setReporterNickname(res.data.nickname));
    }, []);

    useEffect(() => {
        const nickname = searchParams.get('suspect') || '';
        setSuspectNickname(nickname); // 닉네임은 표시용으로 사용

        if (!nickname) return;

        // 닉네임을 user_id로 변환
        axios.get(`http://localhost/member/byNickname/${suspectNickname}`)
            .then(res => {
                if (res.data.user_id) {
                    setSuspectId(res.data.user_id);
                } else {
                    alert("사용자를 찾을 수 없습니다.");
                }
            })
            .catch(err => {
                console.error("닉네임으로 user_id 조회 실패", err);
                alert("닉네임 조회 중 오류 발생");
            });
    }, []);


    useEffect(() => {
        if (!initialNickname) return;

        axios.get(`http://localhost/member/byNickname/${initialNickname}`)
            .then(res => {
                if (res.data.user_id) {
                    setSuspectId(res.data.user_id);
                } else {
                    alert("해당 닉네임의 사용자를 찾을 수 없습니다.");
                }
            })
            .catch(err => {
                console.error("닉네임으로 user_id 조회 실패", err);
                alert("닉네임 조회 중 오류 발생");
            });
    }, [initialNickname]);

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!reporterId || !suspectId || !subject.trim() || !content.trim()) {
            alert('필수 항목을 모두 입력해주세요.');
            return;

        }


        const formData = new FormData();
        formData.append('isClass', classification);
        formData.append('suspect_id', suspectId);
        formData.append('suspect_nickname', suspectNickname);
        formData.append('reporter_id', reporterId);
        formData.append('reported_idx', reportedIdx);
        formData.append('subject', subject);
        formData.append('content', content);
        formData.append('isPublic', isPublic ? '1' : '0');
        files.forEach(f => formData.append('files', f));

        try {
            const res = await axios.post(
                'http://localhost/report_write',
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            if (res.data.success) {
                router.push('/report');
            } else {
                alert('신고 작성에 실패했습니다.');
            }
        } catch (err) {
            console.error('서버 에러:', err);
            alert('서버 에러가 발생했습니다.');
        }

    };

    return (
        <div className="report-write-container">
            <h2>신고 작성</h2>
            <form onSubmit={handleSubmit} className="report-form">
                <table className="report-table">
                    <colgroup>
                        <col style={{ width: 120 }} />
                        <col />
                        <col style={{ width: 120 }} />
                        <col />
                    </colgroup>
                    <tbody>
                    <tr>
                        <th>분류</th>
                        <td>
                            <select
                                name="isClass"
                                value={classification}
                                onChange={e => setClassification(e.target.value)}
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
                    <tr>
                        <th>신고 대상자</th>
                        <td colSpan={3}>
                            <input type="text" value={suspectNickname || suspectId} readOnly />
                        </td>
                    </tr>
                    <tr>
                        <th>제목</th>
                        <td colSpan={3}>
                            <input
                                type="text"
                                value={subject}
                                onChange={e => setSubject(e.target.value)}
                                placeholder="제목을 입력해주세요."
                                required
                            />
                        </td>
                    </tr>
                    <tr>
                        <th>내용 *</th>
                        <td colSpan={3}>
                            <textarea
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                rows={8}
                                placeholder="신고 내용을 작성해주세요."
                                required
                            />
                        </td>
                    </tr>
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
                    <tr>
                        <th>공개 설정</th>
                        <td colSpan={3}>
                            <label>
                                <input
                                    type="radio"
                                    name="public"
                                    checked={isPublic}
                                    onChange={() => setIsPublic(true)}
                                /> 공개
                            </label>
                            <label style={{ marginLeft: 12 }}>
                                <input
                                    type="radio"
                                    name="public"
                                    checked={!isPublic}
                                    onChange={() => setIsPublic(false)}
                                /> 비공개
                            </label>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div className="submit-area">
                    <button type="submit" className="btn-submit">등록</button>
                </div>
            </form>
        </div>
    );
}
