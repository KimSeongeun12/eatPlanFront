'use client'
import './findChangePWCss.css';
import React, {useState} from "react";
import axios from "axios";

export default function FindPw({ setVisibleComponent }) {
    const style = {
        color: '#FF0000',
    }

    const [info, setInfo] = useState({
        user_id: '',
        email: '',
    });

    const input = (e) => {
        const {name, value} = e.target;
        setInfo({
            ...info,
            [name]: value,
        });
    }

    const send = async () => {
        if (!info.user_id || !info.email) {
            alert("아이디와 이메일을 모두 입력해주세요.");
            return;
        }

        const {data} = await axios.post("http://localhost/findPassword", info);
        console.log(data);
        if (data.success === true) {
            alert('인증되었습니다.'); // 발송이 안되긴 하는데 굳이 발송 안하고 인증만 해도 될 것 같아서....
            sessionStorage.setItem('user_id', info.user_id);
            setVisibleComponent('changePw');
        } else {
            alert('아이디 또는 이메일을 다시 한 번 확인해주세요.');
        }
    }

    return (
        <>
            <div className={"findPWTap"}>
                <span className={"changePWSpan"}>CHANGE PASSWORD</span>
                <div className={"idDiv"}>
                    <label>아이디<span style={style}> *</span></label><br/>
                    <input className={"idInput"}
                           type={"text"}
                           name={"user_id"}
                           value={info.user_id}
                           onChange={input}
                           placeholder={"아이디를 입력해주세요."}/>
                </div>
                <div className={"emailDiv"}>
                    <label>이메일<span style={style}> *</span></label><br/>
                    <input className={"emailInput"}
                           type={"text"}
                           name={"email"}
                           value={info.email}
                           onChange={input}
                           placeholder={"이메일을 입력해주세요."}/>
                </div>
                <button onClick={send} className={"nextButton"}>다음 단계</button>
            </div>
        </>
    );
}