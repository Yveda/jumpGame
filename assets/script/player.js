cc.Class({
    extends: cc.Component,

    properties: {
        //初始速度
        init_speed: 500,
        //加速度
        a_power: 600
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

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
            this.anim_node.runAction(cc.scaleTo(0.5, 1, 1))
        }.bind(this), this);
        //在外面弹起来
        this.anim_node.on(cc.Node.EventType.TOUCH_CANCEL, function (e) {
            this.is_power_mode = false;
            this.anim_node.stopAllActions();
            //加力的结束时候播放一个动画，0.5秒钟之内，x不变，y变回来
            this.anim_node.runAction(cc.scaleTo(0.5, 1, 1))
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
});