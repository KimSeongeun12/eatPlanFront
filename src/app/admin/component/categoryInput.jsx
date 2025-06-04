'use client'

import {useState} from "react";
import axios from "axios";

export default function CategoryInput({drawList}){

    const [cate,setCate]=useState('');

    const enterHandler=(e)=>{
        if(e.key==="Enter"){
            insert();
        }
    }

    const insert = async ()=>{
        let {data}= await axios.post(`http://localhost/adtag_cate`, {cate_name:cate});
        if(!data.success){
            alert('중복되었거나 유효하지 않은 카테고리입니다.');
        }
        else{
            drawList();
            setCate('');
        }
    }

    return(
        <div className={"tag-input"}>
            <input type={"text"}
                   style={{height:"30px", fontSize:"20px"}}
                   onKeyUp={enterHandler}
                   value={cate}
                   onChange={(e)=>{setCate(e.target.value)}}
            />
        </div>
    );
}