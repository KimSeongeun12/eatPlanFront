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
            if (!data.success) {
                alert('비밀번호가 일치하지 않습니다.');
                return;
            }
            router.push('/mypage_update');
        } catch (error) {
            console.log(error);
            alert('오류가 발생했습니다.');
        }
    };

    return (
        <div className="passwd-rightMenu">
            <div className="passwd-passwdCard">
                <h3 className="passwd-title">비밀번호 확인</h3>
                <div className="Mypage_passwd_div">
                    <input
                        type="password"
                        placeholder="비밀번호를 입력해주세요"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <p>회원 탈퇴를 위한 비밀번호 확인 절차입니다.</p>
                    <button
                        onClick={checkPassword}
                        className="passwd-infoUpdateButton"
                    >
                        비밀번호 확인
                    </button>
                </div>
            </div>
        </div>
    );
}
