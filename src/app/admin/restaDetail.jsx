'use client'

// 식당 idx를 받아옴
import {useEffect, useMemo, useState} from "react";
import axios from "axios";
import RestaTagManager from "@/app/admin/component/restaTagManager";

export default function RestaDetail({resta_idx}) {

    const [resta, setResta]=useState({});    // 식당세부정보 state
    const [tags,setTags]=useState([]);      // 해당 식당의 태그정보 state
    // ▲ {tag_idx:'', tag_name:''}

    useEffect(()=>{
        getDetail();
    },[]);

    useEffect(()=>{
        getDetail();
    }, [resta_idx]);


    const getDetail = async ()=>{
        let {data} = await axios.get(`http://192.168.0.120/restaDetail/${resta_idx}`);
        setResta(data.detail);   // 1. 식당 정보 저장
        const taglist=data.tags.map((item)=>{
            return {tag_idx: item.tag_idx, tag_name:item.tag_name};
        });
        setTags(taglist);  // 2. 태그 정보 저장
    }

    return(
        <>
            <div style={{backgroundColor:"white", border:"1px solid lightgray", marginTop:"1rem"
                , display:"flex", justifyContent:"left"}}>

                {/*식당정보 출력 부분*/}
                <div>
                    <img src={`http://192.168.0.120/imageIdx/${resta.img_idx}`} alt=""/>
                </div>
                <div className={"information"}>
                    <div>{resta.resta_name}</div>
                    <div>{resta.address}</div>
                    <div>{resta.url}</div>
                    <div>{resta.resta_bio}</div>
                </div>
                {/*닫기버튼*/}
                {/*<div style={{color:"red", position:"absolute", right:"5%", fontSize:"large", cursor:"pointer"}}>X</div>*/}
            </div>
            <RestaTagManager tags={tags} resta_idx={resta.resta_idx} />
        </>

    );
}



