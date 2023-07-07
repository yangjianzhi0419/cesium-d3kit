import store from "./store";

/**
 * 通用工具
 */
let utils = {};

Object.defineProperty(utils, 'Cesium', {
    get() {
        return store?.state?.cesium
    }
})

//坐标转换 84转笛卡尔
utils.transformWGS84ToCartesian = function (position, alt) {
    let {Cesium} = this;
    return position
        ? Cesium.Cartesian3.fromDegrees(
            position.lng || position.lon,
            position.lat,
            position.alt = alt || position.alt,
            Cesium.Ellipsoid.WGS84
        )
        : Cesium.Cartesian3.ZERO
}

//坐标数组转换 84转笛卡尔
utils.transformWGS84ArrayToCartesianArray = function (WSG84Arr, alt) {
    return WSG84Arr
        ? WSG84Arr.map(function (item) { return utils.transformWGS84ToCartesian(item, alt) })
        : []
}

//坐标转换 笛卡尔转84
utils.transformCartesianToWGS84 = function(cartesian) {
    let {Cesium} = this;

    var ellipsoid = Cesium.Ellipsoid.WGS84
    var cartographic = ellipsoid.cartesianToCartographic(cartesian)
    return {
        lng: Cesium.Math.toDegrees(cartographic.longitude),
        lat: Cesium.Math.toDegrees(cartographic.latitude),
        alt: cartographic.height
    }
}

//坐标数组转换 笛卡尔转84
utils.transformCartesianArrayToWGS84Array = function (cartesianArr) {
    return cartesianArr
        ? cartesianArr.map(function (item) { return utils.transformCartesianToWGS84(item) })
        : []
}

export default utils
