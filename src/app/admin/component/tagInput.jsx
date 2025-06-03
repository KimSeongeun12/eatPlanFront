'use client'

import {useRef, useState} from "react";
import axios from "axios";

export default function TagInsert({isClass, cate_idx}) {

    const [input, setInput] = useState('');
    // 넣을거
    const [tag, setTag] = useState({cate_idx: cate_idx, isClass: isClass, tag_name: ''});

    const overlay = async (className) => {
        let {data} = await axios.post(`http://localhost/overlayTag`, {isClass: className, tag_name: input});
        console.log(data.usable);
        return data.usable;
    }

    //-----------------태그입력---------------
    const insert=()=>{
        if(input===''){
            alert('공백');
        }
        else{
            if(isClass==='course'&&overlay('코스')){
                setTag({cate_idx:cate_idx, isClass:'코스', tag_name: input});
                axios.post('http://localhost/addTag', tag).then(({data}) => {
                    if(data.success){
                        setTag({tag_name:''});
                    }
                });
            }
            else if(isClass==='restaurant'&&overlay('식당')){
                setTag({cate_idx:cate_idx, isClass:'식당', tag_name: input});
                axios.post('http://localhost/addTag',tag).then(({data}) => {
                    if(data.success){
                        setTag({tag_name:''});
                    }
                });
            }
        }
    }


    // 버리고다시만들어야함
    return (
        <div className="tag-input" style={{padding: "5px", display: "flex", flexDirection: "row"}}>
            <input type="text" style={{fontSize: "18px"}} value={input} onChange={(e) => {
                console.log(e.target.value);
                setInput(e.target.value)
            }}/>
            <div onClick={()=>insert()}
                 style={{
                     marginLeft: "5px",
                     padding: "10px",
                     position: "relative",
                     left: "10px",
                     cursor: "pointer",
                     border: "1px solid gray",
                     width: "50px",
                     textAlign: "center"
                 }}>추가
            </div>
        </div>
    );

}