'use client'
import './loginCss.css'
import {useEffect, useState} from "react";
import axios from "axios";

export default function LoginPage() {
    useEffect(() => {
        const user_id = sessionStorage.getItem("user_id");
        const token = sessionStorage.getItem("token");
        const admin = sessionStorage.getItem("admin");

        if (user_id != null) {
            sessionStorage.removeItem("user_id");
        }
        if (token != null) {
            sessionStorage.removeItem("token");
        }
    }, []);

    const style = {
        color: '#CC503B',
        fontSize: '16px',
        fontfamily: 'Noto Sans',
        fontStyle: 'normal',
        fontWeight: 'normal',
        lineHeight: '22px',
    }

    const join = () => {
        location.href = "/join";
    }

    const findPw = () => {
        location.href = "/findChangePw";
    }

    const [info, setInfo] = useState({
        user_id: '',
        pass: ''
    });

    const input = (e) => {
        let {name, value} = e.target;
        setInfo({
            ...info,
            [name]: value
        });
    }

    const enter = (e) => {
        if (e.key === 'Enter') {
            login();
        }
    }

    // 정지유저 로그인 차단, true일 시 정지유저
    const block = async () => {
        let {data} = await axios.get(`http://localhost/${info.user_id}/blockchk`);
        return data.blocked;
    }

    const login = async () => {
        // console.log(info);
        const {data} = await axios.post('http://localhost/login', info);
        console.log(data);

        if (await block()) {
            alert('정지된 사용자입니다.');
        } else {
            if (data.success === true) {
                alert("로그인에 성공했습니다.");
                sessionStorage.setItem('user_id', data.user_id);
                sessionStorage.setItem('token', data.token);
                sessionStorage.setItem('admin', data.admin);
                if (sessionStorage.getItem('admin') === 'true') {
                    location.href = '/admin_course';
                } else {
                    location.href = '/list';
                }
            } else {
                alert("아이디 또는 비밀번호를 확인해주세요.");
            }
        }

    }

    return (
        <>
            <div className={"BFB"}>
            <div className={"loginTap"}>
                <img src={"login_background.png"} alt={"로그인 페이지 이미지"}/>
                <span className={"loginSpan"}>LOGIN</span>

                <input className={"IDinput"} type={"text"} name={"user_id"} value={info.user_id}
                       placeholder={"아이디를 입력해주세요."} onChange={input} onKeyUp={(e) => enter(e)}/>
                <input className={"PWinput"} type={"password"} name={"pass"} value={info.pass}
                       placeholder={"비밀번호를 입력해주세요."} onChange={input} onKeyUp={(e) => enter(e)}/>

                <button className={"loginButton"} onClick={login}>로그인</button>
                <span className={"joinSpan"} style={style} onClick={join}>회원가입</span>
                <span className={"findPWSpan"} style={style} onClick={findPw}>비밀번호찾기</span>
            </div>
            </div>
        </>
    );
}