'use client';

import LeftMenu from '@/app/leftMenu';
import ReportList from './reportList';
import './reportList.css';

export default function ReportListPage() {
    return (
        <>
            <LeftMenu/>
            <div className="rightMenu">
                <ReportList/>
            </div>
        </>
    );
}