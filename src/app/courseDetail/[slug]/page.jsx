'use client'

import LeftMenu from "@/app/leftMenu";
import "./courseDetail.css";
import CourseDetail from "@/app/courseDetail/[slug]/courseDetail";

export default function CourseDetailPage({params}) {

    const {slug} = params;

    return (
        <>
            <LeftMenu />
            <div className={"rightMenu"}>
                <CourseDetail post_idx={slug}/>
            </div>
        </>
    );
}