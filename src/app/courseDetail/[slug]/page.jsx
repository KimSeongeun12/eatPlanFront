'use client'

import LeftMenu from "@/app/leftMenu";
import "./courseDetail.css";
import CourseDetail from "@/app/courseDetail/[slug]/courseDetail";



export default function CourseDetailPage({params}) {

    const {slug} = params;

    return (
        <>
            <LeftMenu />
            <CourseDetail post_idx={slug}/>
        </>
    );
}