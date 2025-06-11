'use client'

import {useEffect, useMemo, useState} from "react";
import axios from "axios";
import {CircularProgress} from "@mui/material";

export default function CourseSearch(){

    // 태그 카테고리 리스트 가져오기
    const [tagCate, setTagCate] = useState([]);
    const tagCateList = () => {
        return axios.get("http://localhost/list_tagcate").then(({data}) =>{
            setTagCate(data?.list_tagcate ?? []);
            console.log('태그 카테고리 리스트 : ',data.list_tagcate);
        })
    };

    // 지역태그 리스트 가져오기
    const [areaTag, setAreaTag] = useState([]);
    const areaTagList = () => {
        return axios.get("http://localhost/list_tag_area").then(({data}) => {
            setAreaTag(data?.list_area ?? []);
            console.log('지역태그 리스트 : ',data.list_area);
        })
    };

    // 태그 리스트 가져오기
    const [tag, setTag] = useState([]);
    const tagList = () => {
        return axios.get("http://localhost/list_tag").then(({data}) => {
            setTag(data?.list_tag_whole ?? []);
            console.log('태그 리스트 : ',data.list_tag_whole);
        })
    };

    const [isLoading, setIsLoading] = useState(true);

    // 페이지 입장시 백에서 태그 카테고리, 태그 리스트 가져오기
    useEffect(() => {
        const fetchTags = async () => {
            await Promise.all([tagCateList(), areaTagList(), tagList()])
                .finally(() => {
                    setIsLoading(false);
                });
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
    const [selectedTag, setSelectedTag] = useState([]);   // 선택한 태그
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

    // 태그 선택, 취소하기
    const toggleTag = (tag) => {
        setSelectedTag(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
        setSelectedList(prev => {
            const isSelected = selectedTag.includes(tag);
            if (isSelected) {
                return prev.filter(entry => !(entry.type === 'tag' && entry.value === tag));
            } else {
                return [...prev, { type: 'tag', value: tag }];
            }
        });
    };

    // 선택한 태그들 초기화
    const resetAll = () => {
        setSelectedArea([]);
        setSelectedTag([]);
        setSelectedList([]);
    };

    // 텍스트검색 조건 결정
    const [searchType, setSearchType] = useState("subject"); // "subject" 또는 "nickname"
    const [keyword, setKeyword] = useState(""); // input값 상태관리

    // 검색조건들 검색결과창 url로 넘겨주기
    const search = () => {
        const keyword = document.querySelector('.StringSearch').value;
        console.log(keyword);
        const encodedType = encodeURIComponent(searchType);
        const encodedKeyword  = encodeURIComponent(keyword);
        const stringSearch = keyword ? `${encodedType}=${encodedKeyword}` : '';

        const tagParams = selectedList.length > 0
            ? selectedList.map(tag => `tag=${encodeURIComponent(tag.value)}`).join('&')
            : '';

        const queryParts = [stringSearch, tagParams].filter(Boolean).join('&');
        const url = `/searchResult${queryParts ? `?${queryParts}` : ''}`;

        location.href= url;
    };

    // 텍스트검색창 엔터 기능 추가
    const keyHandler =(e)=>{
        if(e.key === 'Enter'){
            search();
        }
    };

    return(
        <>
            <div className="searchContainer">
                {isLoading ? (<CircularProgress />) :(
                    <>
                        {/*텍스트 검색창*/}
                        <div className={"searchWrapper"}>
                            <input
                                className={"StringSearch"}
                                type={"text"}
                                value={keyword}
                                onChange={e => setKeyword(e.target.value)}
                                onKeyUp={keyHandler}
                                placeholder={"코스 제목 또는 작성자를 입력하세요."}/>
                            <select className="searchFilter" value={searchType} onChange={e => setSearchType(e.target.value)}>
                                <option value="subject">제목</option>
                                <option value="nickname">작성자</option>
                            </select>
                            <button className={"searchBtn"} onClick={search}>
                                <img src={"searchIcon.png"} alt={"돋보기 아이콘"}/>
                            </button>
                        </div>

                        {/*선택한 태그 리스트, 초기화 버튼*/}
                        <div className="selectedRow">
                            <h3 className="selectedList">
                                {selectedList.map((item, idx) => (
                                    <span key={idx}
                                          onClick={() => {
                                              setSelectedList(prev => prev.filter(entry => entry.value !== item.value));
                                              if (item.type === 'area') {
                                                  setSelectedArea(prev => prev.filter(a => a !== item.value));
                                              }
                                              if (item.type === 'tag') {
                                                  setSelectedTag(prev => prev.filter(t => t !== item.value));
                                              }
                                          }}>
                                {item.value}
                            </span>
                                ))}
                            </h3>

                            <button onClick={resetAll} className="resetBtn">선택 초기화</button>
                        </div>

                        <div className={"tagAreaWrapper"}>

                            <h3 className={"areaCate"}>지역</h3>

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

                        {/*태그 리스트*/}
                        <div className="tagWrapper">
                            {tagCate
                                .filter(cate => cate.cate_idx !== 1)
                                .map(cate => {
                                    const tagsForCate = tag.filter(t => t.cate_idx === cate.cate_idx && t.isClass === 'course');
                                    return (
                                        <div key={cate.cate_idx} className="tag">
                                            <h3>{cate.cate_name}</h3>
                                            <ul>
                                                {tagsForCate.length > 0
                                                    ? tagsForCate.map(t =>
                                                        <li key={t.tag_idx}
                                                            className={selectedTag.includes(t.tag_name) ? "activeTag" : "noneActiveTag"}
                                                            onClick={() => toggleTag(t.tag_name)}
                                                        >{t.tag_name}</li>)
                                                    : <li className="empty">태그가 없습니다.</li>
                                                }
                                            </ul>
                                        </div>
                                    );
                                })}
                        </div>
                    </>
                )}
            </div>
        </>
    );
}