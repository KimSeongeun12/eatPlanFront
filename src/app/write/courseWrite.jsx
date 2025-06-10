'use client'
import './courseWriteCss.css';
import './courseAdd_modal/courseAdd_modalCss.css';
import '../courseDetail/[slug]/courseDetail.css';
import {useEffect, useRef, useState} from 'react';
import CourseAdd_modal from './courseAdd_modal/page';
import {Timeline} from "@/app/courseDetail/[slug]/courseDetail";
import TagComponent from "@/app/write/tagComponent";
import TempModal from "@/app/write/tempModal";
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
    const [tmpIdx, setTmpIdx] = useState(1);
    const [deletedDetailRestaIds, setDeletedDetailRestaIds] = useState([]);
    const [deletedDetailCmtIds, setDeletedDetailCmtIds] = useState([]);
    const canUpdate = true;

    const container = useRef(null);

    // 지도정보
    useEffect(() => {
        kakao.maps.load(() => {
            const containerEl = container.current;

            const mapOption = {
                center: new kakao.maps.LatLng(37.570377, 126.985409),
                level: 3
            };

            const map = new kakao.maps.Map(containerEl, mapOption);
            const bounds = new kakao.maps.LatLngBounds();

            const restaInfoList = [
                ...resta
                    .filter(r => !deletedDetailRestaIds.some(d => d.tmpIdx === r.tmpIdx))
                    .map(r => r.resta?.[0])
                    .filter(Boolean)
            ];

            if (restaInfoList.length > 0) {
                restaInfoList.forEach(restaInfo => {
                    if (restaInfo?.lat && restaInfo?.lng) {
                        const position = new kakao.maps.LatLng(restaInfo.lat, restaInfo.lng);

                        const marker = new kakao.maps.Marker({
                            position,
                            map
                        });

                        const infoWindow = new kakao.maps.InfoWindow({
                            position,
                            content: `<div style="padding:5px;font-size:13px;font-weight:bold;">${restaInfo.resta_name}</div>`
                        });

                        infoWindow.open(map, marker);
                        bounds.extend(position);
                    }
                });

                map.setBounds(bounds);
            } else {
                // ✅ 현재 위치 사용
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(position => {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                        const userPosition = new kakao.maps.LatLng(lat, lng);

                        const marker = new kakao.maps.Marker({
                            position: userPosition,
                            map,
                            title: "현재 위치"
                        });

                        const infoWindow = new kakao.maps.InfoWindow({
                            position: userPosition,
                            content: `<div style="padding:5px;font-size:13px;font-weight:bold;">현재 내 위치입니다. 식당일정을 추가해 보세요!</div>`
                        });

                        infoWindow.open(map, marker);
                        map.setCenter(userPosition);
                    }, () => {
                        // ✅ 실패 시 fallback
                        showDefaultMarker(map);
                    });
                } else {
                    // ✅ 브라우저에서 geolocation 지원 안할 때 fallback
                    showDefaultMarker(map);
                }
            }

            function showDefaultMarker(map) {
                const defaultPosition = new kakao.maps.LatLng(38.0761111, 128.0963889);
                const marker = new kakao.maps.Marker({
                    position: defaultPosition,
                    map,
                    title: "대한민국 정중앙"
                });

                const infoWindow = new kakao.maps.InfoWindow({
                    position: defaultPosition,
                    content: `<div style=
                                            padding:8px;
                                            font-size:13px;
                                            font-weight:bold;
                                            background-color:white;
                                            border:1px solid #ccc;
                                            border-radius:8px;
                                            max-width:220px;
                                            word-break:break-word;
                                            white-space:normal;
                                        ">
                                        식당일정도 없고 위치정보 허용도 안해주셨군요! 대한민국 정중앙이에요!
                                        </div>`
                });

                infoWindow.open(map, marker);
                map.setCenter(defaultPosition);
            }
        });
    }, [deletedDetailRestaIds, resta]);

    // 코스 추가 핸들러
    const handleAddCourse = (formData) => {
        console.log("모달에서 넘어온 최종 formData:", formData); // media: "http://localhost/imageIdx/1"
        if (formData.resta_name && formData.resta_name.trim() !== "") {
            // timeline_resta_name 에 값이 존재할 경우
            // timeline_time, timeline_coment, timeline_resta_name, url을 resta 에 저장
            setResta(prev => [
                ...prev,
                {
                    tmpIdx: tmpIdx,
                    resta: [
                        {
                            lat: formData.lat,
                            lng: formData.lng,
                            resta_name: formData.resta_name,
                            url: formData.url || '',
                            media: formData.media || '',
                            img_idx: formData.img_idx || null,
                        }
                    ],
                    start: formData.start || '',
                    comment: formData.comment || '',
                }
            ]);
            setTmpIdx(prev => prev + 1);
            setRestaIdxList(prev => [...prev, formData.selectedRestaIdx]);
        } else {
            // timeline_resta_name 이 null 일 경우 timeline_time, timeline_coment 만 noResta 에 저장
            setNoResta(prev => [
                ...prev,
                {
                    tmpIdx: tmpIdx,
                    start: formData.start || '',
                    comment: formData.comment || '',
                }
            ]);
            setTmpIdx(prev => prev + 1);
        }
        setIsModalOpen(false);
    }
    
    // 임시저장 기능
    const tempSave = () => {}
    
    // 임시저장 불러오기 기능
    const tempLoad = () => {}

    const [isTempModalOpen, setIsTempModalOpen] = useState(false);

    // 선택된 세부일정 시작시간들
    const combinedTimes = [
        ...resta.map(item => item.start),
        ...noResta.map(item => item.start),
    ];

    return (
        <>
            <div className="course_rightMenu">
                <button onClick={() => setIsTempModalOpen(true)} className="courseWrite_button">임시저장 불러오기</button>
                <button className="courseWrite_button">임시저장</button>

                <TempModal
                    isOpen={isTempModalOpen}
                    onClose={() => setIsTempModalOpen(false)}
                />

                <table className="courseWrite_table_one">
                    <tbody>
                    <tr className={"courseWrite_tr_subject"}>
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
                                          noResta={[
                                              ...noResta.filter(
                                                  n => !deletedDetailCmtIds.some(d => d.tmpIdx === n.tmpIdx)
                                              )
                                          ]}
                                          resta={[
                                              ...resta.filter(
                                                  r => !deletedDetailRestaIds.some(d => d.tmpIdx === r.tmpIdx)
                                              ).filter(r => r.resta)
                                          ]}
                                          onDeleteDetail={(detailIdx, customResta, tmpIdx) => {
                                              if (customResta && Object.keys(customResta).length > 0 && tmpIdx){
                                                  setDeletedDetailRestaIds(prev => [...prev, {tmpIdx:tmpIdx}]);
                                                  setResta(prev => prev.filter(item => item.tmpIdx !== tmpIdx));
                                              } else if (tmpIdx) {
                                                  setDeletedDetailCmtIds(prev => [...prev, {tmpIdx:tmpIdx}]);
                                                  setNoResta(prev => prev.filter(item => item.tmpIdx !== tmpIdx));
                                              }
                                          }}
                                          canUpdate={canUpdate}
                                />
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>

                <button onClick={() => setIsModalOpen(true)} className="courseWrite_button">
                    일정 추가
                </button>

                {isModalOpen && (
                    <CourseAdd_modal
                        onClose={() => setIsModalOpen(false)}
                        onSubmit={handleAddCourse}
                        timelineStart={timelineStart}
                        timelineFinish={timelineFinish}
                        combinedTimes={combinedTimes}
                    />
                )}

                <table className="courseWrite_table_two">
                    <tbody>
                    <tr className={"courseWrite_tr_wrapper"}>
                        <td colSpan={2}>
                            지도
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2} className="courseWrite_td">
                            <div className={"kakaoWrapper"}>
                                <div id="map" ref={container} style={{ width: "100%", height: "100%" }}></div>
                            </div>
                        </td>
                    </tr>
                    <tr className={"courseWrite_tr_comment"}>
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
                    <tr className={"courseWrite_tr_public"}>
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
                    <tr className={"courseWrite_tr_tag"}>
                        <td colSpan={2}>
                            태그 (최대 5개까지 선택 가능)<span style={style}> *</span>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2} className="courseWrite_td_tag">
                            <div>
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
