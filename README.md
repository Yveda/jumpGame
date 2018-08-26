### 知识点

#### 单词

convert：转变

#### 坐标转换

![image](1CF4583B5521406887119DAB54CA83C2)

![image](8DB78C0F373A4397808B953EFC8DA0A1)  

#### bind（）的实现

https://segmentfault.com/q/1010000007936495

MDN的解释是：bind()方法会创建一个新函数，称为绑定函数，当调用这个绑定函数时，绑定函数会以创建它时传入 bind()方法的第一个参数作为 this，传入 bind() 方法的第二个以及以后的参数加上绑定函数运行时本身的参数按照顺序作为原函数的参数来调用原函数。

####  apply、call、bind 三者相比较

### 新建项目以及配置资源

打开creator，点击新建项目，注意路径不能含有中文

错误：

![image](E8B1C095D7D74100A377CD67DC27C114)

正确：

![image](FC1C1AB8FA2C43D1BE577280C90E898F)

固定高度和宽度，最后进行适配

![image](6C5610A2ADB84450BDE9C0F5A82F0D8C)

block_root节点是块节点，player是主角，rotate负责旋转，piece是精灵，即主角图案

![image](A266FB1FAB0F45F3A4C3B5FBC2071749)

压缩的时候是往下压，所以把锚点y设置为0

![image](6AC63688F97542BF8F788102E1B7C128)

以块状的最下点为原点

![image](24665BD5620C441EA8D08FB0274BC70F)  

这样方便对其和摆位置

![image](39DDC3C5756F4046A7B0A1571FE7E958)

做好跳跃首先要找两个块

![image](864C750F4FF747DE8CEA17A25A483CA2)

怎么对其呢？技巧——>创建一个单色的精灵，颜色设为红色，大写为5，然后把icon也就是块状图片移到点点这边来，对其后将红色点点隐藏

![image](D50D95BD435744FF81E92E51E22C440F)

往上跳会有三个范围，剩下的就是跳出这个范围

![image](DCA053B238704EBFA53701EBAE77986E)

首先确定物体的中心点，单色精灵mid，摆在最下方，并在player摆在最下方

![image](26DF7377B80D490BB73769487E765AD6)

将mid移到player点下面

![image](38B170AFA8E04F80B9FF41C7D418C570)  

接着将其他两个点也填写好

![image](3E94726857934289A2F9851886917E85)

接下来再来踩左右两个点

![image](1D3E7F2607F441E5A918CA360F8435FE)

这些点有什么用呢？如果待会player跳到这些点的附近，我们就认为是跳上去了，否则就认为失败了

![image](E4433FFE724A407785C7E8F6947F57E0)

挂在脚本：player组件挂在player.js,b1组件挂在block.js,game_scene.js挂在canvas组件来掌控全局

复制粘贴另外一个b2

![image](F40223E210A74F258EB993C2787640AB)

把b1，b2的精灵都改为RAW，即原始大小

![image](0FBCBD87E91145F8A6737B66DC0E74B1)

修改block2的图片

![image](2280BF196201450B865E98D44D8D3ADC)

再做一个复制做一个b3

![image](4148038D513A4B2BB4EBC6D7DC97B6E5)

然后将这三个做成一个预制体，因为待会要生成三个地图来给我们跳，然后把原来的删掉

![image](71943BD7542940E0B5657661C50DAC5D)

### 编写控制代码

```
//game_scene.js
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
      }
    },
```
然后将预制件拖到左边

![image](67A3362EAD4D4205A257F59AF6B87B7D)

第一个block点的位置是固定的

![image](6E212964CB274AE4B64829B73CFF95B1)
![image](A8FEEF5981F346209FAF1B4EE14950CE)

固定的是180,350的世界坐标

![image](FBFAAA989EFB44A58EDE25F59C50CCC7)

然后在start的时候就做两个块，一个是current，一个是next；有current跳到next

