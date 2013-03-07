/**
 * User: kamalyu
 * Date: 2013-03-07
 * Time: 21:47:58
 * autoGrid js
 */
(function($){
    function setPos(self){
        var _children = self.data("_agChild");
        var _width = self.width();
        var _matrix = [[0,_width,0]];
        var _hMax= 0,_c,_size,_point;
        _children.each(function(){
           _c = $(this);
            if(_c.css("display") == "none"){
                return true;
            }
            _size = getSize(_c); // 第一次 [160,160]; 2: [160,160]
            _point = getAttachPoint(_matrix,_size[0]);// 第一次[0,0]
            _matrix = updateAttachArea(_matrix,_point,_size);//第一次[[160,_width,0],[0, 160, 160]]
            _hMax = Math.max(_hMax,_point[1] + _size[1]);//第一次160
            _c.data("_agLeft",_point[0]);
            _c.data("_agTop",_point[1]);
        });
        self.data("_agWrapHeight",_hMax);
        heightTo(self);
    }
    function heightTo(self){
        var _self = self;
        var _delay = self.data("_agChild").length
            * (_self.data("_agOpt").delay || 0)
            + _self.data("_agOpt").time || 500;
        _self.stop();
        if(_self.height() < _self.data("_agWrapHeight")){
            if($.browser.msie){
                _self.height(_self.data("_agWrapHeight"));
            }else{
                _self.animate({
                    height:_self.data("_agWrapHeight")+"px"
                },
                (_self.data("_agOpt").time || 500),
                "easeOutQuart"
                );
            }
        }else{
            clearTimeout(_self.data("_agWrapTimeout"));
            _self.data("_agWrapTimeout", setTimeout(function(){
                if($.browser.msie){
                    _self.height(_self.data("_agWrapHeight"));
                }else{
                    _self.animate(
                        {
                            height: _self.data("_vgwrapheight")+"px"
                        },
                        (_self.data("_vgopt").time || 500),
                        "easeOutQuart"
                    );
                }
            }, _delay))
        }
     }
    //第一次[[0,_width,0]], [0,0], [160,160]
    function updateAttachArea(mtx,point,size){
        var _mtx = mtx.contact().sort(matrixSortDepth);
        var _cell = [point[0],point[0]+size[0],point[1]+size[1]];
        //第一次[0, 160, 160] 上右下
        for(var i= 0,imax=_mtx.length;i<imax;i++){
            if(_cell[0] <= _mtx[i][0] && _mtx[i][1] <= _cell[1]){
                delete _mtx[i];
            }else{
                _mtx[i] = matrixTrimWidth(_mtx[i], _cell);
                // 第一次 _mtx [[160,_width,0]]
            }
        }
        // 第一次[[160,_width,0]],[0, 160, 160]
        return matrixJoin(_mtx, _cell);
        //第一次执行后 [[160,_width,0],[0, 160, 160]]
    }
    // 第一次[[160,_width,0]],[0, 160, 160]
    function matrixJoin(mtx,cell){
        var _mtx = mtx.concat([cell]).sort(matrixSortX);
        // 第一次执行到此 [[160,_width,0],[0, 160, 160]]
        var _mtx_join = [];
        for(var i= 0,imax=_mtx.length;i<imax;i++){
            if(!_mtx[i]) continue;
            if(_mtx_join.length >0
                && _mtx_join[_mtx_join.length-1][1] == _mtx[i][0]
                && _mtx_join[_mtx_join.length-1][2] == _mtx[i][2]){
                _mtx_join[_mtx_join.length-1][1] = _mtx[i][1];
            }else{
                _mtx_join.push(_mtx[i]);
            }
        }
        return _mtx_join;
    }
    function matrixSortX(a,b){
        if(!a || !b) return 0;
        return (a[0] > b[0]) ? 1 : -1;
    }
    // 第一次[0,_width,0], [0, 160, 160]
    function matrixTrimWidth(a,b){
        if(a[0] >= b[0] && a[0] < b[1] || a[1] >= b[0] && a[1] < b[1]){
            if(a[0] >= b[0] && a[0] < b[1]){
                a[0] = b[1]; // 第一次执行到此a[160,_width,0]
            }else{
                a[1] = b[0];
            }
        }
    }
    //第一次[0,_width,0], 160
    //第2次[[160,_width,0],[0, 160, 160]] 160
    function getAttachPoint(mtx,width){
        var _mtx = mtx.contact().sort(matrixSortDepth);
        var _max = _mtx[_mtx.length-1][2];
        for(var i= 0,imax=_mtx.length;i<imax;i++){
            if(_mtx[i][2] >= _max) break;// 第一次执行到此
            if(_mtx[i][1]-_mtx[i][0] >= width){
                return [_mtx[i][0], _mtx[i][2]];
            }
        }
        return [0, _max]; // 第一次返回[0,0]
    }
    function matrixSortDepth(a,b){
        if(!a || !b) return 0;
        return((a[2] == b[2] && a[0] > b[0])?1:-1);
    }
    function getSize(obj){
        var _w = obj.width();
        var _h = obj.height();
        _w += Number(obj.css("margin-left").replace('px',''))
            +Number(obj.css("padding-left").replace('px',''))
            +Number(obj.get(0).style.borderLeftWidth.replace('px',''))
            +Number(obj.css("margin-right").replace('px',''))
            +Number(obj.css("padding-right").replace('px',''))
            +Number(obj.get(0).style.borderRightWidth.replace('px',''));
        _h += Number(obj.css("margin-top").replace('px',''))
            +Number(obj.css("padding-top").replace('px',''))
            +Number(obj.get(0).style.borderTopWidth.replace('px',''))
            +Number(obj.css("margin-bottom").replace('px',''))
            +Number(obj.css("padding-bottom").replace('px',''))
            +Number(obj.get(0).style.borderBottomWidth.replace('px',''));
        return [_w,_h];
    }
    $.fn.extend({
        aGrid:function(option){
            var _target = $(this);
            var _opt = $.extend({},option);
            _target.each(function(){
               var _self = $(this);
                _self.data("_agOpt",_opt);
                _self.data("_agChild",_self.find("> *"));
                _self.data("_agDefChild",_self.data("_agChild"));
                _self.css({
                   "position":"relative",
                    "width":"auto"
                });
                _self.data("agChild").css({"position":"absolute"});
                setPos(_self);

            });
        }
    });
})(jQuery);