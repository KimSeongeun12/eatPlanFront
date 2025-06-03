'use client';

import LeftMenu from "@/app/leftMenu";
import NoticeUpdate from "./noticeUpdate";

export default function notice() {
    return (
        <>
            <LeftMenu />
            <div className="rightMenu">
                <NoticeUpdate />
            </div>
        </>
    );
}