'use client'
import '../mainCss.css'
import './myPageCss.css'
import axios from "axios";
import {useEffect, useRef, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";

export default function MyInfo() {
    const router = useRouter();
    const loginId = useRef('');
    const user_id = useRef('');
    const [userInfo, setUserInfo] = useState({});

    const searchParams = useSearchParams();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            loginId.current = sessionStorage.getItem('user_id');
            user_id.current = searchParams.get("user_id");
            if (!user_id.current) {
                user_id.current = loginId.current
            }
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

    const memberInfo = async (user_id) => {
        const {data} = await axios.post('http://localhost/member_list', {user_id: user_id});
        if (!data.list || data.list.length === 0 || !data.list[0].user_id) {
            alert("해당 회원의 정보가 없습니다.");
            location.href = '/list';
            return;
        }
        console.log("받은 회원 정보:", data.list[0]);
        setUserInfo(data.list[0]);
    }

    // 태그 리스트 불러오기
    const [tags, setTags] = useState([]);
    const member_tagList = async () => {
        const {data} = await axios.post('http://localhost/member_tag_list', {user_id: loginId.current});
        console.log(data.tagnames);
        if (data?.tagnames) {
            setTags(data.tagnames);
        }
    }

    useEffect(() => {
        member_tagList();
    }, []);

    return (
        <>
            <div>
                <div className={"infoTap"}>
                    <div className={"profileTap"}>
                        <img
                            className="userImage"
                            src={userInfo.img_idx ? `http://localhost/imageIdx/${userInfo.img_idx}` : "/userIcon_default_profile.png"}
                            alt="유저 프로필 이미지"
                        /><br/>
                        <label>프로필 사진</label>
                    </div>
                    <table className={"infoTable"}>
                        <tbody>
                        <tr style={trStyle}>
                            <th style={thStyle}>ID</th>
                            <td className={"infoTable_td"}>{userInfo?.user_id}</td>
                        </tr>
                        <tr style={trStyle} className={user_id.current === loginId.current ? "" : "hidden"}>
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
                            <td className={"infoTable_td"}>
                                {tags.map((tag, idx) => (
                                    <div key={idx}># {tag}</div>
                                ))}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div className={"footer"}>
                    <span onClick={() => router.push('/passwd')}
                          className={user_id.current === loginId.current ? "secessionSpan" : "hidden"} >
                        회원 탈퇴
                    </span>
                    <button onClick={() => router.push('/myInfoPasswd')}
                            className={user_id.current === loginId.current? "infoUpdateButton" : "hidden"}>
                        회원 정보 수정
                    </button>
                </div>
            </div>
        </>
    );
}