![image](EF884FBB99024B76BA7EDF0269DDB8EA)

```
//game_scene.js
   start () {
        //随机生成一个块预制件
        this.cur_block = cc.instantiate(this.block_prefab[Math.floor(Math.random()*3)]);
    },
```

挂载根节点

```
   block_root: {
        default: null,
        type: cc.Node
      }
```
//添加进入父节点
```
 this.block_root.addChild(this.cur_block);
```
设置世界坐标点
```
left_org: cc.p(0,0),
```
![image](652DFD06F52241D78FD7F18F58F894C7)

把这个世界坐标转到以block_root为原点节点的坐标系下
```
 this.cur_block.setPosition(this.block_root.convertToNodeSpaceAR(this.left_org));
```
运行一下

![image](043E6221D49A428299C772138DD6388E)

#### 首先player要从第一块的正中央开始跳

让player处于mid这个节点的位置，然后把mid这个坐标转换为世界坐标再转给player，这样子就能让player和mid进行重合，


```
 //块上面中心点的坐标
        var w_pos = this.cur_block.getChildByName("mid").convertToWorldSpaceAR(cc.p(0, 0));
```

```
//game_scece.js
//存放game节点
    map_root: {
        default: null,
        type: cc.Node
    }
```
```
  //让player出现在第一个块的正中央
    this.player.setPosition(this.map_root.convertToNodeSpaceAR(w_pos));
```
效果：

![image](2FE7995C533442F0A292A837F67EC836)

#### 接下来编写一个函数，是要添加一个块，生成nextBlock   

![image](FAD5744B36C047458A07A1EC08A5AAE6)



他是按照平行四边形的路子来走的，

![image](8AE9A1E3059B45F3A15F4F63D5F3FD3C)

只需要把x移动一下，根据斜率得到y值

![image](B437E684B86F42FC90BD214C6509E73C)

只需先计算y除以x的值是多少，就能量出这个方块的斜率，等下x移动多少，y就根据这个斜率移动多少

![image](998E3CA189034D3A9356ADAE3657D0E1)

这个斜率使用ps量的

![image](6732046233214C28AC768B745B22244D)


```
y_radio: 0.5560472
```

```
add_block() {
       .........
        //随机生成一个x的范围200到400之间
        var x_distance = 200 + Math.random() * 200;
        var y_distance = x_distance * this.y_radio;
        //设置新的块的位置
        var next_pos = this.cur_block.getPosition();
        next_pos.x += x_distance;
        next_pos.y += y_distance;
        this.next_block.setPosition(next_pos);

    }
```
可以发现他随机生成了一块

![image](CA539F2073C04AF481EADE23589E8DD6)

#### 更新当前块为下一块


```
   start() {
      ......
        //下一个等于当前的这个块
        this.next_block = this.cur_block;
    },
    add_block() {
        this.cur_block = this.next_block;
        ......

    }
```

#### 接下来做点击蓄力的过程，点击事件

![image](21D889202F94483F94716BC19F4FA471)

为什么要出现以下的层次结构，因为我们需要三个动画

![image](F320833405FD49D999D84985C5ED4F16)

一个是压扁这个图形

![image](B21DFC047AAB413F82269C448B91A5EB)

同时要进行旋转，所以这个时候把anim和rotate分开，anim管压缩，rotate管旋转，接下来编写代码响应消息

打开player.js

```
//player.js
  start () {
        this.rot_node = this.node.getChildByName('rotate');
        this.anim_node = this.rot_node.getChildByName('anim');
    },
```

#### 有了这两个之后就开始监听消息

