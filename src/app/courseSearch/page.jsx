'use client'

import LeftMenu from "@/app/leftMenu";
import './courseSearch.css';
import {useEffect, useMemo, useState} from "react";
import axios from "axios";

export default function CourseSearch(){

    // 태그 카테고리 리스트 가져오기
    const [tagCate, setTagCate] = useState([]);
    const tagCateList = () => {
        axios.get("http://localhost/list_tagcate").then(({data}) =>{
            setTagCate(data.list_tagcate);
            console.log('태그 카테고리 리스트 : ',data.list_tagcate);
        })
    };

    // 지역태그 리스트 가져오기
    const [areaTag, setAreaTag] = useState([]);
    const areaTagList = () => {
        axios.get("http://localhost/list_tag_area").then(({data}) => {
            setAreaTag(data.list_area);
            console.log('지역태그 리스트 : ',data.list_area);
        })
    };

    // 태그 리스트 가져오기
    const [tag, setTag] = useState([]);
    const tagList = () => {
        axios.get("http://localhost/list_tag").then(({data}) => {
            setTag(data.list_tag_whole);
            console.log('태그 리스트 : ',data.list_tag_whole);
        })
    };

    const [selectedCity, setSelectedCity] = useState("");
    const [selectedDist, setSelectedDist] = useState("");
    const [selectedArea, setSelectedArea] = useState("");

    useEffect(() => {
        tagCateList();
        areaTagList();
        tagList();
    }, []);

    const uniqueCities = useMemo(() => {
        return [...new Set(areaTag.map(at => at.city))];
    }, [areaTag]);
    const uniqueDist = useMemo(() =>{
        return [...new Set(areaTag.map(at => at.dist))];
    }, [areaTag]);

    const search = () => {
        location.href="/searchResult"
    };

    return (
        <>
            <LeftMenu />
            <div className={"searchWrapper"}>
                <input className={"StringSearch"} type={"text"} placeholder={"검색어를 입력해주세요"}/>
                <button className={"searchBtn"} onClick={search}>
                    <img src={"돋보기 아이콘.png"} alt={"돋보기 아이콘"}/>
                </button>
            </div>



            <div className={"tagAreaWrapper"}>

                <h3 className={"areaCate"}>지역</h3>

                <div className={"cityWrapper"}>
                <h5 className={"cityHead"}>시.도</h5>
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

                <div className={"distWrapper"}>
                <h5 className={"distHead"}>시.군.구</h5>
                <ul className={"dist"}>
                    {uniqueDist.map(dist => (
                        <li
                            key={dist}
                            className={dist === selectedDist ? "active" : ""}
                            onClick={() => setSelectedDist(dist)}
                        >{dist}</li>
                    ))}
                </ul>
                </div>

                <div className={"areaWrapper"}>
                <ul className={"area"}>
                    {areaTag.map(at => (
                        <li
                            key={at.area_tag_idx}
                            className={at.tag_name === selectedArea ? "active" : ""}
                            onClick={() => setSelectedArea(at.tag_name)}
                        >{at.tag_name}</li>
                    ))}
                </ul>
            </div>
            </div>




            <div className="tagWrapper">
                {tagCate
                    .filter(cate => cate.cate_idx !== 1)
                    .map(cate => {
                        const tagsForCate = tag.filter(t => t.cate_idx === cate.cate_idx);
                        return (
                            <div key={cate.cate_idx} className="category-block">
                                <h3>{cate.cate_name}</h3>
                                <ul>
                                    {tagsForCate.length > 0
                                        ? tagsForCate.map(t => <li key={t.tag_idx}>{t.tag_name}</li>)
                                        : <li className="empty">태그가 없습니다</li>
                                    }
                                </ul>
                            </div>
                        );
                    })}
            </div>
        </>
);
}