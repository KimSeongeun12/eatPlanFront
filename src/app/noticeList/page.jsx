'use client';

import LeftMenu from "@/app/leftMenu";
import NoticeList from "./noticeList";

export default function notice() {
    return (
        <>
            <LeftMenu />
            <div className="rightMenu">
            <NoticeList />
            </div>
        </>
    );
}