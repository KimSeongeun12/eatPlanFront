'use client'

import {useEffect, useState} from "react";
import axios from "axios";
import './admin.css'
import Ban from "@/app/admin/ban";
import MemberItem from "@/app/admin/memberItem";

export default function MemberList({check, setCheck}){

    const [list, setList] = useState([]);
    const [filter, setFilter] = useState("all");
    const [align, setAlign] = useState("user_id");

    useEffect(() => {
        drawlist();
    }, [filter, align]);

    // ----------------- 회원에게 관리자 권한을 부여하는 함수입니다. ---------------//
    const adminClick=(e)=>{
        axios.get(`http://localhost/admember_admin/${e.target.id}`).then(({data})=>{
            drawlist();
        });
    }

    const drawlist=async ()=>{

        let {data}=await axios.get(`http://localhost/admember_list/${align}/${filter}`);
        const member=data.list.map((item)=>{
            return(
                <MemberItem key={item.user_id} item={item} adminClick={adminClick}/>
            );
        });
        setList(member);
    }

    return(
        <>
            <div className={"adminMember"} style={{borderBottom:"2px solid grey", borderTop:"2px solid grey", padding:"6px"}}>
                <input type={"checkbox"} style={{margin:"10px", width:"20px"}}/>
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
            {/*리스트가 출력되는 부분*/}
            {list}
        </>
    );
}
