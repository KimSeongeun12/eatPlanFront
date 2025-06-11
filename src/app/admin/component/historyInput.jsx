'use client'

import {useState} from "react";
import axios from "axios";

export default function HistoryInput({report_idx, drawList}){

    const [input, setInput] = useState('');
    let user_id=sessionStorage.getItem("user_id");

    //히스토리 추가
    const insert=async ()=>{
        let {data}=await axios.post(`http://192.168.0.120/history_write`, {report_idx: report_idx, user_id: user_id, content: input});
        if(data.success){
            drawList();
            setInput('');
        }
    }

    //엔터
    const enterHandler=(e)=>{
        if(e.key === 'Enter'){
            insert();
        }
    }

    return(
        <div>
            <input type={"text"}
                   style={{height:"30px", border:"1px solid black", marginBottom:"10px", marginTop:"10px"}}
                   value={input}
                   onKeyUp={enterHandler}
                   onChange={(e) => setInput(e.target.value)}
                   placeholder={"내용을 입력하세요"}
            />
        </div>
    );
}