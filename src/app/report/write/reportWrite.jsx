'use client';

import {useState, useEffect, Suspense} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import './reportWrite.css';

function FuspReportWrite(){
    const router = useRouter();
    const searchParams = useSearchParams();

    const initialNickname = searchParams.get('suspect') || ''; // 닉네임
    const initialClass = searchParams.get('isClass') || 'course';
    const initialIdx = searchParams.get('idx') || '';

    const [reporterId, setReporterId] = useState('');
    const [reporterNickname, setReporterNickname] = useState('');

    const [reportCmt, setReporterCmt] = useState('');
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
        if (!id || !token) {
            alert('로그인이 필요한 서비스입니다.');
            router.push('/login'); // 로그인 페이지 경로로 리다이렉트
            return;
        }

        setReporterId(id);
        axios.get(`http://192.168.0.120/member/${id}`, {
            headers: { Authorization: token }
        })
            .then(res => setReporterNickname(res.data.nickname))
            .catch(err => {
                console.error('작성자 정보 조회 실패:', err);
                alert('사용자 정보를 불러올 수 없습니다.');
            });
    }, []);

    // (2) **새로 추가하는** 한 개의 훅
    useEffect(() => {
        const suspectParam = searchParams.get('suspect') || '';
        if (!suspectParam) {
            return;
        }

        (async () => {
            try {
                const res = await axios.get(`http://192.168.0.120/member/${encodeURIComponent(suspectParam)}`);
                console.log('▶ user_id 조회 성공', res.status);
                console.log("유저이이디 ", suspectParam);

                if (res.data.user_id) {
                    // user_id 있으면 정상 처리 후 끝
                    setSuspectId(res.data.user_id);
                    setSuspectNickname(res.data.nickname);
                    console.log("서스펙트 닉네임", res.data.nickname);
                    console.log("서스펙트 아이디", res.data.user_id);
                    return;  // → 이때만 return!
                } else {
                    console.log("▶ user_id 조회 성공했지만 user_id 없음 → 닉네임으로 재시도");
                }
            } catch (err) {
                console.log('▶ user_id 조회 실패', err.response?.status);
            }

            // nickname 으로 재시도
            try {
                const res2 = await axios.get(`http://192.168.0.120/member/byNickname/${encodeURIComponent(suspectParam)}`);
                console.log('▶ nickname 조회 성공', res2.status);
                setSuspectId(res2.data.user_id);
                setSuspectNickname(suspectParam);
                console.log("서스펙트 닉네임2", suspectParam);
                console.log("서스펙트 아이디2", res2.data.user_id);
            } catch (err2) {
                console.error('▶ 닉네임 조회도 실패', err2.response?.status);
                alert('해당 사용자가 존재하지 않습니다.');
            }
        })();
    }, [searchParams]);


    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!reporterId || !suspectId || !subject.trim() || !content.trim()) {
            console.log("sdgsdngksndgknsdkgn",reporterId, suspectId);
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
                'http://192.168.0.120/report_write',
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
                                maxLength={66}
                            /><small>{subject.length} / 66자 제한</small>
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
                                maxLength={333}
                            /><small>{content.length} / 333자 제한</small>
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

export default function ReportWrite() {
    return(
        <Suspense fallback={<div>로딩 중...</div>}>
            <FuspReportWrite/>
        </Suspense>
    );
}
