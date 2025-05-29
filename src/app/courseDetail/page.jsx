'use client'

import LeftMenu from "@/app/leftMenu";
import "./courseDetail.css";
import CourseDetail from "@/app/courseDetail/courseDetail";

export default function CourseDetailPage() {

    return (
        <>
            <div className={"pageContainer"}>
                <LeftMenu />
                <div className={"rightMenu"}>
                    <CourseDetail />
                </div>
            </div>
        </>
    );
}