import React, { useEffect, useState, useContext } from 'react'
import * as THREE from 'three';
import { Context } from '../../context/Context'
import alphaTexture from '../../assets/textures/stripes_gradient.jpg';
import image from '../../assets/images/profile2.png';
import video from '../../assets/images/battleship.mp4';
import github_logo from '../../assets/images/github_logo.png';
import font from '../../assets/font/CascadiaCode.json';
import { Interaction } from 'three.interaction';
import { bestSkills, categories, about } from '../../content/skills'
import "./animation.css"


const TreeReact = () => {
    const { category, setCategory } = useContext(Context)
    const [container, setContainer] = useState()
    const [animation, setAnimation] = useState(false)

    var getCategory = () => {
        console.log('category', category)
        return category
    }

    useEffect(() => {
        if (container) {
            init();
            animate();
        }
    }, [container])

    useEffect(() => {
        cat = category
        console.log('cat :', cat);
    }, [category])

    const screenDimensions = {
        width: window.width,
        height: window.height
    }
    const origin = new THREE.Vector3(0, 0, 0);


    var camera, cat, scene, renderer, canvas, subjectWireframe, subjectMaterial, imgMesh, videoMesh;

    var mouse = {
        x: 0,
        y: 0
    }

    const boxGroup = new THREE.Group();
    let textGroup = new THREE.Group();
    let skillsGroup = new THREE.Group();
    let aboutGroup = new THREE.Group();
    const wireFrameGroup = new THREE.Group();


    const init = () => {
        camera = buildCamera(screenDimensions)
        scene = buildScene()
        renderer = buildRenderer()


        imgMesh = buildImg()


        new Interaction(renderer, scene, camera);

        const box = buildBox()
        boxGroup.add(box);

        const wireFrame = buildWireframe()
        wireFrameGroup.add(wireFrame);

        textGroup = buildTexts(categories, 20)
        skillsGroup = buildTexts(bestSkills, 10)
        aboutGroup = buildTexts(about, 25)
        skillsGroup.scale.set(0.5, 0.5, 0.5)
        aboutGroup.scale.set(0.5, 0.5, 0.5)

        scene.add(boxGroup)
        scene.add(wireFrame)
        // scene.add(imgMesh)
        // scene.add(textGroup)

        const pointLight = new THREE.PointLight(0x870d4e, 2);
        pointLight.position.set(0, 100, 90);
        scene.add(pointLight);
        // pointLight.color.setHSL(Math.random(), 1, 0.5);


        // mouse = new THREE.Vector2();

        canvas = renderer.domElement
        console.log('canvas :', canvas);

        videoMesh = buildVideo()
        container.appendChild(canvas);
        onWindowResize()
        window.addEventListener('resize', onWindowResize, false);
        document.addEventListener('mousemove', onDocumentMouseMove, false);

        // document.addEventListener('mousemove', onDocumentMouseMove, false);

    }

    const buildRenderer = () => {
        const renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        return renderer
    }

    const buildTexts = (arr, size) => {
        const group = new THREE.Group();

        const pointsGeometry = new THREE.RingGeometry(size);
        var points = new THREE.Points(pointsGeometry);
        let pointsVertices = points.geometry.vertices

        const fonti = new THREE.Font(font);

        var map = new THREE.TextureLoader().load(alphaTexture);
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.anisotropy = 16;

        var material = new THREE.MeshPhongMaterial({ map: map, side: THREE.DoubleSide });

        arr.forEach((str, i) => {
            var textGeo = new THREE.TextGeometry(str, {
                font: fonti,
                size: 2,
                height: 1,
            })

            textGeo.center()



            const textMaterials = [new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }),
            new THREE.MeshPhongMaterial({ color: 0x000000 })];
            let textGroupChild = new THREE.Group();

            var textMesh = new THREE.Mesh(textGeo, textMaterials);

            const plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(20, 5, 4, 4));
            plane.position.set(pointsVertices[i].x, pointsVertices[i].y, pointsVertices[i].z)
            textGroupChild.add(plane);

            textMesh.position.set(pointsVertices[i].x, pointsVertices[i].y, pointsVertices[i].z)
            textMesh.name = str
            textMesh.cursor = 'pointer';
            plane.cursor = 'pointer';
            plane.name = str
            textGroupChild.name = str
            plane.on('click', (ev) => {
                setCategory(str)
                cat = str
                decount = 10

            });
            textMesh.on('click', (ev) => {
                setCategory(str)
                cat = str
                decount = 10

            });
            textGroupChild.add(textMesh);
            group.add(textGroupChild)
        })
        return group
    }
    const buildWireframe = () => {
        const subjectGeometry = new THREE.IcosahedronGeometry(11);
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
        subjectWireframe.cursor = 'pointer';
        subjectWireframe.on('click', function (ev) {
            scene.add(textGroup)
        })
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
        box.name = 'box'
        box.cursor = 'pointer';
        box.on('click', function (ev) {
            scene.add(textGroup)
            if (cat) {
                console.log('cat :', cat);
                setCategory(categories[categories.indexOf(cat) + 1])
                if (categories.indexOf(cat) === categories.length - 1) {
                    cat = categories[0]
                    decount = 10
                }
                else {
                    cat = categories[categories.indexOf(cat) + 1]
                    decount = 10

                }

            }
        });
        return box
    }
    const buildImg = () => {
        var imgGeometry = new THREE.PlaneBufferGeometry(15, 15, 15, 15);
        var img = new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture(image)
        });
        img.map.needsUpdate = true; //ADDED
        var imgMesh = new THREE.Mesh(imgGeometry, img);
        imgMesh.name = 'img'
        imgMesh.cursor = 'pointer';
        // imgMesh.on('click', function (ev) {
        //     scene.add(textGroup)
        // });
        return imgMesh
    }
    const buildLinks = () => {
        var imgGeometry = new THREE.PlaneBufferGeometry(15, 15, 15, 15);
        var img = new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture(image)
        });
        img.map.needsUpdate = true; //ADDED
        var imgMesh = new THREE.Mesh(imgGeometry, img);
        imgMesh.name = 'img'
        imgMesh.cursor = 'pointer';
        // imgMesh.on('click', function (ev) {
        //     scene.add(textGroup)
        // });
        return imgMesh
    }
    const buildVideo = () => {
        // create the video element
        const videoEl = document.createElement('video');
        // video.id = 'video';
        // video.type = ' video/ogg; codecs="theora, vorbis" ';
        videoEl.src = video;
        videoEl.load(); // must call after setting/changing source
        videoEl.play();
        canvas.appendChild(videoEl)
        var videoGeometry = new THREE.PlaneBufferGeometry(30, 30, 10, 10);
        var videoTexture = new THREE.Texture(video);
        videoTexture.minFilter = THREE.LinearFilter;
        videoTexture.magFilter = THREE.LinearFilter;

        var videoMaterial = new THREE.MeshBasicMaterial({ map: videoTexture, overdraw: true, side: THREE.DoubleSide });

        // texture.minFilter = THREE.LinearFilter;
        // texture.magFilter = THREE.LinearFilter;
        // texture.format = THREE.RGBFormat;

        var videoMesh = new THREE.Mesh(videoGeometry, videoMaterial);
        videoMesh.name = 'video'
        videoMesh.cursor = 'pointer';
        // imgMesh.on('click', function (ev) {
        //     scene.add(textGroup)
        // });
        return videoMesh
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


    var decount = 0
    const render = () => {
        var time = Date.now() * 0.001;
        const speed = 0.02;
        const textureOffsetSpeed = 0.02;
        const angle = time * speed;
        let scale = (Math.sin(angle * 8) + 6.4) / 5;
        if (!cat) {
            boxGroup.rotation.y = time
            boxGroup.rotation.y = -(angle * 50);
        }
        else {
            if (boxGroup.position.y < 18) {
                boxGroup.position.set(boxGroup.position.x, boxGroup.position.y + speed * 12, 0)
                boxGroup.scale.set(0.4, 0.4, 0.4)
                boxGroup.rotation.y = time - speed * 3
            }
            if (boxGroup.position.x > -35) {
                boxGroup.position.set(boxGroup.position.x - speed * 19, boxGroup.position.y, 0)

            }

            // console.log('canvas.height :', canvas.height);
            if (decount > 0) {
                boxGroup.rotation.x = time - speed
                boxGroup.rotation.y = time - speed
                boxGroup.rotation.z = time - speed
                console.log('decount :', decount);
                decount--
            }

            subjectWireframe.scale.set(subjectWireframe.scale - speed)
            textGroup.children.forEach(child => {
                child.children.forEach((el, i) => {
                    if (el.name !== cat) {
                        el.scale.set(0.5, 0.5, 0.5)
                        el.position.set(el.position.x, 20, el.position.z)
                    } else {
                        el.position.set(el.position.x, 18, el.position.z)
                        el.scale.set(0.8, 0.8, 0.8)

                    }

                })
            })
            const removeCenter = () => {
                scene.remove(skillsGroup)
                scene.remove(videoMesh)
                scene.remove(imgMesh)
                scene.remove(aboutGroup)
            }

            switch (cat) {
                case 'About': {
                    removeCenter()
                    scene.add(imgMesh)
                    scene.add(aboutGroup)
                    break
                }
                case 'Projects': {
                    removeCenter()
                    scene.add(videoMesh)
                    break
                }


                case 'Skills':
                    {
                        removeCenter()

                        scene.add(skillsGroup)
                        break
                    }
                // case 'Skills':
                //     {
                //         removeCenter()

                //         scene.add(skillsGroup)
                //         break
                //     }


                default: removeCenter()



            }

        }

        // subjectMaterial.alphaMap.offset.y = 0.55 + time * textureOffsetSpeed;

        subjectWireframe.material.color.setHSL(Math.sin(angle * 2), 0.5, 0.5);

        updateCameraPositionRelativeToMouse()



        if (animation) {
            scale = 0;
            console.log('object');

            subjectWireframe.scale.set(scale, scale, scale)
        }


        const scale2 = (Math.sin(angle * 8) + 6.4) / 8;
        skillsGroup.scale.set(scale2, scale2, scale2)

        renderer.render(scene, camera);

    }

    const updateCameraPositionRelativeToMouse = () => {
        camera.position.x += ((mouse.x) - camera.position.x);
        camera.position.y += (-(mouse.y) - camera.position.y);
        camera.lookAt(origin);

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
