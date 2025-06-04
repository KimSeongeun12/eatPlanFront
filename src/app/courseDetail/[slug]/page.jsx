'use client'

import LeftMenu from "@/app/leftMenu";
import "./courseDetail.css";
import CourseDetail from "@/app/courseDetail/[slug]/courseDetail";
import {use} from "react";

export default function CourseDetailPage({params}) {

    const {slug} = use (params);

    return (
        <>
            <LeftMenu />
            <div className={"rightMenu"}>
                <CourseDetail post_idx={slug}/>
            </div>
        </>
    );
}