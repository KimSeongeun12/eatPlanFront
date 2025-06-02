'use client'

import {useEffect, useRef, useState} from "react";
import dynamic from "next/dynamic";
import axios from "axios";

export default function CourseDetail({post_idx}) {

    const container = useRef(null);
    const [detail, setDetail] = useState({
        "post_idx":0,
        "b_hit":0,
        "post_cmt":"",
        "reg_date":"",
        "star_average":0,
        "subject":"",
        "blind":false,
        "tmp":false,
        "total_like_count":0,
        "total_comment_count":0,
        "nickname":"",
        "content_detail_cmt":[],
        "content_detail_resta":[],
        "tag_name":[],
        "tag_name_area": [],
        "time":{"start":"", "end":""}});

    // 디테일 정보 가져오기
    const getDetail = () => {
        axios.get(`http://localhost/courseDetail?post_idx=${post_idx}`).then(({data}) => {
            console.log(data);
            let d = data.detail;
            setDetail(
                {
                    "post_idx":d.content.post_idx,
                    "b_hit":d.content.b_hit,
                    "post_cmt":d.content.post_cmt,
                    "reg_date":d.content.reg_date,
                    "star_average":d.content.star_average,
                    "subject":d.content.subject,
                    "blind":d.content.blind,
                    "tmp":d.content.tmp,
                    "total_like_count":d.content.total_like_count,
                    "total_comment_count":d.content.total_comment_count,
                    "nickname":d.nickname.nickname,
                    "content_detail_cmt":d.content_detail_cmt,
                    "content_detail_resta":d.content_detail_resta,
                    "tag_name":d.tag_name,
                    "tag_name_area": d.tag_name_area,
                    "time":{
                        "start":d.time.start,
                        "end":d.time.end
                    }}
            );
        });
    };

    // 페이지 입장시 디테일정보 가져오기
    useEffect(() => {
        getDetail();
    }, []);

    // 디테일정보가 들어오면 맵에 마커찍기
    useEffect(() => {
        kakao.maps.load(() => {
            const containerEl = container.current;

            // 지도 생성 기본 옵션
            let mapOption = {
                center: new kakao.maps.LatLng(37.570377, 126.985409), // 기본 중심: 종각역
                level: 3
            };

            const map = new kakao.maps.Map(containerEl, mapOption);
            const bounds = new kakao.maps.LatLngBounds();

            const restaInfoList = detail.content_detail_resta.map(r => r.resta?.[0]).filter(Boolean);

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

                // 모든 마커 포함되도록 범위 설정
                map.setBounds(bounds);
            } else {
                // ✅ 식당 정보 없을 경우 종각역에 기본 마커 표시
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
    }, [detail]);

    // 코스 신고버튼
    const courseReport = (detail) => {
        const queryParts = ["isClass=course", `idx=${detail.post_idx}`, `nickname=${detail.nickname}`].join("&");
        const url = `/courseWrite?${queryParts}`
        location.href = url;
    };

    // 코스 수정버튼
    const courseUpdate = (detail) => {
        const url = `/courseUpdate?post_idx=${detail.post_idx}`;
        location.href = url;
    };

    // 코스 삭제버튼
    const courseDelete = (detail) => {
        axios.delete("http://localhost/delete/",{data:[{post_idx: detail.post_idx}]}).then(({data}) => {
            if (data.success) {
                location.href = "/list";
                alert("코스를 삭제 했습니다.")
            }else{
                alert("삭제에 실패 했습니다.")
            }
        });
    }

    // 리스트로 돌아가기버튼
    const toList = () => {
        location.href = "/list";
    };

    return (
        <>
            <div className={"courseContainer"}>
                <span className={"noHead"}>글 번호</span>
                <span className={"noBody"}>{post_idx}</span>
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
                <span className={"subjectBody"}>{detail.subject}</span>
                <span className={"tagHead"}>태그</span>
                <span className={"tagBody"}>
                    {detail.tag_name_area.map(tag => tag.tag_name).join(" ")}
                    {" "}
                    {detail.tag_name.map(tag => tag.tag_name).join(" ")}
                </span>

                <span className={"timelineHead"}>코스 내용</span>
                <span className={"timelineBody"}>
                    <Timeline timelineStart={detail.time.start}
                              timelineFinish={detail.time.end}
                              noResta = {detail.content_detail_cmt}
                              resta = {detail.content_detail_resta}/>
                </span>

                <span className={"mapHead"}>식당 위치 정보</span>
                <span className={"mapBody"}>
                    <div className={"kakaoWrapper"}>
                        <div id="map" ref={container} style={{ width: "100%", height: "100%" }}></div>
                    </div>
                </span>

                <span className={"courseCmtHead"}>코스 코멘트</span>
                <span className={"courseCmtBody"}>{detail.post_cmt}</span>

                <div className={"btns"}>
                    <span className={"report"} onClick={()=>courseReport(detail)}>신고</span>
                    <span className={"update"} onClick={()=>courseUpdate(detail)}>수정</span>
                    <span className={"delete"} onClick={()=>courseDelete(detail)}>삭제</span>
                    <span className={"toList"} onClick={()=>toList()}>메인페이지</span>
                </div>

                <div className={"rates"}>
                    <span className={"like"}>❤️좋아요({detail.total_like_count})</span>
                    <div className={"stars"}>
                        <label><input className={"star"} type={"radio"} value={1}/>⭐</label>
                        <label><input className={"star"} type={"radio"} value={2}/>⭐⭐</label>
                        <label><input className={"star"} type={"radio"} value={3}/>⭐⭐⭐</label>
                        <label><input className={"star"} type={"radio"} value={4}/>⭐⭐⭐⭐</label>
                        <label><input className={"star"} type={"radio"} value={5}/>⭐⭐⭐⭐⭐</label>
                    </div>
                </div>

                <div className={"comment"}>
                    <input className={"commentBox"}
                           type={"text"}
                           placeholder={"댓글을 입력해 보세요."}/>
                    <span className={"commentBtn"}>등록</span>
                </div>

                <div className={"commentList"}>
                    <div className={"comment2"}>
                        <span className={"nickname"}>의심이많은아이</span>
                        <span className={"commentContent"}>진짜로 재밌었음? 재미없어보이는데 만약 댓글 내용이 길다면?만약 댓글 내용이 길다면?만약 댓글 내용이 길다면?만약 댓글 내용이 길다면?만약 댓글 내용이 길다면?만약 댓글 내용이 길다면?만약 댓글 내용이 길다면?</span>
                        <span className={"reg_date"}>2025-05-29</span>
                    </div>
                    <div className={"commentBtns"}>
                        <span className={"cmtReport"}>신고</span>
                        <span className={"cmtDelete"}>삭제</span>
                        <span className={"cmtUpdate"}>수정</span>
                    </div>
                    <div className={"commentLineWrapper"}>
                        <div className={"commentLine"}></div>
                    </div>
                </div>
            </div>
        </>
    );
}

const Timeline = dynamic(() => import('./timeline'), {
    ssr: false
});

export {Timeline};