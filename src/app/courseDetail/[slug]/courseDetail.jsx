'use client'

import {useEffect, useRef, useState} from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import {CircularProgress, Pagination, Popover, Stack} from "@mui/material";

export default function CourseDetail({post_idx}) {

    const [isLoading, setIsLoading] = useState(true);
    const canUpdate = false;
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;
    const [cmt, setCmt] = useState([]);
    const container = useRef(null);
    const [totalCmtCount, setTotalCmtCount] = useState(0);
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
        "user_id" : "",
        "nickname":"",
        "content_detail_cmt":[],
        "content_detail_resta":[],
        "tags":[],
        "time":{"start":"", "end":""}});

    // 디테일 정보 가져오기
    const getDetail = () => {
        return axios.get(`http://localhost/courseDetail?post_idx=${post_idx}`).then(({data}) => {
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
                "user_id" : d.content.user_id,
                "nickname":d.nickname.nickname,
                "content_detail_cmt":d.content_detail_cmt,
                "content_detail_resta":d.content_detail_resta,
                "tags":d.tags,
                "time":{
                    "start":d.time.start,
                    "end":d.time.end
                }}
            setDetail(newDetail);
            checkLikeStatus(d.content.post_idx);
            cmtList(d.content.post_idx);
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

    // 디테일정보가 들어오면 맵에 마커찍기
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

    }, [detail, isLoading]);

    // 코스 신고버튼
    const courseReport = (detail) => {
        console.log("courseReport -> detail :",detail);
        if (isAuthenticated) {
            const queryParts = ["isClass=course", `idx=${detail.post_idx}`,`suspect=${detail.user_id}`,`nickname=${encodeURIComponent(detail.nickname)}`].join("&");
            const url = `/report/write?${queryParts}`
            location.href = url;
        } else {
            alert("로그인이 필요한 서비스 입니다.");
        }
    };

    // 코스 수정버튼
    const courseUpdate = (detail) => {
        if (isAuthenticated) {
            const url = `/courseUpdate?post_idx=${detail.post_idx}`;
            location.href = url;
        } else {
            alert("로그인이 필요한 서비스 입니다.")
        }
    };

    // 코스 삭제버튼
    const courseDelete = (detail) => {
        if (isAuthenticated && user_id.current === detail.user_id) {
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
            alert("비로그인 상태거나 코스의 작성자가 아닙니다.")
        }
    }

    // 리스트로 돌아가기버튼
    const toList = () => {
        location.href = "/list";
    };

    // 좋아요 체크
    const [likedByMe, setLikedByMe] = useState(false);
    const checkLikeStatus = (post_idx) => {
            axios.get(`http://localhost/like_check?post_idx=${post_idx}&user_id=${user_id.current}`)
                .then(({data}) => {
                    setLikedByMe(data.liked === true);
                });
    };

    // 좋아요 누르기
    // 코스
    const likeToggle = () => {
        if (isAuthenticated) {
            axios.post("http://localhost/like"
                ,{user_id:user_id.current, isClass:"course", post_idx:detail.post_idx}
                ,{headers: { Authorization: sessionStorage.getItem('token') || '' }})
                .then(({data}) => {
                    if (data.success) {
                        setLikedByMe(prev => !prev);
                        setDetail(prev => ({
                            ...prev,
                            total_like_count: prev.total_like_count + (likedByMe ? -1 : 1)
                        }));
                    }
                })
        } else {
            alert("로그인이 필요한 서비스 입니다.");
        }
    };
    // 댓글
    const cmtLikeToggle = (comment_idx) => {
        if (isAuthenticated) {
            axios.post("http://localhost/like"
                ,{user_id:user_id.current, isClass:"comment", cmt_idx:comment_idx, post_idx:post_idx}
                ,{headers: { Authorization: sessionStorage.getItem('token') || '' }})
                .then(({data}) => {
                    if (data.success) {
                        setCmt(prev =>
                            prev.map(cmt => {
                                if (cmt.comment_idx === comment_idx) {
                                    const likedNow = !cmt.likedByMe;
                                    return {
                                        ...cmt,
                                        likedByMe: likedNow,
                                        cmt_like_cnt: cmt.cmt_like_cnt + (likedNow ? 1 : -1)
                                    };
                                }
                                return cmt;
                            })
                        );
                    }
                })
        } else {
            alert("로그인이 필요한 서비스 입니다.");
        }
    };

    // 별점 밸류 가져오기
    const [selectedStar, setSelectedStar] = useState(null);
    const starValue = (e) => {
        setSelectedStar(Number(e.target.value));
    };

    // 별점 먹이기
    const submitStar = () => {
        if (isAuthenticated) {
            if (selectedStar == null) {
                alert("별점을 선택해주세요!");
                return;
            }
            axios.post("http://localhost/star"
                ,{user_id:user_id.current, post_idx:detail.post_idx, star:selectedStar}
                ,{headers: { Authorization: sessionStorage.getItem('token') || '' }})
                .then(({data}) => {
                    if (data.success) {
                        alert("별점이 등록됐습니다. 갱신된 평균을 보려면 새로고침하세요!");
                    }
                })
        } else {
            alert("로그인이 필요한 서비스 입니다.");
        }
    };

    // 댓글 불러오기
    const cmtList = async (post_idx) => {
        const { data } = await axios.get(`http://localhost/comment_list?post_idx=${post_idx}&page=${page}`);
        const comments = Array.isArray(data.list.comments) ? data.list.comments : [];
        setTotalCmtCount(data.totalCount);

        const cmtIdxList = comments.map(cmt => cmt.comment_idx);

        // 댓글 좋아요 여부 체크
        const likedMapRes = await axios.post("http://localhost/like_check_cmt", {
            user_id: user_id.current,
            cmt_idx_list: cmtIdxList
        });

        const likedRaw = likedMapRes.data.likeCheckCmt;

        const likedMap = Array.isArray(likedRaw)
            ? likedRaw.reduce((acc, cur) => {
                acc[cur.cmt_idx] = cur.liked;
                return acc;
            }, {})
            : { [likedRaw.cmt_idx]: likedRaw.liked };

        const updatedComments = comments.map(cmt => ({
            ...cmt,
            likedByMe: likedMap[cmt.comment_idx] === true
        }));

        setCmt(updatedComments);
        console.log(cmt);
    };

    useEffect(() => {
        cmtList(post_idx, page);
    }, [page]);

    // 댓글 신고 버튼
    const cmtReport = (item) => {
        if (isAuthenticated) {
            const queryParts = ["isClass=comment", `idx=${item.comment_idx}`,`suspect=${item.user_id}` ,`nickname=${encodeURIComponent(item.nickname)}`].join("&");
            const url = `/report/write?${queryParts}`
            location.href = url;
        } else {
            alert("로그인이 필요한 서비스 입니다.");
        }

    };

    // 댓글 삭제 버튼
    const cmtDel = (item) => {
        if (isAuthenticated && user_id.current === item.user_id) {
            const confirmDelete = window.confirm("정말로 댓글을 삭제하시겠습니까?");
            if (!confirmDelete) return;
            axios.delete(`http://localhost/comment_del?comment_idx=${item.comment_idx}`
                ,{headers: { Authorization: sessionStorage.getItem('token') || '' }}).then(({data}) => {
                if (data.success) {
                    cmtList(post_idx);
                    alert("댓글을 삭제 했습니다.")
                }else{
                    alert("삭제에 실패 했습니다.")
                }
            });
        } else {
            alert("비로그인 상태거나 댓글의 작성자가 아닙니다.");
        }

    };

    // 댓글 수정 버튼
    const [editingCommentIdx, setEditingCommentIdx] = useState(null);
    const [editedContent, setEditedContent] = useState("");
    // 댓글 수정창 띄우기
    const cmtUpdate = (item) => {
        if (isAuthenticated && user_id.current === item.user_id) {
            setEditingCommentIdx(item.comment_idx);
            setEditedContent(item.content);
        } else {
            alert("비로그인 상태거나 댓글의 작성자가 아닙니다.");
        }
    };

    // 댓글 수정내용 저장
    const saveUpdatedComment = (item) => {
        if (isAuthenticated && user_id.current === item.user_id) {
            const comment_idx= item.comment_idx;
            const user_id = item.user_id;
            axios.put("http://localhost/comment_update"
                , {comment_idx, user_id, content: editedContent}
                , {headers: { Authorization: sessionStorage.getItem('token') || '' }}).then(({data}) => {
                if (data.success) {
                    alert("댓글이 수정되었습니다.");
                    setEditingCommentIdx(null);
                    cmtList(post_idx); // 최신 댓글 다시 가져오기
                } else {
                    alert("수정에 실패했습니다.");
                }
            });
        } else {
            alert("비로그인 상태거나 댓글의 작성자가 아닙니다.");
        }
    };

    // 댓글 작성 버튼
    const [cmtContent, setCmtContent] = useState("");
    const submitCmt = () => {
        if (isAuthenticated) {
            if (cmtContent.trim() === "") {
                alert("댓글을 입력해주세요");
                return;
            }
            axios.post("http://localhost/comment_insert"
                ,{user_id:user_id.current, post_idx:detail.post_idx, content:cmtContent}
                ,{headers: { Authorization: sessionStorage.getItem('token') || '' }})
                .then(({data}) => {
                    if (data.success) {
                        alert("댓글이 등록되었습니다.")
                        setCmtContent("");
                        cmtList(detail.post_idx, 1);
                        setPage(1);
                    }else{
                        alert("댓글 등록을 실패하였습니다.")
                    }
                })
        } else {
            alert("로그인이 필요한 서비스 입니다.");
        }
    };

    // 작성자에게 쪽지보내기, 작성자 정보보기 팝업
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedUser, setSelectedUser] = useState({ user_id: '', nickname: '' });

    const handleAuthorClick = (event, user_id, nickname) => {
        setAnchorEl(event.currentTarget);
        setSelectedUser({ user_id, nickname });
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const memberInfo = (selectedUser) => {
        location.href = `/mypage?user_id=${selectedUser.user_id}`
    }
    const sendMsg = (selectedUser) => {
        if (typeof window !== 'undefined') {
            user_id.current = sessionStorage.getItem('user_id');
            if (!user_id.current) {
                alert('로그인이 필요한 서비스입니다.');
            } else {
                location.href = `/message/messageWrite?recip=${selectedUser.user_id}&nickname=${selectedUser.nickname}`
            }
        }
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
                            <span className={"nicknameBody"}>
                                <span className={"nicknameBodyText"} onClick={(e) => handleAuthorClick(e, detail.user_id, detail.nickname)}>{detail.nickname}</span>
                            </span>
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
                    {detail.tags.map(tag => tag.tag_name).join(" ")}
                </span>

                            <span className={"timelineHead"}>코스 내용</span>
                            <span className={"timelineBody"}>
                    <Timeline timelineStart={detail.time.start}
                              timelineFinish={detail.time.end}
                              noResta = {detail.content_detail_cmt}
                              resta = {detail.content_detail_resta}
                              canUpdate ={canUpdate}/>
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
                                <span className={user_id.current === detail.user_id ? "update" : "hidden"} onClick={()=>courseUpdate(detail)}>수정</span>
                                <span className={user_id.current === detail.user_id ? "delete" : "hidden"} onClick={()=>courseDelete(detail)}>삭제</span>
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
                                <small className={"cmtLimit"}>{cmtContent.length} / 333자 제한</small>
                                <span className={"commentBtn"} onClick={()=>submitCmt()}>등록</span>
                            </div>

                            <div className={"commentList"}>
                                {cmt.length > 0? (
                                    <>
                                        {cmt.map((item, index) => (
                                            <div className={"comment2"} key={index}>
                                                <span className={"nickname"} >
                                                    <span className={"nicknameText"} onClick={(e) => handleAuthorClick(e, item.user_id, item.nickname)}>{item.nickname}</span>
                                                </span>
                                                {editingCommentIdx === item.comment_idx ? (
                                                    <>
                                                        <textarea
                                                            className={"updateCommentBox"}
                                                            value={editedContent}
                                                            onChange={(e) => setEditedContent(e.target.value)}
                                                            rows="3"
                                                        />
                                                        <small className={"cmtLimit"}>{editedContent.length} / 333자 제한</small>
                                                    </>
                                                ) : (
                                                    <span className={"commentContent"}>{item.content}</span>)}
                                                    <span className={"reg_date"}>{item.reg_date.replace("T", " ").substring(0, 16)}</span>
                                                    <div className={"commentBtns"}>
                                                        <span className={"like"} onClick={()=>cmtLikeToggle(item.comment_idx)}>
                                                            {item.likedByMe ? "❤️ 좋아요" : "🤍 좋아요"}({item.cmt_like_cnt})
                                                        </span>
                                                        <span className={"cmtReport"} onClick={()=>cmtReport(item)}>신고</span>
                                                        <span className={user_id.current === item.user_id ? "cmtDelete" : "hidden"} onClick={()=>cmtDel(item)}>삭제</span>
                                                        {editingCommentIdx === item.comment_idx ? (
                                                            <span className={"cmtUpdate"} onClick={() => saveUpdatedComment(item)}>저장</span>
                                                        ) : (
                                                            <span className={user_id.current === item.user_id ? "cmtUpdate" : "hidden"} onClick={() => cmtUpdate(item)}>수정</span>
                                                        )}
                                                    </div>
                                                <div className={"commentLineWrapper"}>
                                                    <div className={"commentLine"}></div>
                                                </div>
                                            </div>
                                        ))}
                                        <Stack spacing={2} sx={{ mt: 2 }} className={"courseStack"}>
                                            <Pagination
                                                count={Math.ceil(totalCmtCount / itemsPerPage)}
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
                        </>
                    )}
            </div>
            {/*회원 닉네임 누르면 뜨는 팝업창*/}
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <div style={{ padding: '10px' }}>
                    <p><b>{selectedUser.nickname}</b> 님</p>
                    <button onClick={() => memberInfo(selectedUser)}>회원정보 보기</button>
                    <button onClick={() => sendMsg(selectedUser)}>쪽지 보내기</button>
                </div>
            </Popover>
        </>
    );
}

const Timeline = dynamic(() => import('./timeline'), {
    ssr: false
});

export {Timeline};