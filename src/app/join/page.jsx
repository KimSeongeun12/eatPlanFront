'use client'
import './joinCss.css';
import React, { useRef, useState } from 'react';
import ConsentPage from './consentPage';
import InfoInput from './infoInput';
import EmailCheckPage from "./emailCheckPage";
import axios from "axios";

export default function JoinPage() {
    const [profileImage, setProfileImage] = useState(null);
    const [profilePreview, setProfilePreview] = useState(null);
    const [profileFileName, setProfileFileName] = useState("");

    const [confirmPass, setConfirmPass] = useState('');
    const confirmRef = useRef();
    const [isPassConfirmed, setIsPassConfirmed] = useState(false);
    const [visible, setVisible] = useState('consentPage');
    const [select, setSelect] = useState(null);
    const [emailAuth, setEmailAuth] = useState(false);

    const [input, setInput] = useState({
        user_id: '',
        pass: '',
        nickname: '',
        email: '',
        bio: '',
        location: '',
        tags: [],
        new_filename: '',
    });

    const [idChk, setIdChk] = useState(false);
    const [nicknameChk, setNicknameChk] = useState(false);

    // input onChange
    const handleChange = (e) => {
        const {name, value} = e.target;
        setInput((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (name === 'user_id') {
            setIdChk(false);
        }
        if (name === 'nickname') {
            setNicknameChk(false);
        }
    };

    const overlay_id = async () => {
        const { data } = await axios.get(`http://192.168.0.120/overlay/id/${input.user_id}`);
        if (data.use) {
            alert("사용 가능한 아이디입니다.");
            setIdChk(true);
        } else {
            alert("이미 사용 중인 아이디입니다.");
            setInput({ ...input, user_id: '' });
            setIdChk(false);
        }
    };

    const overlay_nickname = async () => {
        const { data } = await axios.get(`http://192.168.0.120/overlay/nickname/${input.nickname}`);
        if (data.use) {
            alert("사용 가능한 닉네임입니다.");
            setNicknameChk(true);
        } else {
            alert("이미 사용 중인 닉네임입니다.");
            setInput({ ...input, nickname: '' });
            setNicknameChk(false);
        }
    };

    const showSecond = () => {
        if (!select) {
            alert("개인정보 수집 및 이용에 동의해주세요.");
            return;
        }
        setVisible('infoInput');
    };

    const showThird = async () => {
        if (visible === 'consentPage') {
            showSecond();
        } else if (visible === 'infoInput') {

            const confirmPassVal = confirmRef.current?.value;
            if (!isPassConfirmed) {
                if (input.pass !== confirmPassVal) {
                    alert("비밀번호가 일치하지 않습니다.");
                    confirmRef.current.value = '';
                    confirmRef.current.focus();
                    return;
                }
                setIsPassConfirmed(true);
            }

            const requiredFields = ['user_id', 'pass', 'nickname'];
            const allRequiredFilled = requiredFields.every(key =>
                typeof input[key] === 'string' && input[key].trim() !== ''
            );
            if (!allRequiredFilled) {
                alert("아이디, 비밀번호, 닉네임은 필수 입력 항목입니다.");
                return;
            }

            if (!input.tags || input.tags.length === 0) {
                alert("선호 카테고리는 한 개 이상 선택되어야 합니다.");
                return;
            }

            if (!idChk || !nicknameChk) {
                alert("아이디와 닉네임 중복 체크를 해주세요.");
                return;
            }
            setVisible('emailCheckPage');

        } else if (visible === 'emailCheckPage') {
            if (!emailAuth) {
                alert('이메일 인증을 진행해주세요.');
                return;
            }

            // ✅ joinWithImage 전송
            const dto = {
                user_id: input.user_id,
                pass: input.pass,
                nickname: input.nickname,
                email: input.email,
                bio: input.bio,
                location: input.location,
            };

            const tags = input.tags.map(tag => ({
                idx: tag.value.tag_idx ?? tag.value.area_tag_idx,
                isClass: tag.type === 'tag' ? '일반' : '지역',
                user_id: input.user_id,
            }));

            const formData = new FormData();
            formData.append('dto', new Blob([JSON.stringify(dto)], { type: 'application/json' }));
            formData.append('tags', new Blob([JSON.stringify(tags)], { type: 'application/json' }));
            if (profileImage) {
                formData.append('files', profileImage);
            }

            try {
                const response = await axios.post('http://192.168.0.120/joinWithImage', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                if (response.data.success) {
                    alert("회원 가입에 성공했습니다.");
                    location.href = '/login';
                } else {
                    alert("회원 가입 실패: " + (response.data.message || ''));
                }
            } catch (error) {
                console.error("회원 가입 오류:", error);
                alert("서버 오류가 발생했습니다.");
            }
        }
    };

    return (
        <div className={"bigBody"}>
        <div className="joinTap">
            <span className="signupSpan">SIGN UP</span>
            {visible === 'consentPage' && <ConsentPage selected={select} onChange={setSelect} />}
            {visible === 'infoInput' && (
                <InfoInput
                    input={input}
                    setInput={setInput}
                    overlayId={overlay_id}
                    overlayNickname={overlay_nickname}
                    confirmPass={confirmPass}
                    setConfirmPass={setConfirmPass}
                    confirmref={confirmRef}
                    profileImage={profileImage}
                    setProfileImage={setProfileImage}
                    profilePreview={profilePreview}
                    setProfilePreview={setProfilePreview}
                    setProfileFileName={setProfileFileName}
                    handleChange={handleChange}
                />
            )}
            {visible === 'emailCheckPage' && (
                <EmailCheckPage
                    input={input}
                    setInput={setInput}
                    confirmPass={confirmPass}
                    emailAuth={emailAuth}
                    setEmailAuth={setEmailAuth}
                    overlayId={overlay_id}
                    overlayNickname={overlay_nickname}
                />
            )}
            <button onClick={showThird} className="nextButton">
                {visible === 'emailCheckPage' ? "가입 완료" : "다음 단계"}
            </button>
        </div>
        </div>
    );
}
