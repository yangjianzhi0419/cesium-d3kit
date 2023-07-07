import * as Cesium from 'cesium'

/**
 * 应用
 */
class application {
    constructor(viewer, d3kit) {
        this.viewer = viewer;
        this.d3kit = d3kit;
    }

    /**
     * 添加光效弧度
     *
     * @param startPoint Cesium.Cartesian3.fromDegrees(106.56298388731544, 29.532057959712986, 230.0)
     * @param endPoint Cesium.Cartesian3.fromDegrees(106.55775961346458, 29.542807433251742, 0.0)
     * @returns {Entity}
     */
    addRadianLineLight(startPoint, endPoint) {
        return this.viewer.entities.add({
            polyline: {
                positions: this.d3kit.Math3d.getLinkedPointList(startPoint, endPoint, 50000, 500),
                width: 8,
                material: new Cesium.PolylineCityLinkMaterialProperty({
                    color: Cesium.Color.CYAN,
                    duration: 20000
                })
            }
        });
    }

    /**
     * 动态圆
     * @param circle = { lng: 106.55510300690722, lat: 29.527818241746893, alt: 0.0 }
     * @returns {Entity}
     */
    addDynamicCircle(circle) {
        let circleEntity = this.d3kit.Graphics.createDynamicCircleGraphics({
            center: circle,
            material: new Cesium.CircleWaveMaterialProperty({
                color: Cesium.Color.CYAN,
                count: 1,
                gradient: 0.9
            }),
            radius: 100,
            height: 0.1,
            rotateAmount: 0.01
        })
        return this.viewer.entities.add(circleEntity)
    }

    /**
     * poi2
     * @param position Cesium.Cartesian3.fromDegrees(106.55682326246042, 29.534247808485972, 1.0)
     */
    addPoi2(position) {
        return this.viewer.entities.add({
            position: position,
            billboard: {
                image: "/images/Textures/poi2.png",
                width: 42,
                height: 140,
                scale: 1.5,
                clampToGround: true,
                pixelOffset: new Cesium.Cartesian2(0, -20)
            }
        })
    }

    /**
     * 旋转锥子模型
     * @param position Cesium.Cartesian3.fromDegrees(106.56298388731544, 29.532057959712986, 230.0)
     * @param modelPos = { lng: 106.56298388731544, lat: 29.532057959712986, alt: 230.0 }
     * @returns {Entity}
     */
    addRotateZhuiModel(position, modelPos) {
        let entity = new Cesium.Entity();

        entity.model = new Cesium.ModelGraphics({
            uri: "/data/model/zhui.glb",
            scale: 40,
            minimumPixelSize: 50,
            color: Cesium.Color.GREEN
        });

        // 设置
        this.d3kit.Graphics.setGraphicsRotate({
            entity: entity,
            position: modelPos,
            rotateAmount: 4
        })

        entity.position = position;
        return this.viewer.entities.add(entity);
    }
}

export default application
