'use client'

import {useEffect, useRef, useState} from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import {Pagination, Stack} from "@mui/material";

export default function CourseDetail({post_idx}) {

    const [page, setPage] = useState(1);
    const itemsPerPage = 10;
    const [cmt, setCmt] = useState([]);
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
            const d = data.detail;
            const newDetail =
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
            setDetail(newDetail);
            checkLikeStatus(d.content.post_idx);
            cmtList(d.content.post_idx);
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
        const url = `/reportWrite?${queryParts}`
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

    // 좋아요 체크
    // 게시글일 경우
    const [likedByMe, setLikedByMe] = useState(false);
    const checkLikeStatus = (post_idx) => {
        axios.get(`http://localhost/like_check?post_idx=${post_idx}&user_id=test_user&isClass=course`)
            .then(({data}) => {
                setLikedByMe(data.liked === true);
            });
    };

    // 댓글일경우
    const [cmtLikedByMe, setCmtLikedByMe] = useState(false);
    const checkCommentLikeStatus = async (cmt_idx) => {
        const { data } = await axios.get(`http://localhost/like/check`, {
            params: {
                user_id: currentUserId,
                isClass: 'comment',
                cmt_idx: cmt_idx
            }
        }).then(({data}) => {
            setCmtLikedByMe(data.liked === true);
        });

        return data.liked === true;
    };

    // 좋아요 누르기
    const likeToggle = () => {
        axios.post("http://localhost/like",{user_id:"test_user", isClass:"course", post_idx:detail.post_idx})
            .then(({data}) => {
                if (data.success) {
                    setLikedByMe(prev => !prev);
                    setDetail(prev => ({
                        ...prev,
                        total_like_count: prev.total_like_count + (likedByMe ? -1 : 1)
                    }));
                }
            })
    };
    const cmtLikeToggle = (cmt_idx) => {
        axios.post("http://localhost/like",{data:{user_id:"test_user", isClass:"comment", cmt_idx:cmt_idx}})
            .then(({data}) => {
                if (data.success) {
                    setLikedByMe(prev => !prev);
                    setDetail(prev => ({
                        ...prev,
                        total_like_count: prev.total_like_count + (likedByMe ? -1 : 1)
                    }));
                }
            })
    };

    // 별점 밸류 가져오기
    const [selectedStar, setSelectedStar] = useState(null);
    const starValue = (e) => {
        setSelectedStar(Number(e.target.value));
    };

    // 별점 먹이기
    const submitStar = () => {
        if (selectedStar == null) {
            alert("별점을 선택해주세요!");
            return;
        }
        axios.post("http://localhost/star",{user_id:"test_user", post_idx:detail.post_idx, star:selectedStar})
            .then(({data}) => {
                if (data.success) {
                    alert("별점이 등록됐습니다. 갱신된 평균을 보려면 새로고침하세요!")
                }
            })
    };

    // 댓글 불러오기
    const cmtList = (post_idx) => {
        axios.get(`http://localhost/comment_list?post_idx=${post_idx}&page=${page}`)
            .then(({data}) => {
                setCmt(Array.isArray(data.list.comments) ? data.list.comments : []);
                console.log("댓글목록 : ",data);
            })
    };

    // 페이지당 댓글 갯수
    const indexOfLastItem = page * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCmt = cmt.slice(indexOfFirstItem, indexOfLastItem);

    // 댓글 신고 버튼
    const cmtReport = (item) => {
        const queryParts = ["isClass=comment", `idx=${item.comment_idx}`, `nickname=${item.nickname}`].join("&");
        const url = `/reportWrite?${queryParts}`
        location.href = url;
    };

    // 댓글 삭제 버튼
    const cmtDel = (item) => {
        axios.delete(`http://localhost/comment_del?comment_idx=${item.comment_idx}`).then(({data}) => {
            if (data.success) {
                cmtList(post_idx);
                alert("댓글을 삭제 했습니다.")
            }else{
                alert("삭제에 실패 했습니다.")
            }
        });
    };

    // 댓글 수정 버튼
    const cmtUpdate = (item) => {

    };

    // 댓글 작성 버튼
    const [cmtContent, setCmtContent] = useState("");
    const submitCmt = () => {
        if (cmtContent.trim() === "") {
            alert("댓글을 입력해주세요");
            return;
        }
        axios.post("http://localhost/comment_insert"
            ,{user_id:"test_user", post_idx:detail.post_idx, content:cmtContent})
            .then(({data}) => {
                if (data.success) {
                    alert("댓글이 등록되었습니다.")
                    setCmtContent("");
                    cmtList(detail.post_idx);
                }
            })
    };

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
                    <span className={"like"} onClick={()=>likeToggle()}>
                        {likedByMe ? "❤️ 좋아요" : "🤍 좋아요"}({detail.total_like_count})
                    </span>
                    <div className={"stars"}>
                        <label>
                            <input
                                className={"star"}
                                type={"radio"}
                                name={"starRating"}
                                value={1}
                                onChange={starValue}/>⭐
                        </label>
                        <label>
                            <input
                                className={"star"}
                                type={"radio"}
                                name={"starRating"}
                                value={2}
                                onChange={starValue}/>⭐⭐
                        </label>
                        <label>
                            <input
                                className={"star"}
                                type={"radio"}
                                name={"starRating"}
                                value={3}
                                onChange={starValue}/>⭐⭐⭐
                        </label>
                        <label>
                            <input
                                className={"star"}
                                type={"radio"}
                                name={"starRating"}
                                value={4}
                                onChange={starValue}/>⭐⭐⭐⭐
                        </label>
                        <label>
                            <input
                                className={"star"}
                                type={"radio"}
                                name={"starRating"}
                                value={5}
                                onChange={starValue}/>⭐⭐⭐⭐⭐
                        </label>
                        <span onClick={()=>submitStar()}>별점주기</span>
                    </div>
                </div>

                <div className={"comment"}>
                    <textarea
                        className={"commentBox"}
                        placeholder="댓글을 입력하세요."
                        rows="3"
                        name={"cmtContent"}
                        value={cmtContent}
                        onChange={(e) => setCmtContent(e.target.value)}>
                    </textarea>
                    <span className={"commentBtn"} onClick={()=>submitCmt()}>등록</span>
                </div>

                <div className={"commentList"}>
                    {cmt.length > 0? (
                            <>
                                {currentCmt.map((item, index) => (
                                    <div className={"comment2"} key={index}>
                                        <span className={"nickname"}>{item.nickname}</span>
                                        <span className={"commentContent"}>{item.content}</span>
                                        <span className={"reg_date"}>{item.reg_date.replace("T", " ").substring(0, 16)}</span>
                                        <div className={"commentBtns"}>
                                            <span className={"cmtReport"} onClick={()=>cmtReport(item)}>신고</span>
                                            <span className={"cmtDelete"} onClick={()=>cmtDel(item)}>삭제</span>
                                            <span className={"cmtUpdate"} onClick={()=>cmtUpdate(item)}>수정</span>
                                        </div>
                                        <div className={"commentLineWrapper"}>
                                            <div className={"commentLine"}></div>
                                        </div>
                                    </div>
                                    ))}
                                <Stack spacing={2} sx={{ mt: 2 }} className={"courseStack"}>
                                    <Pagination
                                        count={Math.ceil(cmt.length / itemsPerPage)}
                                        page={page}
                                        onChange={(e, value) => setPage(value)}
                                        variant="outlined"
                                        shape="rounded"
                                        siblingCount={1}
                                        boundaryCount={1}
                                        showFirstButton
                                        showLastButton
                                        sx={{
                                            '& .MuiPaginationItem-root': {
                                                color: '#c9c9c9',
                                                borderColor: '#d29292',
                                                border: 3,
                                                borderRadius: '10px',
                                                minWidth: '50px',
                                                height: '50px',
                                                padding: '10px',
                                                fontSize: '20px',
                                            },
                                            '& .Mui-selected': {
                                                backgroundColor: 'rgba(42,205,175,0.5)',
                                                color: '#a17070',
                                                borderColor: '#d29292',
                                            },
                                        }}
                                    />
                                </Stack>
                            </>
                    ):(
                        <p className="noResult">아직 댓글이 없습니다.</p>
                    )}
                </div>
            </div>
        </>
    );
}

const Timeline = dynamic(() => import('./timeline'), {
    ssr: false
});

export {Timeline};