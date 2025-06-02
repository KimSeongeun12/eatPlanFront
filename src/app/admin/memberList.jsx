'use client'

import {useEffect, useState} from "react";
import axios from "axios";
import './admin.css'

export default function MemberList({filter, align, check, setCheck}){

    const [list, setList] = useState([]);


    useEffect(() => {
        drawlist();
    }, [filter, align]);

    // -----------------회원에게 관리자 권한을 부여하는 함수입니다. ---------------//
    const adminClick=(e)=>{
        axios.get(`http://localhost/admember_admin/${e.target.id}`).then(({data})=>{
            drawlist();
        });
    }

    const insertCheck=(e)=>{

    }

    const drawlist=async ()=>{
        let {data}=await axios.get(`http://localhost/admember_list/${align}/${filter}`);
        const member=data.list.map((item)=>{
            return(
                <div className={"member list"} key={item.user_id}>
                    <input type={"checkbox"} id={item.user_id} onChange={(e)=>insertCheck(e)}/>
                    <span>{item.user_id}</span>
                    {/*아래에 유저 페이지 이동*/}
                    <span>{item.nickname}</span>
                    <span className={"long"}>{item.email}</span>
                    <span className={"long"}>{item.reg_date}</span>
                    <div className={"buttons"}>
                        <div className={'member button'}>정지</div>
                        <div id={item.user_id} className={item.admin ? 'member button admin':'member button'} onClick={(e)=>adminClick(e)}>관리자 부여</div>
                    </div>
                </div>
            );
        });
        setList(member);
    }

    return(
        <>{list}</>
    );
}