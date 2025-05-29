'use client'
import {useEffect, useState} from "react";
import axios from "axios";
import Link from "next/link";

export default function MessageList({type}) {
    let user_id = sessionStorage.getItem('user_id');
    const token = sessionStorage.getItem('token');

    const [list, setList] = useState([]);
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        console.log(user_id);
        drawList();
    }, [type]);

    // --------------------몰러 일괄삭제 어떻게 하냐 ---------------------//
    const selectDel = (e) => {
        console.log('selected: ', selected);
    }

    const drawList = async () => {
        if (type === 'inbox') {
            axios.get(`http://localhost/${user_id}/recip_msg`, /*{headers: {Authorization: token}}*/).then(({data}) => {
                let content = data.recip_msg.map((item) => {
                    return (
                        <div key={item.msg_idx}><Item item={item} user_id={user_id} drawList={drawList} type={type}/></div>
                    );
                });
                setList(content);
            });
        } else if (type === 'outbox') {
            axios.get(`http://localhost/${user_id}/send_msg`, /*{headers: {Authorization: token}}*/).then(({data}) => {
                let content = data.send_msg.map((item) => {
                    return (
                        <div key={item.msg_idx}><Item item={item} user_id={user_id} drawList={drawList} type={type}/></div>
                    );
                });
                setList(content);
            });
        }

    }

    return (
        <div>
            {list}
            <br/>
            <Link href={'/message/write'}><button>쪽지쓰기(임시)</button></Link>
        </div>

    );
}

function Item({item, user_id, drawList, type}) {

    const del = async (msg_idx) => {
        // type별 추가
        if(type==='inbox'){
            let {data} = await axios.put(`http://localhost/${user_id}/${msg_idx}/recip_del`);
            if(data.success){
                drawList();
            }
        }else if(type==='outbox'){
            let {data} = await axios.put(`http://localhost/${user_id}/${msg_idx}/send_del`);
            if(data.success){
                drawList();
            }
        }
    }

    return (
        <div className={"messageItem"} style={{width:'800px'}}>
            {/*쪽지 상세보기, 유저 클릭 링크 추가, css는 임시방편*/}
            {item.msg_idx} &nbsp;
            <input type={"checkbox"} value={item.msg_idx}/>
            <Link href={`/message/detail/${item.msg_idx}`}>{item.subject}</Link>  &nbsp;&nbsp;
            {item.recip} &nbsp;&nbsp;
            {item.sender}
            <span style={{fontSize:"small", position:"absolute", right:"40px"}}
                  onClick={()=>del(item.msg_idx)}>[개별삭제(임시)]</span>
            <span>css너무어려워요</span>
        </div>
    );
}