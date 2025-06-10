'use client';

import { useRouter } from 'next/navigation';
import axios from 'axios';
import {useEffect, useState} from 'react';

import './MyPagePasswd.css';

export default function MypagePasswd() {
    const [password, setPassword] = useState('');
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();

      // 로그인 체크 (없으면 /login 으로)
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
            if (!data.success) {
                alert('비밀번호가 일치하지 않습니다.');
                return;
            }
            // 비밀번호 확인 성공 시 모달 열기
            setShowModal(true);
        } catch (error) {
            console.error(error);
            alert('오류가 발생했습니다.');
        }
    };

    const confirmDelete = async () => {
        try {
            const user_id = sessionStorage.getItem('user_id');
            await axios.put(
                'http://localhost/member_secession',
                { user_id },
                { headers: { 'Content-Type': 'application/json' } }
            );
            sessionStorage.clear();
            router.push('/login');
        } catch (err) {
            console.error(err);
            alert('회원 탈퇴 중 오류가 발생했습니다.');
        }
    };

    const cancelDelete = () => {
        setShowModal(false);
    };

    return (
        <div className="passwd-rightMenu">
            <div className="passwd-passwdCard">
                <h3 className="passwd-title">회원 탈퇴</h3>
                <div className="Mypage_passwd_div">
                    <input
                        type="password"
                        placeholder="비밀번호를 입력해주세요"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <p>회원 탈퇴를 위한 비밀번호 확인 절차입니다.</p>
                    <button onClick={checkPassword} className="passwd-infoUpdateButton">
                        비밀번호 확인
                    </button>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <p>정말로 회원 탈퇴 하시겠습니까?</p>
                        <button onClick={confirmDelete} className="modal-confirm">
                            확인
                        </button>
                        <button onClick={cancelDelete} className="modal-cancel">
                            취소
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
