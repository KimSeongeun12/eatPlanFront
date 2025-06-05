'use client'
import {useEffect, useState} from "react";
import axios from "axios";
import Link from "next/link";
import SelectedModel from "@/app/message/selected";
import '../mainCss.css';

export default function MessageList({type, user_id, token}) {

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
            axios.get(`http://localhost/${user_id}/recip_msg`, {headers: {Authorization: token}}).then(({data}) => {
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
            axios.get(`http://localhost/${user_id}/send_msg`, {headers: {Authorization: token}}).then(({data}) => {
                let content = data.send_msg.map((item) => {
                    console.log(item);
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
            {/*상단 바*/}
            <div style={{display:"inline-flex", padding:"5px", border:"1px solid lightgray", borderRadius:"5px"}} >
                <div style={{width:"100px"}}>No</div>
                <div style={{width:"300px"}}>제목</div>
                <div style={{width:"200px"}}>{type==='inbox'? '작성자':'수신자'}</div>
                <div style={{width:"200px"}}>작성일</div>
            </div>
            {list}
            <br/>
        </div>

    );
}

function InboxItem({item, user_id, drawList}) {

    const token=sessionStorage.getItem('token');

    // ------------------ 모달창위치정하기 ---------------//
    const [open, setOpen] = useState(false);
    const [pos, setPos] = useState({x: 0, y: 0});
    const popup = (e) => {
        setOpen(!open);
    }

    const del = async (msg_idx) => {
        let {data} = await axios.get(`http://localhost/${user_id}/${msg_idx}/recip_del`, {headers: {Authorization: token}});
        if (data.success) {
            drawList();
        }
    }
    return (
        <div className={"messageItem"} style={{width: '800px'}}>
            {/*번호*/}
            {item.msg_idx} &nbsp;
            <input type={"checkbox"} value={item.msg_idx}/>
            {/*제목*/}
            <Link href={`/message/detail/${item.msg_idx}`}>{item.subject}</Link>  &nbsp;&nbsp;
            {/*발신인*/}
            <span style={{cursor:"pointer"}} onClick={(e)=>{popup(e)}}>{item.sender}</span> &nbsp;&nbsp;
            {open ? <SelectedModel target_user={item.sender} /> : null}
            {/*작성일*/}
            <span> <DateFormat date={item.msg_date}/></span>
            {/*임시로만든 개별삭제버튼*/}
            <span style={{fontSize: "small", position: "absolute", right: "40px", cursor:"pointer"}}
                  onClick={() => del(item.msg_idx)}>[개별삭제]</span>
        </div>
    );
}

function OutboxItem({item, user_id, drawList}) {

    const token=sessionStorage.getItem('token');

    // ------------------ 모달창위치정하기 ---------------//
    const [open, setOpen] = useState(false);
    const [pos, setPos] = useState({x: 0, y: 0});
    const popup = (e) => {
        setOpen(!open);
    }
    const del = async (msg_idx) => {
        let {data} = await axios.get(`http://localhost/${user_id}/${msg_idx}/send_del`, {headers: {Authorization: token}});
        if (data.success) {
            drawList();
        }
    }
    return (
        <div className={"messageItem"} style={{width: '800px'}}>
            {/*번호*/}
            {item.msg_idx} &nbsp;   
            <input type={"checkbox"} value={item.msg_idx}/>
            {/*제목*/}
            <Link href={`/message/detail/${item.msg_idx}`}>{item.subject}</Link>  &nbsp;&nbsp;
            {/*수신인*/}
            <span style={{cursor:"pointer"}} onClick={(e)=>{popup(e)}}>{item.recip}</span>  &nbsp;&nbsp;
            {open ? <SelectedModel target_user={item.recip} /> : null}
            {/*작성일*/}
            <span><DateFormat date={item.msg_date}/> </span>
            {/*개별삭제임시버튼*/}
            <span style={{fontSize: "small", position: "absolute", right: "40px", cursor:"pointer"}}
                  onClick={() => del(item.msg_idx)}>[개별삭제]</span>
        </div>
    );
}


// 날짜 포맷 변경
function DateFormat({date}) {
    const trimmedString = date.split('T')[0];
    return (
        <>{trimmedString}</>
    );
}