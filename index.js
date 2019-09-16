import Page from './Page';
import React from 'react';
import { Navigation } from "react-native-navigation";

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
                // console.log('000000');
                // console.log(this);
                this.render = () => {
                    let command = props.$href;
                    if(typeof(command) == 'string'){
                        command = {
                            url: command
                        };
                    }
                    if(!command.target){
                        command.target = this._reactInternalFiber._debugOwner.stateNode;
                    }
                    if(!command.type){
                        command.type = 'push';
                    }
                    if(command.type == 'push'){
                        if(!command.target.props.$layout || !command.target.props.$layout.isInStack){
                            command.type = 'overlay';
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
        visible: false,
        // drawBehind: true,
        // transparent: true,
        // translucent: true,
        // background: { color: '#ffffff' }
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
                // visible:false
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
    Page: Page
};

let _regComp = function(k, comp){
    Navigation.registerComponent(k, () => comp);
};

let sortOutLayout = function(layout, isInStack){
    if(layout instanceof Array){
        for(let i = 0; i < layout.length; i++){
            sortOutLayout(layout[i], isInStack);
        }
    } else if(layout instanceof Object){
        for(let k in layout){
            let obj = layout[k];
            if(k == 'component'){
                if(isInStack){
                    if(!obj.passProps){
                        obj.passProps = {};
                    }
                    obj.passProps.$layout = {isInStack: true};
                }
            }else{
                // console.log(k, k == 'stack', k == 'stack' || isInStack);
                sortOutLayout(obj, k == 'stack' || isInStack);
            }
        }
    }
};

$Nav.init = function(options){
    if(options.pages){
        for(let k in options.pages){
            _regComp(k, options.pages[k]);
            $Nav.pages[k] = options.pages[k];
        }
    }
    if(options.layout){
        sortOutLayout(options.layout);
        // console.log('======', options.layout);
        Navigation.events().registerAppLaunchedListener(() => {
            Navigation.setRoot(options.layout);
        });
    }
};

$Nav.go = function(command){
    if(command.type && command.url && $Nav.pages[command.url]){
        if(command.type == 'push'){
            Navigation.push(command.target.props.componentId, {
                component: {
                    name: command.url,
                    passProps: {
                        $from: {command: command},
                        $data: command.data
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
        
    }
};

export default $Nav;