import React from 'react';
import { Navigation } from "react-native-navigation";

class Page extends React.Component{
    constructor(props){
        super(props);

        if(props.$from && props.$from.command){
            if(props.$from.command.type == 'push'){
                this.$close = () => {
                    Navigation.pop(props.componentId);
                };
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
    }
}

export default Page;