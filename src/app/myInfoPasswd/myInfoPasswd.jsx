'use client'

import {useRouter} from "next/navigation";
import axios from "axios";
import {useState} from "react";

import '../mainCss.css'
import '../mypage/myPageCss.css';

export default function MyInfoPasswd() {

    const [password, setPassword] = useState('');
    // const [loading, setLoading] = useState(false);
    const router = useRouter();

    const checkPassword = async () => {
        if (!password) {
            alert('비밀번호를 입력해주세요.');
            return;
        }

        const user_id = sessionStorage.getItem("user_id");
        if (!user_id) {
            alert("로그인이 필요한 서비스입니다.");
            return;
        }
        // setLoading(true);

        try {
            const {data} = await axios.post('http://localhost/member_pass', {
                user_id,
                pass: password,
            });
            console.log(data);

            if (!data.success) {
                alert('비밀번호가 일치하지 않습니다.');
                // setLoading(false);
                return;
            }
            console.log("비밀번호 일치 -> 페이지 이동 중");
            router.push('/mypage_update');
            // router.push('/login');

        } catch (error) {
            console.log(error);
            alert('오류가 발생했습니다.');
            // setLoading(false);
        }
    };

    return (
        <div className="rightMenu">
            <h3 className="passwd-title">비밀번호 확인</h3>
            <div className="Mypage_passwd_div">
                <input
                    type="password" placeholder="비밀번호를 입력해주세요"
                    value={password} onChange={(e) => setPassword(e.target.value)}/>
                <p>회원 정보 수정을 위한 비밀번호 확인 절차입니다.</p>
                <button
                    onClick={checkPassword}
                    // disabled={loading}
                    className="infoUpdateButton"
                >
                    비밀번호 확인
                    {/*{loading ? '처리중...' : '비밀번호 확인'}*/}
                </button>
            </div>
        </div>
    );
}