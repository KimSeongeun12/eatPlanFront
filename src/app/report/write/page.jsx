'use client';

import LeftMenu from '@/app/leftMenu';
import ReportWrite from './reportWrite';
import './reportWrite.css';

export default function ReportWritePage() {
    return (
        <div className="page-wrapper">
            {/* 1) 왼쪽 사이드바 */}
            <LeftMenu />
            {/* 2) 오른쪽 컨텐츠 (신고 폼) */}
            <div className="rightMenu">
                <ReportWrite />
            </div>
        </div>
    );
}