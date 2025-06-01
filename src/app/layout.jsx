import './mainCss.css';
import './list/listCss.css';
//import './mypage/myPageCss.css';
import '@/app/mypage_update/myInfo_updateCss.css';
/*공지사항 css 부터*/
import './report/reportList.css';

export default function layout({children}) {
    return (
        <html>
        <head>
            <meta charSet="utf-8" />
            <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=94e036a27f572c7ed53e3d333ecb0210&autoload=false"></script>
            <title>EatPlan</title>
        </head>
        <body>
        {children}
        </body>
        </html>
    );
}