'use client'

import {useRouter} from "next/navigation";
import axios from "axios";
import {useState} from "react";

import '../mainCss.css'
import '../mypage/myPageCss.css';

export default function MyInfoPasswd() {

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
            const {data : verify} = await axios.post('http://localhost/member_pass',{password});

            if(!verify.success) {
                alert('비밀번호가 일치하지 않습니다.');
                return;
            }
                //비밀번호가 맞으면 회원정보 수정 페이지로 이동
                router.push('/myInfo_update');
            }catch (err){
                console.log(err);
                alert('오류가 발생했습니다.');
            }finally{
                setLoading(false);
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
                    disabled={loading}
                    className="infoUpdateButton"
                >
                    {loading ? '처리중...' : '비밀번호 확인'}
                </button>
            </div>
        </div>
    );
}