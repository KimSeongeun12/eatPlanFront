'use client'
import './tagManager.css'
import {useEffect, useRef, useState} from "react";
import CourseTagManager from "@/app/admin/courseTag";

export default function TagManagement(){

    const [component, setComponent] = useState(null);

    const toggle=(e)=>{
        console.log(e.target.id);
        switch(e.target.id){
            case "course":
                setComponent(<CourseTagManager/>);
                break;
            case "restaurant":
                break;
            case "restaurant_tags":
                break;
        }
    }

    return(
        <div>
            <br/>
            <div className={"tag tab"}>
                <div id={'course'} onClick={(e)=>toggle(e)}>코스 태그 관리</div>
                <div id={'restaurant'} onClick={(e)=>toggle(e)}>식당 태그 관리</div>
                <div id={'restaurant_tags'} onClick={(e)=>toggle(e)}>식당 별 태그 관리</div>
            </div>
            {component}
        </div>
    );
}