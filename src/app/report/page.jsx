'use client';

import LeftMenu from '@/app/leftMenu';
import ReportList from './reportList';
import './reportList.css';

export default function ReportListPage() {
    return (
        <div className="main-container">
            <LeftMenu/>
            <div className="rightMenu">
                <ReportList/>
            </div>
        </div>
    );
}