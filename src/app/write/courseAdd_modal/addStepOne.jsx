const AddStepOne = ({ formData, setFormData, nextStep, onClose }) => {
    return (
        <div>
            <div style={{ marginBottom: "20px" }}>
                <label>
                    장소/건물명 입력
                    <input
                        type="text"
                        value={formData.timeline_resta_name || ""}
                        onChange={(e) => setFormData({ ...formData, timeline_resta_name: e.target.value })}
                        placeholder="타임라인에 표시될 장소 또는 건물명을 입력해주세요."
                    />
                </label>
            </div>

            <button className="next" onClick={nextStep}>다음</button>
            <button className="cancel" onClick={onClose}>취소</button>
        </div>
    );
};

export default AddStepOne;
