'use client'

export default function CourseDetail({post_idx}) {
    return (
        <>
            <div className={"courseContainer"}>
                <span className={"noHead"}>글 번호</span>
                <span className={"noBody"}>{post_idx}</span>
                <span className={"reg_dateHead"}>작성일</span>
                <span className={"reg_dateBody"}>2025-05-31</span>

                <span className={"nicknameHead"}>작성자</span>
                <span className={"nicknameBody"}>글쓴이에용</span>
                <span className={"b_hitHead"}>조회수</span>
                <span className={"b_hitBody"}>0</span>

                <span className={"starAvgHead"}>평점</span>
                <span className={"starAvgBody"}>0</span>
                <span className={"likeCntHead"}>좋아요</span>
                <span className={"likeCntBody"}>0</span>

                <span className={"subjectHead"}>코스 제목</span>
                <span className={"subjectBody"}>술을 마셔보자</span>

                <span className={"timelineHead"}>코스 내용</span>
                <span className={"timelineBody"}>--ㅣ---ㅣ----</span>

                <span className={"mapHead"}>식당 위치 정보</span>
                <span className={"mapBody"}>지도...</span>

                <span className={"courseCmtHead"}>코스 코멘트</span>
                <span className={"courseCmtBody"}>정말 재밌었어요</span>

                <div className={"btns"}>
                    <span className={"report"}>신고</span>
                    <span className={"update"}>수정</span>
                    <span className={"delete"}>삭제</span>
                    <span className={"toList"}>리스트</span>
                </div>

                <div className={"rates"}>
                    <span className={"like"}>❤️좋아요</span>
                    <span className={"scrollToCmt"}>💬댓글 작성(0)</span>
                    <label><input className={"star"} type={"radio"} value={1}/>⭐</label>
                    <label><input className={"star"} type={"radio"} value={2}/>⭐⭐</label>
                    <label><input className={"star"} type={"radio"} value={3}/>⭐⭐⭐</label>
                    <label><input className={"star"} type={"radio"} value={4}/>⭐⭐⭐⭐</label>
                    <label><input className={"star"} type={"radio"} value={5}/>⭐⭐⭐⭐⭐</label>
                </div>

                <div className={"comment"}>
                    <input className={"commentBox"}
                           type={"text"}
                           placeholder={"댓글을 입력해 보세요."}/>
                    <span className={"commentBtn"}>등록</span>
                </div>

                <div className={"commentList"}>
                    <div className={"comment"}>
                        <span className={"nickname"}>닉네임</span>
                        <span className={"commentContent"}>댓글내용</span>
                        <span className={"reg_date"}>2025-05-29</span>
                    </div>
                    <div className={"commentBtns"}>
                        <span className={"cmtReport"}>신고</span>
                        <span className={"cmtDelete"}>삭제</span>
                        <span className={"cmtUpdate"}>수정</span>
                    </div>
                </div>
            </div>
        </>
    );
}