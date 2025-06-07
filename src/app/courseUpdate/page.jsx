'use client'

import LeftMenu from "@/app/leftMenu";
import CourseUpdate from "@/app/courseUpdate/courseUpdate";
import "../courseDetail/[slug]/courseDetail.css";
import {useEffect, useRef, useState} from "react";

export default function CourseUpdatePage() {

    // user_id 받아옴
    const user_id = useRef('');
    const [isAuthenticated, setIsAuthenticated] = useState(false); // 로그인 여부
    const [checkingAuth, setCheckingAuth] = useState(true); // 인증 확인 중 여부
    useEffect(() => {
        if (typeof window !== 'undefined') {
            user_id.current = sessionStorage.getItem('user_id');
            if (!user_id.current) {
                alert('로그인이 필요한 서비스입니다.');
                location.href = '/login';
            } else {
                setIsAuthenticated(true);
            }
            setCheckingAuth(false); // 인증 체크 완료
        }
    }, []);

    if (checkingAuth) return null;
    if (!isAuthenticated) return null;

    return (
        <>
            <LeftMenu/>
            <div className={"rightMenu"}>
                <CourseUpdate/>
            </div>
        </>
    );
}