'use client'

import {useEffect, useRef, useState} from "react";
import axios from "axios";

export default function DrawResta({leftMenu}){

    useEffect(() => {
    }, [leftMenu]);

    const [list,setList] = useState([]); //식당 리스트
    let sort=useRef('resta_name');
    let page=useRef(1);

    // ------------------------ 마우스오버 기능 -----------------------//

    const [clicked,setClicked]=useState(false);

    const handleClick=(e)=>{
        
    }

    // --------------------- 리스트 기능 --------------------- //
    const drawResta=async (e)=>{
        sortList(e);
        let {data}=await axios.get(`http://localhost/adtag_restaList/${page.current}/${sort.current}`);

        const result=data.restaList.list.map((item)=>{
            // console.log(item);
            return(
                <div key={item.resta_idx}
                     style={{padding:"5px", border:"1px solid lightgray", display:'flex', flexDirection:'row'}}>
                    <div style={{width:"200px"}}>{item.resta_name}</div>
                    <div style={{position:"relative", right:"-20%"}}>{item.address}</div>
                </div>
            );
        });
        setList(result);
    }

    const sortList=(e)=>{
        sort.current=(e.target.options[e.target.selectedIndex].value);
    }

    return(
        <>
            <div className={"sort"}>
                <select name={"sort"} style={{height:"30px"}} onChange={(e)=>drawResta(e)}>
                    <option value={"resta_name"} >식당 이름 순</option>
                    <option value={"address"}>식당별 주소 순</option>
                </select>
            </div>
            <div className={"resta-list"}>
                {list}
            </div>
        </>
    );
}

// --------------------마우스오버하면 뜨는 태그창  --------------------//
function tagPopup({resta_name}){

    const [tags,setTags] = useState([]);

    const showTags=async ()=>{
        let {data}=await axios.get(`http://localhost/listRestaTags/${resta_name}`);
        const list=data.tags.map((item)=>{
            return(
                <div key={item.tag_name}>{item.tag_name}</div>
            )
        });
        setTags(list);
    }

    return(
        <div style={{border:"1px solid red", padding:"5px", backgroundColor:"lightyellow"}}>
            {tags}
        </div>
    );
}