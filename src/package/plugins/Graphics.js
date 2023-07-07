import store from "../common/store";
import utils from "../common/utils";

/**
 * 图形工具
 */
let Graphics = {};

Object.defineProperty(Graphics, 'Cesium', {
    get() {
        return store?.state?.cesium
    }
})

// 动态旋转圆
Graphics.createDynamicCircleGraphics = function (options) {
    let { Cesium } = this;

    if (options && options.center) {
        var entity = new Cesium.Entity(),
            _center = options.center,
            _radius = options.radius || 800,
            _rotateAmount = options.rotateAmount || 0.05, _stRotation = 0,
            _height = options.height || 1,
            heading = 0,
            pitch = 0,
            roll = 0,
            _scale = options.scale || null,
            _scale2 = options.scale2 || null,
            _material = options.material || new Cesium.ImageMaterialProperty({
                image: options.image || '/images/Textures/circle_bg.png',
                transparent: true
            });

        entity.position = new Cesium.CallbackProperty(function () {
            return utils.transformWGS84ToCartesian(_center)
        }, false)

        entity.orientation = new Cesium.CallbackProperty(function () {
            return Cesium.Transforms.headingPitchRollQuaternion(
                utils.transformWGS84ToCartesian(_center),
                new Cesium.HeadingPitchRoll(
                    Cesium.Math.toRadians(heading),
                    Cesium.Math.toRadians(pitch),
                    Cesium.Math.toRadians(roll)
                )
            )
        }, false)

        let bg_scale = _radius, flag = false;
        var updateScalerAxis = () => {
            if (_radius >= _scale || _radius <= bg_scale) {
                flag = !flag
            }
            flag ? _radius += 2 : _radius -= 2;
        }
        var updateScalerAxis2 = () => {
            _scale2 >= _radius ? _radius += 2 : _radius = bg_scale;
        }
        entity.ellipse = {
            material: _material,
            height: _height,
            semiMajorAxis: new Cesium.CallbackProperty(function () {
                return _radius
            }, false),
            semiMinorAxis: new Cesium.CallbackProperty(function () {
                return _radius
            }, false),
            stRotation: new Cesium.CallbackProperty(function () {
                if (_rotateAmount > 0) {
                    _stRotation += _rotateAmount
                    if (_stRotation >= 360) {
                        _stRotation = 0
                    }
                }
                if (_scale) updateScalerAxis()
                if (_scale2) updateScalerAxis2()
                return _stRotation
            }, false)
        }
        return entity;
    }
    return null;
}

// 图形浮动
Graphics.setGraphicsFloat = function (options) {
    let {Cesium} = this;

    if (options && options.entity && options.maxHeight) {

        var entity = options.entity,
            minHeight = options.minHeight || 5,
            maxHeight = options.maxHeight || 100,
            cartesians = options.cartesians,
            speed = options.speed || 0.06,
            bg_minHeight = minHeight,
            flag = false;

        if (cartesians.length) {
            entity.positions = new Cesium.CallbackProperty(function () {

                var positions = utils.transformCartesianArrayToWGS84Array(cartesians)
                for (var i in positions) {
                    var position = positions[i]
                    if (minHeight >= maxHeight || minHeight <= bg_minHeight) {
                        flag = !flag
                    }
                    flag ? minHeight += speed : minHeight -= speed;
                    position.alt = minHeight;
                }
                return utils.transformWGS84ArrayToCartesianArray(positions);
            }, false);
        } else {
            entity.position = new Cesium.CallbackProperty(function () {

                var position = utils.transformCartesianToWGS84(cartesians)
                if (minHeight >= maxHeight || minHeight <= bg_minHeight) {
                    flag = !flag
                }
                flag ? minHeight += speed : minHeight -= speed;
                position.alt = minHeight;
                return utils.transformWGS84ToCartesian(position);
            }, false);
        }
    }
}

// 图形旋转
Graphics.setGraphicsRotate = function (options) {
    let {Cesium} = this;

    var entity = options.entity,
        rotateAmount = options.rotateAmount,
        _position = options.position;
    _position.heading = 0;
    _position.pitch = 0;
    _position.roll = 0;

    entity.position = new Cesium.CallbackProperty(function () {
        return utils.transformWGS84ToCartesian(_position)
    }, false)

    entity.orientation = new Cesium.CallbackProperty(function () {
        if (rotateAmount > 0) {
            _position.heading += rotateAmount
            if (_position.heading === 360) {
                _position.heading = 0
            }
        }
        return Cesium.Transforms.headingPitchRollQuaternion(
            utils.transformWGS84ToCartesian(_position),
            new Cesium.HeadingPitchRoll(
                Cesium.Math.toRadians(_position.heading),
                Cesium.Math.toRadians(_position.pitch),
                Cesium.Math.toRadians(_position.roll)
            )
        )
    }, false)
}

export default Graphics
