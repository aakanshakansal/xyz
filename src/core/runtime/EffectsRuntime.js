import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import * as THREE from "three";
import { BokehPass, FilmPass, FXAAShader, LUTImageLoader, LUTPass, OutputPass, RenderPass, ShaderPass, SSAOPass, SSRPass, UnrealBloomPass } from "three/examples/jsm/Addons.js";



const Default_Effects = {
    imageProcessing :{
        enabled: false,
        exposure: 1,
        contrast: 1,
        colorCurves:{
            globalHue: 0,
            globalDensity: 0,
            globalSaturation: 0,
            highlightsHue: 0,
            highlightsDensity: 0,
            highlightsSaturation: 0,
            shadowsHue: 0,
            shadowsDensity: 0,
            shadowsSaturation: 0,
        },
        colorGradientEnabled : false,
        colorGradientTexture : null,
        toneMappingEnabled : false,
        toneMappingType : "ACES",
        vignetteEnabled : false,
        vignetteColor : "#000000",
        vignetteWeight : 1,
        vignetteStretch: 1,

    },
    ssao : {
        enabled: false,
        base:0,
        bilateralSamples: 64,
        bilateralSoften:1,
        bilateralTolerance: 2,
        maxZ: 100,
        minZAspect: 1,
        radius: 0.1,
        totalStrength: 1,

    },
    ssr:{
        enabled: false,
        thickness:0.1,
        automaticThickness: true,
        reflectivityThreshold: 0.04,
        useFrensel: true,
        roughnessFactor: 0.5,
        maxSteps: 20,
        maxDistance: 100,
        smoothReflections: true,
        attenuateScreenBorders: true,
        step:1,
        ssrDownSample:1,
        blurDownsample:1,
        blurDispersionStrength:0.01,
        selfCollisionNumSkip:0,
        samples: 64,
        debug: false,
    },
    glow:{
        enabled: false,
        intensity: 0.5,
        blurKernelSize: 64,
    },
    bloom:{
        enabled: false,
        kernel: 64,
        scale: 1,
        threshold: 1,
        weight: 0.5,
    },
    chromaticAbberation:{
        enabled: false,
        amount: 0.1,
    },
    depthOfField:{
        enabled: false,
        blurLevel: 1,
        fStop:1.4,
        focalLength:50,
        focusDistance: 10,
        lensSize: 50,
    },
    antiAliasing:{
        fxaaEnabled: false,
    },
    grain:{
        enabled: false,
        intensity: 0.1,
        animated:false,

    },
    sharpen:{
        enabled: false,
        colorAmount: 0.5,
        edgeAmount: 0.5,
    },
};

function n(value, fallback){
    const result= Number(value)
    return Number.isFinite(result)? result: fallback;
}

function clamp (value, min,max){
  return Math.min(max, Math.max(min,value));
}

function getColor(value,fallback="#000000"){
  const result = new THREE.Color()
  try{
    result.set(value || fallback)
  }
  catch{
    result.set(fallback)
  }
  return result ;


  }

function setUniform(pass, name , value){
  const uniform = pass?.uniforms?.[name]

  if(!uniform) return;

  if(uniform.value?.isColor && value?.isColor)
  {
    uniform.value.copy(value)
    return;
  }
  if(uniform.value && typeof uniform.value.copy === "function" && value && value.isColor)
  {
    uniform.value.copy(value)
    return 
  }
  uniform.value = value
}

function setNodeUniform(node, name , value){
  const property = node?.[name]

  if(property == null){
    return;
  }
  if( typeof property === "object" && 
    Object.prototype.hasOwnProperty.call(property, "value"))
    {
      property.value = value
    }
    else
    {
      node[name] = value;
    }
}

