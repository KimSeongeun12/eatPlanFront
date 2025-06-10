'use client'
import {useState} from "react";
import Ban from "@/app/admin/component/ban";

export default function MemberItem({item, adminClick}){

    const [open, setOpen] =  useState(false);

    return(
        <>
            <div className={"member list"}>
                <span>{item.user_id}</span>
                {/*아래에 유저 페이지 이동*/}
                <span>{item.nickname}</span>
                <span className={"long"}>{item.email}</span>
                <span className={"long"}>{item.reg_date}</span>
                <div className={"buttons"}>
                    <div className={'member button'} onClick={()=>setOpen(!open)}>정지</div>
                    {open ? <Ban user_id={item.user_id} user_nickname={item.nickname} setOpen={setOpen}/>:null}
                    <div id={item.user_id} className={item.admin ? 'member button admin':'member button'} onClick={(e)=>adminClick(e)}>관리자 부여</div>
                </div>
            </div>
        </>
    );
}