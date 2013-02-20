/**
 * Created with JetBrains PhpStorm.
 * User: kamalyu
 * Date: 13-2-19
 * Time: 上午11:15
 * Brand demo js
 */

$(function(){
    var cube = {};
    var kit = {};
    cube.config = {
        "cols":0,
        "rows":0,
        "width":0, // 实际宽度（不是外框的宽度）
        "height":0, // 实际高度
        "cubeSize":100
    };
    cube.elem = {}; // 顶层元素
    cube.cubes = {}; // 各个方块
    cube.rFlag = 0; // 正在动画标志
    
    cube.init = function(elem){
        var oThis = this;
        oThis.elem = elem;
        oThis.cubes = elem.children();
        elem.css('position','relative');
        
        this.config.cols = Math.floor(elem.width() / oThis.config.cubeSize);
        this.config.rows = Math.ceil((oThis.cubes.length + 3)/oThis.config.cols);
        this.config.width = (this.config.cols) * this.config.cubeSize;
        this.config.height = (this.config.rows) * this.config.cubeSize;
        
//        console.log(this.config);

        var x = 0,
            y = 0;
        oThis.cubes.each(function(index){
            var tmp = [x,y++];
            var currDiv = $(this);
            currDiv.data('pos',tmp); // 位置坐标，数组[x,y]
            currDiv.data('dots',[tmp]); // 占用坐标，二维数组[[x,y]，[x,y],[x,y]]
            currDiv.data('enlarge',0); // 是否已经展开0/1
            if((index + 1)%(oThis.config.cols) == 0 && index > 0){
                x++;
                y=0;
            }

            currDiv.click(function(){
                if(oThis.rFlag){
                    return;
                }
                oThis.rFlag = 1;
                if (currDiv.data('enlarge') == 1) {
                    cube.zoomOut(currDiv);// 缩小	
                } else {
                    cube.zoomIn(currDiv);// 放大
                }
            })
        });
        oThis.moveTo();
    };
    cube.update = function(){
        var oThis = this;
//        console.log('set');
        oThis.setPos();
//        console.log('move');
        oThis.moveTo();
    };
    cube.setPos = function(){
        oThis = this;
        var tmpMap = multidimensionalArray(oThis.config.rows,oThis.config.cols);// 空白map
        var largeDiv = oThis.elem.find('.js-enlarge');
//        console.log(largeDiv.length);
        if(largeDiv.length > 0){
            var dots = largeDiv.data('dots');
//        console.log('large');
//        console.log(dots);
            // 先在map中填上放大后的方块的坐标
            $.each(dots,function(index,dot){
//                console.log(index,dot);
                tmpMap[dot[0]][dot[1]] = 1;
            });            
        }
        var x = 0;
        var  y = 0;
//        var log = 1;
        // 继续填写剩余的方块坐标，如果已被占则后移
        oThis.cubes.each(function(index){
            var currCube = $(this);
            if(currCube.data('enlarge') != 1){
                var breakPoint = true;
                while(breakPoint){
                    if(tmpMap[x][y] == 1){
                        if(y == oThis.config.cols -1){
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
                if(y == oThis.config.cols -1){
                    y = 0;
                    x += 1;
                }else{
                    y += 1;
                }
                var tmpPos = [currCube.css('top')/oThis.config.cubeSize,currCube.css('left')/oThis.config.cubeSize];
                currCube.data('pos',tmpPos)
                    .data('dots',[tmpPos]);
                
//                console.log('large');
//                console.log(log++);
//                console.log([x,y]);
                // 放大后的图片不动
                return true;
            }
//            console.log(currCube.data('dots'));
//            console.log(log++);
//            console.log([x,y]);
        })
    };
    cube.moveTo = function(){
        this.cubes.each(function(){
            var currCube = $(this);
            if(currCube.data('enlarge') == 1){
                return;
            }
            var pos = currCube.data('pos');
//            console.log(pos);
            currCube.animate({
                'left':pos[1] * 100,
                'top':pos[0] * 100
            },'200','linear')
                .css({'position':'absolute'})
        })
    };
//    放大
    cube.zoomIn = function(obj) {
        var oThis = this;
        var large_div = $(".js-enlarge");
        if (large_div.length > 0) {
            oThis.zoomOut(large_div, obj);
        } else {
            var newCss = {
                width:"200px",
                height:"200px"
            };
            var newDots = obj.data('dots');
            var tmpPos = obj.data('pos');
            var rightSide = obj.position().left + obj.outerWidth() == oThis.config.width ? 1:0;
            var bottomSide = obj.position().top + obj.outerHeight() == oThis.config.height ? 1:0;
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
//            console.log(newDots);
            obj.data('dots',newDots);
            
            obj.animate(newCss, {
                duration:"200",
                complete:function () {
                    oThis.rFlag = 0;
//                    console.log(obj.data('dots'));
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
            width:"100px",
            height:"100px",
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
    cube.init($('#grid-content'));
});

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