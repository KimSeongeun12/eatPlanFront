'use client'
import LeftMenu from "@/app/leftMenu";
import {useEffect, useRef, useState} from "react";
import MemberList from "@/app/admin/memberList";
import './admin.css';

export default function AdminPage(){

    let user_id=useRef('');
    let token=useRef('');

    const [filter, setFilter] = useState("all");
    const [align, setAlign] = useState("user_id");

    useEffect(() => {
        user_id.current=sessionStorage.getItem('user_id');
        token.current=sessionStorage.getItem('token');
    }, []);


    return(
        <>
            <LeftMenu/>
            <div className={"rightMenu"}>
                <div className={"topMenuSpans"}>
                    <span className={'active-span'}>내 정보 열람</span>
                    <span className={'active-span'}>내 코스 모아보기</span>
                    <span className={'active-span'}>회원 리스트</span>
                    <span className={'active-span'}>태그 관리</span>
                    <span className={'active-span'}>신고 내역 확인</span>
                </div>
                <div className={"adminMember"} style={{borderBottom:"2px solid grey", borderTop:"2px solid grey", padding:"6px"}}>
                    <input type={"checkbox"} style={{margin:"10px"}}/>
                    <span>정지</span>
                    <span>관리자 부여</span>
                    <span style={{marginLeft:"10px"}}>필터: </span>
                    <select style={{margin:"10px", height:"30px"}} name={"filter"} onChange={(e)=>setFilter(e.target.options[e.target.selectedIndex].value)}>
                        <option value={"all"}>모든 회원</option>
                        <option value={"default"}>일반 회원</option>
                        <option value={"banned"}>정지 회원</option>
                        <option value={"admin"}>관리자</option>
                    </select>
                    <span style={{marginLeft:"10px"}}>정렬: </span>
                    <select style={{margin:"10px", height:"30px"}} name={"align"} onChange={(e)=>setAlign(e.target.options[e.target.selectedIndex].value)}>
                        <option value={"user_id"}>아이디</option>
                        <option value={"nickname"}>닉네임</option>
                        <option value={"email"}>이메일</option>
                        <option value={"reg_date"}>가입일자</option>
                    </select>
                </div>
                <MemberList filter={filter} align={align}/>
            </div>
        </>
    );
}