const colorAdjusterShader = {
  uniforms: {
    tDiffuse: {
      value: null,
    },
    enabled: {
      value: 0,
    },
    exposure: {
      value: 0,
    },
    contrast: {
      value: 0,
    },
    globalHue: {
      value: 0,
    },
    globalDensity: {
      value: 0,
    },
    globalSaturation: {
      value: 0,
    },
    highlightsHue: {
      value: 0,
    },
    highlightsDensity: {
      value: 0,
    },
    highlightsSaturation: {
      value: 0,
    },
    shadowsHue: {
      value: 0,
    },
    shadowsDensity: {
      value: 0,
    },
    shadowsSaturation: {
      value: 0,
    },
    vignetteEnabled: {
      value: 0,
    },
    vignetteColor: {
      value: 0,
    },
    vignetteStretch: {
      value: 0,
    },
    vignetteWeight: {
      value: 0,
    },
  },
  vertexShader: `varying vec2 vUv;
  void main(){
  vUv=uv;
  gl_Position= projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  
  }`,
  fragmentShader: `
uniform sampler2D tDiffuse;

uniform float enabled;
uniform float exposure;
uniform float contrast;

uniform float globalHue;
uniform float globalDensity;
uniform float globalSaturation;

uniform float highlightsHue;
uniform float highlightsDensity;
uniform float highlightsSaturation;

uniform float shadowsHue;
uniform float shadowsDensity;
uniform float shadowsSaturation;

uniform float vignetteEnabled;
uniform vec3 vignetteColor;
uniform float vignetteStretch;
uniform float vignetteWeight;

varying vec2 vUv;


vec3 rgb2hsv(vec3 c) {

    vec4 K = vec4(
        0.0,
        -1.0 / 3.0,
        2.0 / 3.0,
        -1.0
    );

    vec4 p = mix(
        vec4(c.bg, K.wz),
        vec4(c.gb, K.xy),
        step(c.b, c.g)
    );

    vec4 q = mix(
        vec4(p.xyw, c.r),
        vec4(c.r, p.yzx),
        step(p.x, c.r)
    );

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;

    return vec3(
        abs(q.z + (q.w - q.y) / (6.0 * d + e)),
        d / (q.x + e),
        q.x
    );
}


vec3 hsv2rgb(vec3 c) {

    vec4 K = vec4(
        1.0,
        2.0 / 3.0,
        1.0 / 3.0,
        3.0
    );

    vec3 p = abs(
        fract(c.xxx + K.xyz) * 6.0 - K.www
    );

    return c.z * mix(
        K.xxx,
        clamp(p - K.xxx, 0.0, 1.0),
        c.y
    );
}


vec3 hueShift(vec3 c, float h) {

    vec3 hsv = rgb2hsv(c);

    hsv.x = fract(hsv.x + h);

    return hsv2rgb(hsv);
}


vec3 adjust(
    vec3 c,
    float hue,
    float density,
    float sat
) {

    vec3 shifted = hueShift(c, hue);

    shifted = mix(
        c,
        shifted,
        clamp(abs(density), 0.0, 1.0)
    );

    vec3 hsv = rgb2hsv(shifted);

    hsv.y = clamp(
        hsv.y * (1.0 + sat),
        0.0,
        1.0
    );

    return hsv2rgb(hsv);
}


void main() {

    vec4 src = texture2D(tDiffuse, vUv);

    vec3 c = src.rgb;


    if (enabled > 0.5) {

        c *= exposure;

        c = (c - 0.5) * contrast + 0.5;


        // Global color adjustment
        c = adjust(
            c,
            globalHue / 360.0,
            globalDensity,
            globalSaturation
        );


        float lum = dot(
            c,
            vec3(
                0.2126,
                0.7152,
                0.0722
            )
        );


        // Highlights
        float hi = smoothstep(
            0.5,
            1.0,
            lum
        );


        // Shadows
        float sh = 1.0 - smoothstep(
            0.0,
            0.5,
            lum
        );


        c = mix(
            c,
            adjust(
                c,
                highlightsHue / 360.0,
                highlightsDensity,
                highlightsSaturation
            ),
            hi
        );


        c = mix(
            c,
            adjust(
                c,
                shadowsHue / 360.0,
                shadowsDensity,
                shadowsSaturation
            ),
            sh
        );
    }


    // Vignette
    if (vignetteEnabled > 0.5) {

        vec2 p = vUv - 0.5;

        p.x *= max(
            0.01,
            vignetteStretch
        );

        float edge = smoothstep(
            0.15,
            0.75,
            length(p)
        );

        float v = clamp(
            edge * vignetteWeight,
            0.0,
            1.0
        );

        c = mix(
            c,
            c * vignetteColor,
            v
        );
    }


    gl_FragColor = vec4(
        max(c, 0.0),
        src.a
    );
}
`,
};

