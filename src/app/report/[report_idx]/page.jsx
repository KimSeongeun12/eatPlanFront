'use client';

import LeftMenu from '@/app/leftMenu';
import ReportDetail from './reportDetail';
import './reportDetail.css';


export default function ReportDetailPage() {
    return (
        <div className="main-container">
            <LeftMenu />
            <div className="right-menu">
            <ReportDetail />
            </div>
        </div>
    );
}