import React from 'react';
import { Navigation } from "react-native-navigation";

class Page extends React.Component{
    static STATE = {
        APPEAR: 1,
        DISAPPEAR: 2
    };

    constructor(props){
        super(props);

        $Nav.Screen.push(this);

        if(props.$from && props.$from.command){
            if(props.$from.command.type == 'push'){
                this.$close = () => {
                    Navigation.pop(props.componentId);
                };
                // if(props.$opener){
                //     let _navigationButtonPressed = props.$opener.navigationButtonPressed,
                //         _this_navigationButtonPressed = this.navigationButtonPressed;
                //     if(_navigationButtonPressed){
                //         if(_this_navigationButtonPressed){
                //             this.navigationButtonPressed = (btn) => {
                //                 _navigationButtonPressed(btn);
                //                 _this_navigationButtonPressed(btn);
                //             };
                //         }else{
                //             this.navigationButtonPressed = _navigationButtonPressed
                //         }
                //     }
                // }
            } else if(props.$from.command.type == 'overlay'){
                this.$close = () => {
                    Navigation.dismissOverlay(props.componentId);
                };
            } else if(props.$from.command.type == 'modal'){
                this.$close = () => {
                    Navigation.dismissModal(props.componentId);
                };
            }
        }

        if(props.$layout){
            if(props.$layout.type == 'sideMenuLeft'){
                if(props.$layout.centerId){
                    this.$center = $Nav.Screen.get(props.$layout.centerId);
                    if(this.$center){
                        this.$center.$left = this;
                    }
                }
                this.$close = ()=>{
                    Navigation.mergeOptions(props.componentId, {
                        sideMenu: {
                            left: {
                                visible: false
                            },
                        },
                    });
                };
                this.$open = ()=>{
                    Navigation.mergeOptions(props.componentId, {
                        sideMenu: {
                            left: {
                                visible: true
                            },
                        },
                    });
                };
                this.$isOpened = ()=>{
                    return this.$state == Page.STATE.APPEAR;
                };
                this.$toggle = ()=>{
                    if(this.$isOpened()){
                        this.$close();
                    }else{
                        this.$open();
                    }
                };
            } else if(props.$layout.type == 'sideMenuRight'){
                if(props.$layout.centerId){
                    this.$center = $Nav.Screen.get(props.$layout.centerId);
                    if(this.$center){
                        this.$center.$right = this;
                    }
                }
                this.$close = ()=>{
                    Navigation.mergeOptions(props.componentId, {
                        sideMenu: {
                            right: {
                                visible: false
                            },
                        },
                    });
                };
                this.$open = ()=>{
                    Navigation.mergeOptions(props.componentId, {
                        sideMenu: {
                            right: {
                                visible: true
                            },
                        },
                    });
                };
                this.$isOpened = ()=>{
                    return this.$state == Page.STATE.APPEAR;
                };
                this.$toggle = ()=>{
                    if(this.$isOpened()){
                        this.$close();
                    }else{
                        this.$open();
                    }
                };
            } else if(props.$layout.type == 'sideMenuCenter'){
                if(props.$layout.leftId){
                    this.$left = $Nav.Screen.get(props.$layout.leftId);
                    if(this.$left){
                        this.$left.$center = this;
                    }
                    this.$openLeft = ()=>{
                        if(this.$left){
                            this.$left.$open();
                        }
                    };
                    this.$closeLeft = ()=>{
                        if(this.$left){
                            this.$left.$close();
                        }
                    };
                    this.$toggleLeft = ()=>{
                        if(this.$left){
                            this.$left.$toggle();
                        }
                    };
                }
                if(props.$layout.rightId){
                    this.$right = $Nav.Screen.get(props.$layout.rightId);
                    if(this.$right){
                        this.$right.$center = this;
                    }
                    this.$openRight = ()=>{
                        if(this.$right){
                            this.$right.$open();
                        }
                    };
                    this.$closeRight = ()=>{
                        if(this.$right){
                            this.$right.$close();
                        }
                    };
                    this.$toggleRight = ()=>{
                        if(this.$right){
                            this.$right.$toggle();
                        }
                    };
                }
            }
        }

        this.navigationEventListener = Navigation.events().bindComponent(this);

        let _componentWillUnmount = this.componentWillUnmount;
        this.componentWillUnmount = ()=>{
            if(_componentWillUnmount){
                _componentWillUnmount();
            }
            $Nav.Screen.remove(this);
            if (this.navigationEventListener) {
                this.navigationEventListener.remove();
            }
        };
    }
}

export default Page;