import React, { useEffect, useState, useContext } from 'react'
import * as THREE from 'three';
import { Context } from '../../context/Context'
import alphaTexture from '../../assets/textures/dark-s_nx.jpg';
import { Interaction } from 'three.interaction';
import { bestSkills, categories } from '../../content/skills'


const TreeReact = () => {
    const { setCategory } = useContext(Context)
    const [container, setContainer] = useState()
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


    var camera, scene, renderer;

    var raycaster, mouse;

    var mesh, line, box, box2;

    const boxGroup = new THREE.Group();
    const textGroup = new THREE.Group();

    function init() {

        // container = document.getElementById('container');

        //

        // camera = new THREE.PerspectiveCamera(27, window.innerWidth / window.innerHeight, 1, 3500);
        // camera.position.z = 2750;

        camera = buildCamera(screenDimensions)
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff);
        scene.fog = new THREE.Fog(0x050505, 2000, 3500);

        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);

        const interaction = new Interaction(renderer, scene, camera);



        const subjectGeometry = new THREE.IcosahedronGeometry(200);
        var texture = new THREE.TextureLoader().load(alphaTexture);

        const subjectMaterial = new THREE.MeshStandardMaterial({

        });
        subjectMaterial.alphaMap = new THREE.TextureLoader().load(alphaTexture);
        subjectMaterial.alphaMap.magFilter = THREE.NearestFilter;
        subjectMaterial.alphaMap.wrapT = THREE.RepeatWrapping;

        const subjectWireframe = new THREE.LineSegments(
            new THREE.EdgesGeometry(subjectGeometry),
            new THREE.LineBasicMaterial(),

        );
        var material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true });

        var geometry = new THREE.BoxGeometry(10, 10, 10, 10, 10, 10)
        var box = new THREE.Mesh(geometry, subjectMaterial);

        box.rotation.z = Math.PI / 4;
        box.rotation.x = Math.PI / 4;
        box.rotation.y = Math.PI / 4;
        box.name = 'foo'
        box.cursor = 'pointer';
        box.on('click', function (ev) {
            setCategory(ev.data.target.name)
            scene.add(textGroup)
        });

        boxGroup.add(box);
        scene.add(subjectWireframe);
        scene.add(boxGroup)


        mouse = new THREE.Vector2();


        //Points

        const pointsGeometry = new THREE.RingGeometry(10);
        var points = new THREE.Points(pointsGeometry);
        // var points = new THREE.Points(pointsGeometry, pointsMaterial);
        console.log('points :', points.geometry.vertices);
        let pointsVertices = points.geometry.vertices


        // var ambientLight = new THREE.AmbientLight(0x555555);
        // scene.add(ambientLight);

        var loader = new THREE.FontLoader();
        loader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_bold.typeface.json', async (font) => {
            // 
            categories.forEach((str, i) => {
                var textGeo = new THREE.TextGeometry(str, {
                    font: font,
                    size: 1,
                    height: .5,

                })


                textGeo.center()
                // await textGeo.position.set(foo.x, foo.y, foo.z)
                // var textmaterial = new THREE.MeshNormalMaterial({ color: '#5b0f0f' });
                var textmaterial = new THREE.MeshPhongMaterial(
                    { color: 0xffffff }
                );
                var textMesh = new THREE.Mesh(textGeo, textmaterial);

                textMesh.position.set(pointsVertices[i].x, pointsVertices[i].y, pointsVertices[i].z)
                textMesh.name = str
                textMesh.on('click', function (ev) {
                    setCategory(ev.data.target.name)

                });
                textGroup.add(textMesh);
            })


        });



        container.appendChild(renderer.domElement);

        onWindowResize()
        window.addEventListener('resize', onWindowResize, false);
        document.addEventListener('mousemove', onDocumentMouseMove, false);

    }
    function buildCamera({ width, height }) {
        const aspectRatio = width / height;
        const fieldOfView = 60;
        const nearPlane = 4;
        const farPlane = 100;
        const camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);

        camera.position.z = 40;

        return camera;
    }

    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);

    }

    function onDocumentMouseMove(event) {

        event.preventDefault();

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    }

    //

    function animate() {

        requestAnimationFrame(animate);

        render();
        // stats.update();

    }

    function render() {

        var time = Date.now() * 0.001;

        // boxGroup.rotation.x = time * 0.15;
        boxGroup.rotation.y = time

        // raycaster.setFromCamera(mouse, camera);

        // var intersects = raycaster.intersectObject(boxGroup);

        // console.log('intersects :', intersects);
        // if (intersects.length > 0) {
        //     var intersect = intersects[0];
        //     console.log('intersect :', intersect.object.name);
        //     var face = intersect.face;
        //     setCategory(intersect.object.name)
        //     var linePosition = line.geometry.attributes.position;
        //     // var meshPosition = box2.geometry.attributes.position;

        //     linePosition.copyAt(0, meshPosition, face.a);
        //     linePosition.copyAt(1, meshPosition, face.b);
        //     linePosition.copyAt(2, meshPosition, face.c);
        //     linePosition.copyAt(3, meshPosition, face.a);

        //     mesh.updateMatrix();

        //     line.geometry.applyMatrix4(mesh.matrix);

        //     line.visible = true;

        // } else {

        //     line.visible = false;

        // }

        renderer.render(scene, camera);

    }
    function deformGeometry(geometry) {
        for (let i = 0; i < geometry.vertices.length; i += 2) {
            const scalar = 1 + Math.random() * 0.8;
            geometry.vertices[i].multiplyScalar(scalar)
        }

        return geometry;
    }
    return (
        <div className="header-header" ref={element => setContainer(element)} />
    )
}

export default TreeReact
