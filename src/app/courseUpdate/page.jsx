'use client'

import LeftMenu from "@/app/leftMenu";
import CourseUpdate from "@/app/courseUpdate/courseUpdate";
import "../courseDetail/[slug]/courseDetail.css";

export default function CourseUpdatePage() {


    return (
        <>
            <LeftMenu/>
            <div className={"rightMenu"}>
                <CourseUpdate/>
            </div>
        </>
    );
}