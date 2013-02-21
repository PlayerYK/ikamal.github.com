/**
 * Created with JetBrains PhpStorm.
 * User: kamalyu
 * Date: 13-2-19
 * Time: 上午11:15
 * Brand demo js
 */

$(function(){    
    cube.init($('#grid-content'),{"cubeSize":100});
});

var cube = {
    "cols":0,    // 列数
    "rows":0,    // 行数
    "width":0,   // 实际宽度（不是外框的宽度）
    "height":0,  // 实际高度
    "elem":{},   // 顶层元素
    "cubes":{},  // 各个方块
    "rFlag":0    // 正在动画标志
};
cube.config = {
    "cubeSize":0
};

cube.init = function(elem,config){
    var oThis = this;
    cube.config = $.extend({},cube.config,config);
    oThis.elem = elem;
    oThis.cubes = elem.children();
    elem.css('position','relative');

    this.cols = Math.floor(elem.width() / oThis.config.cubeSize);
    this.rows = Math.ceil((oThis.cubes.length + 3)/oThis.cols);
    this.width = (this.cols) * this.config.cubeSize;
    this.height = (this.rows) * this.config.cubeSize;

    var x = 0,
        y = 0;
    oThis.cubes.each(function(index){
        var tmp = [x,y++];
        var currDiv = $(this);
        currDiv.data('pos',tmp); // 位置坐标，数组[x,y]
        currDiv.data('dots',[tmp]); // 占用坐标，二维数组[[x,y]，[x,y],[x,y]] 或者[[x,y]]
        currDiv.data('enlarge',0); // 是否已经展开0/1
        if((index + 1)%(oThis.cols) == 0 && index > 0){
            x++;
            y=0;
        }

        currDiv.click(function(){
            if(oThis.rFlag){
                return;
            }
            if (currDiv.data('enlarge') == 1) {
                /* 暂时注释掉只缩小的功能 */
//                oThis.rFlag = 1;
//                cube.zoomOut(currDiv);// 缩小	
            } else {
                oThis.rFlag = 1;
                cube.zoomIn(currDiv);// 放大
            }
        })
    });
    oThis.moveTo();
    // 随机展开一个方块
    oThis.cubes.eq(parseInt(Math.random() * oThis.cubes.length)).click();
};
cube.update = function(){
    var oThis = this;
    oThis.setPos();
    oThis.animateTo();
};
cube.setPos = function(){
    oThis = this;
    var tmpMap = multidimensionalArray(oThis.rows,oThis.cols);// 空白map
    var largeDiv = oThis.elem.find('.js-enlarge');
    if(largeDiv.length > 0){
        var dots = largeDiv.data('dots');
        // 先在map中填上放大后的方块的坐标
        $.each(dots,function(index,dot){
            tmpMap[dot[0]][dot[1]] = 1;
        });
    }
    var x = 0;
    var  y = 0;
    // 继续填写剩余的方块坐标，如果已被占则后移
    oThis.cubes.each(function(index){
        var currCube = $(this);
        if(currCube.data('enlarge') != 1){
            var breakPoint = true;
            while(breakPoint){
                if(tmpMap[x][y] == 1){
                    if(y == oThis.cols -1){
                        y = 0;
                        x += 1;
                    }else{
                        y += 1;
                    }
                }else{
                    if(currCube.data('enlarge') != 1){
                        tmpMap[x][y] = 1;
                        currCube.data('dots',[[x,y]])
                            .data('pos',[x,y]);
                        breakPoint = false;
                    }
                }
            }
        }else{
            if(y == oThis.cols -1){
                y = 0;
                x += 1;
            }else{
                y += 1;
            }
            var tmpPos = [currCube.css('top')/oThis.config.cubeSize,currCube.css('left')/oThis.config.cubeSize];
            currCube.data('pos',tmpPos)
                .data('dots',[tmpPos]);
            // 放大后的图片保持原坐标
            return true;
        }
    })
};
cube.moveTo = function(first){
    this.cubes.each(function(){
        var currCube = $(this);
        if(!first && currCube.data('enlarge') == 1){
            return;
        }
        var pos = currCube.data('pos');
        currCube.css({
            'left':pos[1] * 100,
            'top':pos[0] * 100,
            'position':'absolute'
        });
    })
};
cube.animateTo = function(){
    this.cubes.each(function(){
        var currCube = $(this);
        if(currCube.data('enlarge') == 1){
            return;
        }
        var pos = currCube.data('pos');
        currCube.animate({
            'left':pos[1] * 100,
            'top':pos[0] * 100
        },'200','linear')
            .css({'position':'absolute'})
    })
};
// 放大
cube.zoomIn = function(obj) {
    var oThis = this;
    var large_div = $(".js-enlarge");
    if (large_div.length > 0) {
        oThis.zoomOut(large_div, obj);
    } else {
        var newCss = {
            width:oThis.config.cubeSize * 2,
            height:oThis.config.cubeSize * 2
        };
        var newDots = obj.data('dots');
        var tmpPos = obj.data('pos');
        var rightSide = obj.position().left + obj.outerWidth() == oThis.width ? 1:0;
        var bottomSide = obj.position().top + obj.outerHeight() == oThis.height ? 1:0;
        // 计算位置坐标
        if(rightSide){
            newCss["left"] = (obj.data("pos")[1] - 1) *  oThis.config.cubeSize;
        }
        if(bottomSide){
            newCss["top"] = (obj.data("pos")[0] - 1) *  oThis.config.cubeSize;
        }
        //计算占位坐标
        if(rightSide && bottomSide){
            newDots.push([tmpPos[0],tmpPos[1]-1]);
            newDots.push([tmpPos[0]-1,tmpPos[1]]);
            newDots.push([tmpPos[0]-1,tmpPos[1]-1]);
        }else if(rightSide){
            newDots.push([tmpPos[0],tmpPos[1]-1]);
            newDots.push([tmpPos[0]+1,tmpPos[1]]);
            newDots.push([tmpPos[0]+1,tmpPos[1]-1]);
        }else if(bottomSide){
            newDots.push([tmpPos[0],tmpPos[1]+1]);
            newDots.push([tmpPos[0]-1,tmpPos[1]]);
            newDots.push([tmpPos[0]-1,tmpPos[1]+1]);
        }else{
            newDots.push([tmpPos[0],tmpPos[1]+1]);
            newDots.push([tmpPos[0]+1,tmpPos[1]]);
            newDots.push([tmpPos[0]+1,tmpPos[1]+1]);
        }
        obj.data('dots',newDots);

        obj.animate(newCss, {
            duration:"200",
            complete:function () {
                oThis.rFlag = 0;
            }
        })
            .css({"z-index":"5"})
            .addClass('js-enlarge');
        obj.data('enlarge', '1');
        oThis.update();
    }
};
//    缩小
cube.zoomOut = function(obj, obj2) {
    oThis = this;
    var newCss = {
        "z-index":"1",
        width:oThis.config.cubeSize,
        height:oThis.config.cubeSize,
        left:obj.data('pos')[1] * oThis.config.cubeSize,
        top:obj.data('pos')[0] * oThis.config.cubeSize
    };
    obj.css(newCss);
    obj.data('dots',[obj.data('pos')])
        .data('enlarge', '0')
        .css({"z-index":"1"})
        .removeClass('js-enlarge');
    if (obj2) {
        oThis.zoomIn(obj2);
    }else{
        oThis.rFlag = 0;
        oThis.update();
    }
/**
 * 注释掉方块缩小的动画
 * */
//        obj.animate(newCss, {
//            duration:"100",
//            complete:function () {
//                obj.data('dots',[obj.data('pos')])
//                    .data('enlarge', '0')
//                    .css({"z-index":"1"})
//                    .removeClass('js-enlarge');
//                if (obj2) {
//                    oThis.zoomIn(obj2);
//                }else{
//                    oThis.rFlag = 0;
//                    oThis.update();
//                }
//            }
//        });
};

// 生成多位数组的方法，默认值都填写为0
function multidimensionalArray(){
    var args = Array.prototype.slice.call(arguments);

    function helper(arr){
        if(arr.length <=0){
            return;
        }
        else if(arr.length == 1){
//            return new Array(arr[0]);
            var i,resultArr = [];
            for(i=0;i<arr[0];i++){
                resultArr.push('0');
            }
            return resultArr;
        }

        var currArray = new Array(arr[0]);
        var newArgs = arr.slice(1, arr.length);
        for(i = 0; i < currArray.length; i++){
            currArray[i] = helper(newArgs);
        }
        return currArray;
    }

    return helper(args);
}