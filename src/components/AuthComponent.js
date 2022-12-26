/**
 * 权限校验
 * 
 * @param {*} param0 
 * @returns 
 */

import { useState } from "react"
import Redirect from "./Redirect"


function AuthComponent({children}){
    // 控制权限
    const [isLogin, setLogin] = useState(true)
    return isLogin ? children : <Redirect to= "/login" />
}

export default AuthComponent