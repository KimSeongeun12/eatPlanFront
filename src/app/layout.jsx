import './mainCss.css';

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