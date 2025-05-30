// 'use client'
// import {useState} from "react";
// import StepOne from "./stepOne";
// import StepTwo from "./stepTwo";
// import StepThree from "./stepThree";
// import './modalCss.css';
// import LeftMenu from "@/app/leftMenu";
// import CourseWrite from "@/app/write/courseWrite";
//
// export default function ModalPage({onClose, onComplete}) {
//     const [step, setStep] = useState(1);
//     const [formData, setFormData] = useState({});
//
//     const nextStep = () => {
//         setStep((prev) => prev + 1);
//     }
//     const prevStep = () => {
//         setStep((prev) => prev - 1);
//     }
//
//     const updateFormData = (data) => {
//         setFormData((prev)=>({...prev, ...data}));
//     }
//
//     // const onClose = () => {
//     //     location.href = "/write";
//     // }
//
//     return (
//         <>
//             <div className="modal">
//                 <div className="modal-content">
//                     {step === 1 && <StepOne onNext={nextStep} setData={updateFormData} />}
//                     {step === 2 && <StepTwo onNext={nextStep} onPrev={prevStep} setData={updateFormData} />}
//                     {step === 3 && (
//                         <StepThree
//                             onPrev={prevStep}
//                             onSubmit={() => onComplete(formData)}  // write/page.jsx로 데이터 전달
//                         />
//                     )}
//
//                     <div className="modal-footer">
//                         {step > 1 && <button onClick={prevStep}>이전</button>}
//                         {step < 3 ? (
//                             <button onClick={nextStep}>다음</button>
//                         ) : (
//                             <button onClick={onClose}>완료</button>
//                         )}
//                     </div>
//                 </div>
//             </div>
//             <LeftMenu />
//             <CourseWrite />
//         </>
//     );
// }

'use client';
import {useState} from 'react';
import StepOne from './stepOne';
import StepTwo from './stepTwo';
import StepThree from './stepThree';
import './modalCss.css';
import CourseWrite from "@/app/write/courseWrite";

export default function StepModal({onComplete}) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({});

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);

    const updateFormData = (data) => {
        setFormData((prev) => ({...prev, ...data}));
    };

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
