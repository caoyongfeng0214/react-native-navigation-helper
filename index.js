import React from 'react';
import { Navigation } from "react-native-navigation";
import Screen from './Screen';
import Page from './Page';
// import CMD from './command';
import Layout from './layout';

let _merge = function(a, b){
    if(!a){
        a = {};
    }
    if(b && b instanceof Object){
        for(let k1 in b){
            let v1 = b[k1];
            if(v1 === null){
                delete a[k1];
            }else{
                let v0 = a[k1];
                if(!(v0 instanceof Object) || !(v1 instanceof Object)){
                    a[k1] = v1;
                }else{
                    merge(v0, v1);
                }
            }
        }
    }
    return a;
};

let merge = function(){
    let a = arguments[0] || {};
    for(let i = 1; i < arguments.length; i++){
        if(arguments[i]){
            _merge(a, arguments[i]);
        }
    }
    return a;
};


if(!React.Component.$_ISCOMP){
    class Comp extends React.Component{
        static $_ISCOMP = true;
        constructor(props){
            super(props);
            if(props && props.$href && !(props.$href_)){
                this.render = () => {
                    // let command = props.$href;
                    // if(typeof(command) === 'string'){
                    //     command = {
                    //         url: command
                    //     };
                    // }
                    // if(!command.type){
                    //     command.type = 'push';
                    // }
                    // if(!command.target){
                    //     if(command.type == 'push' && this._reactInternalFiber._debugOwner.stateNode.$center){
                    //         command.target = this._reactInternalFiber._debugOwner.stateNode.$center;
                    //         if(!command.afterNav){
                    //             command.afterNav = this._reactInternalFiber._debugOwner.stateNode.$close;
                    //         }
                    //     }else{
                    //         command.target = this._reactInternalFiber._debugOwner.stateNode;
                    //     }
                    // }
                    // if(command.type == 'push'){
                    //     if(typeof(command.target) === 'string'){

                    //     }else{
                    //         if(!command.target.props.$layout || !command.target.props.$layout.isInStack){
                    //             command.type = 'overlay';
                    //         }
                    //     }
                    // }

                    // let command = CMD.parse(props.$href, this._reactInternalFiber._debugOwner.stateNode);
                    // return <this.constructor {...props} $href_={props.$href} onPress={()=>$Nav.go(command)}/>;

                    return <this.constructor {...props} $href_={props.$href} onPress={()=>this._reactInternalFiber._debugOwner.stateNode.$go(props.$href)}/>;
                }
            }
            return this;
        }
    }

    React.Component = Comp;
}


global.$Nav = {
    pages: {},
    Page: Page,
    Screen: Screen
};

$Nav.nav = Navigation;

let _defaultOptions = {
    topBar: {
        animate: true
    },
    animations: {
        push: {
            enabled: true,
            content: {
                x: {
                    from: 1000,
                    to: 0,
                    duration: 300
                }
            },
            topBar:{
                waitForRender: true,
                x: {
                    from: 1000,
                    to: 0,
                    duration: 300
                }
            }
        },
        pop: {
            enabled: true,
            content: {
                x: {
                    from: 0,
                    to: 1000,
                    duration: 300
                }
            },
            topBar:{
                // visible:false,
                x: {
                    from: 0,
                    to: 1000,
                    duration: 300
                }
            }
            
        }
    }
};

$Nav.setDefaultOptions = function(options){
    Navigation.setDefaultOptions(options);
};

$Nav.setOptions = function(compId, options){
    if(options){
        Navigation.mergeOptions(compId, options);
    }
};

let _regComp = function(k, comp){
    Navigation.registerComponent(k, () => comp);
};

let _findComp = function(obj){
    if(obj){
        if(obj instanceof Array){
            for(let i = 0; i < obj.length; i++){
                let _re = _findComp(obj[i]);
                if(_re){
                    return _re;
                }
            }
        }else if(obj instanceof Object){
            if(obj.component){
                return obj.component;
            }else{
                for(var k in obj){
                    let _re = _findComp(obj[k]);
                    if(_re){
                        return _re;
                    }
                }
            }
        }
    }
    return undefined;
};

