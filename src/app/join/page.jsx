'use client'
import './joinCss.css'
import React, {useRef, useState} from 'react';
import ConsentPage from './consentPage';
import InfoInput from './infoInput';
import EmailCheckPage from "./emailCheckPage";
import axios from "axios";

export default function JoinPage() {
    const [confirmPass, setConfirmPass] = useState('');
    const confirmRef = useRef();
    const [isPassConfirmed, setIsPassConfirmed] = useState(false);

    const [visible, setVisible] = useState('consentPage');

    const [select, setSelect] = useState(null);

    const showSecond = () => {
        if (!select) {
            alert("개인정보 수집 및 이용에 동의해주세요.");
            return;
        }
        setVisible('infoInput')
    }

    const [input, setInput] = useState({
        user_id: '',
        pass: '',
        nickname: '',
        email: '',
        bio: '',
        location: '',
        // 태그
        // 프로필 사진
    });

    // 아이디, 닉네임 중복 확인 여부
    const [idChk, setIdChk] = useState(false);
    const [nicknameChk, setNicknameChk] = useState(false);

    // 중복 확인 - 아이디
    const overlay_id = async () => {
        const {data} = await axios.get(`http://localhost/overlay/id/${input.user_id}`);
        console.log(data);
        if (data.use === true) {
            alert("사용 가능한 아이디입니다.");
            setIdChk(true);
        } else {
            alert("이미 사용 중인 아이디입니다.");
            setInput({...input, user_id: ''});
            setIdChk(false);
        }
    }

    // 중복 확인 - 닉네임
    const overlay_nickname = async () => {
        const {data} = await axios.get(`http://localhost/overlay/nickname/${input.nickname}`);
        console.log(data);
        if (data.use === true) {
            alert("사용 가능한 닉네임입니다.");
            setNicknameChk(true);
        } else {
            alert("이미 사용 중인 닉네임입니다.");
            setInput({...input, nickname: ''});
            setNicknameChk(false);
        }
    }

    const showThird = () => {
        console.log(input);

        // 비밀번호 일치/불일치 체크
        const confirmPass = confirmRef.current?.value;
        if (!isPassConfirmed) { // 아직 확인이 안 됐으면 검사
            if (input.pass !== confirmPass) {
                alert("비밀번호가 일치하지 않습니다.");
                if (confirmRef.current) {
                    confirmRef.current.value = '';
                    confirmRef.current.focus();
                }
                return;
            }
            setIsPassConfirmed(true); // 일치하면 확인 완료
        }

        // 필수 입력 항목 검사
        const requiredFields = ['user_id', 'pass', 'nickname'];
        const allRequiredFilled = requiredFields.every(
            (key) => typeof input[key] === 'string' && input[key].trim() !== ''
        );
        if (!allRequiredFilled) {
            alert("아이디, 비밀번호, 닉네임은 필수 입력 항목입니다.");
            console.log(input);
            return;
        }

        // 중복 체크 if
        if (!idChk) {
            alert("아이디 중복 체크를 해주세요.");
            return;
        }
        if (!nicknameChk) {
            alert("닉네임 중복 체크를 해주세요.");
            return;
        }

        // 다음 페이지로 이동
        setVisible('emailCheckPage');
    }

    return (
        <>
            <div className={"joinTap"}>
                <span className={"signupSpan"}>SIGN UP</span>
                <>
                    {visible === 'consentPage' && <ConsentPage selected={select} onChange={setSelect}/>}
                    {visible === 'infoInput' && <InfoInput input={input}
                                                           setInput={setInput}
                                                           overlayId={overlay_id}
                                                           overlayNickname={overlay_nickname}
                                                           confirmPass={confirmPass}
                                                           setConfirmPass={setConfirmPass}
                                                           confirmref={confirmRef}/>}
                    {visible === 'emailCheckPage' && <EmailCheckPage input={input}
                                                                     setInput={setInput}
                                                                     confirmPass={confirmPass}
                                                                     setConfirmPass={setConfirmPass}
                                                                     overlayId={overlay_id}
                                                                     overlayNickname={overlay_nickname}/>}
                </>
                {visible === 'consentPage'
                    ? <button onClick={showSecond}
                              className={"nextButton"}>다음 단계</button> :
                    <button onClick={showThird}
                            className={"nextButton"}>{visible === 'emailCheckPage' ? "가입 완료" : "다음 단계"}</button>}
            </div>
        </>
    );
}