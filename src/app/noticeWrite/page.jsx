'use client';

import React from 'react';
import LeftMenu from '@/app/leftMenu';
import NoticeWrite from './noticeWrite';
import './noticeWrite.css';

export default function notice() {
    return (
        <>
            <LeftMenu />
            <div className="notice-write-right">
                <NoticeWrite />
            </div>
        </>
    );
}