// let _comp_id = 0;
// let sortOutLayout = function(layout, isInStack){
//     if(layout instanceof Array){
//         for(let i = 0; i < layout.length; i++){
//             sortOutLayout(layout[i], isInStack);
//         }
//     } else if(layout instanceof Object){
//         for(let k in layout){
//             let obj = layout[k];
//             if(k == 'component' || k == 'stack'){
//                 if(!obj.id){
//                     obj.id = k + '_' + (_comp_id++);
//                 }
//             }else if(k == 'sideMenu'){
//                 let _left = obj.left, _center = obj.center, _right = obj.right,
//                     _leftComp = undefined, _centerComp = undefined, _rightComp = undefined;
//                 if(_left){
//                     _leftComp = _left.component;
//                 }
//                 if(_right){
//                     _rightComp = _right.component;
//                 }
//                 if(_center){
//                     _centerComp = _findComp(_center);
//                 }
//                 if(_leftComp){
//                     if(!_leftComp.id){
//                         _leftComp.id = 'sideMenuLeft_' + (_comp_id++);
//                     }
//                 }
//                 if(_rightComp){
//                     if(!_rightComp.id){
//                         _rightComp.id = 'sideMenuRight_' + (_comp_id++);
//                     }
//                 }
//                 if(_centerComp){
//                     _centerComp.id = 'sideMenuCenterComp_' + (_comp_id++);
//                 }
//                 if(_leftComp){
//                     if(!_leftComp.passProps){
//                         _leftComp.passProps = {};
//                     }
//                     if(!_leftComp.passProps.$layout){
//                         _leftComp.passProps.$layout = {};
//                     }
//                     _leftComp.passProps.$layout.type = 'sideMenuLeft';
//                     if(_centerComp){
//                         _leftComp.passProps.$layout.centerId = _centerComp.id;
//                     }
//                 }
//                 if(_rightComp){
//                     if(!_rightComp.passProps){
//                         _rightComp.passProps = {};
//                     }
//                     if(!_rightComp.passProps.$layout){
//                         _rightComp.passProps.$layout = {};
//                     }
//                     _rightComp.passProps.$layout.type = 'sideMenuRight';
//                     if(_centerComp){
//                         _rightComp.passProps.$layout.centerId = _centerComp.id;
//                     }
//                 }
//                 if(_centerComp){
//                     if(!_centerComp.passProps){
//                         _centerComp.passProps = {};
//                     }
//                     if(!_centerComp.passProps.$layout){
//                         _centerComp.passProps.$layout = {};
//                     }
//                     _centerComp.passProps.$layout.type = 'sideMenuCenter';
//                     if(_leftComp){
//                         _centerComp.passProps.$layout.leftId = _leftComp.id;
//                     }
//                     if(_rightComp){
//                         _centerComp.passProps.$layout.rightId = _rightComp.id;
//                     }
//                 }
//             }
//             if(k == 'component'){
//                 if(isInStack){
//                     if(!obj.passProps){
//                         obj.passProps = {};
//                     }
//                     if(!obj.passProps.$layout){
//                         obj.passProps.$layout = {};
//                     }
//                     obj.passProps.$layout.isInStack = true;
//                 }
//             }else{
//                 sortOutLayout(obj, k == 'stack' || isInStack);
//             }
//         }
//     }
// };

$Nav.layout = undefined;

let BEFORENAV = undefined;

// defaultOptions: use to Navigation.setDefaultOptions(...)
// pages: object, key-value, screen components, them extends from $Nav.Page
// promises: array, promise list, pre-load resources
// layout: JSON, layout config
// beforeNav: function, it return a Promise or boolean
$Nav.init = function(options){
    if(options.pages){
        for(let k in options.pages){
            _regComp(k, options.pages[k]);
            $Nav.pages[k] = options.pages[k];
        }
    }
    if(options.layout){
        Navigation.events().registerAppLaunchedListener(() => {
            if(options.defaultOptions){
                if(options.defaultOptions.animations){
                    Object.assign(_defaultOptions.animations, options.defaultOptions.animations);
                    delete options.defaultOptions.animations;
                }
                Object.assign(_defaultOptions, options.defaultOptions);
            }
            $Nav.setDefaultOptions(_defaultOptions);

            Navigation.events().registerComponentDidAppearListener((comp) => {
                let screen = Screen.get(comp.componentId);
                if(screen){
                    screen.$state = Page.STATE.APPEAR;
                }
            });

            Navigation.events().registerComponentDidDisappearListener((comp) => {
                let screen = Screen.get(comp.componentId);
                if(screen){
                    screen.$state = Page.STATE.DISAPPEAR;
                }
            });

            let _f = (ps) => {
                let _layout = options.layout;
                if(_layout instanceof Function){
                    _layout = _layout.apply(null, ps);
                }
                // sortOutLayout(_layout);
                for(let k in _layout){
                    Layout.sortOut(_layout[k]);
                }
                
                $Nav.layout = _layout;
                Navigation.setRoot(_layout);
            };
            if(options.promises){
                Promise.all(options.promises).then((...results)=>{
                    _f(results[0]);
                });
            }else{
                _f();
            }
        });
    }
    if(options.beforeNav && options.beforeNav instanceof Function){
        BEFORENAV = options.beforeNav;
    }
};

