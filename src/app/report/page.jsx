'use client';

import LeftMenu from "@/app/leftMenu";
import ReportList from "./reportList";
import "./reportList.css";

export default function report() {
    return (
        <div className="report-page-wrapper">
            <LeftMenu />
            <ReportList/>
        </div>
    );
}