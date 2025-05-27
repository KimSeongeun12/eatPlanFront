'use client'

import {useState} from "react";
import {useRouter} from "next/navigation";
import axios from "axios";
import './myPageCss.css';

export default function MyPagePasswd() {

    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const checkPassword = async () => {
        if (!password) {
            alert('비밀번호를 입력해주세요.');
            return;
        }
        setLoading(true);


        try {
            //1. 비밀번호 확인 API 요청
            const {data: verify} = await axios.post('/member_pass', {password});

            if (!verify.success) {
                alert('비밀번호가 일치하지 않습니다.');
                setLoading(false);
                return;
            }

            //2. 탈퇴 여부 확인
            const confirmDelete = window.confirm('정말 회원 탈퇴하시겠습니까?');
            if (!confirmDelete) {
                setLoading(false);
                return;
            }
            // 3. 회원탈퇴 요청
            const {data: deletRes} = await axios.put('/member_secession', {password});

            if (!deletRes.success) {
                alert('회원 탈퇴 처리 중 오류가 발생했습니다.');
                setLoading(false);
                return;
            }

            // 4.로그아웃 요청
            await axios.post('/logout');

            alert('회원 탈퇴가 완료되었습니다.');
            router.push('/');
        } catch (err) {
            console.log(err)
            alert('오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="MyPagePasswd">
            <span className="passwd-title">비밀번호 확인</span> {/* 박스 위 텍스트 */}
            <div className="Mypage_passwd_div">
                <input
                    type="password"
                    placeholder="비밀번호를 입력해주세요."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <p>회원 탈퇴를 위한 비밀번호 확인 절차 입니다.</p>
                <button
                    onClick={checkPassword}
                    disabled={loading}
                    className="infoUpdateButton"
                >
                    {loading ? '처리중...' : '비밀번호 확인'}
                </button>
            </div>
        </div>
    )
}