```
 start () {
        .......
        //是否正在充电，蓄力
        this.is_power_mode = false;
        //响应触摸事件
        this.anim_node.on(cc.Node.EventType.TOUCH_START,function (e) {
            //如果按下表示我们开始加力
            this.is_power_mode = true;
            //先停掉所有的action动作，注意后面有加s
            this.anim_node.stopAllActions();
            //加力的开始时候播放一个动画，2秒钟之内，x不变，y压缩到0.5
            this.anim_node.runAction(cc.scaleTo(2,1,0.5))
        }.bind(this),this);
        //弹起来
        this.anim_node.on(cc.Node.EventType.TOUCH_END,function (e) {
            //加力结束
            this.is_power_mode = false;
            this.anim_node.stopAllActions();
             //加力的结束时候播放一个动画，0.5秒钟之内，x不变，y变回来
             this.anim_node.runAction(cc.scaleTo(0.5,1,1))
        }.bind(this),this);
        //在外面弹起来
        this.anim_node.on(cc.Node.EventType.TOUCH_CANCEL,function (e) {
            this.is_power_mode = false;
            this.anim_node.stopAllActions();
            //加力的结束时候播放一个动画，0.5秒钟之内，x不变，y变回来
            this.anim_node.runAction(cc.scaleTo(0.5,1,1))
        }.bind(this),this);
    },

```

#### 蓄力的动画

![image](89A57CE9DBD7434CB4C8382AF71D7E1B)

现在长按可以长按压缩图片，松开的时候图片复原

![image](0D1ED769880748DF950EFF788B482442)

加力的时间越久我的弹力久越大，所以会有一个弹力的加速度


```
//player.js
    properties: {
        //初始速度
        init_speed: 500,
        //加速度
        a_power: 600
    },
```
![image](79CC450B6DC542CDB46DE662F90A0E5C)


```
 start() {
        //当前的速度等于0
        this.speed = 0;
        //开始的x_distance等于0
        this.x_distance = 0;
        //响应触摸事件
        this.anim_node.on(cc.Node.EventType.TOUCH_START, function (e) {
            this.x_distance = 0;
           ....
        }.bind(this), this);
        //弹起来
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
```


#### 实现弹出效果

有了能量，当我们弹起来以后，
player_jump函数，弹起来也是按照一定斜率反弹的，x_distance有了之后也是根据斜率算出y_distance    

![image](28EAD560CF9C4F61BA8DED2899F3A1B9)


```
//player.js
start() {
      //弹起来
        this.anim_node.on(cc.Node.EventType.TOUCH_END, function (e) {
           .......
            this.player_jump();    
        }.bind(this), this); 
         //在外面弹起来
        this.anim_node.on(cc.Node.EventType.TOUCH_CANCEL, function (e) {
            .......
            this.player_jump();    
        }.bind(this), this);
},
player_jump() {
     var x_distance = this.x_distance;
     var y_distance = this.x_distance * this.y_radio;

     //跳到目的地
     var target_pos = this.node.getPosition();
     target_pos.x += x_distance;
     target_pos.y += y_distance;

    //跳到目标，时间0.5秒，目标target_pos,高度200，跳的次数是1
    var j = cc.jumpTo(0.5,target_pos,200,1);
    this.node.runAction(j);
}
```
效果：长按一下，摁越久跳的越远

![image](C19A4AEABEFB4531AC91FB445F45E8E2)

#### 加一个旋转

```
 player_jump() {
        .....
         //0.5秒转360度
         this.rot_node.runAction(cc.rotateBy(0.5,360))
        .......
    }
```

![image](1127CCFB7168434B9FDB799864207F1F)

旋转的时候对他进行`拖尾`，player节点添加组件`MotionStreak`

![image](BF5DEF0B173E4F1E9442D122A6AFD9C9)

![image](9DBBB748E3534CAA86F0147D78AD8479)

效果：有拖尾

![image](FF1D122EE5E24A5CB2573B0AF2DC9D4F)


#### 实现滚动地图

每跳一下滚动一下，然后再生成下一个再来跳，player往上走，镜头也拉上，如果是左边，我们让x始终停在左边，如果是右边往左边跳，我们就让他停在右边那个点

