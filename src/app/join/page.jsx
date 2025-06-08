// 'use client'
// import './joinCss.css'
// import React, {useRef, useState} from 'react';
// import ConsentPage from './consentPage';
// import InfoInput from './infoInput';
// import EmailCheckPage from "./emailCheckPage";
// import axios from "axios";
//
// export default function JoinPage() {
//     /* 프로필 사진 업로드 기능*/
//     const [profileImage, setProfileImage] = useState(null);        // 실제 파일
//     const [profilePreview, setProfilePreview] = useState(null);    // 미리보기 URL
//     const [profileFileName, setProfileFileName] = useState("");
//     /**/
//
//     const [confirmPass, setConfirmPass] = useState('');
//     const confirmRef = useRef();
//     const [isPassConfirmed, setIsPassConfirmed] = useState(false);
//
//     const [visible, setVisible] = useState('consentPage');
//
//     const [select, setSelect] = useState(null);
//
//     // 이메일 체크 추가
//     const [emailAuth, setEmailAuth] = useState(false);
//
//     const showSecond = () => {
//         if (!select) {
//             alert("개인정보 수집 및 이용에 동의해주세요.");
//             return;
//         }
//         setVisible('infoInput')
//     }
//
//     const [input, setInput] = useState({
//         user_id: '',
//         pass: '',
//         nickname: '',
//         email: '',
//         bio: '',
//         location: '',
//         tags: [],
//         // new_filename: '',
//         // img_idx: '',
//     });
//
//     // 아이디, 닉네임 중복 확인 여부
//     const [idChk, setIdChk] = useState(false);
//     const [nicknameChk, setNicknameChk] = useState(false);
//
//     // 중복 확인 - 아이디
//     const overlay_id = async () => {
//         const {data} = await axios.get(`http://localhost/overlay/id/${input.user_id}`);
//         console.log(data);
//         if (data.use === true) {
//             alert("사용 가능한 아이디입니다.");
//             setIdChk(true);
//         } else {
//             alert("이미 사용 중인 아이디입니다.");
//             setInput({...input, user_id: ''});
//             setIdChk(false);
//         }
//     }
//
//     // 중복 확인 - 닉네임
//     const overlay_nickname = async () => {
//         const {data} = await axios.get(`http://localhost/overlay/nickname/${input.nickname}`);
//         console.log(data);
//         if (data.use === true) {
//             alert("사용 가능한 닉네임입니다.");
//             setNicknameChk(true);
//         } else {
//             alert("이미 사용 중인 닉네임입니다.");
//             setInput({...input, nickname: ''});
//             setNicknameChk(false);
//         }
//     }
//
//     // 회원 가입 완료
//     const showThird = async () => {
//         if (visible === 'consentPage') {
//             showSecond();
//         } else if (visible === 'infoInput') {
//             console.log("이전 페이지에서 전송한 데이터:", input);
//
//             const confirmPass = confirmRef.current?.value;
//             if (!isPassConfirmed) {
//                 if (input.pass !== confirmPass) {
//                     alert("비밀번호가 일치하지 않습니다.");
//                     confirmRef.current.value = '';
//                     confirmRef.current.focus();
//                     return;
//                 }
//                 setIsPassConfirmed(true);
//             }
//
//             const requiredFields = ['user_id', 'pass', 'nickname'];
//             const allRequiredFilled = requiredFields.every(
//                 (key) => typeof input[key] === 'string' && input[key].trim() !== ''
//             );
//             if (!allRequiredFilled) {
//                 alert("아이디, 비밀번호, 닉네임은 필수 입력 항목입니다.");
//                 return;
//             }
//
//             if (!idChk) {
//                 alert("아이디 중복 체크를 해주세요.");
//                 return;
//             }
//             if (!nicknameChk) {
//                 alert("닉네임 중복 체크를 해주세요.");
//                 return;
//             }
//
//             setVisible('emailCheckPage');
//         } else if (visible === 'emailCheckPage') {
//             if (!input.user_id || input.user_id.trim() === '') {
//                 alert("user_id가 비어 있습니다.");
//                 return;
//             }
//
//             const finalPayload = {
//                 dto: {
//                     user_id: input.user_id,
//                     pass: input.pass,
//                     nickname: input.nickname,
//                     email: input.email,
//                     bio: input.bio,
//                     location: input.location,
//                     // new_filename: profileFileName, // 실제 업로드는 나중에 함
//                     // img_idx: '' // 초기에는 비워둠
//                 },
//                 tags: input.tags.map(tag => ({
//                     idx: tag.value.tag_idx ?? tag.value.area_tag_idx,
//                     isClass: tag.type === 'tag' ? '일반' : '지역',
//                     user_id: input.user_id,
//                 }))
//             };
//
//             if (!emailAuth) {
//                 alert('이메일 인증을 진행해주세요.');
//                 return;
//             }
//
//             try {
//                 const response = await axios.post('http://localhost/join', finalPayload);
//                 console.log("회원 가입 성공:", response.data);
//
//                 // ✅ 가입 성공 후 이미지 업로드
//                 if (profileImage) {
//                     const formData = new FormData();
//                     formData.append("new_filename", profileImage);
//                     formData.append("user_id", finalPayload.user_id);
//
//                     try {
//                         const imgUploadRes = await axios.post('http://localhost/profileUpload', formData, {
//                             headers: { 'Content-Type': 'multipart/form-data' },
//                         });
//
//                         if (imgUploadRes.data.success) {
//                             console.log("이미지 업로드 성공, img_idx:", imgUploadRes.data.img_idx);
//                         } else {
//                             console.warn("이미지 업로드 실패:", imgUploadRes.data.message);
//                         }
//                     } catch (imgErr) {
//                         console.error("이미지 업로드 중 오류:", imgErr);
//                     }
//                 }
//
//                 alert("회원 가입에 성공했습니다.");
//                 // location.href = '/login';
//             } catch (error) {
//                 console.error("회원 가입 오류:", error);
//                 alert("서버 오류가 발생했습니다.");
//             }
//         }
//     }
//
//     return (
//         <>
//             <div className={"joinTap"}>
//                 <span className={"signupSpan"}>SIGN UP</span>
//                 <>
//                     {visible === 'consentPage' && <ConsentPage selected={select} onChange={setSelect}/>}
//                     {visible === 'infoInput' && <InfoInput input={input}
//                                                            setInput={setInput}
//                                                            overlayId={overlay_id}
//                                                            overlayNickname={overlay_nickname}
//                                                            confirmPass={confirmPass}
//                                                            setConfirmPass={setConfirmPass}
//                                                            confirmref={confirmRef}
//                                                            profileImage={profileImage}
//                                                            setProfileImage={setProfileImage}
//                                                            profilePreview={profilePreview}
//                                                            setProfilePreview={setProfilePreview}
//                                                            setProfileFileName={setProfileFileName}
//                     />}
//                     {visible === 'emailCheckPage' && <EmailCheckPage input={input}
//                                                                      setInput={setInput}
//                                                                      confirmPass={confirmPass}
//                                                                      emailAuth={emailAuth}
//                                                                      setEmailAuth={setEmailAuth}
//                                                                      overlayId={overlay_id}
//                                                                      overlayNickname={overlay_nickname}/>}
//                 </>
//                 {visible === 'consentPage'
//                     ? <button onClick={showSecond}
//                               className={"nextButton"}>다음 단계</button> :
//                     <button onClick={showThird} className={"nextButton"}>
//                         {visible === 'emailCheckPage' ? "가입 완료" : "다음 단계"}
//                     </button>
//                 }
//             </div>
//         </>
//     );
// }

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
    });

    const [idChk, setIdChk] = useState(false);
    const [nicknameChk, setNicknameChk] = useState(false);

    const overlay_id = async () => {
        const { data } = await axios.get(`http://localhost/overlay/id/${input.user_id}`);
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
        const { data } = await axios.get(`http://localhost/overlay/nickname/${input.nickname}`);
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
                const response = await axios.post('http://localhost/joinWithImage', formData, {
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
    );
}
