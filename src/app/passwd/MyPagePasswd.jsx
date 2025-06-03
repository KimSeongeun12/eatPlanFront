'use client';

import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useState } from 'react';

import './MyPagePasswd.css';

export default function MyInfoPasswd() {
    const [password, setPassword] = useState('');
    const router = useRouter();

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
            console.log('비밀번호 일치 → 회원 정보 수정 페이지로 이동');
            router.push('/mypage_update');
        } catch (error) {
            console.log(error);
            alert('오류가 발생했습니다.');
        }
    };

    return (
            <div className="passwd-card">
                <h3 className="passwd-title">비밀번호 확인</h3>
                <div className="Mypage_passwd_div">
                    <input
                        type="password"
                        placeholder="비밀번호를 입력해주세요"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {/* 안내 문구를 "회원 정보 수정"용으로 변경 */}
                    <p>회원 정보 수정을 위한 비밀번호 확인 절차입니다.</p>
                    <button onClick={checkPassword} className="infoUpdateButton">
                        비밀번호 확인
                    </button>
                </div>
            </div>
    );
}