![image](B03F42F7DB6743FC9A31A2D92BB236DE)

编写一个函数move_map()；

```
//game_scene.js
  //移动这个map，传入两个参数，X移动多少，y移动多少
    move_map(offset_x,offset_y){
        //0.5秒内移动到指定位置
        var m1 = cc.moveBy(0.5,offset_x,offset_y);
        this.map_root.runAction(m1);
     }
```


```
var game_scene = require('./game_scene');
cc.Class({
    properties: {
        //game管理类，这是个类
        game_manager: {
            type: game_scene,
            default: null,
        }
    },
})
```

把canvas节点拖进去
![image](65EC0DB511584CFEB00F30B55F08343A)

依次执行队列
```
//player.js
player_jump() {
        //将节点坐标系下的一个点转换到世界空间坐标系。
        var w_pos = this.node.parent.convertToWorldSpaceAR(target_pos);
        var end_func = cc.callFunc(function () {
            //镜头反方向移动
            this.game_manager.move_map(180 - w_pos.x,-y_distance);
        }.bind(this));
        //执行完j以后执行end_func,sequence表示队列
        var seq = cc.sequence(j,end_func);
        this.node.runAction(seq);
     },
```

思路你需要移动这个镜头就需要将game_scene这个镜头往后面移，这样位子才会回到原来停留的地方，当跳到目的地以后就将镜头往反方向移动

效果:

![image](5FE6DACB11824213BC19CA87EB25B0CB)


#### 移动完之后往后面添加一个block

```
//game_scene.js
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
     }
     
//player.js

start () {
     //响应触摸事件
    this.anim_node.on(cc.Node.EventType.TOUCH_START, function (e) {
        //每次开始的时候速度重置
        this.speed = this.init_speed;
    }.bind(this), this);
}
```

![image](8CD0ABF521D2418E840F1460879F8EC1)

#### 判定落下时成功的还是失败的

观测target_pos是不是落在有效的范围之内。

![image](EDB178B1059B4C01B7905506E463EE3D)

block.js里面添加一个判定，而且最好是用世界坐标来对，而且需要有一个player跳的方向，分为右上和右下，如果他刚好踩到那个边值上，我们是要统一都跳到这个点上，所以最后还要回一个位置,把w_dst_pos改回来就可以了。dir = -1则往右边跳跃，dir=1则往左边跳跃


```
//block.js
start () {
        this.mid = this.node.getChildByName('mid');
        this.up = this.node.getChildByName('up');
        this.down = this.node.getChildByName('down');
        this.left = this.node.getChildByName('left');
        this.right = this.node.getChildByName('mid');
    },
    update (dt) {},
    ///第一个参数是，第二个参数是方向,dir = 1表示往右边跳，dir = -1表示往左边跳
    jump_on_block(w_dst_pos,dir) {
        var mid_pos = this.mid.convertToWorldSpaceAR(cc.p(0.0));
        if (dir === 1) {//如果往右边跳
            var up_pos = this.up.convertToWorldSpaceAR(cc.p(0,0));
            var down_pos = this.down.convertToWorldSpaceAR(cc.p(0,0));
        } else {
            var left_pos = this.left.convertToWorldSpaceAR(cc.p(0,0));
            var right_pos = this.right.convertToWorldSpaceAR(cc.p(0,0));
        }
    }
```

#### 求出当前的点离哪个点最接近，越靠近哪个点就取哪个点

![image](8AC68F57CA694BEBA630CF6556202110)

![image](C60DC86E3FA94E4DA917A9AC4CF0DCF0)

算出这个距离的长度，如果有更近的就更新下，如果没有就取当前这个值

