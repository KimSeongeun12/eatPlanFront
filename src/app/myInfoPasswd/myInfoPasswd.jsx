// src/app/mypage/MyInfoPasswd.jsx
'use client';

import { useRouter } from 'next/navigation';
import axios from 'axios';
import {useEffect, useState} from 'react';
import './myInfoPasswd.css';

export default function MyInfoPasswd() {
    const [password, setPassword] = useState('');
    const router = useRouter();

    // 로그인 체크
       useEffect(() => {
             const userId = sessionStorage.getItem('user_id');
             if (!userId) {
                   router.replace('/login');
                 }
           }, [router]);


    const checkPassword = async () => {
        if (!password) {
            alert('비밀번호를 입력해주세요.');
            return;
        }

        const user_id = sessionStorage.getItem('user_id');
        if (!user_id) {
            alert('로그인이 필요한 서비스입니다.');
            return;
        }

        try {
            const { data } = await axios.post('http://localhost/member_pass', {
                user_id,
                pass: password,
            });
            console.log(data);

            if (!data.success) {
                alert('비밀번호가 일치하지 않습니다.');
                return;
            }

            console.log('비밀번호 일치 → 페이지 이동 중');
            router.push('/mypage_update');
        } catch (error) {
            console.log(error);
            alert('오류가 발생했습니다.');
        }
    };

    return (
        <div className="myInfoPasswd-rightMenu">
            {/* 흰색 카드 박스 */}
            <div className="myInfoPasswd-card">
                <h3 className="myInfoPasswd-title">비밀번호 확인</h3>
                <div className="myInfoPasswd-formWrapper">
                    <input
                        type="password"
                        placeholder="비밀번호를 입력해주세요"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <p>회원 정보 수정을 위한 비밀번호 확인 절차입니다.</p>
                    <button
                        onClick={checkPassword}
                        className="myInfoPasswd-button"
                    >
                        비밀번호 확인
                    </button>
                </div>
            </div>
        </div>
    );
}