const ChromaticShader = {
  uniforms: {
    tDiffuse: { value: null },
    amount: { value: 0.001 },
  },
  vertexShader: ` varying vec2 vUv;
    void main(){
     vUv= uv;
     gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
    }
    `,
  fragmentShader: `
uniform sampler2D tDiffuse;
uniform float colorAmount;
uniform float edgeAmount;
uniform vec2 resolution;

varying vec2 vUv;

void main() {

    vec2 texel = 1.0 / resolution;

    vec4 center = texture2D(tDiffuse, vUv);

    vec3 north = texture2D(
        tDiffuse,
        vUv + vec2(0.0, texel.y)
    ).rgb;

    vec3 south = texture2D(
        tDiffuse,
        vUv - vec2(0.0, texel.y)
    ).rgb;

    vec3 east = texture2D(
        tDiffuse,
        vUv + vec2(texel.x, 0.0)
    ).rgb;

    vec3 west = texture2D(
        tDiffuse,
        vUv - vec2(texel.x, 0.0)
    ).rgb;

    vec3 average = (north + south + east + west) * 0.25;

    vec3 detail = center.rgb - average;

    vec3 sharpened =
        center.rgb + detail * edgeAmount;

    float centerLuma =
        dot(center.rgb, vec3(0.299, 0.587, 0.114));

    float sharpLuma =
        dot(sharpened, vec3(0.299, 0.587, 0.114));

    vec3 chroma =
        sharpened - vec3(sharpLuma);

    float finalLuma =
        mix(centerLuma, sharpLuma, colorAmount);

    sharpened =
        vec3(finalLuma) + chroma;

    gl_FragColor =
        vec4(clamp(sharpened, 0.0, 1.0), center.a);
}
`,
};

const sharpenShader = {
  uniforms: {
    tDiffuse: { value: null },
    colorAmount: { value: 0.5 },
    edgeAmount: { value: 0.5 },
    resolution: { value:  new THREE.Vector2(1,1) },
  },
  vertexShader : `
  varying vec2 vUv;

  void main(){
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);


  }
  
  
  `,

  fragmentShader : `
  uniform sampler2D tDiffuse;
   uniform float colorAmount;
    uniform float edgeAmount;
    uniform vec2 resolution ;
    varying vec2 vUv;

    void main (){
    
    vec2 texel = 1.0 / resolution;
    vec4 center = texture2D(tDiffuse, vUv );
    vec3 north = texture2D(tDiffuse, vUv + vec2(0.0, texel.y)).rgb;
    vec3 south = texture2D(tDiffuse, vUv -vec2(0.0, texel.y)).rgb;
    vec3 east  = texture2D(tDiffuse, vUv +vec2( texel.x, 0.0)).rgb;
   vec3 west  = texture2D(tDiffuse, vUv - vec2( texel.x, 0.0)).rgb;

   vec3 average= (north + south + east + west) * 0.25;

   vec3 detail = center.rgb - average ;
   vec3 sharpened = center.rgb + detail * edgeAmount;

   float centerLuma = dot(center.rgb, vec3(0.299, 0.587, 0.114));

    float sharpLuma = dot(sharpened, vec3(0.299, 0.587, 0.114));

    vec3 chroma = sharpened - vec3(sharpLuma);

    sharpened= vec3 (mix(sharpLuma, centerLuma, colorAmount)) + chroma ;

    gl_FragColor= vec4 (clamp(sharpened, 0.0, 1.0), center.a);

    
    }

  
  `
}
function toneMappingValue(type){
    if(type === "Standard ") return THREE.LinearToneMapping;
    if(type === "Khronos PBR Neutral") return THREE.NeutralToneMapping;
    return THREE.ACESFilmicToneMapping
}

// webGL Funnction 

