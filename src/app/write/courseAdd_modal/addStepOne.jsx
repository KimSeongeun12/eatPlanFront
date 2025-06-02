const AddStepOne = ({ formData, setFormData, nextStep, onClose }) => {

    return (
        <div>

            <button className="next" onClick={nextStep}>다음</button>
            <button className="cancel" onClick={onClose}>취소</button>
        </div>
    );
};

export default AddStepOne;
