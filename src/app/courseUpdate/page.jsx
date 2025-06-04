'use client'

import LeftMenu from "@/app/leftMenu";
import CourseUpdate from "@/app/courseUpdate/courseUpdate";

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