```
//block.js
cc.Class({
    ///第一个参数是玩家跳的世界坐标，第二个参数是方向,dir = 1表示往右边跳，dir = -1表示往左边跳
    is_jump_on_block(w_dst_pos,direction) {
        var mid_pos = this.mid.convertToWorldSpaceAR(cc.p(0.0));
        //目标减去mid原点的距离
        var dir = cc.pSub(w_dst_pos,mid_pos);
        //最近的点,算出这个距离的长度，如果有更近的就更新下，如果没有就取当前这个值
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
        //找到了跳跃的位置距离参考点最近的哪个参考点以及位置
    }
});


```

#### 看我们是不是跳在那个参考点的边缘

再次取这个距离的值，这个边缘我们取的是100的范围，如果小于100，就让他跳到参考点这里，return true表示你当前成功了


```
//block.js
cc.Class({
    is_jump_on_block(w_dst_pos,dir) {
       ..........
     
        dir = cc.pSub(w_dst_pos,min_pos);
        //如果两个点之间的距离小于100，则表示这次跳跃是有效的
        if (cc.pLength(dir) < 100) {
            w_dst_pos.x = min_pos.x;
            w_dst_pos.y = min_pos.y;
            return true;
        }
        //否则啥也不改
        return false;
    }
});

```
#### 拿到block这个对象


```
//game_scene.js
  start() {
        ......
        //player这个组件
        this.player_com = this.player.getComponent('player');
         this.add_block()
    },
  add_block() {
        .......
        //每次add_block的时候都加上this.next_block。每次加一个块的时候玩//家就会知道你要跳向那个next_block,然后player.js那边就保存一下
         //每次add_block的时候都加上this.next_block；要把block上的实例组件传进去
        this.player_com.set_next_block(this.next_block.getComponent('block'));
    },
    
//player.js
onload() {
     this.next_block = null;  
},
start () {
  this.direction = 1;//1默认向右
},
player_jump(){
    ....
    if (this.next_block.is_jump_on_block(w_pos,this.direction)) {
            //target_pos就变成了参考点的位置，更新一下target_pos的位置，
            //重新的转一下，因为他会在is_jump_on_block这个函数里面改掉
            target_pos = this.node.parent.convertToNodeSpaceAR(w_pos);
        }
    ....
},
set_next_block (block) {
    this.next_block = block;
    }
```
效果：分别出现在底下，上方，中间三个地方

![image](AD580609B6D448A789E4F6420C682E5D)

![image](D3372C688824472785C6384BE8709B4E)

![image](3CBD6700A4C9418EB0C8BDB8A47BC344)

#### 添加游戏结束


```
//player.js
player_jump () {
    ......
    var is_game_over = false;
    if (this.next_block.is_jump_on_block(w_pos,this.direction)) {
        //target_pos就变成了参考点的位置，更新一下target_pos的位置，
        //重新的转一下，因为他会在is_jump_on_block这个函数里面改掉
        target_pos = this.node.parent.convertToNodeSpaceAR(w_pos);
    } else {
        is_game_over = true;
    }
    ......
    var end_func = cc.callFunc(function () {
        //如果游戏结束
        if (is_game_over) {
            this.game_manager.on_checkout_game();
        }else {
            //镜头反方向移动,180是因为本来就要有180的宽度距离
            this.game_manager.move_map(180 - w_pos.x,-y_distance);
        }
    }.bind(this));
    .......
}

//game_scene.js
//游戏结算
on_check_game () {
    
},
//重玩游戏
on_game_again () {
    cc.director.loadScene('gameScene');
}
```

做一个check_out的节点，里面加一个mask的精灵，把颜色改成黑色，然后改成一半透明

![image](1A4F82F5E40442DB9B7367718B9759FD)

![image](0EBFB0AEE16C49A2BE14AA906DB2CE52)

然后mask要`挡住事件`，所以给他一个button

![image](ED4FA0FF101846828641181313C306D8)

然后再来一个重玩得按钮，直接拖动精灵到节点上

![image](3920F05088294FBBAC79D51BB3300045)

![image](EDC7A45BB9CB4E86998F1C1E8115499E)