let _rejectData = function(obj, data){
    if(obj && data && data.passProps){
        if(obj instanceof Array){
            for(let i = 0; i < obj.length; i++){
                _rejectData(obj[i], data);
            }
        }else if(obj instanceof Object){
            for(let k in obj){
                let v = obj[k];
                if(v){
                    if(k == 'component'){
                        if(!v._passProps){
                            v._passProps = v.passProps || {};
                        }
                        v.passProps = merge({}, v._passProps, data.passProps);
                    }else{
                        _rejectData(v, data);
                    }
                }
            }
        }
    }
};

$Nav.go = function(command){
    if(command.type && command.url && ($Nav.layout[command.url] || $Nav.pages[command.url])){
        let _do = ()=>{
            let _layout = $Nav.layout[command.url];
            if(command.type == 'push'){
                let _target = command.target;
                if(typeof(_target) === 'string'){
                    command.target = Screen.get(_target);
                }else{
                    _target = command.target.props.componentId;
                }
                if(_layout){
                    // let $_layout = undefined;
                    // if(command.target && command.target.props && command.target.props.$layout){
                    //     $_layout = {};
                    //     for(let k in command.target.props.$layout){
                    //         if(k != 'windowId'){
                    //             $_layout[k] = command.target.props.$layout[k];
                    //         }
                    //     }
                    // }
                    _rejectData(_layout, {
                        passProps:{
                            $from: {command: command},
                            $data: command.data,
                            // $layout: $_layout,
                            $opener: command.opener
                        }
                    });
                }else{
                    _layout = {
                        component: {
                            name: command.url,
                            passProps: {
                                $from: {command: command},
                                $data: command.data,
                                $layout: (command.target && command.target.props) ? command.target.props.$layout : undefined,
                                $opener: command.opener
                            },
                            optoins: merge($Nav.pages[command.url].options, command.options)
                        }
                    };
                }
                Navigation.push(_target, _layout);
            }else if(command.type == 'overlay'){
                if(_layout){
                    _rejectData(_layout, {
                        passProps:{
                            $from: {command: command},
                            $data: command.data,
                            $opener: command.opener
                        }
                    });
                }else{
                    _layout = {
                        component: {
                            name: command.url,
                            passProps: {
                                $from: {command: command},
                                $data: command.data,
                                $opener: command.opener
                            },
                            options: merge({
                                overlay: {
                                    interceptTouchOutside: true
                                }
                            }, $Nav.pages[command.url].options, command.options)
                        }
                    };
                }
                Navigation.showOverlay(_layout);
            }else if(command.type == 'modal'){
                if(_layout){
                    _rejectData(_layout, {
                        passProps:{
                            $from: {command: command},
                            $data: command.data,
                            $opener: command.opener
                        }
                    });
                }else{
                    _layout = {
                        stack: {
                            children: [{
                                component: {
                                    name: command.url,
                                    passProps: {
                                        $from: {command: command},
                                        $data: command.data,
                                        $opener: command.opener
                                    },
                                    options: merge({
                                        topBar: {
                                            visible: false
                                        }
                                    }, $Nav.pages[command.url].options, command.options)
                                }
                            }]
                        }
                    };
                }
                Navigation.showModal(_layout);
            }
            
            if(command.afterNav){
                command.afterNav();
            }
        };
        if(BEFORENAV){
            let check = BEFORENAV(command.opener, command.url, $Nav.layout[command.url] || $Nav.pages[command.url]);
            if(check instanceof Promise){
                check.then((o)=>{
                    if(o){
                        _do();
                    }
                }).catch(()=>{});
            }else{
                if(check){
                    _do();
                }
            }
        }else{
            _do();
        }
    }
};

export default $Nav;