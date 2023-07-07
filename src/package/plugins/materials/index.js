import * as PolylineCityLinkMaterialProperty from './PolylineCityLinkMaterialProperty'
import * as CircleWaveMaterialProperty from './CircleWaveMaterialProperty'
import store from "../../common/store";

export function install(plugin) {
    plugin.install && plugin.install(store.state.cesium);
}

// 安装默认扩展材质
export function installDefaultMaterialProperty() {
    install(PolylineCityLinkMaterialProperty);
    install(CircleWaveMaterialProperty);
}
