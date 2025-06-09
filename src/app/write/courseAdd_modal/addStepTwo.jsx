const AddStepTwo = ({ nextStep, prevStep, formData, setFormData }) => {
    const style = {
        color: '#FF0000',
    }

    return (
        <div className={"addstep_container"}>
            <div style={{ marginBottom: "20px" }}>
                {/* 시간 필수 입력으로 바꾸기 */}
                <label className={"addstep_label"}>시간 입력<span style={style}> *</span></label>
                    <input
                        type="time"
                        className={"addstep_input"}
                        value={formData.start || ""}
                        onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                    />
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
