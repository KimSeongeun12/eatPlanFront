'use client'
import React, { useState } from "react";
import AddStepOne from "./addStepOne";
import AddStepTwo from "./addStepTwo";
import AddStepThree from "./addStepThree";
import './courseAdd_modalCss.css';

const CourseAddModal = ({ onClose, onSubmit, timelineStart, timelineFinish, combinedTimes }) => {
    const [step, setStep] = useState(1);
    // const [formData, setFormData] = useState({
    //     timeline_resta_name: "",
    //     resta: "",
    //     noResta: "선택 안됨",
    //     timeline_time: "",
    //     timeline_coment: "",
    // });
    const [formData, setFormData] = useState({});

    const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

    return (
        <div className="modal-background">
            <div className="modal-content">
                {step === 1 && (
                    <AddStepOne
                        nextStep={nextStep}
                        formData={formData}
                        setFormData={setFormData}
                        onClose={onClose}
                    />
                )}
                {step === 2 && (
                    <AddStepTwo
                        nextStep={nextStep}
                        prevStep={prevStep}
                        formData={formData}
                        setFormData={setFormData}
                        timelineStart={timelineStart}
                        timelineFinish={timelineFinish}
                        combinedTimes={combinedTimes}
                    />
                )}
                {step === 3 && (
                    <AddStepThree
                        prevStep={prevStep}
                        formData={formData}
                        onSubmit={() => {
                            console.log("최종 제출 formData:", formData); // ✅ 제출 시 로그
                            onSubmit(formData);
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default CourseAddModal;
