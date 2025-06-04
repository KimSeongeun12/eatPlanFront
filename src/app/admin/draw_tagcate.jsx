'use client'
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import Tags from "@/app/admin/component/tags";
import './tagManager.css'
import CategoryInput from "@/app/admin/component/categoryInput";

export default function DrawLeftTags({isClass, leftMenu}) {

    const [list, setList] = useState([]);
    const cate_idx=useRef(1);
    const [component, setComponent] = useState(null);

    useEffect(() => {
        drawList();
    }, [cate_idx.current, leftMenu]);

    // 좌측 카테고리를 클릭할 시 실행되는 함수
    // isClass===코스/식당 식별
    const clickCate=(idx)=>{
        cate_idx.current=idx;
        setComponent(<Tags idx={idx} isClass={isClass}/>);    //Tags set
    }

    // 태그 카테고리 삭제
    const del = async (cate_idx)=>{
        let {data}= await axios.delete(`http://localhost/adtag_cate_del`, {data: {'cate_idx': cate_idx}});
        // console.log(data);
        await drawList();
    }

    const drawList = async () => {
        let {data} = await axios.get('http://localhost/list_tagcate');
        const tags = data.list_tagcate.map((item) => {
                return (
                    <div key={item.cate_idx} className={"box"}
                         onClick={() => {clickCate(item.cate_idx)}}>
                        {item.cate_name}
                        <div style={{cursor:"pointer", color:"red", width:"15px"}} onClick={()=>del(item.cate_idx)}>X</div>
                    </div>
                );
        })
        setList(tags);  //태그 카테고리 세팅
    }

    return (
        <div>
            <div className={"tag list"}>
                <div className={"left-tag"}>{list}</div>
                {component}
            </div>
            <br/>
            <CategoryInput drawList={drawList}/>
            ▲태그카테고리 Enter로 추가하세요 | 현재탭: {isClass}
        </div>

    );
}
