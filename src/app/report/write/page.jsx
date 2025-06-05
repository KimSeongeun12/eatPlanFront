'use client';

import LeftMenu from '@/app/leftMenu';
import ReportWrite from './reportWrite';
import './reportWrite.css';

export default function ReportWritePage() {
    return (
        <div className="page-wrapper">
            {/* 1) 좌측 메뉴 */}
            <LeftMenu className="left-menu" />

            {/* 2) 우측 콘텐츠: 작성 폼 */}
            <div className="report-write-rightmenu">
                <ReportWrite />
            </div>
        </div>
    );
}
