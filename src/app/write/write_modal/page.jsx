'use client';
import {useState} from 'react';
import StepOne from './stepOne';
import StepTwo from './stepTwo';
import StepThree from './stepThree';
import './modalCss.css';
import CourseWrite from "@/app/write/courseWrite";
import axios from "axios";

export default function StepModal({onComplete}) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({});

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);

    const updateFormData = (data) => {
        setFormData((prev) => ({...prev, ...data}));
    };

    // const timelineInsert = () => {
    //     // 타임라인의 시간을 서버로 올려보냄
    //     const {data} = axios
    // }

    return (
        <>
            <div className="modal">
                <div className="modal-content">
                    {step === 1 && <StepOne onNext={nextStep} setData={updateFormData}/>}
                    {step === 2 && <StepTwo onNext={nextStep} onPrev={prevStep} setData={updateFormData}/>}
                    {step === 3 && (
                        <StepThree
                            onPrev={prevStep}
                            onSubmit={() => onComplete(formData)}  // write/page.jsx로 데이터 전달
                            data={formData}
                        />
                    )}
                </div>
            </div>
        </>
    );
}
