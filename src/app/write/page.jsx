'use client';
import {useEffect, useRef, useState} from 'react';
import StepModal from './write_modal/page';
import LeftMenu from "@/app/leftMenu";
import '../mainCss.css'
import CourseWrite from "@/app/write/courseWrite";

export default function WritePage() {
    const [showModal, setShowModal] = useState(true);
    const [formData, setFormData] = useState(null);  // 모달 입력값 저장

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

    const handleComplete = (data) => {
        setFormData(data);       // 저장
        setShowModal(false);     // 모달 닫기
    };

    if (checkingAuth) return null;
    if (!isAuthenticated) return null;

    return (
        <>
            {showModal && (
                <StepModal
                    onClose={() => setShowModal(false)}
                    onComplete={handleComplete}
                />
            )}
            <LeftMenu />
            <CourseWrite data={formData} />
        </>
    );
}