function createWebGLRuntime({
  renderer,
  scene,
  camera,
  width,
  height,
})
{
  const composer = new EffectComposer(renderer)

  const renderPass = new RenderPass(scene, camera)

  const ssaoPass = new SSAOPass(scene, camera , width ,height )

  const ssrPass = new SSRPass({renderer, scene, camera,width,height})

  const glowPass = new UnrealBloomPass(new THREE.Vector2(width,height), 0.5 ,0.5,0);

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(width, height),
    0.5,
    0.5,
    1,
  );
  const bokehPass = new BokehPass(scene, camera,{
    focus:10,
    aperture: 0.001,
    maxblur:0.01,
  })

  const colorAdjustPass = new ShaderPass(colorAdjusterShader);
  const chromaticPass = new ShaderPass(ChromaticShader);
  const sharpenPass = new ShaderPass(sharpenShader)

  const grainPass = new FilmPass(0.1,false)

  const lutPass = new LUTPass();
  const outputPass = new OutputPass();
  const fxaaPass = new ShaderPass(FXAAShader)

  composer.addPass(renderPass)
  composer.addPass(ssaoPass)
  composer.addPass(ssrPass);
  composer.addPass(glowPass);
  composer.addPass(bloomPass);
  composer.addPass(bokehPass);
  composer.addPass(colorAdjustPass);
  composer.addPass(chromaticPass);
  composer.addPass(sharpenPass);
  composer.addPass(grainPass);
  composer.addPass(lutPass);
  composer.addPass(outputPass);
  composer.addPass(fxaaPass);


  const effectPasses = [
    ssaoPass,
    ssrPass,
    glowPass,
    bloomPass,
    bokehPass,
    colorAdjustPass,
    chromaticPass,
    sharpenPass,
    grainPass,
    lutPass,
    fxaaPass,
  ]

  effectPasses.forEach((pass)=>{
    pass.enabled = false;
  })

  let disposed = false ;
  let lutRequest = 0 ;

  function resize(nextWidth, nextHeight) {
    const w = Math.max(1, nextWidth);
    const h= Math.max(1, nextHeight)

    composer.setSize(w,h);

    if(fxaaPass.uniforms?.resolution){
      fxaaPass.uniforms.resolution.value.set(1/w,1/h);

    }
    if (sharpenPass.uniforms?.resolution) {
      sharpenPass.uniforms.resolution.value.set( w,  h);
    }
  }

  function update(effects= Default_Effects){
    const image = effects.imageProcessing || Default_Effects.imageProcessing;

    const curves = image.colorCurves || Default_Effects.imageProcessing.colorCurves

    const ssao = effects.ssao || Default_Effects.ssao

    const ssr = effects.ssr || Default_Effects.ssr;
    const glow = effects.glow || Default_Effects.glow;
    const bloom  = effects.bloom  || Default_Effects.bloom 
  
  const chromatic = effects.chromaticAbberation || Default_Effects.chromaticAbberation;

  const dof = effects.depthOfField || Default_Effects.depthOfField;
  const aa = effects.antiAliasing || Default_Effects.antiAliasing;

  const grain = effects.grain || Default_Effects.grain;

  const sharpen = effects.sharpen || Default_Effects.sharpen;

renderer.toneMapping = image.toneMappingEnabled
? toneMappingValue(image.toneMappingType)
: THREE.NoToneMapping

renderer.toneMappingExposure = n(image.exposure,1)

colorAdjustPass.enabled= Boolean(image.enabled)
setUniform(colorAdjustPass,"enabled",image.enabled ? 1 : 0)
setUniform(colorAdjustPass, "exposure", n(image.exposure ,1));

setUniform(colorAdjustPass, "contrast", n(image.contrast, 1));

setUniform(colorAdjustPass, "globalHue", n(curves.globalHue, 0));
setUniform(colorAdjustPass, "globalDensity", n(curves.globalDensity, 0));
setUniform(colorAdjustPass, "globalSaturation", n(curves.globalSaturation, 0));
setUniform(colorAdjustPass, "highlightsHue", n(curves.highlightsHue, 0));
setUniform(colorAdjustPass, "highlightsDensity", n(curves.highlightsDensity, 0));
setUniform(colorAdjustPass, "highlightsSaturation", n(curves.highlightsSaturation, 0));
setUniform(colorAdjustPass, "shadowsHue", n(curves.shadowsHue, 0));
setUniform(colorAdjustPass, "shadowsDensity", n(curves.shadowsDensity, 0));
setUniform(colorAdjustPass, "shadowsSaturation", n(curves.shadowsSaturation, 0));
setUniform(colorAdjustPass, "vignetteEnabled",
  image.enabled && image.vignetteEnabled
  ? 1
  : 0
);

setUniform(colorAdjustPass, "vignetteColor", getColor(image.vignetteColor));

setUniform(colorAdjustPass, "vignetteWeight", n(image.vignetteWeight, 1));

setUniform(colorAdjustPass, "vignetteStretch",Math.max(0.01,n(image.vignetteStretch, 1)));


// ssao

ssaoPass.enabled = Boolean(ssao.enabled)

ssaoPass.kernelRadius = Math.max(0, n(ssao.radius,0.1))
ssaoPass.minDistance = Math.max(0.001, n(ssao.base, 0));

ssaoPass.maxDistance = Math.max(0.001, n(ssao.maxZ, 100));

ssaoPass.KernelSize = Math.max(1, Math.round( n(ssao.bilateralSamples, 64)));



// ssr

ssrPass.enabled = Boolean(ssr.enabled)

ssrPass.thickness= Math.max(0.0001,n(ssr.thickness,0.018))

ssrPass.maxDistance = Math.max(0.001, n(ssr.maxDistance, 100));

ssrPass.frensel= Boolean(ssr.useFrensel)
ssrPass.blur = Boolean(ssr.smoothReflections)

ssrPass.distanceAttenuation = Boolean(ssr.attenuateScreenBorders)

ssrPass.resolutionScale= clamp(n(ssr.ssrDownSample,1),0.1,1)

// Glow

glowPass.enabled = Boolean(glow.enabled);

glowPass.strength= Math.max(0,n(glow.intensity,0.5))

glowPass.radius = clamp(n(glow.blurKernelSize,64)/128,0,1);

glowPass.threshold = 0;

// bloom
bloomPass.enabled = Boolean(bloom.enabled)

bloomPass.strength = Math.max(0, n(bloom.weight,0.5))

bloomPass.radius = clamp(n(bloom.scale,1),0,1)

bloomPass.threshold= Math.max(0, n(bloom.threshold,1))

// Depth of field 
bokehPass.enabled = Boolean(dof.enabled)

setUniform(bokehPass, "focus", Math.max(0.001,n(dof.focusDistance,10)))
setUniform(bokehPass, "aperture", Math.max(0, n(dof.fStop, 1.4)) * 0.0001);


setUniform(bokehPass, "maxblur", clamp( n(dof.fStop, 1)*0.01,0,1));


// chromatic Abberation

chromaticPass.enabled = Boolean(chromatic.enabled)

setUniform(chromaticPass, "amount", n(chromatic.amount,0.1)* 0.01)

// sharpen

sharpenPass.enabled = Boolean(sharpen.enabled);

setUniform(sharpenPass, "colorAmount", clamp(n(sharpen.colorAmount,0.5),0,1));

setUniform(
  sharpenPass,
  "edgeAmount",
  clamp(n(sharpen.edgeAmount, 0.5), 0, 2),
);


// grain 

grainPass.enabled = Boolean(grain.enabled)

setUniform(grainPass, "intensity", clamp(n(grain.intensity, 0.1), 0, 1));

setUniform(grainPass,"grayScale",false)


// FXAA
fxaaPass.enabled= Boolean(aa.fxaaEnabled)


// LUT

const lutUrl = image.colorGradientEnabled
? image.colorGradientTexture
: null;

if(!lutUrl)
{
  lutRequest ++ ;
  lutPass.enabled = false
  lutPass.lut = null;
  lutPass.intensity =1

} else if( lutUrl !== lutPass.__badvisorUrl)
{
  const request = ++lutRequest;
  lutPass.enabled= false;
  
  new LUTImageLoader().load(
    lutUrl,
    (result)=>{
      if(disposed || request !== lutRequest)
      {
        return;
      }

      const texture = result?.texture3D || result?.texture;

      if(!texture){
        lutPass.enabled = false
        return
      }

      lutPass.lut= texture;
      lutPass.intensity = 0.5 ;
      lutPass.enabled = true;

      lutPass.__badvisorUrl = lutUrl
    },
    undefined, 
    ()=>{
      if(disposed || request !== lutRequest)
      {
        return;
      }
      lutPass.enabled = false
    }
  )
}
  }

  function render(){
    if(!disposed)
    {
      composer.render();
    }

  }
  function dispose(){
    if(disposed){
      return;
    }
    disposed = true
    composer.dispose();
    [
      ssaoPass,
      ssrPass,
      glowPass,
      bloomPass,
      bokehPass,
      colorAdjustPass,
      chromaticPass,
      sharpenPass,
      grainPass,
      lutPass,
      outputPass,
      fxaaPass,
    ].forEach((pass)=>{
      pass?.dispose?.();
    })
  }
  resize(width,height);

  return{
    kind: "webgl",
    composer,
    update,
    resize,
    render,
    dispose,
  }
}

