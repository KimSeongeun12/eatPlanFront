'use client';

import React from 'react';
import LeftMenu from '@/app/leftMenu';
import NoticeWrite from './noticeWrite';
import './noticeWrite.css';
import { Box } from '@mui/material';

export default function NoticeWritePage() {
    return (
            <LeftMenu />
            {/* 우측 메인 콘텐츠: flex로 가운데 정렬 및 너비 제한 */}
            <div className="notice-write-right">
                <Box
                    sx={{
                        maxWidth: 700,
                        width: '100%',
                        margin: '0 auto',
                    }}>
                    <NoticeWrite />
                </Box>
            </div>
    );
}
