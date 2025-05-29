'use client'
import '../mainCss.css'
import './myPageCss.css'
import axios from "axios";
import {useEffect, useRef, useState} from "react";
import {useRouter} from "next/navigation";

export default function MyInfo() {
    const router = useRouter();
    const user_id = useRef('');
    const [userInfo, setUserInfo] = useState({});

    useEffect(() => {
        if (typeof window !== 'undefined') {
            user_id.current = sessionStorage.getItem('user_id');
            memberInfo(user_id.current);
        }
    }, []);

    const trStyle = {
        border: '1px solid lightgray',
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

    const memberInfo = async () => {
        const {data} = await axios.post('http://localhost/member_list', {user_id: user_id.current});
        if (!data.list || data.list.length === 0 || !data.list[0].user_id) {
            alert("로그인이 필요한 서비스입니다.");
            location.href = '/login';
            return;
        }
        setUserInfo(data.list[0]);
    }

    return (
        <>
            <div>
                <div className={"infoTap"}>
                    <div className={"profileTap"}>
                        <img className={"userImage"} src={"userIcon_default_profile.png"} alt={"유저 아이콘 기본 프로필 사진"}/><br/>
                        <label>프로필 사진</label>
                    </div>
                    <table className={"infoTable"}>
                        <tbody>
                        <tr style={trStyle}>
                            <th style={thStyle}>ID</th>
                            <td className={"infoTable_td"}>{userInfo?.user_id}</td>
                        </tr>
                        <tr style={trStyle}>
                            <th style={thStyle}>PASSWORD</th>
                            <td className={"infoTable_td"}>{userInfo?.pass}</td>
                        </tr>
                        <tr style={trStyle}>
                            <th style={thStyle}>닉네임</th>
                            <td className={"infoTable_td"}>{userInfo?.nickname}</td>
                        </tr>
                        <tr style={trStyle}>
                            <th style={thStyle}>이메일</th>
                            <td className={"infoTable_td"}>{userInfo?.email}</td>
                        </tr>
                        <tr className={"bioTable"} style={trStyle}>
                            <th style={thStyle}>자기소개</th>
                            <td className={"infoTable_td"}>{userInfo?.bio}</td>
                        </tr>
                        <tr style={trStyle}>
                            <th style={thStyle}>지역</th>
                            <td className={"infoTable_td"}>{userInfo?.location}</td>
                        </tr>
                        <tr style={trStyle}>
                            <th style={thStyle}>선호 태그</th>
                            <td className={"infoTable_td"}>선호 태그</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div className={"footer"}>
                    <span onClick={() => router.push('/passwd')} className={"secessionSpan"} >회원 탈퇴</span>
                    <button onClick={() => router.push('/myInfoPasswd')} className={"infoUpdateButton"}>회원 정보 수정</button>
                </div>
            </div>
        </>
    );
}