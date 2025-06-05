'use client'

import {useEffect, useRef, useState} from "react";
import axios from "axios";
import RestaDetail from "@/app/admin/restaDetail";

export default function DrawResta({leftMenu}){

    useEffect(() => {

    }, [leftMenu]);

    const [list,setList] = useState([]); //식당 리스트
    let sort=useRef('resta_name');
    let page=useRef(1);
    const [component,setComponent]=useState(null); //식당 디테일 컴포넌트 state

    const openDetail =(idx)=>{
        setComponent(<RestaDetail resta_idx={idx}/>);
    }

    // --------------------- 식당 리스트를 뽑는 함수 --------------------- //
    const drawResta = async (e)=>{
        sortList(e);
        let {data}=await axios.get(`http://localhost/adtag_restaList/${page.current}/${sort.current}`);

        const result=data.restaList.list.map((item)=>{
            // console.log(item);
            return(
                <div key={item.resta_idx}
                     style={{padding:"5px", border:"1px solid lightgray", display:'flex', flexDirection:'row'}}>
                    {/*식당 이름*/}
                    <div style={{width:"200px", cursor:"pointer"}} onClick={()=>openDetail(item.resta_idx)}>{item.resta_name}</div>
                    {/*식당 주소*/}
                    <div style={{position:"relative", right:"-20%"}}>{item.address}</div>
                </div>
            );
        });
        setList(result);
    }

    const sortList=(e)=>{
        sort.current=(e.target.options[e.target.selectedIndex].value);
    }

    // #페이징처리 필요

    return(
        <>
            {/*상단 바*/}
            <div className={"sort"}>
                <select name={"sort"} style={{height:"30px"}} onChange={(e)=>drawResta(e)}>
                    <option value={"resta_name"} >식당 이름 순</option>
                    <option value={"address"}>식당별 주소 순</option>
                </select>
            </div>
            {/*실질적인 식당 리스트가 출력되는 부분*/}
            <div className={"resta-list"}>
                {list}
            </div>
            {component}
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