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
        y_radio: 0.5560472
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

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
        this.add_block()

    },
    add_block() {
        this.cur_block = this.next_block;
        this.next_block = cc.instantiate(this.block_prefab[Math.floor(Math.random() * 3)]);
        this.block_root.addChild(this.next_block);
        //随机生成一个x的范围200到400之间
        var x_distance = 200 + Math.random() * 200;
        var y_distance = x_distance * this.y_radio;
        //设置新的块的位置
        var next_pos = this.cur_block.getPosition();
        next_pos.x += x_distance;
        next_pos.y += y_distance;
        this.next_block.setPosition(next_pos);

    }

    // update (dt) {},
});