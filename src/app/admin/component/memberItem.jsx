'use client'
import {useState} from "react";
import Ban from "@/app/admin/component/ban";
import {Popover} from "@mui/material";

export default function MemberItem({item, adminClick}){

    const [open, setOpen] =  useState(false);

    // 작성자에게 쪽지보내기, 작성자 정보보기 팝업
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedUser, setSelectedUser] = useState({ user_id: '', nickname: '' });

    const handleAuthorClick = (event, user_id, nickname) => {
        setAnchorEl(event.currentTarget);
        setSelectedUser({ user_id, nickname });
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const openn = Boolean(anchorEl);
    const id = openn ? 'simple-popover' : undefined;

    const memberInfo = (selectedUser) => {
        location.href = `/mypage?user_id=${selectedUser.user_id}`
    }
    const sendMsg = (selectedUser) => {
        if (typeof window !== 'undefined') {
            user_id.current = sessionStorage.getItem('user_id');
            if (!user_id.current) {
                alert('로그인이 필요한 서비스입니다.');
            } else {
                location.href = `/message/messageWrite?recip=${selectedUser.user_id}&nickname=${selectedUser.nickname}`
            }
        }
    };

    return(
        <>
            <div className={"member list"}>
                <span>{item.user_id}</span>
                {/*아래에 유저 페이지 이동*/}
                <span onClick={(e) => handleAuthorClick(e, item.user_id, item.nickname)}>{item.nickname}</span>
                <span className={"long"}>{item.email}</span>
                <span className={"long"}>{item.reg_date}</span>
                <div className={"buttons"}>
                    <div className={'member button'} onClick={()=>setOpen(!open)}>정지</div>
                    {open ? <Ban user_id={item.user_id} user_nickname={item.nickname} setOpen={setOpen}/>:null}
                    <div id={item.user_id} className={item.admin ? 'member button admin':'member button'} onClick={(e)=>adminClick(e)}>관리자 부여</div>
                </div>
            </div>
            {/*회원 닉네임 누르면 뜨는 팝업창*/}
            <Popover
                id={id}
                open={openn}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <div style={{
                    padding: '12px',
                    minWidth: '145px', // 기존 대비 약 10% 증가
                    backgroundColor: '#f9f9f9',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    fontFamily: 'Segoe UI, Noto Sans KR, Roboto, Helvetica, Arial, sans-serif',
                    color: '#222',
                    textAlign: 'left', // 전체 텍스트 기본 왼쪽 정렬
                    border: '1px solid #ddd'
                }}>
                    <p style={{
                        margin: '0 0 12px 0',
                        fontWeight: '600',
                        fontSize: '12px',
                        color: '#111'
                    }}>
                        <b>{selectedUser.nickname}</b> 님
                    </p>
                    <button
                        onClick={() => memberInfo(selectedUser)}
                        style={{
                            width: '100%',
                            padding: '7px',
                            marginBottom: '4px',  // 간격 절반으로 줄임
                            backgroundColor: '#CC503B',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '10px',
                            letterSpacing: '0.3px',
                            transition: 'background-color 0.3s ease'
                        }}
                        onMouseOver={e => e.currentTarget.style.backgroundColor = '#b64532'}
                        onMouseOut={e => e.currentTarget.style.backgroundColor = '#CC503B'}
                    >
                        회원정보 보기
                    </button>
                    <button
                        onClick={() => sendMsg(selectedUser)}
                        style={{
                            width: '100%',
                            padding: '7px',
                            backgroundColor: '#CC503B',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '10px',
                            letterSpacing: '0.3px',
                            transition: 'background-color 0.3s ease'
                        }}
                        onMouseOver={e => e.currentTarget.style.backgroundColor = '#b64532'}
                        onMouseOut={e => e.currentTarget.style.backgroundColor = '#CC503B'}
                    >
                        쪽지 보내기
                    </button>
                </div>
            </Popover>
        </>
    );
}