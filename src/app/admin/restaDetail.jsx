'use client'

// 식당 idx를 받아옴
import {useEffect, useState} from "react";
import axios from "axios";
import RestaTagManager from "@/app/admin/component/restaTagManager";

export default function RestaDetail({resta_idx}) {

    const [resta, setResta]=useState({});    // 식당세부정보 state
    const [tags,setTags]=useState([]);      // 해당 식당의 태그정보 state
    const [compHtml,setCompHtml]=useState(null);

    const [idx, setIndex]=useState(0);

    const [isLoading, setIsLoading] = useState(true);

    //test

    const [img, setImg]=useState(null);
    // ▲ {tag_idx:'', tag_name:''}

    useEffect(()=>{
        // console.log('RestaDetail idx(O):', resta_idx);
        getDetail();
    }, [resta_idx]);

    const getDetail = async ()=>{
        let {data} = await axios.get(`http://192.168.0.120/restaDetail/${resta_idx}`);
        setResta(data.detail);
        setCompHtml(
            <div className={"information"}>
                <div style={{ color: 'red', fontWeight: 'bold' }}>{data.detail.resta_name}</div>
                <div>{data.detail.address}</div>
                <div>{data.detail.url}</div>
            </div>);
        setImg(<img src={`http://192.168.0.120/imageIdx/${data.detail.img_idx}`} alt="" style={{width: "200px", height: "200px", padding: "10px"}}/>);

        const taglist=data.tags.map((item)=>{
            return {tag_idx: item.tag_idx, tag_name:item.tag_name};
        });

        setTags(taglist);  // 2. 태그 정보 저장
        setIsLoading(false);
    }

    return(
        <>
            <div style={{backgroundColor:"white", border:"1px solid lightgray", display:"flex", justifyContent:"left", padding:"10px"}}>
                {/*식당정보 출력 부분*/}
                {isLoading ? <div>로딩중...</div> : <div><div>{img}</div>{compHtml}</div>}
            </div>
            {isLoading ? null : <RestaTagManager tags={tags} resta_idx={resta_idx}/>}
        </>
    );
}



