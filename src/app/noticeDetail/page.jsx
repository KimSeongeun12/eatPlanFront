'use client';

import LeftMenu from "@/app/leftMenu";
import NoticeDetail from "./noticeDetail";

export default function notice() {
    return (
        <>
            <LeftMenu />
            <div className="rightMenu">
                <NoticeDetail />
            </div>
        </>
    );
}