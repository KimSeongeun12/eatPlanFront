'use client'

import {useEffect, useMemo, useState} from "react";
import axios from "axios";

export default function AreaField(){


    /*
    * 여기다가 만들어주시면 됩니다
    * */

    return (
        <>
            <table>
                <tbody>
                <tr>
                    {/*city, dist, tag_name*/}
                    <td className={"city"}>city</td>
                    <td className={"dist"}>dist</td>
                    <td className={"tag_name"}>tag</td>
                </tr>
                </tbody>
            </table>
        </>
    );

}