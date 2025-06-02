'use client'
import LeftMenu from "@/app/leftMenu";
import {useState} from "react";
import MessageList from "@/app/message/message_list";

export default function MessagePage() {

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
                <MessageList type={type}/>
            </div>
        </>
    );
}