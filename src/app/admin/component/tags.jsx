'use client'

import {useEffect, useState} from "react";
import axios from "axios";
import TagInsert from "@/app/admin/component/tagInput";

// --------------- (식당, 코스)각 우측 태그들 -------------------//
// -------------------cate_idx, isClass를 가져옴 ---------------//
export default function Tags({idx, isClass}) {

    const [list, setList] = useState([]);

    useEffect(() => {
        if(isClass==='course') {
            drawCourseTags();
        }
        else if(isClass==='restaurant') {
            drawRestaTags();
        }
    }, [idx, isClass]);


    const drawCourseTags = async () => {
        let {data} = await axios.get(`http://192.168.0.120/list_tag/${idx}`);
        const tags = data.list_tag.map((item) => {
            if (item.isClass === 'course') {
                // console.log('코스: ', data);
                return (
                    <div key={item.tag_idx}>
                        <Tag isClass={isClass}
                             name={item.tag_name}
                             drawCourseTags={drawCourseTags}/>
                    </div>
                )
            }
        });
        setList(tags);
    }

    const drawRestaTags=async () => {
        let {data} = await axios.get(`http://192.168.0.120/list_tag/${idx}`);
        const tags = data.list_tag.map((item) => {
            if (item.isClass === 'restaurant') {
                // console.log('식당: ', data);
                return (
                    <div key={item.tag_idx}>
                        <Tag isClass={isClass}
                             name={item.tag_name}
                             drawRestaTags={drawRestaTags}
                        />
                    </div>
                )
            }
        });
        setList(tags);
    }

    return (
        <div className={"right-tags"}>
            <div style={{border:"1px solid lightgrey", padding:"5px", position:"relative"}}>
                <TagInsert isClass={isClass}
                           cate_idx={idx}
                           drawCourseTags={drawCourseTags}
                           drawRestaTags={drawRestaTags} />
            </div>
            <div className={"tagArea"}>
                {list}
            </div>
        </div>
    );
}

// 태그하나하나하나하나
function Tag({name, isClass, drawCourseTags, drawRestaTags}) {

    const del=async ()=>{
        // #태그 지우는 delete 요청 추가
        console.log('del clicked', name);
        if(isClass==='course') {
            let {data}= await axios.post(`http://192.168.0.120/delTag`, {tag_name:name, isClass:'course'});
            drawCourseTags();
        }
        else{
            let {data}=await axios.post('http://192.168.0.120/delTag', {tag_name:name, isClass:'restaurant'});
            drawRestaTags();
        }
    }

    return (
            <div className={"tag-component"}>
              <div className={"tag-name"}>{name}</div>&nbsp;
              <div id={"x"} onClick={()=>del()}>X</div>
            </div>

    );
}