import store from '../common/store'

/**
 * 三维Math拓展工具
 */
let Math3d = {};

Object.defineProperty(Math3d, 'Cesium', {
    get() {
        return store?.state?.cesium
    }
})

/**
 * 计算椭圆边位置
 * options.semiMinorAxis：短半轴
 * options.semiMajorAxis：长半轴
 * options.rotation：旋转角度 弧度
 * options.center：中心点 笛卡尔坐标
 * options.granularity：粒度 弧度
 * Returns an array of positions that make up the ellipse.
 * @private
 */
Math3d.computeEllipseEdgePositions = function (options) {
    let {Cesium} = this;

    var unitPosScratch = new Cesium.Cartesian3();
    var eastVecScratch = new Cesium.Cartesian3();
    var northVecScratch = new Cesium.Cartesian3();
    var scratchCartesian1 = new Cesium.Cartesian3();

    var semiMinorAxis = options.semiMinorAxis;
    var semiMajorAxis = options.semiMajorAxis;
    var rotation = options.rotation;//法线
    var center = options.center;
    var granularity = options.granularity && (typeof options.granularity === "number") ? options.granularity : (Math.PI / 180.0);// 角度间隔
    if (granularity > Math.PI / 12.0) { granularity = Math.PI / 12.0; }//最小分24
    if (granularity < Math.PI / 180.0) { granularity = Math.PI / 180.0; }//最大分360
    var aSqr = semiMinorAxis * semiMinorAxis;
    var bSqr = semiMajorAxis * semiMajorAxis;
    var ab = semiMajorAxis * semiMinorAxis;
    var mag = Cesium.Cartesian3.magnitude(center);//
    var unitPos = Cesium.Cartesian3.normalize(center, unitPosScratch);
    var eastVec = Cesium.Cartesian3.cross(Cesium.Cartesian3.UNIT_Z, center, eastVecScratch);
    eastVec = Cesium.Cartesian3.normalize(eastVec, eastVec);
    var northVec = Cesium.Cartesian3.cross(unitPos, eastVec, northVecScratch);
    var numPts = Math.ceil(Cesium.Math.PI * 2 / granularity);
    var deltaTheta = granularity;
    var theta = 0;

    var position = scratchCartesian1;
    var i;
    var outerIndex = 0;
    var outerPositions = [];
    for (i = 0; i < numPts; i++) {
        theta = i * deltaTheta;
        position = this.getPointOnEllipsoid(theta, rotation, northVec, eastVec, aSqr, ab, bSqr, mag, unitPos, position);

        outerPositions[outerIndex++] = position.x;
        outerPositions[outerIndex++] = position.y;
        outerPositions[outerIndex++] = position.z;
    }

    var r = {};
    r.numPts = numPts;
    r.outerPositions = outerPositions;
    return r;
}

/**
 * 椭圆计算
 * @param {*} theta
 * @param {*} rotation
 * @param {*} northVec
 * @param {*} eastVec
 * @param {*} aSqr
 * @param {*} ab
 * @param {*} bSqr
 * @param {*} mag
 * @param {*} unitPos
 * @param {*} result
 */
Math3d.getPointOnEllipsoid = function (theta, rotation, northVec, eastVec, aSqr, ab, bSqr, mag, unitPos, result) {
    let {Cesium} = this;

    var rotAxis = new Cesium.Cartesian3();
    var tempVec = new Cesium.Cartesian3();
    var unitQuat = new Cesium.Quaternion();
    var rotMtx = new Cesium.Matrix3();

    var azimuth = theta + rotation;

    Cesium.Cartesian3.multiplyByScalar(eastVec, Math.cos(azimuth), rotAxis);
    Cesium.Cartesian3.multiplyByScalar(northVec, Math.sin(azimuth), tempVec);
    Cesium.Cartesian3.add(rotAxis, tempVec, rotAxis);

    var cosThetaSquared = Math.cos(theta);
    cosThetaSquared = cosThetaSquared * cosThetaSquared;

    var sinThetaSquared = Math.sin(theta);
    sinThetaSquared = sinThetaSquared * sinThetaSquared;

    var radius = ab / Math.sqrt(bSqr * cosThetaSquared + aSqr * sinThetaSquared);
    var angle = radius / mag;

    // Create the quaternion to rotate the position vector to the boundary of the ellipse.
    Cesium.Quaternion.fromAxisAngle(rotAxis, angle, unitQuat);
    Cesium.Matrix3.fromQuaternion(unitQuat, rotMtx);

    Cesium.Matrix3.multiplyByVector(rotMtx, unitPos, result);
    Cesium.Cartesian3.normalize(result, result);
    Cesium.Cartesian3.multiplyByScalar(result, mag, result);
    return result;
}

/**
 * 计算链路的点集
 * @param startPoint 开始节点
 * @param endPoint 结束节点
 * @param angularityFactor 曲率
 * @param numOfSingleLine 点集数量
 * @returns {Array}
 */
Math3d.getLinkedPointList = function (startPoint, endPoint, angularityFactor, numOfSingleLine) {
    let { Cesium } = this;

    if (Cesium && startPoint && endPoint && angularityFactor && numOfSingleLine) {
        var result = [];
        var startPosition = Cesium.Cartographic.fromCartesian(startPoint);
        var endPosition = Cesium.Cartographic.fromCartesian(endPoint);

        var startLon = startPosition.longitude * 180 / Math.PI;
        var startLat = startPosition.latitude * 180 / Math.PI;
        var endLon = endPosition.longitude * 180 / Math.PI;
        var endLat = endPosition.latitude * 180 / Math.PI;

        var dist = Math.sqrt((startLon - endLon) * (startLon - endLon) + (startLat - endLat) * (startLat - endLat));
        var angularity = dist * angularityFactor;

        var startVec = Cesium.Cartesian3.clone(startPoint);
        var endVec = Cesium.Cartesian3.clone(endPoint);

        var startLength = Cesium.Cartesian3.distance(startVec, Cesium.Cartesian3.ZERO);
        var endLength = Cesium.Cartesian3.distance(endVec, Cesium.Cartesian3.ZERO);

        Cesium.Cartesian3.normalize(startVec, startVec);
        Cesium.Cartesian3.normalize(endVec, endVec);

        if (Cesium.Cartesian3.distance(startVec, endVec) === 0) {
            return result;
        }

        var omega = Cesium.Cartesian3.angleBetween(startVec, endVec);

        result.push(startPoint);
        for (var i = 1; i < numOfSingleLine - 1; i++) {
            var t = i / (numOfSingleLine - 1);
            var invT = 1 - t;

            var startScalar = Math.sin(invT * omega) / Math.sin(omega);
            var endScalar = Math.sin(t * omega) / Math.sin(omega);

            var startScalarVec = Cesium.Cartesian3.multiplyByScalar(startVec, startScalar, new Cesium.Cartesian3());
            var endScalarVec = Cesium.Cartesian3.multiplyByScalar(endVec, endScalar, new Cesium.Cartesian3());

            var centerVec = Cesium.Cartesian3.add(startScalarVec, endScalarVec, new Cesium.Cartesian3());

            var ht = t * Math.PI;
            var centerLength = startLength * invT + endLength * t + Math.sin(ht) * angularity;
            centerVec = Cesium.Cartesian3.multiplyByScalar(centerVec, centerLength, centerVec);

            result.push(centerVec);
        }

        result.push(endPoint);

        return result;
    }
}

export default Math3d
