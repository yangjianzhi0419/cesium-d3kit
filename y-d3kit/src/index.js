import store from './common/store'
import Math3d from "./plugins/Math3d";
import Graphics from "./plugins/Graphics";
import { installDefaultMaterialProperty } from "./plugins/materials";

// 初始方法
export function init({ viewer, cesium, vm }) {
    store.state.viewer = viewer;
    store.state.vm = vm;
    store.state.cesium = cesium;

    // 安装默认扩展材质
    installDefaultMaterialProperty();
}

export {
    Math3d,
    Graphics
}
