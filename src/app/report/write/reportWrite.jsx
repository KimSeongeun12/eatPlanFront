'use client'

import {useState, useEffect} from 'react'
import {useRouter, useSearchParams} from 'next/navigation'
import axios from 'axios'
import './reportWrite.css'

export default function ReportWrite() {
    const router = useRouter()

    const [reporterId, setReporterId] = useState('')
    useEffect(() => {
        const id = localStorage.getItem('userId') || ''
        setReporterId(id)
    }, [])

    const searchParams = useSearchParams() ;
    const initialSuspect = searchParams.get('suspect') || '';

    const [classification, setClassification] = useState('course')
    const [suspectId, setSuspectId] = useState(initialSuspect)
    const [suspectNickname, setSuspectNickname] = useState('')
    const [subject, setSubject] = useState('')
    const [content, setContent] = useState('')
    const [files, setFiles] = useState([])
    const [isPublic, setIsPublic] = useState(false)

    useEffect(() =>{
        if(!suspectId) return;
        axios.get(`api/member/${suspectId}`).then((res) => {
            if(res.data.nickname){
                setSuspectNickname(res.data.nickname);
            }else {
                setSuspectNickname('');
            }
        })
    },[suspectId])

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()   // 네이티브 제출 차단

        if (!suspectId || !subject || !content) {
            alert('필수 항목을 모두 입력해주세요.')
            return
        }

        const formData = new FormData()
        formData.append('isClass', classification)
        formData.append('suspect_id', suspectId)
        formData.append('reporter_id', reporterId)
        formData.append('subject', subject)
        formData.append('content', content)
        formData.append('isPublic', isPublic ? '1' : '0')
        files.forEach(f => formData.append('files', f))

        try {
            const res = await axios.post(
                '/report_write',  // baseURL=http://localhost(=80) 로 프록시됨
                formData,
                {headers: {'Content-Type': 'multipart/form-data'}}
            )
            if (res.data.success) {
                router.push('/report')
            } else {
                alert('작성에 실패했습니다.')
            }
        } catch (err) {
            console.error(err)
            alert('서버 에러가 발생했습니다.')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="report-form">
            <table className="report-table">
                <colgroup>
                    <col style={{width: 120}}/>
                    <col/>
                    <col style={{width: 120}}/>
                    <col/>
                </colgroup>
                <tbody>
                {/* 1. 분류 / 작성자 */}
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
                        <input type="text" value={reporterId} readOnly/>
                    </td>
                </tr>

                {/* 2. 신고 대상자 */}
                <tr>
                    <th>신고 대상자</th>
                    <td colSpan={3}>
                        <input
                            type="text"
                            value={suspectNickname ||suspectId}
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
                            onChange={e => setSubject(e.target.value)}
                            placeholder="제목을 입력해주세요."
                            required
                        />
                    </td>
                </tr>

                {/* 4. 내용 */}
                <tr>
                    <th>내용 <span className="required">*</span></th>
                    <td colSpan={3}>
              <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
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
                            /> 공개
                        </label>
                        <label className="radio-spacer">
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

            {/* 7. 등록 버튼 (플로팅) */}
            <div className="submit-area">
                <button type="submit" className="btn-submit">등록</button>
            </div>
        </form>
    )
}