'use client'

import {useState} from "react";
import {useRouter} from "next/navigation";
import axios from "axios";
import '../mypage/myPageCss.css';

export default function MyPagePasswd() {

    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();

    const checkPassword = async () => {
        if (!password) {
            alert('비밀번호를 입력해주세요.');
            return;
        }
        setLoading(true);


        try {
            //1. 비밀번호 확인 API 요청
            const {data: verify} = await axios.post('http://localhost/member_pass', {password});

            if (!verify.success) {
                alert('비밀번호가 일치하지 않습니다.');
                setLoading(false);
                return;
            }

            //모달 열기
            setShowModal(true);
        } catch (err) {
            console.log(err);
            alert('비밀번호를 확인해주세요!');
            setLoading(false);
        }
    };
    //2. 탈퇴 여부 확인
    const handleDelete = async () => {
        try {
            const {data: deletRes} = await axios.put('/member_secession', {password});

            // 3. 회원탈퇴 요청
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
            setShowModal(false);
        }
    };


    return (
        <div className={"rightMenu"}>
            <h3 className="passwd-title">비밀번호 확인</h3>
            <div className={"Mypage_passwd_div"}>
                <input type={'password'} placeholder={"비밀번호를 입력해주세요."} value={password}
                       onChange={(e) => setPassword(e.target.value)}/>
                <p>회원 탈퇴를 위한 비밀번호 확인 절차 입니다.</p>
                <button onClick={checkPassword} disabled={loading}
                        className={"infoUpdateButton"}>{loading ? '처리중...' : '비밀번호 확인'}</button>
            </div>
            {showModal && (
                <div className = "modalOverlay">
                    <div className ="modalContent">
                        <p className="modalText">정말 회원 탈퇴하시겠습니까?</p>
                        <div className={"modalButtons"}>
                            <button className="cancelBtn" onClick={() => setShowModal(false)}>취소</button>
                            <button className="confirmBtn" onClick={() => setShowModal(handleDelete)}>확인</button>
                        </div>
                    </div>
                </div>
                    )}

        </div>
    )
}