'use client';

import LeftMenu from '@/app/leftMenu';
import ReportList from './reportList';
import './reportList.css';

export default function Report() {
    return (
        <div className="main-container">
            <LeftMenu />
            <div className="rightMenu">
                <ReportList />
            </div>
        </div>
    );
}