import Shaders from "../Shaders";

/**
 * 城市光效线
 */
function plugin(Cesium) {
    var Color = Cesium.Color,
        defaultValue = Cesium.defaultValue,
        defined = Cesium.defined,
        defineProperties = Object.defineProperties,
        Event = Cesium.Event,
        createPropertyDescriptor = Cesium.createPropertyDescriptor,
        Property = Cesium.Property,
        Material = Cesium.Material,
        defaultColor = Color.WHITE;

    function PolylineCityLinkMaterialProperty(options) {
        options = defaultValue(options, defaultValue.EMPTY_OBJECT);
        this._definitionChanged = new Event();
        this._color = undefined;
        this._colorSubscription = undefined;
        this.color = options.color || Cesium.Color.BLUE;
        this.duration = options.duration || 1000;
        this._time = undefined;
    }

    defineProperties(PolylineCityLinkMaterialProperty.prototype, {
        isvarant: {
            get: function () {
                return false;
            }
        },
        definitionChanged: {
            get: function () {
                return this._definitionChanged;
            }
        },
        color: createPropertyDescriptor('color')
    });

    PolylineCityLinkMaterialProperty.prototype.getType = function () {
        return Material.PolylineCityLinkType;
    };

    PolylineCityLinkMaterialProperty.prototype.getValue = function (time, result) {
        if (!defined(result)) {
            result = {};
        }
        result.color = Property.getValueOrClonedDefault(this._color, time, defaultColor, result.color);
        result.image = Material.PolylineCityLinkImage;
        if (this._time === undefined) {
            this._time = time.secondsOfDay;
        }
        result.time = (time.secondsOfDay - this._time) * 1000 / this.duration;
        return result;
    };

    PolylineCityLinkMaterialProperty.prototype.equals = function (other) {
        return this === other || //
            (other instanceof PolylineCityLinkMaterialProperty &&
                Property.equals(this._color, other._color));
    };

    /**
     *  城市光效线
     */
    Cesium.PolylineCityLinkMaterialProperty = PolylineCityLinkMaterialProperty
    Material.PolylineCityLinkType = 'PolylineCityLink';
    Material.PolylineCityLinkImage = '/images/Textures/meteor_01.png';
    Material._materialCache.addMaterial(Material.PolylineCityLinkType,
        {
            fabric: {
                type: Material.PolylineCityLinkType,
                uniforms: {
                    color: new Color(1, 0, 0, 1.0),
                    image: Material.PolylineCityLinkImage,
                    time: 0,
                },
                source: Shaders.getDynamicLightLineShader({ get: true })
            },
            translucent: function () {
                return true;
            }
        });
}

export {
    plugin as install
}
