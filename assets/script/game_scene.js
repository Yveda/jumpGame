cc.Class({
    extends: cc.Component,

    properties: {
        player: {
            default: null,
            type: cc.Node
        },
        block_prefab: {
            default: [],
            type: cc.Prefab
        },
        block_root: {
            default: null,
            type: cc.Node
        },
        //世界坐标原点
        left_org: cc.p(0, 0),
        //存放game节点
        map_root: {
            default: null,
            type: cc.Node
        },
        //斜率
        y_radio: 0.5560472,
        checkout: {
            default:null,
            type: cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
     // update (dt) {},

    start() {
        //随机生成一个块预制件
        this.cur_block = cc.instantiate(this.block_prefab[Math.floor(Math.random() * 3)]);
        //添加进入父节点
        this.block_root.addChild(this.cur_block);
        //把这个世界坐标转到以block_root为原点节点的坐标系下
        this.cur_block.setPosition(this.block_root.convertToNodeSpaceAR(this.left_org));
        //块上面中心点的世界坐标
        var w_pos = this.cur_block.getChildByName("mid").convertToWorldSpaceAR(cc.p(0, 0));
        //让player出现在第一个块的正中央
        this.player.setPosition(this.map_root.convertToNodeSpaceAR(w_pos));
        //下一个等于当前的这个块
        this.next_block = this.cur_block;
        //player这个组件
        this.player_com = this.player.getComponent('player');
        this.add_block()

    },
    add_block() {
        this.cur_block = this.next_block;
        this.next_block = cc.instantiate(this.block_prefab[Math.floor(Math.random() * 3)]);
        this.block_root.addChild(this.next_block);
        //每次负得越来越多，所以加的block永远在上一个block的后面
        this.next_block.setLocalZOrder(this.block_zorder);
        this.block_zorder --;
        //随机生成一个x的范围200到400之间
        var x_distance = 200 + Math.random() * 200;
        var y_distance = x_distance * this.y_radio;
        //设置新的块的位置
        var next_pos = this.cur_block.getPosition();
        //往左边x就减，往右边x就加
        next_pos.x += (x_distance * this.player_com.direction);
        next_pos.y += y_distance;
        this.next_block.setPosition(next_pos);
        //每次add_block的时候都加上this.next_block。每次加一个块的时候玩
        //家就会知道你要跳向那个next_block,然后player.js那边就保存一下
        //每次add_block的时候都加上this.next_block；要把block上的实例组件传进去
        this.player_com.set_next_block(this.next_block.getComponent('block'));
    },
    //移动这个map，传入两个参数，X移动多少，y移动多少
    move_map(offset_x,offset_y){
        //0.5秒内移动到指定位置
        var m1 = cc.moveBy(0.5,offset_x,offset_y);
        //回调函数
        var end_func = cc.callFunc(function () {
            this.add_block();
        }.bind(this));
        //队列，当m1移动完之后生成一个块
        var seq = cc.sequence([m1,end_func]);
        this.map_root.runAction(seq);
     },
     //游戏结算
     on_checkout_game () {
        this.checkout.active = true;
     },
     //重玩游戏
    on_game_again () {
        cc.director.loadScene('gameScene');
    }
});