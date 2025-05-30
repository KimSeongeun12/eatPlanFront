// 'use client'
// import LeftMenu from "@/app/leftMenu";
// import CourseWrite from "./courseWrite";
// import {useState} from "react";
// import Write_modal from "./write_modal/page";
//
// export default function WritePage() {
//     const [showModal, setShowModal] = useState(true);
//     const [writeData, setWriteData] = useState(null);
//
//     const handleComplete = (data) => {
//         setWriteData(data);       // 저장
//         setShowModal(false);     // 모달 닫기
//     };
//
//     return (
//         <>
//             {showModal && (
//                 <Write_modal
//                     onClose={() => setShowModal(false)}
//                     onComplete={handleComplete}
//                 />
//             )}
//
//             {/*<LeftMenu />*/}
//             {/*<CourseWrite />*/}
//         </>
//     );
// }

'use client';
import { useState } from 'react';
import StepModal from './write_modal/page';
import LeftMenu from "@/app/leftMenu";
import '../mainCss.css'

export default function WritePage() {
    const [showModal, setShowModal] = useState(true);
    const [formData, setFormData] = useState(null);  // 모달 입력값 저장

    const handleComplete = (data) => {
        setFormData(data);       // 저장
        setShowModal(false);     // 모달 닫기
    };

    return (
        <>
            <LeftMenu />
            {showModal && (
                <StepModal
                    onClose={() => setShowModal(false)}
                    onComplete={handleComplete}
                />
            )}

            {formData && (
                <div style={{ marginTop: '20px' }}>
                    <h2>✅ 입력한 코스 정보</h2>
                    <p><strong>제목:</strong> {formData.timelineStart}</p>
                    <p><strong>설명:</strong> {formData.timelineFinish}</p>
                </div>
            )}
        </>
    );
}
