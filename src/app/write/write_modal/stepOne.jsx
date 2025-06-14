'use client'
import {useState} from "react";
import {useRouter} from "next/navigation";
import './modalCss.css';

export default function StepOne({onNext, setData, data}) {
    const [timelineStart, setTimelineStart] = useState('');
    const router = useRouter();

    const handleNext = () => {
        if (!timelineStart) {
            alert("시작 시각을 선택해주세요.");
            return;
        }
        setData({timelineStart});  // 상위로 데이터 전달
        onNext();
    };

    const handleCancel = () => {
        router.back();
    };

    const buttonClick = (value) => {
        setTimelineStart(value);
    }

    // 버튼 목록
    const morning_buttons = ["00 : 00", "01 : 00", "02 : 00", "03 : 00", "04 : 00"
        , "05 : 00", "06 : 00", "07 : 00", "08 : 00", "09 : 00"
        , "10 : 00", "11 : 00"];

    const afternoon_buttons = ["12 : 00", "13 : 00", "14 : 00", "15 : 00", "16 : 00"
        , "17 : 00", "18 : 00", "19 : 00", "20 : 00", "21 : 00"
        , "22 : 00", "23 : 00"];

    return (
        <>
            <div style={{textAlign: "center"}}>
                <span className={"modal_title"}>타임라인의 시작 시각을 선택해주세요.</span>
            </div>
            <div className={"modal_time_select"}>
                <span style={{fontSize: '24px'}}>오전</span><br/>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',  // 4열
                        gap: '10px',
                        justifyItems: 'center',  // 버튼 중앙 정렬
                        marginTop: '15px',
                    }}
                >
                    {morning_buttons.map((btnText) => (
                        <input
                            key={btnText}
                            type="button"
                            value={btnText}
                            onClick={() => buttonClick(btnText)}
                            style={{
                                width: '147px',
                                height: '55px',
                                margin: '5px',
                                padding: '10px',
                                backgroundColor: timelineStart === btnText ? '#c3c3c3' : '#fff',
                                color: timelineStart === btnText ? '#fff' : '#a1a1a1',
                                fontSize: '24px',
                                border: '1px solid #c3c3c3',
                                borderRadius: '30px',
                                cursor: 'pointer'
                            }}
                        />
                    ))}
                </div>
                <br/>
                <span style={{fontSize: '24px'}}>오후</span><br/>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',  // 4열
                        gap: '10px',
                        justifyItems: 'center',  // 버튼 중앙 정렬
                        marginTop: '15px',
                    }}
                >
                    {afternoon_buttons.map((btnText) => (
                        <input
                            key={btnText}
                            type="button"
                            value={btnText}
                            onClick={() => buttonClick(btnText)}
                            style={{
                                width: '147px',
                                height: '55px',
                                margin: '5px',
                                padding: '10px',
                                backgroundColor: timelineStart === btnText ? '#c3c3c3' : '#fff',
                                color: timelineStart === btnText ? '#fff' : '#a1a1a1',
                                fontSize: '24px',
                                border: '1px solid #c3c3c3',
                                borderRadius: '30px',
                                cursor: 'pointer'
                            }}
                        />
                    ))}
                </div>
            </div>
            <br/>
            <button className={"modal_next_button"} onClick={handleNext}>다음</button>
            <button className={"modal_back_button"} onClick={handleCancel}>취소</button>
        </>
    );
}
