'use client';
import LeftMenu from '@/app/leftMenu';
import ReportDetail from './reportDetail';
import './reportDetail.css';

export default function ReportDetailPage() {
    return (
        <div className="page-wrapper">
            <LeftMenu/>
            <div className="report-detail-rightmenu">
                <ReportDetail/>
            </div>
        </div>
    );
}