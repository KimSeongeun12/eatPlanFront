'use client'

import {useEffect, useMemo, useState} from "react";
import axios from "axios";


export default function AreaField(){

    // 지역태그 리스트 가져오기
    const [areaTag, setAreaTag] = useState([]);
    const areaTagList = () => {
        axios.get("http://localhost/list_tag_area").then(({data}) => {
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
    const [selectedArea, setSelectedArea] = useState([]); // 선택한 지역태그
    const [selectedList, setSelectedList] = useState([]); // 선택한 지역,태그

    // 지역태그 선택, 취소하기
    const toggleArea = (area) => {
        setSelectedArea(prev =>
            prev.includes(area)
                ? prev.filter(a => a !== area)
                : [...prev, area]
        );
        setSelectedList(prev => {
            const isSelected = selectedArea.includes(area);
            if (isSelected) {
                return prev.filter(entry => !(entry.type === 'area' && entry.value === area));
            } else {
                return [...prev, { type: 'area', value: area }];
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
                    </div>
                    {/*지역태그 리스트*/}
                    <div className={"areaWrapper"}>
                        <ul className={"area"}>
                            {areaTag
                                .filter(areaCate => areaCate.dist === selectedDist)
                                .map(at => (
                                    <li
                                        key={at.area_tag_idx}
                                        className={(selectedArea.includes(at.tag_name) ? "activeArea " : "noneActiveArea ") +
                                            (at.city === selectedCity ? "" : "hidden")}
                                        onClick={() => toggleArea(at.tag_name)}
                                    >{at.tag_name}</li>
                                ))}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );

}