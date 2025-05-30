'use client';

import LeftMenu from '../leftMenu'
import ReportWrite from './reportWrite';

export default function ReportWritePage() {
    return (
        <div className="main-container">
            <LeftMenu/>
            <div className="rightMenu report-write-wrapper">
                <ReportWrite/>
            </div>
        </div>
    );
}