'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Box, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio,
    Button, Typography,} from '@mui/material';
import './noticeWrite.css';

export default function NoticeWrite() {
    const router = useRouter();

    // ─── 폼 상태 ───
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [highlight, setHighlight] = useState('false');
    // (string 'true' / 'false'로 관리해서 RadioGroup으로 제어)

    // ─── 로그인된 사용자(user_id) 조회 ───
    const [currentUser, setCurrentUser] = useState(null);
    useEffect(() => {
        const storedUser = sessionStorage.getItem('user_id');
        setCurrentUser(storedUser);

        // DB에 관리자 계정이 user_id='admin'이라고 가정
        if (storedUser !== 'admin') {
            router.push('/noticeList');
        }
    }, [router]);

    // ─── 제목, 내용, 라디오 change 핸들러 ───
    const handleSubjectChange = (e) => setSubject(e.target.value);
    const handleContentChange = (e) => setContent(e.target.value);
    const handleHighlightChange = (e) => setHighlight(e.target.value);

    // ─── 폼 제출 ───
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!subject.trim() || !content.trim()) {
            alert('제목과 내용을 모두 입력해주세요.');
            return;
        }
        try {
            const payload = {
                user_id: currentUser,
                subject: subject.trim(),
                content: content.trim(),
                highlight: highlight === 'true', // boolean 타입으로 변환
            };
            const res = await axios.post('http://localhost/notice_write', payload);
            if (res.data.success) {
                alert('공지사항이 등록되었습니다.');
                router.push('/noticeList');
            } else {
                alert('공지사항 등록에 실패했습니다.');
            }
        } catch (err) {
            console.error('[NoticeWrite] error:', err);
            alert('오류가 발생했습니다. 콘솔을 확인해주세요.');
        }
    };

    // ─── 취소 ───
    const handleCancel = () => {
        router.push('/noticeList');
    };

    return (
        <Box className="notice-write-container">
            {/* 타이틀 */}
            <Typography variant="h4" component="h2" className="notice-write-heading">
                공지사항 작성
            </Typography>

            <Box
                component="form"
                onSubmit={handleSubmit}
                className="notice-write-form"
            >
                {/* ── 제목 입력 ── */}
                <FormControl fullWidth margin="normal">
                    <FormLabel required className="form-label">
                        제목
                    </FormLabel>
                    <TextField
                        variant="outlined"
                        fullWidth
                        size="small"
                        value={subject}
                        onChange={handleSubjectChange}
                        placeholder="제목을 입력하세요"
                        inputProps={{ maxLength: 100 }}
                        required
                    />
                </FormControl>

                {/* ── 내용 입력(멀티라인) ── */}
                <FormControl fullWidth margin="normal">
                    <FormLabel required className="form-label">
                        내용
                    </FormLabel>
                    <TextField
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={12}
                        value={content}
                        onChange={handleContentChange}
                        placeholder="내용을 입력하세요"
                        required
                    />
                </FormControl>

                {/* ── 중요 공지 설정 (라디오) ── */}
                <FormControl component="fieldset" margin="normal">
                    <FormLabel component="legend" className="form-label">
                        중요 공지 설정
                    </FormLabel>
                    <RadioGroup
                        row
                        name="highlight"
                        value={highlight}
                        onChange={handleHighlightChange}
                    >
                        <FormControlLabel
                            value="true"
                            control={<Radio size="small" />}
                            label="설정"
                        />
                        <FormControlLabel
                            value="false"
                            control={<Radio size="small" />}
                            label="비설정"
                        />
                    </RadioGroup>
                </FormControl>

                {/* ── 하단 버튼 ── */}
                <Box className="form-button-group">
                    <Button
                        type="submit"
                        variant="contained"
                        color="error"
                        className="btn-submit"
                    >
                        등록
                    </Button>
                    <Button
                        type="button"
                        variant="outlined"
                        color="inherit"
                        className="btn-cancel"
                        onClick={handleCancel}
                    >
                        취소
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
