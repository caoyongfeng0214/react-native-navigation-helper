let command = function(){};

command.parse = function(cmd, curPage){
    if(typeof(cmd) === 'string'){
        cmd = {
            url: cmd
        };
    }
    cmd.opener = curPage;
    if(!cmd.type){
        cmd.type = 'push';
    }
    if(!cmd.target){
        if(cmd.type == 'push' && curPage.$center){
            cmd.target = curPage.$center;
            if(!cmd.afterNav){
                cmd.afterNav = curPage.$close;
            }
        }else{
            cmd.target = curPage;
        }
    }
    if(cmd.type == 'push'){
        if(typeof(cmd.target) === 'string'){

        }else{
            if(!cmd.target.props.$layout || !cmd.target.props.$layout.stackId){
                cmd.type = 'overlay';
            }
        }
    }

    return cmd;
};

export default command;