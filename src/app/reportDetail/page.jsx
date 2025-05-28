'use client';

import LeftMenu from "@/app/leftMenu";
import './reportDetail.css';
import ReportDetail from "@/app/reportDetail/reportDetail";

export default function report() {
    return (
        <div className="report-page-wrapper">
            <LeftMenu />
            <ReportDetail/>
        </div>
    );
}