import React from 'react';
import { Navigation } from "react-native-navigation";

class Page extends React.Component{
    constructor(props){
        super(props);

        $Nav.Screen.push(this);

        if(props.$from && props.$from.command){
            if(props.$from.command.type == 'push'){
                this.$close = () => {
                    Navigation.pop(props.componentId);
                };
                if(props.$opener){
                    let _navigationButtonPressed = props.$opener.navigationButtonPressed,
                        _this_navigationButtonPressed = this.navigationButtonPressed;
                    if(_navigationButtonPressed){
                        if(_this_navigationButtonPressed){
                            this.navigationButtonPressed = (btn) => {
                                _navigationButtonPressed(btn);
                                _this_navigationButtonPressed(btn);
                            };
                        }else{
                            this.navigationButtonPressed = _navigationButtonPressed
                        }
                    }
                }
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
            } else if(props.$layout.type == 'sideMenuRight'){
                if(props.$layout.centerId){
                    this.$center = $Nav.Screen.get(props.$layout.centerId);
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
            } else if(props.$layout.type == 'sideMenuCenter'){
                if(props.$layout.leftId){
                    this.$left = $Nav.Screen.get(props.$layout.leftId);
                    this.$openLeft = ()=>{
                        Navigation.mergeOptions(props.componentId, {
                            sideMenu: {
                                left: {
                                    visible: true
                                },
                            },
                        });
                    };
                    this.$closeLeft = ()=>{
                        Navigation.mergeOptions(props.componentId, {
                            sideMenu: {
                                left: {
                                    visible: false
                                },
                            },
                        });
                    };
                }
                if(props.$layout.rightId){
                    this.$right = $Nav.Screen.get(props.$layout.rightId);
                    this.$openRight = ()=>{
                        Navigation.mergeOptions(props.componentId, {
                            sideMenu: {
                                right: {
                                    visible: true
                                },
                            },
                        });
                    };
                    this.$closeRight = ()=>{
                        Navigation.mergeOptions(props.componentId, {
                            sideMenu: {
                                right: {
                                    visible: false
                                },
                            },
                        });
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