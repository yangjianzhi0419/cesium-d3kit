import Shaders from "../Shaders";

/**
 * 波动圆材质
 */
function plugin(Cesium) {
    var Color = Cesium.Color,
        defaultValue = Cesium.defaultValue,
        defineProperties = Object.defineProperties,
        Event = Cesium.Event,
        Property = Cesium.Property,
        Material = Cesium.Material;

    function CircleWaveMaterialProperty(options) {
        options = options || {}
        this._definitionChanged = new Event()
        this._color = undefined
        this._colorSubscription = undefined
        this._duration = undefined
        this._durationSubscription = undefined
        this.color = defaultValue(options.color,
            Color.fromBytes(0, 255, 255, 255))
        this.duration = defaultValue(options.duration, 45)
        this.count = Math.max(defaultValue(options.count, 2), 1)
        this.gradient = defaultValue(options.gradient, 0.1)
        if (this.gradient < 0) {
            this.gradient = 0
        } else if (this.gradient > 1) {
            this.gradient = 1
        }
    }

    defineProperties(CircleWaveMaterialProperty.prototype, {
        isConstant: {
            get: function () {
                return false;
            }
        },
        definitionChanged: {
            get: function () {
                return this._definitionChanged;
            }
        }
    });

    CircleWaveMaterialProperty.prototype.getType = function () {
        return Material.CircleWaveType
    };
    CircleWaveMaterialProperty.prototype.getValue = function (time, result) {
        if (!result) {
            result = {}
        }
        result.color = Property.getValueOrUndefined(this._color, time)
        result.duration = this._duration
        result.count = this.count
        result.gradient = this.gradient
        return result
    };
    CircleWaveMaterialProperty.prototype.equals = function (other) {
        return (
            this === other ||
            (other instanceof CircleWaveMaterialProperty &&
                Cesium.Property.equals(this._color, other._color))
        )
    };
    defineProperties(CircleWaveMaterialProperty.prototype, {
        color: Cesium.createPropertyDescriptor('color'),
        duration: Cesium.createPropertyDescriptor('duration')
    })

    /**
     * 波动圆材质
     */
    Cesium.CircleWaveMaterialProperty = CircleWaveMaterialProperty
    Material.CircleWaveType = 'CircleWave'
    Material._materialCache.addMaterial(Material.CircleWaveType, {
        fabric: {
            type: Material.CircleWaveType,
            uniforms: {
                color: new Color(1.0, 0.0, 0.0, 0.7),
                duration: 45,
                count: 1,
                gradient: 0.1
            },
            source: Shaders.getDynamicCircleShader({get: true})
        },
        translucent: function () {
            return true
        }
    })
}

export {
    plugin as install
}
