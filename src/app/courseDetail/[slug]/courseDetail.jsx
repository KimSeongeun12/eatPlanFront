'use client'



import { Chrono } from "react-chrono";

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
                <span className={"tagHead"}>태그</span>
                <span className={"tagBody"}>#가성비 좋은 #파티</span>

                <span className={"timelineHead"}>코스 내용</span>
                <span className={"timelineBody"}><Timeline/></span>

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

const Timeline = () => {
    return (
        <Chrono
            items={[
                {
                    title: "May 1940",
                    cardTitle: "Dunkirk",
                    url: "http://google.com",
                    cardSubtitle:
                        "Men of the British Expeditionary Force (BEF) wade out to a destroyer during the evacuation from Dunkirk.",
                    cardDetailedText: `On 10 May 1940, Hitler began his long-awaited offensive in the west by invading neutral Holland and Belgium and attacking northern France. Holland capitulated after only five days of fighting, and the Belgians surrendered on 28 May. With the success of the German ‘Blitzkrieg’, the British Expeditionary Force and French troops were in danger of being cut off and destroyed.`,
                },
                {
                    title: "25 July 1940",
                    cardTitle: "The Battle of Britain",
                    cardSubtitle: `RAF Spitfire pilots scramble for their planes`,
                    cardDetailedText: `After France’s surrender in June 1940, Churchill told the British people, “Hitler knows that he will have to break us in this island or lose the war”. To mount a successful invasion, the Germans had to gain air superiority. The first phase of the battle began on 10 July with Luftwaffe attacks on shipping in the Channel.
        The following month, RAF Fighter Command airfields and aircraft factories came under attack. Under the dynamic direction of Lord Beaverbrook, production of Spitfire and Hurricane fighters increased, and despite its losses in pilots and planes, the RAF was never as seriously weakened as the Germans supposed.`,
                },
                {
                    title: "June 1941",
                    cardTitle: "Operation Barbarossa",
                    cardSubtitle: `A column of Red Army prisoners taken during the first days of the German invasion`,
                    cardDetailedText: `Since the 1920s, Hitler had seen Russia, with its immense natural resources, as the principal target for conquest and expansion. It would provide, he believed, the necessary ‘Lebensraum’, or living space, for the German people. And by conquering Russia, Hitler would also destroy the “Jewish pestilential creed of Bolshevism”. His non-aggression pact with Stalin in August 1939 he regarded as a mere temporary expedient.
        Barely a month after the fall of France, and while the Battle of Britain was being fought, Hitler started planning for the Blitzkrieg campaign against Russia, which began on 22 June 1941. Despite repeated warnings, Stalin was taken by surprise, and for the first few months the Germans achieved spectacular victories, capturing huge swathes of land and hundreds of thousands of prisoners. But they failed to take Moscow or Leningrad before winter set in.
        On 5/6 December, the Red Army launched a counter-offensive which removed the immediate threat to the Soviet capital. It also brought the German high command to the brink of a catastrophic military crisis. Hitler stepped in and took personal command. His intervention was decisive and he later boasted, “That we overcame this winter and are today in a position again to proceed victoriously… is solely attributable to the bravery of the soldiers at the front and my firm will to hold out…”`,
                },
            ]}
            mode="HORIZONTAL"
        />
    );
};

export {Timeline};