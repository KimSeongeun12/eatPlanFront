'use client'
import './courseWriteCss.css';
import './courseAdd_modal/courseAdd_modalCss.css';
import {useEffect, useState} from 'react';
import CourseAdd_modal from './courseAdd_modal/page';
import {Chrono} from "react-chrono";
import {Timeline} from "@/app/courseDetail/[slug]/courseDetail";

export default function CourseWrite({ data }) {
    const { timelineStart, timelineFinish } = data || {timelineStart: "00:00", timelineFinish: "23:00"};
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [courseList, setCourseList] = useState([]);

    const {timeline_resta_name, resta, noResta, timeline_time, timeline_coment}
        = data || {
        timeline_resta_name: "",
        resta: "",
        noResta: "선택 안됨",
        timeline_time: "",
        timeline_coment: "",
    };

    const style = {
        color: '#FF0000',
    };

    const handleAddCourse = (formData) => {
        setCourseList((prev) => [
            ...prev,
            {
                description: formData.description || '설명 없음',
                visualCategory: formData.visualCategory || 'red',
            },
        ]);
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="course_rightMenu">
                <button className="courseWrite_button">임시저장 불러오기</button>
                <button className="courseWrite_button">임시저장</button>

                <table className="courseWrite_table_one">
                    <tbody>
                    <tr>
                        <td className="courseWrite_td_subject">
                            제목<span style={style}> *</span>
                        </td>
                        <td className="courseWrite_td">
                            <input type="text" className="courseWrite_subject" />
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2} className="courseWrite_td">
                            코스 등록<span style={style}> *</span>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2} className="courseWrite_td">
                            <div className="courseWrite_uploadDiv">
                                <Timeline timelineStart={timelineStart}
                                          timelineFinish={timelineFinish}
                                          timelineRestaName={timeline_resta_name}
                                          resta={resta}
                                          noResta={noResta}
                                          timelineTime={timeline_time}
                                          timelineComent={timeline_coment}
                                />
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>

                <button onClick={() => setIsModalOpen(true)} className="courseWrite_button">
                    코스 추가
                </button>

                {isModalOpen && (
                    <CourseAdd_modal
                        onClose={() => setIsModalOpen(false)}
                        onSubmit={handleAddCourse}
                    />
                )}

                <table className="courseWrite_table_two">
                    <tbody>
                    <tr>
                        <td colSpan={2} className="courseWrite_td">
                            지도 상세보기 (1개 이상의 코스가 등록될 시 자동으로 추가됩니다.)
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2} className="courseWrite_td">
                            <div className="courseWrite_uploadDiv"></div>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2} className="courseWrite_td">개인 코멘트 입력</td>
                    </tr>
                    <tr>
                        <td colSpan={2} className="courseWrite_td">
                            <textarea className="courseWrite_textarea" />
                        </td>
                    </tr>
                    <tr>
                        <td className="courseWrite_td_public">
                            공개 및 비공개 여부<span style={style}> *</span>
                        </td>
                        <td className="courseWrite_td_radio">
                            <input type="radio" />공개&nbsp;
                            <input type="radio" />비공개
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2} className="courseWrite_td">
                            태그 (최대 5개까지 선택 가능)<span style={style}> *</span>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2} className="courseWrite_td">
                            <div className="courseWrite_uploadDiv"></div>
                        </td>
                    </tr>
                    </tbody>
                </table>

                <button className="courseWrite_button">코스 등록</button>
            </div>
        </>
    );
}
