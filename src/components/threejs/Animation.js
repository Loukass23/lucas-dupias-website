import React, { useEffect, useState, useContext } from 'react'
import * as THREE from 'three';
import { Context } from '../../context/Context'
import alphaTexture from '../../assets/textures/stripes_gradient.jpg';
import font from '../../assets/font/CascadiaCode.json';
import { Interaction } from 'three.interaction';
import { bestSkills, categories } from '../../content/skills'
import "./animation.css"


const TreeReact = () => {
    const { setCategory } = useContext(Context)
    const [container, setContainer] = useState()
    const [animation, setAnimation] = useState(false)

    useEffect(() => {
        if (container) {
            init();
            animate();
        }
    }, [container])


    const screenDimensions = {
        width: window.width,
        height: window.height
    }
    const origin = new THREE.Vector3(0, 0, 0);


    var camera, scene, renderer, subjectMaterial, subjectWireframe;

    var mouse = {
        x: 0,
        y: 0
    }

    const boxGroup = new THREE.Group();
    let textGroup = new THREE.Group();
    const wireFrameGroup = new THREE.Group();


    const init = () => {
        camera = buildCamera(screenDimensions)
        scene = buildScene()
        renderer = buildRenderer()

        new Interaction(renderer, scene, camera);

        const box = buildBox()
        boxGroup.add(box);

        const wireFrame = buildWireframe()
        wireFrameGroup.add(wireFrame);

        textGroup = buildTexts()

        scene.add(boxGroup)
        scene.add(wireFrame)
        // scene.add(textGroup)

        // mouse = new THREE.Vector2();


        container.appendChild(renderer.domElement);
        onWindowResize()
        window.addEventListener('resize', onWindowResize, false);
        // document.addEventListener('mousemove', onDocumentMouseMove, false);

        // document.addEventListener('mousemove', onDocumentMouseMove, false);

    }

    const buildRenderer = () => {
        const renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        return renderer
    }

    function onMouseMove(x, y) {
        console.log('x :', x);
        mouse.x = x;
        mouse.y = y;
    }
    const buildTexts = () => {
        const group = new THREE.Group();

        const pointsGeometry = new THREE.RingGeometry(22);
        var points = new THREE.Points(pointsGeometry);
        let pointsVertices = points.geometry.vertices

        const fonti = new THREE.Font(font);

        categories.forEach((str, i) => {
            var textGeo = new THREE.TextGeometry(str, {
                font: fonti,
                size: 2,
                height: 1,
            })

            textGeo.center()

            const pointLight = new THREE.PointLight(0x870d4e, 2);
            pointLight.position.set(0, 100, 90);
            scene.add(pointLight);
            // pointLight.color.setHSL(Math.random(), 1, 0.5);


            const textMaterials = [new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }),
            new THREE.MeshPhongMaterial({ color: 0x000000 })];

            var textMesh = new THREE.Mesh(textGeo, textMaterials);

            textMesh.position.set(pointsVertices[i].x, pointsVertices[i].y, pointsVertices[i].z)
            textMesh.name = str
            textMesh.on('click', function (ev) {
                setCategory(ev.data.target.name)

            });
            group.add(textMesh);
        })
        return group
    }
    const buildWireframe = () => {
        const subjectGeometry = new THREE.IcosahedronGeometry(10);
        subjectMaterial = new THREE.MeshStandardMaterial(
            {});
        // subjectMaterial.alphaMap = new THREE.TextureLoader().load(alphaTexture);
        // subjectMaterial.alphaMap.magFilter = THREE.NearestFilter;
        // subjectMaterial.alphaMap.wrapT = THREE.RepeatWrapping;
        // subjectMaterial.alphaMap.repeat.y = 10;

        subjectWireframe = new THREE.LineSegments(
            new THREE.EdgesGeometry(subjectGeometry),
            // new THREE.LineBasicMaterial(),

        );
        return subjectWireframe
    }
    const buildBox = () => {
        var boxGeometry = new THREE.BoxGeometry(10, 10, 10, 10, 10, 10)
        const boxMaterial = new THREE.MeshStandardMaterial({ color: "#000", transparent: true, side: THREE.AdditiveBlending, alphaTest: 0.1 });
        boxMaterial.alphaMap = new THREE.TextureLoader().load(alphaTexture);
        boxMaterial.alphaMap.magFilter = THREE.NearestFilter;
        boxMaterial.alphaMap.wrapT = THREE.RepeatWrapping;
        var box = new THREE.Mesh(boxGeometry, boxMaterial);
        box.rotation.z = Math.PI / 4;
        box.rotation.x = Math.PI / 4;
        box.rotation.y = Math.PI / 4;
        box.name = 'foo'
        box.cursor = 'pointer';
        box.on('click', function (ev) {
            setAnimation(true)
            scene.add(textGroup)
        });
        return box
    }
    const buildScene = () => {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff);
        scene.fog = new THREE.Fog(0x050505, 2000, 3500);
        return scene
    }
    const buildCamera = ({ width, height }) => {
        const aspectRatio = width / height;
        const fieldOfView = 60;
        const nearPlane = 4;
        const farPlane = 100;
        const camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);

        camera.position.z = 40;
        return camera
    }

    const onWindowResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        console.log('window.innerWidth :', window.innerWidth);
        // 
        renderer.setSize(window.innerWidth, window.innerHeight);


        if (800 < window.innerWidth < 1000) camera.position.z = 50
        if (300 < window.innerWidth < 800) camera.position.z = 80
        if (window.innerWidth < 300) camera.position.z = 100
        if (window.innerWidth > 1000) camera.position.z = 40
    }

    function onDocumentMouseMove(event) {
        event.preventDefault();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;


    }

    const animate = () => {
        requestAnimationFrame(animate);
        render();
    }

    const render = () => {
        var time = Date.now() * 0.001;
        const speed = 0.02;
        const textureOffsetSpeed = 0.02;
        boxGroup.rotation.y = time
        const angle = time * speed;

        boxGroup.rotation.y = -(angle * 50);

        // subjectMaterial.alphaMap.offset.y = 0.55 + time * textureOffsetSpeed;

        subjectWireframe.material.color.setHSL(Math.sin(angle * 2), 0.5, 0.5);

        camera = updateCameraPositionRelativeToMouse()
        let scale
        if (animation) {
            scale = angle * 8;

            subjectWireframe.scale.set(scale, scale, scale)
        }
        else {
            scale = (Math.sin(angle * 8) + 6.4) / 5;
            subjectWireframe.scale.set(scale, scale, scale)
        }


        const scale2 = (Math.sin(angle * 8) + 6.4) / 8;
        textGroup.scale.set(scale2, scale2, scale2)

        renderer.render(scene, camera);

    }
    const updateCameraPositionRelativeToMouse = () => {
        camera.position.x += ((mouse.x) - camera.position.x) * 0.01;
        camera.position.y += (-(mouse.y) - camera.position.y) * 0.01;
        camera.lookAt(origin);
        return camera

    }

    function deformGeometry(geometry) {
        for (let i = 0; i < geometry.vertices.length; i += 2) {
            const scalar = 1 + Math.random() * 0.8;
            geometry.vertices[i].multiplyScalar(scalar)
        }

        return geometry;
    }

    return (
        <div className="animation" ref={element => setContainer(element)} />
    )
}

export default TreeReact
