'use client'
import {useRouter, usePathname} from "next/navigation";
import {useEffect, useState} from "react";

export default function leftMenu() {
    const welcomeStyle = {
        boxSizing: "border-box",
        fontSize: '24px',
        color: "white",
        fontWeight: 'bold',
        marginRight: '0px',
    }

    const router = useRouter();
    const pathname = usePathname();
    const [userId, setUserId] = useState(null);

    const isActive = (path) => pathname === path;

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUserId = sessionStorage.getItem('user_id');

            setUserId(storedUserId);
        }
    }, []);

    const isLoggedIn = !!userId;

    const logout = () => {
        sessionStorage.removeItem('user_id');
        sessionStorage.removeItem('token');
        router.push('/');
    }

    return (
        <>
            <div className={"leftMenu"}>
                <img className={"userIcon"} src={"유저 아이콘.png"} alt={"프로필 사진"}/>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '285px' }}>
                    {isLoggedIn
                        ? <><span style={welcomeStyle}>환영합니다, {userId} 님!</span><span className={"logoutSpan"} onClick={logout}>로그아웃</span></>
                        : <>
                            <div onClick={() => router.push('./login')}
                                 className={`loginMenu ${isActive('/login') ? 'active' : ''}`}>
                                <img src={"로그인 아이콘.png"} alt={"로그인 아이콘"}/>
                                <span>로그인</span>
                            </div>
                        </>}
                </div>
                <div onClick={() => router.push('./admin_course')}
                     className={`courseListMenu ${isActive('/admin_course') ? 'active' : ''}`}>
                    <img src={"커뮤니티 아이콘.png"} alt={"코스 구경 아이콘"}/>
                    <span>코스 구경</span>
                </div>
                <div onClick={() => router.push('./mypage')}
                     className={`mypageMenu ${isActive('/mypage') || isActive('/myInfo_update') || isActive('/passwd') ? 'active' : ''}`}>
                    <img src={"사람 아이콘.png"} alt={"마이페이지 아이콘"}/>
                    <span>마이페이지</span>
                </div>
                <div onClick={() => router.push('./write')}
                     className={`courseWriteMenu ${isActive('/write') ? 'active' : ''}`}>
                    <img src={"연필 아이콘.png"} alt={"코스 등록 아이콘"}/>
                    <span>코스 등록</span>
                </div>
                <div onClick={() => router.push('./message')} className={`noteMenu ${isActive('/message') ? 'active' : ''}`}>
                    <img src={"편지 아이콘.png"} alt={"코스 등록 아이콘"}/>
                    <span>쪽지</span>
                </div>
                <div className={"line"}></div>
                <div onClick={() => router.push('./notice')}
                     className={`noticeMenu ${isActive('/notice') ? 'active' : ''}`}>
                    <img src={"종 아이콘.png"} alt={"공지사항 아이콘"}/>
                    <span>공지사항</span>
                </div>
                <div onClick={() => router.push('./report')}
                     className={`reportMenu ${isActive('/report') ? 'active' : ''}`}>
                    <img src={"신고 아이콘.png"} alt={"신고 아이콘"}/>
                    <span>신고</span>
                </div>
            </div>
        </>
    );
}