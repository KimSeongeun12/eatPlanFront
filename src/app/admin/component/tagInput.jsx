'use client'

import {useEffect, useState} from "react";

export default function TagInsert({isClass, cate_idx}){

    const [input, setInput] = useState('');

    useEffect(() => {
        setInput('');
    },[]);

    
    const insert=()=>{

    }


    return(
        <div className="tag-input" style={{padding:"5px", display:"flex", flexDirection:"row"}}>
            <input type="text" style={{fontSize:"18px"}} value={input} onChange={(e)=>setInput(e.target.value)}/>
            <div onClick={()=>{insert()}}
                style={{marginLeft:"5px", padding:"10px", position:"relative", left:"10px", cursor:"pointer", border:"1px solid gray", width:"50px", textAlign:"center"}}>추가</div>
        </div>
    );

}