var game_scene = require('./game_scene');
cc.Class({
    extends: cc.Component,

    properties: {
        //初始速度
        init_speed: 500,
        //加速度
        a_power: 600,
        //斜率
        y_radio: 0.5560472,
        //game管理类，这是个类
        game_manager: {
            type: game_scene,
            default: null,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.next_block = null;
        this.direction = 1;//默认向右
    },

    start() {
        this.rot_node = this.node.getChildByName('rotate');
        this.anim_node = this.rot_node.getChildByName('anim');
        //是否正在充电，蓄力
        this.is_power_mode = false;
        //当前的速度等于0
        this.speed = 0;
        //开始的x_distance等于0
        this.x_distance = 0;
        //响应触摸事件
        this.anim_node.on(cc.Node.EventType.TOUCH_START, function (e) {
            //如果按下表示我们开始加力
            this.is_power_mode = true;
            this.x_distance = 0;
            //每次开始的时候速度重置
            this.speed = this.init_speed;
            //先停掉所有的action动作，注意后面有加s
            this.anim_node.stopAllActions();
            //加力的开始时候播放一个动画，2秒钟之内，x不变，y压缩到0.5
            this.anim_node.runAction(cc.scaleTo(2, 1, 0.5))
        }.bind(this), this);
        //弹起来
        this.anim_node.on(cc.Node.EventType.TOUCH_END, function (e) {
            //加力结束
            this.is_power_mode = false;
            this.anim_node.stopAllActions();
            //加力的结束时候播放一个动画，0.5秒钟之内，x不变，y变回来
            this.anim_node.runAction(cc.scaleTo(0.5, 1, 1));
            //一松手的时候调用这个函数
            this.player_jump();    
        }.bind(this), this);
        //在外面弹起来
        this.anim_node.on(cc.Node.EventType.TOUCH_CANCEL, function (e) {
            this.is_power_mode = false;
            this.anim_node.stopAllActions();
            //加力的结束时候播放一个动画，0.5秒钟之内，x不变，y变回来
            this.anim_node.runAction(cc.scaleTo(0.5, 1, 1));
            this.player_jump();    
        }.bind(this), this);
    },

     update (dt) {
         //如果是加力模式
         if (this.is_power_mode) {
            //就要将蓄力的速度加上加速度
            this.speed += (this.a_power * dt);
            //因为不断的蓄力，所以跳出的距离会非常的远，所以开始的时候x是等于0的
            //我们蓄力的速度越来越快，蓄力的能量也越来越多
            this.x_distance += this.speed * dt;
         }
     },
     player_jump() {
         var x_distance = this.x_distance * this.direction;
         var y_distance = this.x_distance * this.y_radio;

         //跳到目的地
         var target_pos = this.node.getPosition();
         target_pos.x += x_distance;
         target_pos.y += y_distance;

         //0.5秒转360度
        this.rot_node.runAction(cc.rotateBy(0.5,360 * this.direction))
        //将节点坐标系下的一个点转换到世界空间坐标系。
        var w_pos = this.node.parent.convertToWorldSpaceAR(target_pos);
        //这个地方假设direction是1，就是往右边走
        var is_game_over = false;
        if (this.next_block.is_jump_on_block(w_pos,this.direction)) {
            //target_pos就变成了参考点的位置，更新一下target_pos的位置，
            //重新的转一下，因为他会在is_jump_on_block这个函数里面改掉
            target_pos = this.node.parent.convertToNodeSpaceAR(w_pos);
        } else {
            is_game_over = true;
        }
        //跳到目标，时间0.5秒，目标target_pos,高度200，跳的次数是1
        var j = cc.jumpTo(0.5,target_pos,200,1);
        //随机产生一个方向
        this.direction = (Math.random() <0.5) ? -1 : 1;

        var end_func = cc.callFunc(function () {
            //如果游戏结束
            if (is_game_over) {
                this.game_manager.on_checkout_game();
            }else {
                if (this.direction === -1) {
                    //镜头反方向移动,180是因为本来就要有180的宽度距离,player往左边移动
                    this.game_manager.move_map(580 - w_pos.x,-y_distance);
                } else {
                    //镜头反方向移动,180是因为本来就要有180的宽度距离，player往右边移动
                     this.game_manager.move_map(180 - w_pos.x,-y_distance);
                }
            }
        }.bind(this));
        //执行完j以后执行end_func,sequence表示队列
        var seq = cc.sequence(j,end_func);
        this.node.runAction(seq); 
     },
     set_next_block (block) {
         this.next_block = block;
     }
});