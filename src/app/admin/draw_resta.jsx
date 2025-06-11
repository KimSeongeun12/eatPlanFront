'use client'

import {useEffect, useRef, useState} from "react";
import axios from "axios";
import RestaDetail from "@/app/admin/restaDetail";
import {Pagination, Stack} from "@mui/material";

export default function DrawResta({leftMenu}){
    const [list,setList] = useState([]); //식당 리스트
    const [sort,setSort]=useState('');
    let page=useRef(1);
    let totalPages=useRef(1);

    const [component,setComponent]=useState(null); //식당 디테일 컴포넌트 state

    useEffect(()=>{
        setSort('resta_name');
    }, []);

    useEffect(() => {
        axios.get(`http://192.168.0.120/adtag_restaList/1/resta_name`).then(({data})=>{
            totalPages.current=data.restaList.pages;
            const result=data.restaList.list.map((item)=>{
                console.log(item);
                return(
                    <div key={item.resta_idx}
                         style={{padding:"5px", border:"1px solid lightgray", display:'flex', flexDirection:'row'}}>
                        {/*식당 이름*/}
                        <div style={{width:"200px", cursor:"pointer"}} onClick={()=>openDetail(item.resta_idx)}>{item.resta_name}</div>
                        {/*식당 주소*/}
                        <div style={{position:"relative", right:"-20%"}}>{item.address}</div>
                    </div>
                );
            });
            setList(result);
        })
    }, [leftMenu]);

    const openDetail =(idx)=>{
        setComponent(<RestaDetail resta_idx={idx}/>);
    }

    // ----- 페이지네이션 ---- //
    const changePage=(e, val)=>{
        page.current=val
        drawResta();
    }

    // --------------------- 식당 리스트를 뽑는 함수 --------------------- //
    const drawResta = (e)=>{
        if(e){
            setSort(e.target.options[e.target.selectedIndex].value);
        }
        axios.get(`http://192.168.0.120/adtag_restaList/${page.current}/${sort}`).then(({data})=>{
            const result=data.restaList.list.map((item)=>{
                return(
                    <div key={item.resta_idx}
                         style={{padding:"5px", border:"1px solid lightgray", display:'flex', flexDirection:'row'}}>
                        {/*식당 이름*/}
                        <div style={{width:"200px", cursor:"pointer"}} onClick={()=>openDetail(item.resta_idx)}>{item.resta_name}</div>
                        {/*식당 주소*/}
                        <div style={{position:"relative", right:"-20%"}}>{item.address}</div>
                    </div>
                );
            });
            setList(result);
        });

    }

    const sortList=(e)=>{
        setSort(e.target.options[e.target.selectedIndex].value);
    }

    // #페이징처리 필요

    return(
        <>
            {/*상단 바*/}
            <div className={"sort"} style={{position:"relative"}}>
                <select name={"sort"}
                        style={{height:"30px", position:"absolute", right:"30%", top:"30%"}}
                        value={sort}
                        onChange={(e)=>drawResta(e)}>
                    <option value={"resta_name"} >식당 이름 순</option>
                    <option value={"address"}>식당별 주소 순</option>
                </select>
            </div>
            {/*실질적인 식당 리스트가 출력되는 부분*/}
            <div className={"resta-list"}>
                <br/><br/>
                {list}
            </div>
            {component}
            <Stack spacing={2}>
                <Pagination
                    count={totalPages.current}
                    color={'primary'}
                    variant={'outlined'}
                    shape={"rounded"}
                    siblingCount={2} //현재 페이지 양쪽에 표시할 갯수
                    onChange={changePage}
                />
            </Stack>
        </>
    );
}

