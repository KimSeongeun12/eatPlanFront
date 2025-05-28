import './mainCss.css';
import './list/listCss.css';
import './mypage/myPageCss.css';
import './myInfo_update/myInfo_updateCss.css';
/*공지사항 css 부터*/
import './report/reportList.css';

export default function layout({children}) {
    return (
        <html>
        <head>
            <meta charSet="utf-8" />
            <title>EatPlan</title>
        </head>
        <body>
        {children}
        </body>
        </html>
    );
}