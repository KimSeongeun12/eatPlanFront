'use client';
import { useState } from 'react';
import StepModal from './write_modal/page';
import LeftMenu from "@/app/leftMenu";
import '../mainCss.css'
import CourseWrite from "@/app/write/courseWrite";

export default function WritePage() {
    const [showModal, setShowModal] = useState(true);
    const [formData, setFormData] = useState(null);  // 모달 입력값 저장

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [courseList, setCourseList] = useState([]);

    const handleAddCourse = (newCourse) => {
        setCourseList(prev => [...prev, newCourse]);
    };

    const handleComplete = (data) => {
        setFormData(data);       // 저장
        setShowModal(false);     // 모달 닫기
    };

    return (
        <>
            {showModal && (
                <StepModal
                    onClose={() => setShowModal(false)}
                    onComplete={handleComplete}
                />
            )}
            <LeftMenu />
            <CourseWrite data={formData} />
        </>
    );
}
