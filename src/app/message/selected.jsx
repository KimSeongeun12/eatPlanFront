'use client'

import Link from "next/link";

export default function SelectedModel({target_user}){
    console.log(target_user);

return(
    <div style={{backgroundColor:"lightgray", width:"200px"}}>
        <Link href={`/message/write/${target_user}`}><span style={{fontSize:"small"}}>쪽지 보내기</span></Link>
        <br/>
        <span style={{fontSize:"small"}}>신고하기(아직링크안넣음)</span>
    </div>
    );
}