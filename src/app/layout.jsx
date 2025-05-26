import './mainCss.css';
import './list/listCss.css';
import './mypage/myPageCss.css';
/*공지사항 css 부터*/

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