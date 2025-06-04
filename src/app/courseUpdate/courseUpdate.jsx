'use client'

import {useSearchParams} from "next/navigation";

export default function CourseUpdate() {

    const searchParams = useSearchParams();
    const post_idx = searchParams.get('post_idx');

    return (
        <>
            <div>
                글 번호: {post_idx}
            </div>
        </>
    );
}