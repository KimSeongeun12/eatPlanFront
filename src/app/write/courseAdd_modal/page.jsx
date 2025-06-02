import React, { useState } from "react";
import AddStepOne from "./addStepOne";
import AddStepTwo from "./addStepTwo";
import AddStepThree from "./addStepThree";
import AddStepFour from "@/app/write/courseAdd_modal/addStepFour";
import './courseAdd_modalCss.css';

const CourseAddModal = ({ onClose, onSubmit }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });

    const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
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
                    />
                )}
                {step === 3 && (
                    <AddStepThree
                        nextStep={nextStep}
                        prevStep={prevStep}
                        formData={formData}
                        setFormData={setFormData}
                    />
                )}
                {step === 4 && (
                    <AddStepFour
                        prevStep={prevStep}
                        formData={formData}
                        onSubmit={() => onSubmit(formData)}
                    />
                )}
            </div>
        </div>
    );
};

export default CourseAddModal;