// WebGPU function 

async function createWebGPURuntime({
  scene, 
  renderer,
  camera,
  width,
  height
}){

  const { RenderPipeline } = await import("three/webgpu")

  const tsl= await import("three/tsl")

  const {bloom} = await import("three/addons/tsl/display/BloomNode.js");

  const {rgbShift} = await import("three/addons/tsl/display/RGBShiftNode.js");


  const {fxaa} = await import ("three/addons/tsl/display/FXAANode.js")

  const { oitPass } = await import ("three/addons/tsl/display/OITPassNode.js")

  const {ssao } = await import("three/addons/tsl/display/SSAONode.js")

  const { ssr } = await import("three/addons/tsl/display/SSRNode.js")

  const { film } = await import("three/addons/tsl/display/FilmNode.js")

  const { sharpen } =await import("three/addons/tsl/display/SharpenNode.js")

  const { dof } = await import("three/addons/tsl/display/DepthOfFieldNode.js")

  const { lut3D }  = await import("three/addons/tsl/display/Lut3DNode.js")

  const pipeline = new RenderPipeline(renderer)

  let graphNodes =[];

  let disposed = false;

  let currentEffects = Default_Effects;
  let currentSceneSettings = {};

  let lutData = null;
  let lutUrl = null;
  let lutRequest = 0;

  function disposeGraph(){
    graphNodes.forEach((node)=>{
      node?.dispose?.();
    })
    graphNodes = [];


  }

  function build({ effects = Default_Effects, sceneSettings = {} }) {
    if (disposed) {
      return;
    }
    currentEffects = effects || Default_Effects;

    currentSceneSettings = sceneSettings || {};

    disposeGraph();

    const image =
      currentEffects.imageProcessing || Default_Effects.imageProcessing;

    const curves =
      image.colorCurves || Default_Effects.imageProcessing.colorCurves;

    const bloomSettings = currentEffects.bloom || Default_Effects.bloom;

    const glow = currentEffects.glow || Default_Effects.glow;

    const chromatic =
      currentEffects.chromaticAbberation || Default_Effects.chromaticAbberation;

    const grain = currentEffects.grain || Default_Effects.grain;

    const aa = currentEffects.antiAliasing || Default_Effects.antiAliasing;

    const sharpenSettings = currentEffects.sharpen || Default_Effects.sharpen;

    const ssaoSettings = currentEffects.ssao || Default_Effects.ssao;

    const ssrSettings = currentEffects.ssr || Default_Effects.ssr;

    const dofSettings =
      currentEffects.depthOfField || Default_Effects.depthOfField;

    const scenePass = tsl.pass(scene, camera);

    scenePass.setMRT(
      tsl.mrt({
        output: tsl.output,
        normal: tsl.packNormalToRGB(tsl.normalView),
        metalrough: tsl.vec2(tsl.metalness, tsl.roughness),
      }),
    );

    graphNodes.push(scenePass);

    const colorNode = scenePass.getTextureNode("output");

    const depthNode = scenePass.getTextureNode("depth");

    const normalNode = tsl.unpackRGBToNormal(
      scenePass.getTextureNode("normal"),
    );

    const metalRoughNode = scenePass.getTextureNode("metalrough");

    let outputNode = colorNode;

    // OIT

    if (currentSceneSettings.enableOIT) {
      outputNode = oitPass(scene, camera);

      graphNodes.push(outputNode);
    }

    // ssaoSettings

    if (ssaoSettings.enabled && !currentSceneSettings.enableOIT) {
      const aoNode = ssao(depthNode, normalNode, camera);

      setNodeUniform(
        aoNode,
        "radius",
        Math.max(0.0001, n(ssaoSettings.radius, 0.1)),
      );

      setNodeUniform(
        aoNode,
        "samples",
        Math.max(1, Math.round(n(ssaoSettings.bilateralSamples, 32))),
      );

      setNodeUniform(
        aoNode,
        "intensity",
        Math.max(0, n(ssaoSettings.totalStrength, 1)),
      );

      setNodeUniform(aoNode, "bias", Math.max(0, n(ssaoSettings.base, 0)));

      setNodeUniform(
        aoNode,
        "blurSharpness",
        Math.max(0.01, n(ssaoSettings.bilateralTolerance, 2)),
      );

      aoNode.blurEnabled = n(ssaoSettings.bilateralSoften, 1) > 0;

      aoNode.resolutionScale = 0.5;
      graphNodes.push(aoNode);

      outputNode = outputNode.mul(aoNode.getTextureNode());
    }

    if (ssrSettings.enabled && !currentSceneSettings.enableOIT) {
      const roughnessNode = metalRoughNode.g.mul(
        clamp(n(ssrSettings.roughnessFactor, 0.5), 0, 2),
      );

      const reflectionNode = ssr(colorNode, depthNode, normalNode, {
        metalnessNode: metalRoughNode.r,
        roughnessNode,
        reflectNonMetals: true,
        stochastic: Boolean(ssrSettings.samples > 32),
      });

      const qualityFromSteps = clamp(n(ssrSettings.maxSteps, 20) / 64, 0, 1);

      const qualityFromSamples = clamp(n(ssrSettings.samples, 64) / 128, 0, 1);

      setNodeUniform(
        reflectionNode,
        "quality",
        Math.max(qualityFromSteps, qualityFromSamples),
      );

      setNodeUniform(
        reflectionNode,
        "maxDistance",
        Math.max(0.001, n(ssrSettings.maxDistance, 100)),
      );

      setNodeUniform(
        reflectionNode,
        "thickness",
        Math.max(0.0001, n(ssrSettings.thickness, 0.03)),
      );
      setNodeUniform(
        reflectionNode,
        "intensity",
        Math.max(
          0,
          1 - clamp(n(ssrSettings.reflectivityThreshold, 0.04), 0, 1),
        ),
      );

      setNodeUniform(
        reflectionNode,
        "ScreenEdgeFade",
        ssrSettings.attenuateScreenBorders ? 0.2 : 0,
      );

      reflectionNode.resolutionScale = clamp(
        n(ssrSettings.ssrDownSample, 1),
        0.1,
        1,
      );

      reflectionNode.blurQuality = clamp(
        Math.round(n(ssrSettings.blurDownsample, 1) + 1),
        1,
        3,
      );

      reflectionNode.stochastic = Boolean(ssrSettings.samples > 32);

      graphNodes.push(reflectionNode);
      outputNode = colorNode.add(reflectionNode.rgb);
    }

    // bloom
    if (bloomSettings.enabled) {
      const bloomNode = bloom(
        outputNode,
        Math.max(0, n(bloomSettings.weight, 0.5)),
        clamp(n(bloomSettings.scale, 1), 0, 1),
        Math.max(0, n(bloomSettings.threshold, 1)),
      );

      graphNodes.push(bloomNode);

      outputNode = outputNode.add(bloomNode);
    }

    // Glow

    if (glow.enabled) {
      const glowNode = bloom(
        outputNode,
        Math.max(0, n(glow.intensity, 0.5)),
        clamp(n(glow.blurKernelSize, 64) / 128, 0, 1),
        0,
      );

      graphNodes.push(glowNode);
      outputNode = outputNode.add(glowNode);
    }

    if (dofSettings.enabled) {
      const dofNode = dof(
        outputNode,
        scenePass.getViewZNode(),

        Math.max(0.001, n(dofSettings.focusDistance, 10)),
        Math.max(0.001, n(dofSettings.focalLength, 50)),
        Math.max(0, n(dofSettings.blurLevel, 1)),
      );

      graphNodes.push(dofNode);
      outputNode = dofNode;
    }
    if (chromatic.enabled) {
      const rgbShiftNode = rgbShift(
        outputNode,
        n(chromatic.amount, 0.1) * 0.01,
        0,
      );
      graphNodes.push(rgbShiftNode);
      outputNode = rgbShiftNode;
    }

    // sharpen
    if (sharpenSettings.enabled) {
      const sharpenNode = sharpen(
        outputNode,
        clamp(n(sharpenSettings.edgeAmount, 0.5), 0, 2),
      );
      graphNodes.push(sharpenNode);
      outputNode = sharpenNode;
    }

    // grain

    if (grain.enabled) {
      const filmNode = film(outputNode, clamp(n(grain.intensity, 0.1), 0, 1));
      graphNodes.push(filmNode);
      outputNode = filmNode;
    }

    // image

    if (image.enabled) {
      let rgb = outputNode.rgb.mul(Math.max(0, n(image.exposure, 1)));
      rgb = rgb.sub(0.5).mul(n(image.contrast, 1)).add(0.5);
      rgb = tsl.hue(rgb, (n(curves.globalHue, 0) * Math.PI) / 180);

      rgb = tsl.saturation(rgb, 1 + n(curves.globalSaturation, 0));

      if (image.vignetteEnabled) {
        rgb = tsl.vignette(
          rgb,
          clamp(n(image.vignetteWeight, 1), 0, 1),
          Math.max(0.01, n(image.vignetteStretch, 1)),
        );
      }
      outputNode = tsl.vec4(rgb, outputNode.a);
    }

    const requestedLut = image.colorGradientEnabled
      ? image.colorGradientTexture
      : null;

    if (requestedLut) {
      loadLut(requestedLut);
    }

    if (image.colorGradientEnabled && lutData) {
      const texture = lutData.texture3D || lutData.texture;

      const size = lutData.size || 32;

      if (texture) {
        const lutTextureNode = tsl.texture(texture);

        const lutNode = lut3D(outputNode, lutTextureNode, size, 1);
        graphNodes.push(lutNode);

        outputNode = lutNode;
      }
    }
    renderer.toneMapping = image.toneMappingEnabled
      ? toneMappingValue(image.toneMappingType)
      : THREE.NoToneMapping;

    renderer.toneMappingExposure = n(image.exposure, 1);

    // aa

    if (aa.fxaaEnabled) {
      outputNode = tsl.renderOutput(outputNode)

      outputNode = fxaa(outputNode)

      pipeline.outputColorTransform= false;
    }
    else {
      pipeline.outputColorTransform = true ;
    }

    pipeline.outputNode = outputNode
    pipeline.needsUpdate = true 
  }



  
  function loadLut (url){
    if(!url)
    {
      lutData = null
      lutUrl =  null
      return ;
    }

    if (url === lutUrl)
    {
      return
    }

    lutUrl = url;

    const request = ++lutRequest;

    new LUTImageLoader().load (
      url, (result) =>{
        if( disposed || request !== lutRequest)
        {
          return ;
        }

        lutData  = result;
        build (currentEffects, currentSceneSettings)

        
      }, undefined,
      ()=>{
        if(disposed || request !== lutRequest)
        {
          return;
        }

        lutData= null;
        build(currentEffects, currentSceneSettings)
      }
    )


  }

  function update(effects, sceneSettings ){

    currentEffects= effects || Default_Effects;

    currentSceneSettings = sceneSettings || {};

    build(currentEffects, currentSceneSettings)

  }

  function resize(nextWidth, nextheight){
    const w = Math.max(1, nextWidth || width || 1 )
    const h = Math.max(1, nextheight || height || 1 )

    graphNodes.forEach((node)=>{
      node?.setSize?.(w,h)
    })

  }

  function render(){
    if(!disposed)
    {
      pipeline.render()
    }
  }

  function dispose(){
    if(disposed)
    {
      return;
    }
    disposed = true ;
    lutRequest ++ ;
    disposeGraph();
    pipeline.dispose?.()
  }

  build(Default_Effects, {})

  return {
    kind : "webgpu",
    pipeline,
    update,
    render,
    resize,
    dispose
  }
 

}


export async function createEffectsRuntime(options) {
  if(options?.renderer?.isWebGPURenderer)
  {
    return createWebGPURuntime(options)

  }
  return createWebGLRuntime(options);
}