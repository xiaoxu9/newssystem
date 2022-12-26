/**
 * 管理侧边栏
 */
export const CollapsedReducer = (prevState={
    isCollapsed: false
}, action)=>{
    let {type} = action
    switch(type){
        case "change-collapsed":
            let newState = {...prevState};
            newState.isCollapsed = !newState.isCollapsed
            return newState;
        default:
            return prevState;
    }
}