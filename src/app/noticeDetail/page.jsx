'use client';

import LeftMenu from "@/app/leftMenu";
import NoticeDetail from "./noticeDetail";

export default function NoticePage() {
    return (
        <div className="main-container">
            <LeftMenu />

            {/* 오른쪽 여백 + 콘텐츠 영역 전체를 감싸주는 div */}
            <div className="rightMenu">
                <NoticeDetail />
            </div>
        </div>
    );
}
