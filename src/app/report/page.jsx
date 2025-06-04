// page.jsx
'use client';

import LeftMenu from '@/app/leftMenu';
import ReportList from './reportList';

export default function Report() {
    return (
        <div className="report-page-wrapper">
            <LeftMenu/>
                <ReportList/>
        </div>
    );
}
