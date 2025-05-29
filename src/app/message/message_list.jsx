'use client'
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import Link from "next/link";
import SelectedModel from "@/app/message/selected";

export default function MessageList({type}) {
    let user_id = sessionStorage.getItem('user_id');
    const token = sessionStorage.getItem('token');

    const [list, setList] = useState([]);
    const [selected, setSelected] = useState([]);

    useEffect(() => {
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
                        <div key={item.msg_idx}>
                            <InboxItem item={item}
                                       user_id={user_id}
                                       drawList={drawList}
                            />
                        </div>
                    );
                });
                setList(content);
            });
        } else if (type === 'outbox') {
            axios.get(`http://localhost/${user_id}/send_msg`, /*{headers: {Authorization: token}}*/).then(({data}) => {
                let content = data.send_msg.map((item) => {
                    return (
                        <div key={item.msg_idx}>
                            <OutboxItem item={item}
                                        user_id={user_id}
                                        drawList={drawList}
                            />
                        </div>
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
        </div>

    );
}

function InboxItem({item, user_id, drawList}) {

    // ------------------ 모달창위치정하기 ---------------//
    const [open, setOpen] = useState(false);
    const [pos, setPos] = useState({x: 0, y: 0});
    const popup = (e) => {
        setOpen(!open);
    }

    const del = async (msg_idx) => {
        let {data} = await axios.put(`http://localhost/${user_id}/${msg_idx}/recip_del`);
        if (data.success) {
            drawList();
        }
    }
    return (
        <div className={"messageItem"} style={{width: '800px'}}>
            {/*클릭 링크 추가, css는 임시방편*/}
            {item.msg_idx} &nbsp;
            <input type={"checkbox"} value={item.msg_idx}/>
            <Link href={`/message/detail/${item.msg_idx}`}>{item.subject}</Link>  &nbsp;&nbsp;
            {item.recip} &nbsp;&nbsp;
            <span onClick={(e)=>{popup(e)}}>{item.sender}</span> &nbsp;&nbsp;
            {open ? <SelectedModel target_user={item.sender} /> : null}
            <span style={{fontSize: "small", position: "absolute", right: "40px"}}
                  onClick={() => del(item.msg_idx)}>[개별삭제(임시)]</span>
        </div>
    );
}

function OutboxItem({item, user_id, drawList}) {

    // ------------------ 모달창위치정하기 ---------------//
    const [open, setOpen] = useState(false);
    const [pos, setPos] = useState({x: 0, y: 0});
    const popup = (e) => {
        setOpen(!open);
    }
    const del = async (msg_idx) => {
        let {data} = await axios.put(`http://localhost/${user_id}/${msg_idx}/send_del`);
        if (data.success) {
            drawList();
        }
    }
    return (
        <div className={"messageItem"} style={{width: '800px'}}>
            {/*클릭 링크 추가, css는 임시방편*/}
            {item.msg_idx} &nbsp;
            <input type={"checkbox"} value={item.msg_idx}/>
            <Link href={`/message/detail/${item.msg_idx}`}>{item.subject}</Link>  &nbsp;&nbsp;
            <span onClick={(e)=>{popup(e)}}>{item.recip}</span>  &nbsp;&nbsp;
            {open ? <SelectedModel target_user={item.recip} /> : null}
            {item.sender} &nbsp;&nbsp;
            <span style={{fontSize: "small", position: "absolute", right: "40px"}}
                  onClick={() => del(item.msg_idx)}>[개별삭제(임시)]</span>
        </div>
    );
}
