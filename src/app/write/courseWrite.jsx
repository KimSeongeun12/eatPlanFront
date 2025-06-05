'use client'
import './courseWriteCss.css';
import './courseAdd_modal/courseAdd_modalCss.css';
import {useEffect, useRef, useState} from 'react';
import CourseAdd_modal from './courseAdd_modal/page';
import {Timeline} from "@/app/courseDetail/[slug]/courseDetail";
import KakaoMap from "@/app/write/kakaoMap";
import TagComponent from "@/app/write/tagComponent";
import axios from "axios";

export default function CourseWrite({data}) {
    const style = {
        color: '#FF0000',
    };

    const user_id = useRef('');
    useEffect(() => {
        user_id.current = sessionStorage.getItem('user_id');
    }, []);

    const [coursePost, setCoursePost] = useState({
        user_id: user_id,
        subject: '',
        post_cmt: '',
        isPublic: true,
    });

    const [selectedTags, setSelectedTags] = useState({
        area: [],
        tag: [],
        combined: []
    });

    const input = (e) => {
        const { name, value, type } = e.target;
        setCoursePost(prev => ({
            ...prev,
            [name]: type === 'radio' ? value === 'true' : value
        }));
    };

    const [restaIdxList, setRestaIdxList] = useState([]);

    const handelCourseSubmit = async () => {
        try {
            const payload = {
                content: {
                    user_id: user_id.current,
                    subject: coursePost.subject,
                    post_cmt: coursePost.post_cmt,
                    isPublic: coursePost.isPublic,
                    tmp: false // 필요 시
                },
                content_detail_resta: resta.map((item, idx) => ({
                    resta_idx: restaIdxList[idx], // 선택된 식당 idx
                    comment: item.comment || '',
                    start: item.start || ''
                })),
                content_detail_cmt: noResta.map(item => ({
                    comment: item.comment || '',
                    start: item.start || ''
                })),
                tags: selectedTags.combined, // 태그 리스트
                time: {
                    start: timelineStart,
                    end: timelineFinish
                }
            };
            const response = await axios.post('http://localhost/regist_write', payload);
            console.log("코스 등록 성공: ", response.data);
            if (response.data.success === true) {
                alert("코스 등록에 성공했습니다.");
                location.href="./list";
            }
        } catch (error) {
            console.error("코스 등록 실패: ", error);
            alert("코스 등록에 실패했습니다.");
        }
    }

    const handleTagChange = (selection) => {
        setSelectedTags(selection);
        console.log("선택한 태그:", selection);
    };

    const {timelineStart, timelineFinish} = data || {
        timelineStart: "00:00",
        timelineFinish: "23:00"
    };

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [resta, setResta] = useState([]);
    const [noResta, setNoResta] = useState([]);

    // 코스 추가 핸들러
    const handleAddCourse = (formData) => {
        if (formData.resta_name && formData.resta_name.trim() !== "") {
            // timeline_resta_name 에 값이 존재할 경우
            // timeline_time, timeline_coment, timeline_resta_name, url을 resta 에 저장
            setResta(prev => [
                ...prev,
                {
                    resta: [
                        {
                            resta_name: formData.resta_name,
                            url: formData.url || '',
                            media: formData.media || '',
                        }
                    ],
                    start: formData.start || '',
                    comment: formData.comment || '',
                }
            ]);
            setRestaIdxList(prev => [...prev, formData.selectedRestaIdx]); // ✅ 인덱스 저장
        } else {
            // timeline_resta_name 이 null 일 경우 timeline_time, timeline_coment 만 noResta 에 저장
            setNoResta(prev => [
                ...prev,
                {
                    start: formData.start || '',
                    comment: formData.comment || '',
                }
            ]);
        }
        setIsModalOpen(false);
    }

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
                            <input type="text"
                                   name={"subject"}
                                   value={coursePost.subject}
                                   onChange={input}
                                   className="courseWrite_subject"/>
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
                                          resta={resta}
                                          noResta={noResta}
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
                            <div className="courseWrite_uploadDiv">
                                {/*{resta.length > 0 && (*/}
                                {/*    <KakaoMap address={resta[0].resta[0].resta_name} />*/}
                                {/*)}*/}
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2} className="courseWrite_td">개인 코멘트 입력</td>
                    </tr>
                    <tr>
                        <td colSpan={2} className="courseWrite_td">
                            <textarea className="courseWrite_textarea"
                                      name={"post_cmt"}
                                      value={coursePost.post_cmt}
                                      onChange={input} />
                        </td>
                    </tr>
                    <tr>
                        <td className="courseWrite_td_public">
                            공개 및 비공개 여부<span style={style}> *</span>
                        </td>
                        <td className="courseWrite_td_radio">
                            <input type="radio"
                                   name={"isPublic"}
                                   value={"true"}
                                   checked={coursePost.isPublic === true}
                                   onChange={input} />공개&nbsp;
                            <input type="radio"
                                   name={"isPublic"}
                                   value={"false"}
                                   checked={coursePost.isPublic === false}
                                   onChange={input} />비공개
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2} className="courseWrite_td">
                            태그 (최대 5개까지 선택 가능)<span style={style}> *</span>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2} className="courseWrite_td">
                            <div className="courseWrite_uploadDiv_">
                                <TagComponent selectTag={handleTagChange} />
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>

                <button onClick={handelCourseSubmit} className="courseWrite_button">코스 등록</button>
            </div>
        </>
    );
}
