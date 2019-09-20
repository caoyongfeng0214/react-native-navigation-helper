let Screen = function(){};

Screen.screens = {};

Screen.push = function(screen){
    if(screen.props && screen.props.componentId){
        // let ary = Screen.screens[screen.props.componentId];
        // if(!ary){
        //     ary = Screen.screens[screen.props.componentId] = [];
        // }
        // ary.push(screen);

        Screen.screens[screen.props.componentId] = screen;
    }
};

Screen.get = function(id){
    // let ary = Screen.screens[id];
    // if(ary){
    //     return ary[ary.length - 1];
    // }
    // return undefined;

    return Screen.screens[id];
};

// Screen.gets = function(id){
//     return Screen.screens[id] || [];
// };

Screen.remove = function(screen){
    if(screen.props && screen.props.componentId){
        // let ary = Screen.screens[screen.props.componentId];
        // if(ary){
        //     ary = Screen.screens[screen.props.componentId] = ary.filter((T)=>{
        //         return T != screen;
        //     });
        //     if(ary.length == 0){
        //         delete Screen.screens[screen.props.componentId];
        //     }
        // }

        delete Screen.screens[screen.props.componentId];
    }
};

export default Screen;