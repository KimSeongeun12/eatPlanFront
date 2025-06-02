'use client'
import LeftMenu from "@/app/leftMenu";
import {useRef, useState} from "react";
import MessageList from "@/app/message/message_list";
import '../mainCss.css'
import './message.css'

export default function MessagePage() {

    const user_id=useRef(sessionStorage.getItem("user_id"));
    const token=useRef(sessionStorage.getItem("token"));

    // inbox인지 outbox인지 정하는 state 입니다.
    const [type, setType] = useState("inbox");

    const inboxClick=()=>{
        setType("inbox");
    }
    const outboxClick=()=>{
        setType("outbox");
    }

    return (
        <>
            <LeftMenu />
            <div className={"rightMenu"}>
                <div className={"topMenuSpans"}>
                    <span onClick={inboxClick} className={type==='inbox'? 'active-span' : ''}>수신함</span>
                    <span onClick={outboxClick} className={type==='outbox'? 'active-span' : ''}>발신함</span>
                </div>
                <hr/>
                <MessageList type={type} user_id={user_id.current} token={token.current}/>
            </div>
        </>
    );
}