然后在restart_btn添加组件widget，然后让他停靠在bottom，并`垂直`在中央，目标是以canvas为`停靠点`    

![image](ED2EC2459D8746EFAFC0D9AC6C406D04)

然后再给restart_btn一个按钮，给他一个响应

![image](F014CE4639F5417487A573142D8E2645)

给check_out这个节点隐藏掉

在game_scence.js里面添加这个节点


```
//game_scene.js
properties: {
    ......
    checkout: {
        default:null,
        type: cc.Node
    }
},
```

```
//game_scene.js
 //游戏结算
     on_checkout_game () {
        this.checkout.active = true;
     },
```
效果：

![image](7892F185A5454A148CF64F98F821D644)

#### 往左边随机的生成块

我们再产生下一个的时候，add_block()的时候，我们是根据玩家来决定下一个是多少，所以在player.js里面，玩家跳完以后就要随机产生一个,这样子就修改了方向


```
//player.js
player_jump() {
   //随机产生一个方向
    this.direction = (Math.random() <0.5) ? -1 : 1;

    var end_func = cc.callFunc(function () {
        //如果游戏结束
        if (is_game_over) {
            this.game_manager.on_checkout_game();
        }else {
            //根据方向来判定player的移动范围
            if (this.direction === -1) {
                //镜头反方向移动,180是因为本来就要有180的宽度距离,player往左边移动
                this.game_manager.move_map(580 - w_pos.x,-y_distance);
            } else {
                //镜头反方向移动,180是因为本来就要有180的宽度距离，player往右边移动
                 this.game_manager.move_map(180 - w_pos.x,-y_distance);
            }
        }
    }.bind(this));
}
```

修改一点，因为方向要转变，y值不变，但是x的值是要根据方向的


```
//game_scene.js

add_block() {
    //往左边x就减，往右边x就加
    next_pos.x += (x_distance * this.player_com.direction);
}
//将原本在start() 的这句改在onload函数里面
//player.js
onlaod() {
    this.direction = 1;//默认向右
}
```
效果：出现问题了，就是界面当前这个块要拉到最右边这边来

![image](352279797A9C4670B2E242077F9310C1)

![image](4D0A6EB65E124C8CA4424784E5F9C2D0)

看下效果：

![image](6720B04AF69D4E039E2366C9CE448E86)

出现问题：明明我往左边走，却跳向了右边，所以jump这个地方还没有改过来

![image](8E0FFCBEE82C4ECF8C0B5FF465B70CD1)


```
//player.js
    player_jump() {
         var x_distance = this.x_distance * this.direction;
         ......
    }
```

效果：

![image](2D007A877FF94261A24FFB1F1009D13E)

问题： 翻筋头的方向不对，修改一下方向


```
//player.js
this.rot_node.runAction(cc.rotateBy(0.5,360 * this.direction))
```

还有一个问题：层级不对，后面的块叠在了当前的上面，其实应该是当前的在上，后添加的在下 ，通过修改他的`zorder`   

![image](F99C9DABFA254F6CB6D948792C46FEBC)

每一次去add_block以后
```
//game_scene.js
start() {
    .....
    this.block_zorder = -1;
    ....
},
add_block() {
    ......
    //每次负得越来越多，所以加的block永远在上一个block的后面
    this.next_block.setLocalZOrder(this.block_zorder);
    this.block_zorder --;
    ....
}
```

#### 优化点，当我们超过多少个block的时候可以把它删掉

![image](3B0F177707FF4E68B93106C9106EC0C3)

我们在add_block()完了以后进行删掉没用的block

逻辑比方说长度超过20就把前面的10个干掉

#### 微信配置

![image](C99C637970414FF680073ECC6189FE66)

#### 打包小游戏

![image](7E47D97E91624C3CBCDC2F10EF8D1396)

#### 微信开发文档

![image](72730A3FAB304D23B642851100A6992A)


