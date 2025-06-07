'use client'

import {useSearchParams} from "next/navigation";
import Timeline from "@/app/courseDetail/[slug]/timeline";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import TagModal from "@/app/courseUpdate/tagModal";
import "./tagModal.css";
import CourseAdd_modal from "@/app/write/courseAdd_modal/page";
import StepModalUpdate from "@/app/courseUpdate/update_modal/page";
import {CircularProgress} from "@mui/material";

export default function CourseUpdate() {

    const searchParams = useSearchParams();
    const post_idx = searchParams.get('post_idx');
    const container = useRef(null);
    const [isLoading, setIsLoading] = useState(true);

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
    const [tmpIdx, setTmpIdx] = useState(1);

    const [initialSelectedTags, setInitialSelectedTags] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showTimeModal, setShowTimeModal] = useState(false);
    const canUpdate = true;


    const [detail, setDetail] = useState({
        "post_idx":0,
        "user_id":"",
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
        "tags":[],
        "time":{"timelineStart":"", "timelineFinish":""}});

    // 디테일 정보 가져오기
    const getDetail = () => {
        return axios.get(`http://localhost/courseDetail?post_idx=${post_idx}`).then(({data}) => {
            const d = data.detail;
            const newDetail =
                {
                    "post_idx":d.content.post_idx,
                    "user_id":d.content.user_id,
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
                    "tags":d.tags,
                    "time":{
                        "timelineStart":d.time.start,
                        "timelineFinish":d.time.end
                    }}
            setDetail(newDetail);
        })
        .catch(error => {
            if (error.response && error.response.status === 404) {
                alert("존재하지 않는 코스입니다.");
                location.href = '/list';
            } else {
                alert("데이터를 불러오는 중 오류가 발생했습니다. 서버 혹시 키셨나요?");
                location.href = '/list';
            }
        });
    };

    const user_id = useRef('');
    const [isAuthenticated, setIsAuthenticated] = useState(false); // 로그인 여부
    const [checkingAuth, setCheckingAuth] = useState(true); // 인증 확인 중 여부

    // 페이지 입장시 로그인 여부 확인
    useEffect(() => {
        if (typeof window !== 'undefined') {
            user_id.current = sessionStorage.getItem('user_id');
            if (user_id.current) {
                setIsAuthenticated(true);
            }
            setCheckingAuth(false); // 인증 체크 완료
        }
    }, []);

    // 페이지 입장시 로그인 확인되면 디테일정보 가져오기
    useEffect(() => {
        if (!checkingAuth) {
            getDetail().finally(() => {
                setIsLoading(false);
            });
        }
    }, [checkingAuth]);

    const isFirstLoad = useRef(true);
    useEffect(() => {
        if (isFirstLoad.current && detail.post_idx !== 0) {
            setSubject(detail.subject);

            const normalizedTags = detail.tags.map(tag => ({
                ...tag,
                value: tag.tag_name,
                type: tag.isClass
            }));

            setSelectedTags(normalizedTags);
            setInitialSelectedTags(normalizedTags);  // 초기 상태 따로 저장
            setCourseCmt(detail.post_cmt);
            setTime(detail.time);
            setIsPublic(detail.isPublic);
            isFirstLoad.current = false;
            if ((detail.user_id && user_id.current !== detail.user_id) || !detail.user_id) {
                alert("url로 장난치면 혼나요!");
                location.href="/list";
            }
        }
    }, [detail]);

    // 최신디테일정보가 들어오면 맵에 마커찍기
    useEffect(() => {
        if (!isLoading && container.current) {
            kakao.maps.load(() => {
                const containerEl = container.current;

                const mapOption = {
                    center: new kakao.maps.LatLng(37.570377, 126.985409),
                    level: 3
                };

                const map = new kakao.maps.Map(containerEl, mapOption);
                const bounds = new kakao.maps.LatLngBounds();

                const restaInfoList = [
                    ...detail.content_detail_resta
                        .filter(r => !deletedDetailRestaIds.some(d => d.detail_idx === r.detail_idx))
                        .map(r => r.resta?.[0])
                        .filter(Boolean),
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
        }
    }, [detail, deletedDetailRestaIds, resta]);


    // 코스 삭제버튼
    const courseDelete = (detail) => {
        if (isAuthenticated && user_id.current === detail.user_id){
            const confirmDelete = window.confirm("정말로 코스를 삭제하시겠습니까?");
            if (!confirmDelete) return;
            axios.delete("http://localhost/delete/"
                ,{data:[{post_idx: detail.post_idx}]
                ,headers: { Authorization: sessionStorage.getItem('token') || '' }}).then(({data}) => {
                if (data.success) {
                    location.href = "/list";
                    alert("코스를 삭제 했습니다.")
                }else{
                    alert("삭제에 실패 했습니다.")
                }
            });
        } else {
            alert("비로그인 상태거나 코스 작성자가 아닙니다.");
        }
    }

    // 코스 시간 핸들러
    const handleComplete = (data) => {
        setTime(data);       // 저장
        setShowTimeModal(false);     // 모달 닫기
        console.log("변경된 시간 : ",time);
    };

    // 세부일정 추가 핸들러
    const handleAddCourse = (formData) => {
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
                            img_idx: formData.img_idx
                        }
                    ],
                    start: formData.start || '',
                    comment: formData.comment || '',
                }
            ]);
            setTmpIdx(prev => prev + 1);
            setRestaIdxList(prev => [...prev, formData.selectedRestaIdx]); // ✅ 인덱스 저장
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
        setShowDetailModal(false);
    }

    // 수정완료버튼
    const updateSubmit = () => {

        if (isAuthenticated && user_id.current === detail.user_id) {
            const added = selectedTags.filter(
                tag => !initialSelectedTags.some(init => init.type === tag.type && init.idx === tag.idx)
            );

            const removed = initialSelectedTags.filter(
                init => !selectedTags.some(tag => tag.type === init.type && tag.idx === init.idx)
            );

            const tags = added.map(t => ({
                isClass: t.type,
                idx: t.idx
            }));

            const tags_del = removed.map(t => ({
                isClass: t.type,
                idx: t.idx
            }));

            const payload = {
                content: {subject: subject, user_id: detail.user_id , post_cmt: courseCmt, isPublic: isPublic, tmp: detail.tmp},
                time: {start: time.timelineStart, end: time.timelineFinish},
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

            axios.put(`http://localhost/update/${detail.post_idx}`
                , payload
                , {headers: {Authorization: sessionStorage.getItem('token') || ''}}).then(({data}) => {
                if (data.success) {
                    alert("수정 완료!");
                    location.href = `/courseDetail/${detail.post_idx}`
                } else {
                    alert("변경된 내용이 없습니다.")
                    location.href = `/courseDetail/${detail.post_idx}`
                }
                console.log("tags:", tags);
                console.log("tags_del:", tags_del);
            });
        } else {
            alert("비로그인 상태거나 코스 작성자가 아닙니다.")
        }
    };

    // 리스트로 돌아가기버튼
    const toList = () => {
        location.href = "/list";
    };

    return (
        <>
            <div className={"courseContainer"}>
                {isLoading ? (<CircularProgress />) :
                    (
                        <>
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

                            <span className={"subjectHead"}>
                                코스 제목 ❗ &nbsp;&nbsp;
                                <small>{subject.length} / 66자 제한</small>
                            </span>
                            <input
                                className={"subjectBody"}
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                maxLength={66}
                            />
                            <span className={"tagHead"}>태그 ❗</span>
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

                            <span className={"timelineHead"}>코스 내용 ❗</span>
                            <span className={"timelineBody"}>
                <Timeline
                    timelineStart={time.timelineStart}
                    timelineFinish={time.timelineFinish}
                    noResta={[
                        ...detail.content_detail_cmt.filter(
                            c => !deletedDetailCmtIds.some(d => d.detail_idx === c.detail_idx)
                        ),
                        ...noResta.filter(
                            n => !deletedDetailCmtIds.some(d => d.tmpIdx === n.tmpIdx)
                        )
                    ]}
                    resta={[
                        ...detail.content_detail_resta.filter(
                            r => !deletedDetailRestaIds.some(d => d.detail_idx === r.detail_idx)
                        ),
                        ...resta.filter(
                            r => !deletedDetailRestaIds.some(d => d.tmpIdx === r.tmpIdx)
                        ).filter(r => r.resta)
                    ]}
                    onDeleteDetail={(detailIdx, customResta, tmpIdx) => {
                        if (customResta && Object.keys(customResta).length > 0 && tmpIdx == null) {
                            setDeletedDetailRestaIds(prev => [...prev, {detail_idx:detailIdx}]);
                        } else if (tmpIdx == null){
                            setDeletedDetailCmtIds(prev => [...prev, {detail_idx:detailIdx}]);
                        } else if (customResta && Object.keys(customResta).length > 0 && tmpIdx){
                            setDeletedDetailRestaIds(prev => [...prev, {tmpIdx:tmpIdx}]);
                            setResta(prev => prev.filter(item => item.tmpIdx !== tmpIdx));
                        } else if (tmpIdx) {
                            setDeletedDetailCmtIds(prev => [...prev, {tmpIdx:tmpIdx}]);
                            setNoResta(prev => prev.filter(item => item.tmpIdx !== tmpIdx));
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

                            <span className={"courseCmtHead"}>
                                코스 코멘트 ❗ &nbsp;&nbsp;
                                <small>{courseCmt.length} / 333자 제한</small>
                            </span>
                            <textarea
                                className={"courseCmtBody"}
                                value={courseCmt}
                                onChange={(e) => setCourseCmt(e.target.value)}
                                maxLength={333}></textarea>

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
                        </>
                    )}

            </div>
        </>
    );
}