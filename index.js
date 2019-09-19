import React from 'react';
import { Navigation } from "react-native-navigation";
import Screen from './Screen';
import Page from './Page';

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
                    let command = props.$href;
                    if(typeof(command) == 'string'){
                        command = {
                            url: command
                        };
                    }
                    if(!command.type){
                        command.type = 'push';
                    }
                    if(!command.target){
                        if(command.type == 'push' && this._reactInternalFiber._debugOwner.stateNode.$center){
                            command.target = this._reactInternalFiber._debugOwner.stateNode.$center;
                            if(!command.afterNav){
                                command.afterNav = this._reactInternalFiber._debugOwner.stateNode.$close;
                            }
                        }else{
                            command.target = this._reactInternalFiber._debugOwner.stateNode;
                        }
                    }
                    if(command.type == 'push'){
                        if(typeof(command.target) === 'string'){

                        }else{
                            if(!command.target.props.$layout || !command.target.props.$layout.isInStack){
                                command.type = 'overlay';
                            }
                        }
                    }
                    return <this.constructor {...props} $href_={props.$href} onPress={()=>$Nav.go(command)}/>;
                }
            }
            return this;
        }
    }

    React.Component = Comp;
}



Navigation.setDefaultOptions({
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
});



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

let _regComp = function(k, comp){
    Navigation.registerComponent(k, () => comp);
};

let _comp_id = 0;
let _findComp = function(obj, re){
    if(!re){
        re = {};
    }
    if(obj){
        if(obj instanceof Array){
            for(let i = 0; i < obj.length; i++){
                _findComp(obj[i], re);
            }
        }else{
            if(obj.stack){
                re.stack = obj.stack;
                _findComp(re.stack, re);
            }else if(obj.component){
                re.component = obj.component;
            }else{
                for(var k in obj){
                    _findComp(obj[k], re);
                }
            }
        }
    }
    return re;
};

let sortOutLayout = function(layout, isInStack){
    if(layout instanceof Array){
        for(let i = 0; i < layout.length; i++){
            sortOutLayout(layout[i], isInStack);
        }
    } else if(layout instanceof Object){
        for(let k in layout){
            let obj = layout[k];
            if(k == 'component' || k == 'stack'){
                if(!obj.id){
                    obj.id = k + '_' + (_comp_id++);
                }
            }else if(k == 'sideMenu'){
                let _left = obj.left, _center = obj.center, _right = obj.right,
                    _leftComp = undefined, _centerObj = undefined, _centerO = undefined, _rightComp = undefined;
                if(_left){
                    _leftComp = _left.component;
                }
                if(_right){
                    _rightComp = _right.component;
                }
                if(_center){
                    _centerObj = _findComp(_center);
                }
                if(_leftComp){
                    if(!_leftComp.id){
                        _leftComp.id = 'sideMenuLeft_' + (_comp_id++);
                    }
                }
                if(_rightComp){
                    if(!_rightComp.id){
                        _rightComp.id = 'sideMenuRight_' + (_comp_id++);
                    }
                }
                if(_centerObj){
                    if(_centerObj.stack){
                        if(!_centerObj.stack.id){
                            _centerObj.stack.id = 'sideMenuCenterStack_' + (_comp_id++);
                        }
                    }
                    if(_centerObj.component){
                        if(!_centerObj.component.id){
                            _centerObj.component.id = 'sideMenuCenterComp_' + (_comp_id++);
                        }
                    }
                    _centerO = _centerObj.component || _centerObj.statck;
                }
                if(_leftComp){
                    if(!_leftComp.passProps){
                        _leftComp.passProps = {};
                    }
                    if(!_leftComp.passProps.$layout){
                        _leftComp.passProps.$layout = {};
                    }
                    _leftComp.passProps.$layout.type = 'sideMenuLeft';
                    if(_centerO){
                        _leftComp.passProps.$layout.centerId = _centerO.id;
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
                    if(_centerO){
                        _rightComp.passProps.$layout.centerId = _centerO.id;
                    }
                }
                if(_centerO){
                    if(!_centerO.passProps){
                        _centerO.passProps = {};
                    }
                    if(!_centerO.passProps.$layout){
                        _centerO.passProps.$layout = {};
                    }
                    _centerO.passProps.$layout.type = 'sideMenuCenter';
                    if(_leftComp){
                        _centerO.passProps.$layout.leftId = _leftComp.id;
                    }
                    if(_rightComp){
                        _centerO.passProps.$layout.rightId = _rightComp.id;
                    }
                }
            }
            if(k == 'component'){
                if(isInStack){
                    if(!obj.passProps){
                        obj.passProps = {};
                    }
                    if(!obj.passProps.$layout){
                        obj.passProps.$layout = {};
                    }
                    obj.passProps.$layout.isInStack = true;
                }
            }else{
                sortOutLayout(obj, k == 'stack' || isInStack);
            }
        }
    }
};

// defaultOptions: use to Navigation.setDefaultOptions(...)
// pages: object, key-value, screen components, them extends from $Nav.Page
// promises: array, promise list, pre-load resources
// layout: JSON, layout config
$Nav.init = function(options){
    if(options.defaultOptions){
        if(options.defaultOptions.animations){
            Object.assign(_defaultOptions.animations, options.defaultOptions.animations);
            delete options.defaultOptions.animations;
        }
        Object.assign(_defaultOptions, options.defaultOptions);
    }
    $Nav.setDefaultOptions(_defaultOptions);
    if(options.pages){
        for(let k in options.pages){
            _regComp(k, options.pages[k]);
            $Nav.pages[k] = options.pages[k];
        }
    }
    if(options.layout){
        Navigation.events().registerAppLaunchedListener(() => {
            let _f = (ps) => {
                let _layout = options.layout;
                if(_layout instanceof Function){
                    _layout = _layout.apply(null, ps);
                }
                sortOutLayout(_layout);
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
};

$Nav.go = function(command){
    if(command.type && command.url && $Nav.pages[command.url]){
        if(command.type == 'push'){
            let _target = command.target;
            if(typeof(_target) === 'string'){
                command.target = Screen.get(_target);
            }else{
                _target = command.target.props.componentId;
            }
            Navigation.push(_target, {
                component: {
                    name: command.url,
                    passProps: {
                        $from: {command: command},
                        $data: command.data,
                        $layout: command.target.props ? command.target.props.$layout : undefined,
                        $opener: command.target
                    },
                    optoins: merge($Nav.pages[command.url].options, command.options)
                }
            });
        }else if(command.type == 'overlay'){
            Navigation.showOverlay({
                component: {
                    name: command.url,
                    passProps: {
                        $from: {command: command},
                        $data: command.data
                    },
                    options: merge({
                        overlay: {
                            interceptTouchOutside: true
                        }
                    }, $Nav.pages[command.url].options, command.options)
                }
            });
        }else if(command.type == 'modal'){
            Navigation.showModal({
                stack: {
                    children: [{
                        component: {
                            name: command.url,
                            passProps: {
                                $from: {command: command},
                                $data: command.data
                            },
                            options: merge({
                                topBar: {
                                    visible: false
                                }
                            }, $Nav.pages[command.url].options, command.options)
                        }
                    }]
                }
            });
        }
        
        if(command.afterNav){
            command.afterNav();
        }
    }
};

export default $Nav;