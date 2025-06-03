'use client'

import {useEffect, useState} from "react";
import axios from "axios";

const TagAddModal = ({ onClose }) => {
    const [visible, setVisible] = useState('all');

    const showAll = () => setVisible('all');
    const showLocation = () => setVisible('location');
    const showResta = () => setVisible('resta');
    const showAtmo =  () => setVisible('atmo');
    const showRound = () => setVisible('round');
    const showPeople = () => setVisible('people');
    const showSearchTap = () => setVisible('searchTap');

    const [list, setList] = useState([]);

    const listTag = async () => {
        try {
            const {data} = await axios.get('http://localhost/list_tag');
            setList(data.list_tag_whole);
        } catch (e) {
            console.error("태그 로딩 실패", e);
        }
    };

    useEffect(() => {
        if (visible === 'all') {
            listTag();
        }
    }, [visible]);

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <input type="text" placeholder="원하는 태그를 검색해주세요." />
                <button>검색</button>
                <div>여기에 선택한 태그 이름들이 표시됨</div>
                <div style={{display: 'flex'}}>
                    <div onClick={listTag} className={"tagTap"}>전체</div>
                    <div onClick={showLocation} className={"tagTap"}>지역</div>
                    <div onClick={showResta} className={"tagTap"}>식당 종류</div>
                    <div onClick={showAtmo} className={"tagTap"}>분위기</div>
                    <div onClick={showRound} className={"tagTap"}>n차</div>
                    <div onClick={showPeople} className={"tagTap"}>인원수</div>
                    <div onClick={showSearchTap} className={"tagTap"}>이름 검색</div>
                </div>

                <div style={{width: '516px', height: '500px', border: '1px solid black'}}>
                    {visible === 'all' && <All list={list} />}
                    {visible === 'location' && <Location />}
                    {visible === 'resta' && <Resta />}
                    {visible === 'atmo' && <Atmo />}
                    {visible === 'round' && <Round />}
                    {visible === 'people' && <People />}
                    {visible === 'searchTap' && <SearchTap />}
                </div>

                <button onClick={onClose}>닫기</button>
                <button>선택</button>
            </div>
        </div>
    );
};

export default TagAddModal;

const All = ({list}) => {
    return (
        <div>
            {list.length > 0 ? (
                list.map(item => (
                <div key={item.tag_idx}>{item.tag_name}</div>
                ))
            ) : (
                <div>리스트가 존재하지 않습니다.</div>
            )}
        </div>
    );
}

const Location = () => {
    return (
        <>
            지역탭
        </>
    );
}

const Resta = () => {
    return (
        <>
            식당종류탭
        </>
    );
}

const Atmo = () => {
    return (
        <>
            분위기탭
        </>
    );
}

const Round = () => {
    return (
        <>
            n차탭
        </>
    );
}

const People = () => {
    return (
        <>
            인원수탭
        </>
    );
}

const SearchTap = () => {
    return (
        <>
            이름검색탭
        </>
    );
}