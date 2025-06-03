'use client'
import './myInfo_updateCss.css'
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import ChangePW from "@/app/mypage_update/changePW";

export default function Update() {
    const user_id = useRef('');
    const [ori_nickname, setOri_nickname] = useState('');
    const [ori_email, setOri_email] = useState('');

    const [nicknameChk, setNicknameChk] = useState(false);
    const [emailChk, setEmailChk] = useState(false);

    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const storedId = sessionStorage.getItem('user_id');
        if (storedId) {
            user_id.current = storedId;
            getInfo();
        } else {
            console.log('sessionStorage에 user_id 없음');
        }
    }, []);

    const [info, setInfo] = useState({
        nickname: '',
        email: '',
        bio: '',
        location: '',
    })

    const getInfo = async () => {
        const {data} = await axios.post('http://localhost/member_list', {
            user_id: user_id.current,
        });
        console.log(data.list[0]);
        setInfo(data.list[0]);
        setOri_nickname(data.list[0].nickname);
        setOri_email(data.list[0].email);
    };

    const input = (e) => {
        const {name, value} = e.target;
        setInfo({
            ...info,
            [name]: value,
        })
    }

    // 중복 확인 - 닉네임
    const nickname_overlay = async() => {
        if (info.nickname === ori_nickname) {
            alert("변경된 내용이 없습니다.");
            setNicknameChk(true);
            return;
        }
        const {data} = await axios.get(`http://localhost/overlay/nickname/${info.nickname}`)
        // console.log(data);
        if (data.use === false) {
            alert("이미 사용 중인 닉네임입니다.");
            setNicknameChk(false);
        } else {
            alert("사용 가능한 닉네임입니다.");
            setNicknameChk(true);
        }
    }
    
    // 중복 확인 - 이메일
    const email_overlay = async () => {
        if (info.email === ori_email) {
            alert("변경된 내용이 없습니다.");
            setEmailChk(true);
            return;
        }
        const {data} = await axios.get(`http://localhost/overlay/email/${info.email}`)
        // console.log(data);
        if (data.use === false) {
            alert("이미 사용 중인 이메일입니다.");
            setEmailChk(false);
        } else {
            alert("사용 가능한 이메일입니다.");
            setEmailChk(true);
        }
    }

    // 회원 정보 수정
    const mypage_update = async () => {
        const {data} = await axios.put('http://localhost/member_update', {
            user_id: user_id.current,
            email: info.email,
            bio: info.bio,
            location: info.location,
            nickname: info.nickname,
        })
        console.log(data);
        if (data.success === true) {
            alert("회원 정보 수정에 성공했습니다.");
            location.href = './mypage';
        } else {
            if (nicknameChk === false) {
                alert("닉네임 중복 확인을 진행해주세요.");
            }
            if (emailChk === false) {
                alert("이메일 중복 확인을 진행해주세요.");
            }
        }
    }

    const trStyle = {
        border: '1px solid lightgray',
        height: '45px',
    }

    const thStyle = {
        boxSizing: 'border-box',
        width: '249px',
        border: '1px solid lightgray',
        backgroundColor: '#f4f4f4',
        fontWeight: 500,
        textAlign: 'left',
        paddingLeft: '30px',
    }

    return (
        <>
            <div>
                <div className={"infoTap"}>
                    <div className={"profileTap"}>
                        <img className={"userImage"} src={"/userIcon_default_profile.png"} alt={"유저 아이콘 기본 프로필 사진"}/><br/>
                        <label>프로필 사진</label>
                    </div>
                    <table className={"infoTable"}>
                        <tbody>
                        <tr style={trStyle}>
                            <th style={thStyle}>ID</th>
                            <td className={"infoTable_td"}>{user_id.current}</td>
                        </tr>
                        <tr style={trStyle}>
                            <th style={thStyle}>PASSWORD</th>
                            <td onClick={()=>{setShowModal(true)}} className={"infoTable_td_pw"}>비밀번호 수정</td>
                        </tr>
                        <tr style={trStyle}>
                            <th style={thStyle}>닉네임</th>
                            <td className={"infoTable_td"}>
                                <input className={"nickname_update"}
                                       type={"text"} name={"nickname"}
                                       value={info?.nickname || ''} onChange={input}/>
                                <button onClick={nickname_overlay} className={"updateButton"}>중복 확인</button>
                            </td>
                        </tr>
                        <tr style={trStyle}>
                            <th style={thStyle}>이메일</th>
                            <td className={"infoTable_td"}>
                                <input className={"email_update"}
                                       type={"text"} name={"email"}
                                       value={info?.email || ''} onChange={input}/>
                                <button onClick={email_overlay} className={"updateButton"}>중복 확인</button>
                            </td>
                        </tr>
                        <tr className={"bioTable"} style={trStyle}>
                            <th style={thStyle}>자기소개</th>
                            <td className={"infoTable_td"}>
                                <input className={"bio_update"}
                                       type={"text"} name={"bio"}
                                       value={info?.bio || ''} onChange={input}/>
                            </td>
                        </tr>
                        <tr style={trStyle}>
                            <th style={thStyle}>지역</th>
                            <td className={"infoTable_td"}>
                                <select className={"locationSelect"}>
                                    <option>지역1</option>
                                    <option>지역2</option>
                                    <option>지역3</option>
                                </select>
                            </td>
                        </tr>
                        <tr className={"tag_tr"} style={trStyle}>
                            <th style={thStyle}>선호 태그</th>
                            <td className={"infoTable_td"}>
                                <div className={"tag_content"}>
                                    <span>태그1, 태그2, 태그3</span>
                                    <button className={"tag_updateButton"}>태그 선택</button>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div className={"footer"}>
                    <button onClick={mypage_update} className={"infoUpdateButton"}>수정 완료</button>
                </div>
                {/*{visibleComponent === 'changePW' && <ChangePW onShowModal={() => setShowModal(true)} />}*/}
            </div>

            {showModal && <ChangePW onClose={() => setShowModal(false)} />}

        </>
    );
}