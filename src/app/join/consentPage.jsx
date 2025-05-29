import React, {useState} from "react";

export default function consentPage({select, onChange}) {
    return (
        <>
            <div className={"consentTitle"}>
                <img src={"checkIcon.png"} alt={"체크 아이콘"}></img>
                <span className={"consentSpan"}>개인정보 수집 및 이용</span>
            </div>
            <div className={"consentForm"}>
                <ul>
                    <b>1. 수집·이용 목적</b><br/>
                    <span>회사는 다음의 목적을 위해 귀하의 개인정보를 수집 및 이용합니다.</span>
                    <li>서비스 제공 및 회원관리</li>
                    <li>본인 확인 및 민원 처리</li>
                    <li>계약 이행 및 요금 정산</li>
                    <li>마케팅 및 광고 활용 (선택사항)</li>
                </ul>
                <ul>
                    <b>2. 수집하는 개인정보 항목</b>
                    <li>필수 항목: 성명, 생년월일, 연락처(전화번호, 이메일 등), 주소</li>
                    <li>선택 항목: 직업, 관심 분야, 서비스 이용 기록</li>
                </ul>
                <ul>
                    <b>3. 개인정보의 보유 및 이용 기간</b>
                    <li>수집된 개인정보는 수집·이용 목적 달성 시까지 보유하며, 관련 법령에 따라 일정 기간 보관이 필요할 경우 해당 기간 동안 보관합니다.</li>
                    <li>단, 동의 철회 요청 시 지체 없이 파기합니다.</li>
                </ul>
                <ul>
                    <b>4. 개인정보의 제3자 제공에 관한 사항</b>
                    <li>제공받는 자: (제공받는 기관명)</li>
                    <li>제공 목적: (예: 서비스 제공을 위한 본인 확인)</li>
                    <li>제공 항목: 성명, 연락처, 주소 등</li>
                    <li>보유 및 이용 기간: 제공 목적 달성 시까지</li>
                </ul>
                <ul>
                    <b>5. 동의를 거부할 권리 및 불이익</b>
                    <p>귀하는 개인정보 제공에 동의하지 않을 수 있으며, 동의 거부 시 일부 서비스 이용에 제한이 있을 수 있습니다.</p>
                </ul>
            </div>
            <div className={"consentRadio"}>
                <input type={"checkbox"} name={"consent"} value={"yes"} onChange={()=>onChange("yes")} />
                <label className={"consentYes"}>개인정보 수집 및 이용에 동의합니다.</label><br/>
            </div>
        </>
    );
}