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
            <link rel="stylesheet" href="/richtexteditor/rte_theme_default.css" />
            <script type="text/javascript" src="/richtexteditor/rte.js"></script>
            <script type="text/javascript" src='/richtexteditor/plugins/all_plugins.js'></script>
        </head>
        <body>
        {children}
        </body>
        </html>
    );
}