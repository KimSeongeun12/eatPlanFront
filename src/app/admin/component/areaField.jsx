'use client'

import {useEffect, useMemo, useRef, useState} from "react";
import axios from "axios";
import {data} from "react-router-dom";


export default function AreaField(){

    // 지역태그 리스트 가져오기
    const [areaTag, setAreaTag] = useState([]);
    const area_cate_idx=useRef(1);


    const areaTagList = () => {
        axios.get("http://192.168.0.120/list_tag_area").then(({data}) => {
            setAreaTag(data?.list_area ?? []);
            console.log('지역태그 리스트 : ',data.list_area);
        })
    };

    // 페이지 입장시 백에서 태그 카테고리, 태그 리스트 가져오기
    useEffect(() => {
        const fetchTags = async () => {
            await Promise.all([areaTagList()])
        };
        fetchTags();
    }, []);

    // 지역태그 city 중복제거
    const uniqueCities = useMemo(() => {
        if (!Array.isArray(areaTag)) return [];
        return [...new Set(areaTag.map(at => at.city))];
    }, [areaTag]);

    // 선택한 목록들
    const [selectedCity, setSelectedCity] = useState(""); // 선택한 시·도
    const [selectedDist, setSelectedDist] = useState(""); // 선택한 시·군·구
    const [selectedArea, setSelectedArea] = useState(""); // 선택한 지역태그

    // 지역태그 선택, 취소하기
    const toggleArea = (area) => {
        if (selectedArea === area) {
            setSelectedArea("");
        } else {
            setSelectedArea(area);
        }
    };

    // 지역 태그 추가
    const addArea = () => {
        if (selectedCity.trim().length === 0 || selectedDist.trim().length === 0) {
            alert("지역태그는 반드시 대분류와 중분류가 필요합니다.")
            return;
        }
        if (selectedArea.trim().length === 0) {
            alert("지역태그 이름을 입력하세요.");
            return;
        }

        // cate_idx : 지역 불러오기

        if (selectedCity.trim().length>0 && selectedDist.trim().length>0 && selectedArea.trim().length>0){
            axios.post("http://192.168.0.120/adtag_write"
                ,{cate_name: {cate_name:'지역', cate_idx:1}, tag_area: {city: selectedCity, dist: selectedDist, tag_name: selectedArea}})
                .then(({data}) => {
                    if (data.success) {
                        alert("태그가 추가 되었습니다.");
                        areaTagList();
                    }else{
                        alert("중복된 지역태그 이름입니다.");
                    }
                });
        }
    };

    // 시도 삭제
    const delCity = () => {
        const delCity = areaTag.find(at => at.city === selectedCity);
        if (!delCity){
            alert("삭제할 대분류를 찾을 수 없습니다.");
            return;
        }
        const confirmDelete = window.confirm("대분류에 해당하는 모든 중분류와 지역태그가 삭제됩니다.");
        if (!confirmDelete) return;
        axios.delete("http://192.168.0.120/adtag_del_city", {
            data: { city: delCity.city }
        })
            .then(({data}) => {
                if (data.success) {
                    alert("대분류가 삭제 되었습니다.");
                    areaTagList();
                }else {
                    alert("삭제에 실패했습니다.");
                }
            });
    };

    // 시군구 삭제
    const delDist = () => {
        const delDist = areaTag.find(at => at.dist === selectedDist);
        if (!delDist){
            alert("삭제할 중분류를 찾을 수 없습니다.");
            return;
        }
        const confirmDelete = window.confirm("대분류에 해당하는 유일한 중분류일 경우 대분류가 삭제됩니다, 해당하는 모든 지역태그가 삭제됩니다.");
        if (!confirmDelete) return;
        axios.delete("http://192.168.0.120/adtag_del_dist", {
            data: { dist: delDist.dist }
        })
            .then(({data}) => {
                if (data.success) {
                    alert("중분류가 삭제 되었습니다.");
                    areaTagList();
                }else {
                    alert("삭제에 실패했습니다.");
                }
            });
    };

    // 지역 태그 삭제
    const delArea = () => {
        const delTag = areaTag.find(at => at.tag_name === selectedArea);
        if (!delTag) {
            alert("삭제할 태그를 찾을 수 없습니다.");
            return;
        }
        const confirmDelete = window.confirm("중분류에 해당하는 유일한 지역태그일 경우 대분류와 중분류가 모두 삭제됩니다.");
        if (!confirmDelete) return;
        axios.delete("http://192.168.0.120/adtag_del", {
            data: { area_tag_idx: delTag.area_tag_idx }
        })
            .then(({data}) => {
                if (data.success) {
                    alert("태그가 삭제 되었습니다.");
                    areaTagList();
                }else {
                    alert("삭제에 실패했습니다.");
                }
            });
    };

    return (
        <>
            <div className="searchContainer">
                <div className={"tagAreaWrapper"}>
                    {/*도시 리스트*/}
                    <div className={"cityWrapper"}>
                        <h5 className={"cityHead"}>시 · 도</h5>
                        <ul className={"city"}>
                            {uniqueCities.map(city => (
                                <li
                                    key={city}
                                    className={city === selectedCity ? "active" : ""}
                                    onClick={() => setSelectedCity(city)}
                                >{city}</li>
                            ))}
                        </ul>
                        <div className={"ADHead"}>시 · 도 </div>
                        <div className={"cityAdd"}>
                            <input type="text" value={selectedCity} onChange={(e)=>setSelectedCity(e.target.value)}/>
                        </div>
                        <div className={"ADHead"}>Enter로 시 · 도 삭제 ❗</div>
                        <div className={"cityDel"}>
                            <input
                                type="text"
                                value={selectedCity}
                                onChange={(e)=>setSelectedCity(e.target.value)}
                                onKeyUp={(e) => {
                                    if (e.key === 'Enter') {
                                        delCity();
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {/*시군구 리스트*/}
                    <div className={"distWrapper"}>
                        <h5 className={"distHead"}>시 · 군 · 구</h5>
                        <ul className={"dist"}>
                            {[...new Set(
                                areaTag
                                    .filter(distCate => distCate.city === selectedCity)
                                    .map(distName => distName.dist)
                            )].map(dist => (
                                <li
                                    key={dist}
                                    className={(dist === selectedDist ? "active " : "")}
                                    onClick={() => setSelectedDist(dist)}
                                >{dist}</li>
                            ))}
                        </ul>
                        <div className={"ADHead"}>시 · 군 · 구</div>
                        <div className={"distAdd"}>
                            <input type="text" value={selectedDist} onChange={(e)=>setSelectedDist(e.target.value)}/>
                        </div>
                        <div className={"ADHead"}>Enter로 시 · 군 · 구 삭제 ❗</div>
                        <div className={"distDel"}>
                            <input
                                type="text"
                                value={selectedDist}
                                onChange={(e)=>setSelectedDist(e.target.value)}
                                onKeyUp={(e) => {
                                    if (e.key === 'Enter') {
                                        delDist();
                                    }
                                }}
                            />
                        </div>
                    </div>
                    {/*지역태그 리스트*/}
                    <div className={"areaWrapper"}>
                        <ul className={"area"}>
                            {areaTag
                                .filter(areaCate => areaCate.dist === selectedDist)
                                .map(at => (
                                    <li
                                        key={at.area_tag_idx}
                                        className={(selectedArea === at.tag_name ? "activeArea " : "noneActiveArea ") +
                                            (at.city === selectedCity ? "" : "hidden")}
                                        onClick={() => toggleArea(at.tag_name)}
                                    >{at.tag_name}</li>
                                ))}
                        </ul>
                        <div className={"ADHead"}>Enter로 지역태그 추가</div>
                        <div className={"areaAdd"}>
                            <input
                                type="text"
                                value={selectedArea}
                                onChange={(e) => setSelectedArea(e.target.value)}
                                onKeyUp={(e) => {
                                    if (e.key === 'Enter') {
                                        addArea();
                                    }
                                }}
                            />
                        </div>
                        <div className={"ADHead"}>Enter로 지역태그 삭제 ❗</div>
                        <div className={"areaDel"}>
                            <input
                                type="text"
                                value={selectedArea}
                                onChange={(e)=>setSelectedArea(e.target.value)}
                                onKeyUp={(e) => {
                                    if (e.key === 'Enter') {
                                        delArea();
                                    }
                                }}/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

}