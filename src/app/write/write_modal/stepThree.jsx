'use client';

export default function StepThree({onPrev, onSubmit, data}) {
    return (
        <div>
            <div style={{textAlign: "center"}}>
                <span className={"modal_title"}>입력한 정보가 정확한가요? 제출하면 수정할 수 없습니다.</span>
            </div>

            <div style={{textAlign: "center"}} className={"modal_time_select"}>
                <span style={{display: "block", marginTop: '100px'}} className={"preview"}><strong>시작 시각:</strong> {data.timelineStart}</span>
                <br/><br />
                <span style={{display: "block", marginBottom: '105px'}} className={"preview"}><strong>종료 시각:</strong> {data.timelineFinish}</span>
                <br />
                <span>만들어지는 타임라인은 아래와 같습니다. (예시)</span><br /><br /><br />
                <div className={"timeline_line"}>
                    <span className={"timeline_startSpan"}>{data.timelineStart}</span>
                    <div className={"timeline_grid_one"}></div>
                    <div className={"timeline_grid_two"}></div>
                    <div className={"timeline_grid_three"}></div>
                    <div className={"timeline_grid_four"}></div>
                    <div className={"timeline_grid_five"}></div>
                    <span className={"timeline_finishSpan"}>{data.timelineFinish}</span>
                </div>
            </div>
            <br/>

            <button className={"modal_next_button"} onClick={onSubmit}>확인</button>
            <button className={"modal_back_button"} onClick={onPrev}>이전</button>

        </div>
    );
}
