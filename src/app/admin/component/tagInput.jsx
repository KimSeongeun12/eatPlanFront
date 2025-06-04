'use client'

import {useEffect, useState} from "react";
import axios from "axios";

export default function TagInsert({isClass, cate_idx, drawCourseTags, drawRestaTags}) {

    const [tag, setTag] = useState({});
    // 넣을거

    useEffect(() => {
        if(isClass==='restaurant') {
            setTag({cate_idx: cate_idx, isClass: '식당', tag_name:''});
        }
        else if(isClass==='course') {
            setTag({cate_idx: cate_idx, isClass: '코스', tag_name:''});
        }
    }, [cate_idx, isClass]);


    //-----------------태그입력---------------
    const insert= async ()=>{
        setTag({...tag, tag_name:''});
        let {data}=await axios.post('http://localhost/addTag', tag);
        if(tag.isClass==='식당')  drawRestaTags();
        else  drawCourseTags();
    }

    // ----------------- 귀찮으니 엔터로 해결! -------------//
    const enterHandler=(e)=>{
        if(e.key === 'Enter'){
            insert();
        }
    }


    return (
        <div className="tag-input" style={{padding: "5px", display: "flex", flexDirection: "row"}}>
            <input type="text" style={{fontSize: "18px"}}
                   value={tag.tag_name}
                   onKeyUp={(e)=>{enterHandler(e)}}
                   onChange={(e) => {setTag({...tag, tag_name:e.target.value})}}/>
            <div onClick={insert}
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