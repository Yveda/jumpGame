
cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.mid = this.node.getChildByName('mid');
        this.up = this.node.getChildByName('up');
        this.down = this.node.getChildByName('down');
        this.left = this.node.getChildByName('left');
        this.right = this.node.getChildByName('mid');
    },
    update (dt) {},
    ///第一个参数是玩家跳的世界坐标，第二个参数是方向,dir = 1表示往右边跳，dir = -1表示往左边跳
    is_jump_on_block(w_dst_pos,direction) {
        //1.找到了跳跃的位置距离参考点最近的哪个参考点以及位置
        var mid_pos = this.mid.convertToWorldSpaceAR(cc.p(0.0));
        //目标减去mid原点的距离
        var dir = cc.pSub(w_dst_pos,mid_pos);
        //最近的点,算出这个距离的长度
        var min_len = cc.pLength(dir);
        var min_pos = mid_pos;
        if (direction === 1) {//如果往右边跳
            var up_pos = this.up.convertToWorldSpaceAR(cc.p(0,0));
            //返回两个向量
            dir = cc.pSub(w_dst_pos,up_pos);
            //返回指定向量的长度
            var len = cc.pLength(dir);
            if (min_len > len) {
                min_len = len;
                min_pos = up_pos;
            }
            var down_pos = this.down.convertToWorldSpaceAR(cc.p(0,0));
            //返回两个向量
            dir = cc.pSub(w_dst_pos,down_pos);
             //返回指定向量的长度
            var len = cc.pLength(dir);
            if (min_len > len) {
                min_len = len;
                min_pos = down_pos;
            }
        } else {
            var left_pos = this.left.convertToWorldSpaceAR(cc.p(0,0));
            //返回两个向量
            dir = cc.pSub(w_dst_pos,left_pos);
             //返回指定向量的长度
            var len = cc.pLength(dir);
            if (min_len > len) {
                min_len = len;
                min_pos = left_pos;
            }
            var right_pos = this.right.convertToWorldSpaceAR(cc.p(0,0));
            //返回两个向量
            dir = cc.pSub(w_dst_pos,right_pos);
             //返回指定向量的长度
            var len = cc.pLength(dir);
            if (min_len > len) {
                min_len = len;
                min_pos = right_pos;
            }
        }
     
        dir = cc.pSub(w_dst_pos,min_pos);
        //2.如果两个点之间的距离小于100，则表示这次跳跃是有效的
        if (cc.pLength(dir) < 100) {
            w_dst_pos.x = min_pos.x;
            w_dst_pos.y = min_pos.y;
            return true;
        }
        //否则啥也不改
        return false;
    }
});
