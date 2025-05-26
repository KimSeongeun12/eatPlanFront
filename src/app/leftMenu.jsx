'use client'
import {useRouter, usePathname} from "next/navigation";

export default function leftMenu() {
    const router = useRouter();
    const pathname = usePathname();

    const isActive = (path) => pathname === path;

    return (
        <>
            <div className={"leftMenu"}>
                <img className={"userIcon"} src={"유저 아이콘.png"} alt={"프로필 사진"} />
                <div onClick={()=>router.push('./login')} className={`loginMenu ${isActive('/login') ? 'active' : ''}`}>
                    <img src={"로그인 아이콘.png"} alt={"로그인 아이콘"} />
                    <span>로그인</span>
                </div>
                <div onClick={()=>router.push('./admin_course')} className={`courseListMenu ${isActive('/admin_course') ? 'active' : ''}`}>
                    <img src={"커뮤니티 아이콘.png"} alt={"코스 구경 아이콘"} />
                    <span>코스 구경</span>
                </div>
                <div onClick={()=>router.push('./mypage')} className={`mypageMenu ${isActive('/mypage') ? 'active' : ''}`}>
                    <img src={"사람 아이콘.png"} alt={"마이페이지 아이콘"} />
                    <span>마이페이지</span>
                </div>
                <div onClick={()=>router.push('./write')} className={`courseWriteMenu ${isActive('/write') ? 'active' : ''}`}>
                    <img src={"연필 아이콘.png"} alt={"코스 등록 아이콘"} />
                    <span>코스 등록</span>
                </div>
                <div onClick={()=>router.push('./note')} className={`noteMenu ${isActive('/note') ? 'active' : ''}`}>
                    <img src={"편지 아이콘.png"} alt={"코스 등록 아이콘"} />
                    <span>쪽지</span>
                </div>
                <div className={"line"}></div>
                <div onClick={()=>router.push('./notice')} className={`noticeMenu ${isActive('/notice') ? 'active' : ''}`}>
                    <img src={"종 아이콘.png"} alt={"공지사항 아이콘"} />
                    <span>공지사항</span>
                </div>
                <div onClick={()=>router.push('./report')} className={`reportMenu ${isActive('/report') ? 'active' : ''}`}>
                    <img src={"신고 아이콘.png"} alt={"신고 아이콘"} />
                    <span>신고</span>
                </div>
            </div>
        </>
    );
}