import * as THREE from 'https://cdn.skypack.dev/three@0.133.1/build/three.module';

const container = document.querySelector('.container');
const canvasEl = document.querySelector('#canvas');

let renderer, scene, camera, clock, material;

const params = {
    speed: 2,
    shape: 1,
    power: .7,
    addition: .5,
}

initScene();
window.addEventListener('resize', updateSceneSize);

gsap.timeline({
    scrollTrigger: {
        trigger: '.scroll-space',
        start: '0% 0%',
        end: '100% 100%',
        scrub: true,
    },
    onUpdate: () => {
        material.uniforms.u_shape_offset.value = params.shape;
        material.uniforms.u_power.value = params.power;
        material.uniforms.u_addition.value = params.addition;
    }
})
    .to(params, {
        duration: .7,
        shape: .2,
    })
    .to(params, {
        duration: .7,
        power: 0,
        ease: 'power3.in'
    }, 0)
    .fromTo(params, {
        addition: .5,
    }, {
        duration: .7,
        addition: 1,
        ease: 'power4.out'
    }, .3)



function initScene() {

    renderer = new THREE.WebGLRenderer({
        alpha: true,
        canvas: canvasEl
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(-.5, .5, .5, -.5, .1, 10);
    clock = new THREE.Clock()

    material = new THREE.ShaderMaterial({
        uniforms: {
            u_time: { type: "f", value: 0 },
            u_ratio: { type: "f", value: window.innerWidth / window.innerHeight },
            u_speed: { type: "f", value: params.speed },
            u_shape_offset: { type: "f", value: params.shape },
            u_power: { type: "f", value: params.power },
            u_addition: { type: "f", value: params.addition },
        },
        vertexShader: document.getElementById("vertexShader").textContent,
        fragmentShader: document.getElementById("fragmentShader").textContent
    });
    const planeGeometry = new THREE.PlaneGeometry(2, 2);
    scene.add(new THREE.Mesh(planeGeometry, material));

    updateSceneSize();
    render();
}


function render() {
    material.uniforms.u_time.value = clock.getElapsedTime();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

function updateSceneSize() {
    material.uniforms.u_ratio.value = window.innerWidth / window.innerHeight;
    renderer.setSize(container.clientWidth, container.clientHeight);
}