// page.jsx
'use client';

import LeftMenu from '@/app/leftMenu';
import ReportList from './reportList';
import './reportList.css';

export default function Report() {
    return (
        <div className="main-container">
            <LeftMenu/>

            <div className="rightMenu">
                {/* ── 제목: 스크린샷과 동일하게 “신고 열람” ── */}
                <h2>신고 열람</h2>

                {/* ── ReportList 컴포넌트: 테이블 + 페이징만 렌더 ── */}
                <ReportList/>
            </div>
        </div>
    );
}
