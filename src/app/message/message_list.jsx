'use client'
import {useEffect, useState} from "react";
import axios from "axios";
import store from "./redux/store";

export default function MessageList({type}) {
    let user_id = 'admin'// 테스트용 코드입니다. 로그인 적용 시 변경합니다.
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
                        <div key={item.msg_idx}><Item item={item} user_id={user_id} drawList={drawList}/></div>
                    );
                });
                setList(content);
            });
        } else if (type === 'outbox') {
            axios.get(`http://localhost/${user_id}/send_msg`, /*{headers: {Authorization: token}}*/).then(({data}) => {
                let content = data.send_msg.map((item) => {
                    return (
                        <div key={item.msg_idx}><Item item={item} user_id={user_id} drawList={drawList}/></div>
                    );
                });
                setList(content);
            });
        }

        // console.log(data);
    }

    return (
        <div>
            {list}
            <br/>
            <button>선택삭제(아직안만듬)</button>
        </div>

    );
}

function Item({item, user_id, drawList}) {

    const del = async (msg_idx) => {
        let {data} = await axios.put(`http://localhost/${user_id}/${msg_idx}/recip_del`);
        console.log(user_id, msg_idx, data);
        drawList();
    }

    return (
        <div className={"messageItem"} style={{width:'800px'}}>
            {/*쪽지 상세보기, 유저 클릭 링크 추가, css는 임시방편*/}
            {item.msg_idx} &nbsp;
            <input type={"checkbox"} value={item.msg_idx}/>
            {item.content} &nbsp;&nbsp;
            {item.recip} &nbsp;&nbsp;
            {item.sender}
            <span style={{fontSize:"small", position:"absolute", right:"40px"}}
                  onClick={()=>del(item.msg_idx)}>[개별삭제(임시)]</span>
        </div>
    );
}