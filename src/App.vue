<template>
  <div>
    <y-viewer @ready="ready"/>
  </div>
</template>

<script>
import * as d3kit from './package'
import application from "@/package/application";

export default {
  name: 'App',
  methods: {
    ready(obj) {
      d3kit.init(obj);
      let {cesium, viewer} = obj;

      this.d3App = new application(viewer, d3kit);
      this.d3App.addPoi2(cesium.Cartesian3.fromDegrees(106.55682326246042, 29.534247808485972, 1.0));
    }
  }
}
</script>

<style>

</style>
