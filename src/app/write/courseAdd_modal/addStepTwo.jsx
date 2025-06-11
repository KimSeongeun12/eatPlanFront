'use client'

import {useState} from "react";

const AddStepTwo = ({ nextStep, prevStep, formData, setFormData, timelineStart, timelineFinish, combinedTimes }) => {
    const style = {
        color: '#FF0000',
    }

    const [selectedTime, setSelectedTime] = useState("");

    const buttonClick = (value) => {
        if (value <= timelineStart || value >= timelineFinish) {
            alert("세부일정 시작시간은 코스의 시작시간과 끝시간 범위 내여야 합니다.");
        }else if (combinedTimes.includes(value)){
            alert("중복된 세부일정 시작시간 입니다.");
        }else {
            setSelectedTime(value);
            setFormData({...formData, start: value});
        }
    }

    // 버튼 목록
    const morning_buttons = ["00 : 00", "01 : 00", "02 : 00", "03 : 00", "04 : 00"
        , "05 : 00", "06 : 00", "07 : 00", "08 : 00", "09 : 00"
        , "10 : 00", "11 : 00"];

    const afternoon_buttons = ["12 : 00", "13 : 00", "14 : 00", "15 : 00", "16 : 00"
        , "17 : 00", "18 : 00", "19 : 00", "20 : 00", "21 : 00"
        , "22 : 00", "23 : 00"];

    return (
        <div className={"addstep_container"}>
            <div style={{ marginBottom: "20px" }}>
                {/* 시간 필수 입력으로 바꾸기 */}
                <label className={"addstep_label"}>시간 입력<span style={style}> *</span></label>
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
                                    backgroundColor: selectedTime === btnText ? '#c3c3c3' : '#fff',
                                    color: selectedTime === btnText ? '#fff' : '#a1a1a1',
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
                                    backgroundColor: selectedTime === btnText ? '#c3c3c3' : '#fff',
                                    color: selectedTime === btnText ? '#fff' : '#a1a1a1',
                                    fontSize: '24px',
                                    border: '1px solid #c3c3c3',
                                    borderRadius: '30px',
                                    cursor: 'pointer'
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div style={{ marginBottom: "20px" }}>
                <label className={"addstep_label"}>상세 설명 입력</label>
                    <textarea
                        className={"addstep_textarea"}
                        value={formData.comment || ""}
                        onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                        placeholder="선택한 코스에 대한 상세 설명을 기입해주세요."
                    />
            </div>
            <div className={"resta_search_buttons"}>
            <button className={"resta_search_button"} onClick={prevStep}>이전</button>
            <button className={"resta_search_button"} onClick={nextStep}>다음</button>
            </div>
        </div>
    );
};

export default AddStepTwo;
