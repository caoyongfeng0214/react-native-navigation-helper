let Layout = function(){};

let _comp_id = 0;

let _findComp = function(obj){
    if(obj){
        if(obj instanceof Array){
            for(let i = 0; i < obj.length; i++){
                let o = _findComp(obj[i]);
                if(o){
                    return o;
                }
            }
        }else if(obj instanceof Object){
            for(let k in obj){
                if(k == 'component'){
                    return obj[k];
                }else{
                    let o = _findComp(obj[k]);
                    if(o){
                        return o;
                    }
                }
            }
        }
    }
    return undefined;
};

let sideMenu = function(obj){
    let _left = obj.left, _center = obj.center, _right = obj.right,
        _leftComp = undefined, _centerComp = undefined, _rightComp = undefined;
    if(_left){
        _leftComp = _findComp(_left);
        if(_leftComp){
            if(!_leftComp.id){
                _leftComp.id = 'sideMenuLeft_' + (_comp_id++);
            }
        }
    }
    if(_right){
        _rightComp = _findComp(_right);
        if(_rightComp){
            if(!_rightComp.id){
                _rightComp.id = 'sideMenuRight_' + (_comp_id++);
            }
        }
    }
    if(_center){
        _centerComp = _findComp(_center);
        if(_centerComp){
            _centerComp.id = 'sideMenuCenterComp_' + (_comp_id++);
        }
    }
    if(_leftComp){
        if(!_leftComp.passProps){
            _leftComp.passProps = {};
        }
        if(!_leftComp.passProps.$layout){
            _leftComp.passProps.$layout = {};
        }
        _leftComp.passProps.$layout.type = 'sideMenuLeft';
        if(_centerComp){
            _leftComp.passProps.$layout.centerId = _centerComp.id;
        }
    }
    if(_rightComp){
        if(!_rightComp.passProps){
            _rightComp.passProps = {};
        }
        if(!_rightComp.passProps.$layout){
            _rightComp.passProps.$layout = {};
        }
        _rightComp.passProps.$layout.type = 'sideMenuRight';
        if(_centerComp){
            _rightComp.passProps.$layout.centerId = _centerComp.id;
        }
    }
    if(_centerComp){
        if(!_centerComp.passProps){
            _centerComp.passProps = {};
        }
        if(!_centerComp.passProps.$layout){
            _centerComp.passProps.$layout = {};
        }
        _centerComp.passProps.$layout.type = 'sideMenuCenter';
        if(_leftComp){
            _centerComp.passProps.$layout.leftId = _leftComp.id;
        }
        if(_rightComp){
            _centerComp.passProps.$layout.rightId = _rightComp.id;
        }
    }
};

Layout.sortOut = function(layout, options){
    options = options || {};
    if(layout instanceof Array){
        for(let i = 0; i < layout.length; i++){
            Layout.sortOut(layout[i], options);
        }
    } else if(layout instanceof Object){
        for(let k in layout){
            let obj = layout[k];
            if(k == 'component' || k == 'stack' || k == 'sideMenu'|| k == 'bottomTabs'){
                if(!obj.id){
                    obj.id = k + '_' + (_comp_id++);
                }
                if(!options.windowId){
                    options.windowId = obj.id;
                }
                if(k == 'stack'){
                    options.stackId = obj.id;
                }else if(k == 'sideMenu'){
                    options.sideMenuId = obj.id;
                    sideMenu(obj);
                }else if(k == 'bottomTabs'){
                    options.bottomTabsId = obj.id;
                }
            }
            if(k == 'component'){
                if(!obj.passProps){
                    obj.passProps = {};
                }
                if(!obj.passProps.$layout){
                    obj.passProps.$layout = {};
                }
                for(let m in options){
                    obj.passProps.$layout[m] = options[m];
                }
            }else{
                Layout.sortOut(obj, options);
            }
        }
    }
};

export default Layout;