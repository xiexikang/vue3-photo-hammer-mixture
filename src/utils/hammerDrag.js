// 引入hammerjs包
import Hammer from 'hammerjs'
/**
   * 封装组件拖动方法
   * @param elment 拖动对象
   * @param config 额外配置
*/
function Drag(elment, config = {}) {
    const reqAnimationFrame = (() => {
        return window[Hammer.prefixed(window, 'requestAnimationFrame')] || function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
    })();

    let el = document.querySelector(elment),//dom结构
        isReset = config.isReset || false,//额外重置
        start_x = 0, //x
        start_y = 0, //y
        ticking = false,//状态
        transform, //css效果
        initAngle = 0, //旋转角度
        initScale = 3; //放大倍数

    const ham = new Hammer.Manager(el); //用管理器 可以同时触发旋转 拖拽 移动
    /**
     ev.srcEvent.type touchstart touchend touchmove
     ev.deltaX 手势移动位移变量
     */
    ham.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));
    ham.add(new Hammer.Rotate({ threshold: 0 })).recognizeWith(ham.get('pan'));
    ham.add(new Hammer.Pinch({ threshold: 0 })).recognizeWith([ham.get('pan'), ham.get('rotate')]);

    //结束时
    ham.on("hammer.input", function (ev) {
        if (ev.isFinal) {
            // console.log(start_x + " " + transform.translate.x + " " + ev.deltaX);
            start_x = transform.translate.x;
            start_y = transform.translate.y;
        }
    });
    ham.on("panstart panmove", onPan);
    ham.on("rotatestart rotatemove rotateend", onRotate);
    ham.on("pinchstart pinchmove", onPinch);

    //拖动
    /**
         第二次进入拖拽时 delta位移重置
        移动时 初始位置startxy不动，delta增加
    */
    function onPan(ev) {
        if (!ev.isFinal) {
            document.querySelector(elment).classList.remove('animate')
            // console.log(start_x + " " + start_y + " | " + ev.deltaX + " " + ev.deltaY);
            transform.translate = {
                x: start_x + ev.deltaX,
                y: start_y + ev.deltaY
            };
            requestElementUpdate();
        }
    }

    //缩放相关
    function onPinch(ev) {
        if (ev.type == 'pinchstart') {
            initScale = transform.scale || 1;
        }
        document.querySelector(elment).classList.remove('animate')
        transform.scale = initScale * ev.scale;
        requestElementUpdate();
    }

    //旋转相关
    let preAngle = 0,
        tempAngleFlag = 0,
        deltaAngle = 0,
        startRotateAngle = 0;
    function onRotate(ev) {
        //点下第二个触控点时触发
        if (ev.type == 'rotatestart') {
            startRotateAngle = ev.rotation;
            tempAngleFlag = 0;
        }
        if (ev.type == 'rotatemove') {
            if (tempAngleFlag == 0) {
                preAngle = startRotateAngle;
                tempAngleFlag++;
            } else {
                deltaAngle = ev.rotation - preAngle;
                document.querySelector(elment).classList.remove('animate')
                transform.rz = 1; //非0 垂直xy轴
                transform.angle = initAngle + deltaAngle;
                requestElementUpdate();
            }
        }
        //旋转结束 记录当前图片角度
        if (ev.type == 'rotateend') {
            initAngle = transform.angle;
        }
    }

    //更新el transform
    function updateElementTransform() {
        let value = [
            'translate3d(' + transform.translate.x + 'px, ' + transform.translate.y + 'px, 0)',
            'scale(' + transform.scale + ', ' + transform.scale + ')',
            'rotate3d(' + transform.rx + ',' + transform.ry + ',' + transform.rz + ',' + transform.angle + 'deg)'
        ];
        value = value.join(" ");
        el.style.webkitTransform = value; /*为Chrome/Safari*/
        el.style.mozTransform = value; /*为Firefox*/
        el.style.transform = value; /*IE Opera?*/
        ticking = false;
    }

    //更新
    function requestElementUpdate() {
        if (!ticking) {
            reqAnimationFrame(updateElementTransform);
            ticking = true;
        }
    }

    //初始化设置
    function resetElement() {
        el.className += ' animate';
        transform = {
            translate: { x: start_x, y: start_y },
            scale: 1,
            angle: 0,
            rx: 0,
            ry: 0,
            rz: 0
        };
        requestElementUpdate();
    }
    resetElement();

    //重置位置
    if (isReset) {
        resetElement();
    }

    return ham
}

export { Drag }