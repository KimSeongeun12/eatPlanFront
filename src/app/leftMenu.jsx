'use client'
import {useRouter, usePathname} from "next/navigation";
import {useEffect, useState} from "react";
import axios from "axios";

export default function leftMenu() {
    const welcomeStyle = {
        boxSizing: "border-box",
        fontSize: '24px',
        color: "white",
        fontWeight: 'bold',
        marginRight: '0px',
    }

    const isActive = (path) => pathname === path;

    const router = useRouter();
    const pathname = usePathname();
    const [userId, setUserId] = useState(null);
    const [admin, setAdmin] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const user_id = sessionStorage.getItem('user_id');
            const admin = sessionStorage.getItem('admin');
            setUserId(user_id);
            setAdmin(admin);
        }
    }, []);

    const isLoggedIn = !!userId;

    const logout = () => {
        sessionStorage.removeItem('user_id');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('admin');
        location.href="/";
    }

    const [userInfo, setUserInfo] = useState({});
    const memberInfo = async (user_id) => {
        const {data} = await axios.post('http://localhost/member_list', {user_id: user_id});
        console.log(data);
        setUserInfo(data.list[0]);
    }

    useEffect(() => {
        if (userId) {
            memberInfo(userId);
        }
    }, [userId]);

    return (
        <>
            <div className={"leftMenu"}>
                <div
                    className="logo-container"
                    onClick={() => router.push('/')}
                    style={{ cursor: 'pointer' }}
                >
                    <img src="/logo.png" alt="EatPlan 로고" className="logo-img" />
                </div>

                <img
                    className="userIcon"
                    src={
                        userInfo?.img_idx
                            ? `http://localhost/imageIdx/${userInfo.img_idx}`
                            : "/userIcon.png"
                    }
                    alt="프로필 사진"
                />

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '40px'}}>
                    {isLoggedIn
                        ? (
                            <>
                                {admin === "true" ? (
                                    <span style={welcomeStyle}>환영합니다, 관리자 님!</span>
                                ) : (
                                    <span style={welcomeStyle}>환영합니다, {userId} 님!</span>
                                )}
                                <span className={"logoutSpan"} onClick={logout}>로그아웃</span>
                            </>
                        )
                        : (
                            <>
                                <div onClick={() => router.push('/login')}
                                     className={`loginMenu ${isActive('/login') ? 'active' : ''}`}>
                                    <img src={"/loginIcon.png"} alt={"로그인 아이콘"}/>
                                    <span>로그인</span>
                                </div>
                            </>
                        )
                    }
                </div>

                <div
                    onClick={() => router.push(admin === "true" ? '/admin_course' : '/list')}
                    className={`courseListMenu ${
                        isActive('/admin_course') ||
                        isActive('/list') ||
                        isActive('/courseSearch') ||
                        isActive('/searchResult') ? 'active' : ''
                    }`}
                >
                    <img src={"/communityIcon.png"} alt={"코스 구경 아이콘"} />
                    <span>{admin === "true" ? "코스 구경 (관리자용)" : "코스 구경"}</span>
                </div>

                <div
                    onClick={() => router.push(admin === "true" ? '/admin' : '/mypage')}
                    className={`mypageMenu ${
                        isActive('/mypage') ||
                        isActive('/mypage_update') ||
                        isActive('/admin') ||
                        isActive('/passwd') ||
                        isActive('/admin') ? 'active' : ''
                    }`}
                >
                    <img src={"/personIcon.png"} alt={"마이페이지 아이콘"} />
                    <span>{admin === "true" ? "관리자 페이지" : "마이페이지"}</span>
                </div>

                <div onClick={() => router.push('/write')}
                     className={`courseWriteMenu ${isActive('/write') ? 'active' : ''}`}>
                    <img src={"/pencil.png"} alt={"코스 등록 아이콘"}/>
                    <span>코스 등록</span>
                </div>
                <div onClick={() => router.push('/message')} className={`noteMenu ${isActive('/message') ? 'active' : ''}`}>
                    <img src={"/letterIcon.png"} alt={"코스 등록 아이콘"}/>
                    <span>쪽지</span>
                </div>
                <div className={"line"}></div>
                <div onClick={() => router.push('/noticeList')}
                     className={`noticeMenu ${isActive('/noticeList') ? 'active' : ''}`}>
                    <img src={"/bellIcon.png"} alt={"공지사항 아이콘"}/>
                    <span>공지사항</span>
                </div>
                <div onClick={() => router.push('/report')}
                     className={`reportMenu ${isActive('/report') ? 'active' : ''}`}>
                    <img src={"/reportIcon.png"} alt={"신고 아이콘"}/>
                    <span>신고</span>
                </div>
            </div>
        </>
    );
}