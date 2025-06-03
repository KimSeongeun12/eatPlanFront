'use client'

import {useEffect, useState} from "react";
import axios from "axios";
import TagInsert from "@/app/admin/component/tagInput";

// --------------- (식당, 코스)각 우측 태그들 -------------------//
// -------------------cate_idx, isClass를 가져옴 ---------------//
export default function Tags({idx, isClass}) {

    const [list, setList] = useState([]);


    useEffect(() => {
        // console.log('isCourse:', isClass);
        if(isClass==='course') {
            drawCourseTags();
        }
        else if(isClass==='restaurant') {
            drawRestaTags();
        }
    }, [idx, isClass]);

    const drawCourseTags = async () => {
        let {data} = await axios.get(`http://localhost/list_tag/${idx}`);
        const tags = data.list_tag.map((item) => {
            if (item.isClass === '코스') {
                // console.log('코스: ', data);
                return (
                    <div key={item.id}><Tag name={item.tag_name}/></div>
                )
            }
        });
        setList(tags);
    }

    const drawRestaTags=async () => {
        let {data} = await axios.get(`http://localhost/list_tag/${idx}`);
        const tags = data.list_tag.map((item) => {
            if (item.isClass === '식당') {
                // console.log('식당: ', data);
                return (
                    <div key={item.id}><Tag name={item.tag_name}/></div>
                )
            }
        });
        setList(tags);
    }

    return (
        <div className={"right-tags"}>
            <div style={{border:"1px solid lightgrey", padding:"5px", position:"relative", left:"400px"}}>
                <TagInsert isClass={isClass} cate_idx={idx}/>
            </div>
            <div>
                {list}
            </div>
        </div>
    );
}

// 태그하나하나하나하나
function Tag({idx, name}) {

    const del=(idx)=>{
        // #태그 지우는 delete 요청 추가
    }

    return (
            <div className={"tag-component"} id={idx}>
              <div className={"tag-name"}>{name}</div>&nbsp;
              <div id={"x"} onClick={()=>del()}>X</div>
            </div>

    );
}