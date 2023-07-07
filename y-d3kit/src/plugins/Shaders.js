/**
 * 着色器模块
 */
let Shaders = {};

// 动态泛光线
Shaders.getDynamicLightLineShader = function (options) {
    if (options && options.get) {
        return "czm_material czm_getMaterial(czm_materialInput materialInput)\n\
                {\n\
                    czm_material material = czm_getDefaultMaterial(materialInput);\n\
                    vec2 st = materialInput.st;\n\
                    \n\
                    vec4 colorImage = texture(image, vec2(fract(1.0 *st.s - time), fract(st.t)));\n\
                    \n\
                    vec4 fragColor;\n\
                    fragColor.rgb = (colorImage.rgb+color.rgb) / 1.0;\n\
                    fragColor = czm_gammaCorrect(fragColor);\n\
                    material.diffuse = colorImage.rgb;\n\
                    material.alpha = colorImage.a;\n\
                    material.emission = fragColor.rgb;\n\
                    \n\
                    return material;\n\
                }\n\
                ";
    }
}

Shaders.getDynamicCircleShader = function (options) {
    if (options && options.get) {
        return "uniform vec4 color;\n\
                uniform float duration;\n\
                uniform float count;\n\
                uniform float gradient;\n\
                \n\
                czm_material czm_getMaterial(czm_materialInput materialInput)\n\
                {\n\
                    czm_material material = czm_getDefaultMaterial(materialInput);\n\
                    material.diffuse = 1.5 * color.rgb;\n\
                    vec2 st = materialInput.st;\n\
                    vec3 str = materialInput.str;\n\
                    float dis = distance(st, vec2(0.5, 0.5));\n\
                    float per = fract(czm_frameNumber / duration);\n\
                    if(abs(str.z) > 0.001){\n\
                        discard;\n\
                    }\n\
                    if(dis > 0.5){\n\
                        discard;\n\
                    } else {\n\
                        float perDis = 0.5 / count;\n\
                        float disNum;\n\
                        float bl = .0;\n\
                        for (int i = 0; i <= 10; i++) {\n\
                            if (float(i) <= count) {\n\
                                disNum = perDis * float(i) - dis + per / count;\n\
                                if (disNum > 0.0) {\n\
                                    if (disNum < perDis) {\n\
                                        bl = 1.0 - disNum / perDis;\n\
                                    } else if (disNum - perDis < perDis) {\n\
                                        bl = 1.0 - abs(1.0 - disNum / perDis);\n\
                                    }\n\
                                    material.alpha = pow(bl, gradient);\n\
                                }\n\
                            }\n\
                        }\n\
                    }\n\
                    return material;\n\
                }\n\
                ";
    }
}

export default Shaders
