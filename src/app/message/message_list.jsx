'use client'
import {useEffect, useState} from "react";
import axios from "axios";

export default function MessageList({type}){
    let user_id = sessionStorage.getItem('user_id');
    const token = sessionStorage.getItem('token');

    const [list, setList] = useState([]);

    console.log("messageList 호출: ", type);

    useEffect(() => {
        user_id='admin';    // 테스트용 코드입니다. 배포 시 지웁니다.
        drawList();
    }, [type]);

    const drawList= ()=>{
        if(type==='inbox'){
            axios.get(`http://localhost/${user_id}/recip_msg`, /*{headers: {Authorization: token}}*/).then(({data})=>{
                let content=data.recip_msg.map((item)=> {
                    return(
                        <Item item={item}/>
                    );
                });
                setList(content);
            });
        }else if(type==='outbox'){
            axios.get(`http://localhost/${user_id}/send_msg`, /*{headers: {Authorization: token}}*/).then(({data})=>{
                let content=data.send_msg.map((item)=> {
                    return(
                        <Item item={item}/>
                    );
                });
                setList(content);
            });
        }

        // console.log(data);
    }

    return(
        <div>{list}</div>
    );
}

function Item({item}){
    return(
        <div className={"messageItem"}>
            {/*쪽지 상세보기, 유저 클릭 링크 추가*/}
            {item.msg_idx} &nbsp;
            <input type={"checkbox"}/>
            {item.content} &nbsp;&nbsp;
            {item.recip} &nbsp;&nbsp;
            {item.sender} &nbsp;&nbsp;
        </div>
    );
}