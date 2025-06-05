'use client'

import {useSearchParams} from "next/navigation";
import Timeline from "@/app/courseDetail/[slug]/timeline";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import TagModal from "@/app/courseUpdate/tagModal";
import "./tagModal.css";
import CourseAdd_modal from "@/app/write/courseAdd_modal/page";
import StepModalUpdate from "@/app/courseUpdate/update_modal/page";

export default function CourseUpdate() {

    const searchParams = useSearchParams();
    const post_idx = searchParams.get('post_idx');
    const container = useRef(null);

    const [subject, setSubject] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);
    const [courseCmt, setCourseCmt] = useState("");
    const [restaIdxList, setRestaIdxList] = useState([]);
    const [resta, setResta] = useState([]);
    const [noResta, setNoResta] = useState([]);
    const [deletedDetailRestaIds, setDeletedDetailRestaIds] = useState([]);
    const [deletedDetailCmtIds, setDeletedDetailCmtIds] = useState([]);
    const [time, setTime] = useState({timelineStart:"",timelineFinish:""});
    const [isPublic, setIsPublic] = useState(true);

    const [initialSelectedTags, setInitialSelectedTags] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showTimeModal, setShowTimeModal] = useState(false);
    const canUpdate = true;


    const [detail, setDetail] = useState({
        "post_idx":0,
        "b_hit":0,
        "post_cmt":"",
        "reg_date":"",
        "star_average":0,
        "subject":"",
        "isPublic":true,
        "blind":false,
        "tmp":false,
        "total_like_count":0,
        "total_comment_count":0,
        "nickname":"",
        "content_detail_cmt":[],
        "content_detail_resta":[],
        "tag_name":[],
        "tag_name_area": [],
        "tags":[],
        "time":{"timelineStart":"", "timelineFinish":""}});

    // 디테일 정보 가져오기
    const getDetail = () => {
        axios.get(`http://localhost/courseDetail?post_idx=${post_idx}`).then(({data}) => {
            const d = data.detail;
            const newDetail =
                {
                    "post_idx":d.content.post_idx,
                    "b_hit":d.content.b_hit,
                    "post_cmt":d.content.post_cmt,
                    "reg_date":d.content.reg_date,
                    "star_average":d.content.star_average,
                    "subject":d.content.subject,
                    "isPublic":d.content.public,
                    "blind":d.content.blind,
                    "tmp":d.content.tmp,
                    "total_like_count":d.content.total_like_count,
                    "total_comment_count":d.content.total_comment_count,
                    "nickname":d.nickname.nickname,
                    "content_detail_cmt":d.content_detail_cmt,
                    "content_detail_resta":d.content_detail_resta,
                    "tag_name":d.tag_name,
                    "tag_name_area": d.tag_name_area,
                    "tags":d.tags,
                    "time":{
                        "timelineStart":d.time.start,
                        "timelineFinish":d.time.end
                    }}
            setDetail(newDetail);
            console.log("받아온 데이터 : ",data);
        });
    };

    // 페이지 입장시 디테일정보 가져오기
    useEffect(() => {
        getDetail();
    }, []);

    const isFirstLoad = useRef(true);
    useEffect(() => {
        if (isFirstLoad.current && detail.post_idx !== 0) {
            const newSelected = detail.tags.map(tag => {
                const isArea = tag.isClass === "area_tag";
                const idx = isArea ? tag.area_tag_idx : tag.tag_idx;

                const name = isArea
                    ? detail.tag_name_area.find(a => a.area_tag_idx === idx)?.tag_name
                    : detail.tag_name.find(t => t.tag_idx === idx)?.tag_name;

                return {
                    type: isArea ? "area" : "tag",
                    value: name || "",   // 못 찾았을 경우 빈 문자열
                    idx,
                    isClass: tag.isClass
                };
            });
            const newInitial = detail.tags.map(tag => ({
                idx: tag.tag_idx ?? tag.area_tag_idx,
                isClass: tag.isClass
            }));

            setSubject(detail.subject);
            setSelectedTags(newSelected);
            setInitialSelectedTags(newInitial); // 초기 상태 따로 저장
            setCourseCmt(detail.post_cmt);
            setTime(detail.time);
            setIsPublic(detail.isPublic);
            isFirstLoad.current = false;
        }
        console.log("받아온 디테일 : ",detail);
    }, [detail]);

    // 최신디테일정보가 들어오면 맵에 마커찍기
    useEffect(() => {
        kakao.maps.load(() => {
            const containerEl = container.current;

            const mapOption = {
                center: new kakao.maps.LatLng(37.570377, 126.985409),
                level: 3
            };

            const map = new kakao.maps.Map(containerEl, mapOption);
            const bounds = new kakao.maps.LatLngBounds();

            // ✅ 삭제된 detail_idx 제외
            const restaInfoList = detail.content_detail_resta
                .filter(r => !deletedDetailRestaIds.includes(r.detail_idx))
                .map(r => r.resta?.[0])
                .filter(Boolean);

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
                const defaultPosition = new kakao.maps.LatLng(37.570377, 126.985409);
                const marker = new kakao.maps.Marker({
                    position: defaultPosition,
                    map,
                    title: "종각역"
                });

                const infoWindow = new kakao.maps.InfoWindow({
                    position: defaultPosition,
                    content: `<div style="padding:5px;font-size:13px;font-weight:bold;">종각역 근처</div>`
                });

                infoWindow.open(map, marker);
            }
        });
    }, [detail, deletedDetailRestaIds]); // ✅ 삭제 ID가 바뀔 때도 재렌더링

    // 코스 삭제버튼
    const courseDelete = (detail) => {
        const confirmDelete = window.confirm("정말로 코스를 삭제하시겠습니까?");
        if (!confirmDelete) return;
        axios.delete("http://localhost/delete/",{data:[{post_idx: detail.post_idx}]}).then(({data}) => {
            if (data.success) {
                location.href = "/list";
                alert("코스를 삭제 했습니다.")
            }else{
                alert("삭제에 실패 했습니다.")
            }
        });
    }

    // 코스 시간 핸들러
    const handleComplete = (data) => {
        setTime(data);       // 저장
        setShowTimeModal(false);     // 모달 닫기
        console.log("변경된 시간 : ",time);
    };

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
                            img_idx: formData.img_idx
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
        setShowDetailModal(false);
    }

    // 수정완료버튼
    const updateSubmit = () => {

        const added = selectedTags.filter(
            tag => !initialSelectedTags.some(init => init.type === tag.type && init.value === tag.value)
        );
        const removed = initialSelectedTags.filter(
            init => !selectedTags.some(tag => tag.type === init.type && tag.value === init.value)
        );

        const tags = added.map(t => ({
            type: t.type,
            isClass: t.isClass,
            idx: t.idx ?? null
        }));

        const tags_del = removed.map(t => ({
            type: t.type,
            isClass: t.isClass,
            idx: t.idx ?? null
        }));

        const payload = {
            content: {subject: subject, post_cmt: courseCmt, isPublic: isPublic, tmp: detail.tmp},
            time: {start:time.timelineStart, end:time.timelineFinish},
            tags,
            tags_del,
            content_detail_resta: resta.map((item, idx) => ({
                resta_idx: restaIdxList[idx], // 선택된 식당 idx
                comment: item.comment || '',
                start: item.start || ''
            })),
            content_detail_cmt: noResta.map(item => ({
                comment: item.comment || '',
                start: item.start || ''
            })),
            content_detail_resta_del: deletedDetailRestaIds,
            content_detail_cmt_del: deletedDetailCmtIds,
        };

        axios.put(`http://localhost/update/${detail.post_idx}`, payload).then(({ data }) => {
            if (data.success){
                alert("수정 완료!");
                location.href=`/courseDetail/${detail.post_idx}`
            }else{
                alert("변경된 내용이 없습니다.")
                location.href=`/courseDetail/${detail.post_idx}`
            }

        });
    };

    // 리스트로 돌아가기버튼
    const toList = () => {
        location.href = "/list";
    };

    console.log("선택된 레스토랑 : ", resta);
    console.log("지워질 디테일(식당) : ", deletedDetailRestaIds);
    console.log("지워질 디테일(코멘트) : ", deletedDetailCmtIds);
    console.log("제목 상태 : ",subject);
    console.log("코스 코멘트 상태 : ",courseCmt);
    console.log("변경된 시간 : ",time);
    console.log("공개여부 : ",isPublic)

    return (
        <>
            <div className={"courseContainer"}>
                <span className={"noHead"}>글 번호</span>
                <span className={"noBody"}>{detail.post_idx}</span>
                <span className={"reg_dateHead"}>작성일</span>
                <span className={"reg_dateBody"}>{detail.reg_date.replace("T", " ").substring(0, 16)}</span>

                <span className={"nicknameHead"}>작성자</span>
                <span className={"nicknameBody"}>{detail.nickname}</span>
                <span className={"b_hitHead"}>조회수</span>
                <span className={"b_hitBody"}>{detail.b_hit}</span>

                <span className={"starAvgHead"}>평점</span>
                <span className={"starAvgBody"}>{detail.star_average}</span>
                <span className={"likeCntHead"}>좋아요</span>
                <span className={"likeCntBody"}>{detail.total_like_count}</span>

                <span className={"subjectHead"}>코스 제목</span>
                <input
                    className={"subjectBody"}
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                />
                <span className={"tagHead"}>태그</span>
                <span className={"tagBody"}>
                    {selectedTags.map(tag => tag.value).join(" ")}
                    <button className={"tagAdd"} onClick={() => setShowModal(true)}>태그 추가</button>
                </span>

                {showModal && (
                        <TagModal
                            selectedTags={selectedTags}
                            onApply={(selected) => {
                            setSelectedTags(selected);
                            setShowModal(false);
                        }} onCancel={() => setShowModal(false)}/>
                )}

                <span className={"timelineHead"}>코스 내용</span>
                <span className={"timelineBody"}>
                <Timeline
                    timelineStart={time.timelineStart}
                    timelineFinish={time.timelineFinish}
                    noResta={[
                        ...detail.content_detail_cmt.filter(
                            c => !deletedDetailCmtIds.includes(c.detail_idx)
                        ),
                        ...noResta
                    ]}
                    resta={[
                        ...detail.content_detail_resta.filter(
                            r => !deletedDetailRestaIds.includes(r.detail_idx)
                        ),
                        ...resta.filter(r => r.resta)
                    ]}
                    onDeleteDetail={(detailIdx, type) => {
                        if (type === 'resta') {
                            setDeletedDetailRestaIds(prev => [...prev, detailIdx]);
                        } else {
                            setDeletedDetailCmtIds(prev => [...prev, detailIdx]);
                        }
                    }}
                    canUpdate={canUpdate}
                />
                </span>
                <div className={"actionButtons"}>
                    <button onClick={() => setShowTimeModal(true)} className="timeUpdate">
                        코스 시간 변경
                    </button>
                    {showTimeModal && (
                        <StepModalUpdate
                            onClose={() => setShowTimeModal(false)}
                            onComplete={handleComplete}
                        />
                    )}
                    <button onClick={() => setShowDetailModal(true)} className="detailUpdate">
                        일정 추가
                    </button>
                    {showDetailModal && (
                        <CourseAdd_modal
                            onClose={() => setShowDetailModal(false)}
                            onSubmit={handleAddCourse}
                        />
                    )}
                </div>

                <span className={"mapHead"}>식당 위치 정보</span>
                <span className={"mapBody"}>
                    <div className={"kakaoWrapper"}>
                        <div id="map" ref={container} style={{ width: "100%", height: "100%" }}></div>
                    </div>
                </span>

                <span className={"courseCmtHead"}>코스 코멘트</span>
                <textarea
                    className={"courseCmtBody"}
                    value={courseCmt}
                    onChange={(e) => setCourseCmt(e.target.value)}></textarea>

                <div className={"btns"}>
                    <div className="isPublic">
                        <label>
                            <input
                                type="radio"
                                name="isPublic"
                                value="public"
                                checked={isPublic}
                                onChange={() => setIsPublic(true)}
                            />
                            공개
                        </label>
                        <label style={{ marginLeft: "10px" }}>
                            <input
                                type="radio"
                                name="isPublic"
                                value="private"
                                checked={!isPublic}
                                onChange={() => setIsPublic(false)}
                            />
                            비공개
                        </label>
                    </div>
                    <span className={"update"} onClick={()=>updateSubmit()}>수정 완료</span>
                    <span className={"delete"} onClick={()=>courseDelete(detail)}>삭제</span>
                    <span className={"toList"} onClick={()=>toList()}>메인페이지</span>
                </div>
            </div>
        </>
    );
}