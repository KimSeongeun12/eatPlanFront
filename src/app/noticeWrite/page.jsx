'use client';

import LeftMenu from "@/app/leftMenu";
import NoticeWrite from "./noticeWrite";

export default function notice() {
    return (
        <>
            <LeftMenu />
            <div className="rightMenu">
                <NoticeWrite />
            </div>
        </>
    );
}