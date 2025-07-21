<template>
  <div ref="container" class="w-full h-full"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, onUnmounted } from 'vue'
import * as THREE from 'three'

import { userDarkMOdel, userCurrentPage } from '../store/stateStore';

const darkModeStore = userDarkMOdel();
const currentPageStore = userCurrentPage();

const container = ref<HTMLDivElement>()
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let stars: THREE.Points
let galaxy: THREE.Points
let rainLines: THREE.Group
let cloudParticles: THREE.Points
let animationId: number
// 目标位置和朝向
const targetPosition = new THREE.Vector3()
const targetLookAt = new THREE.Vector3()
// 相机位置配置
const cameraPositions = [
  { position: [0, 0, 50], lookAt: [0, 0, 0] }, // 正面视角
  { position: [40, 20, 30], lookAt: [0, 0, 0] }, // 右上角视角
  { position: [0, 40, 20], lookAt: [0, 0, 0] }, // 顶部视角
  { position: [-40, 10, 30], lookAt: [0, 0, 0] }, // 左侧视角
  { position: [20, -30, 40], lookAt: [0, 0, 0] }, // 底部斜视角
]


//初始化
const initThreeJS = () => {
  if (!container.value) return
  //创建场景和相机
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, 5, 50)
  // 创建渲染器
  //alpha: true,背景变为透明色
  renderer = new THREE.WebGLRenderer({ alpha: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  container.value.appendChild(renderer.domElement)

  if (darkModeStore.isDark) {
    createStars()
    createGalaxy()
    updateCamera()
  } else {
    createRain()
  }
  animate()
}

//创建银河
const createGalaxy = () => {
  const count = 8000
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)

  const innerColor = new THREE.Color('#ffffff')
  const middleColor = new THREE.Color('#a855f7')
  const outerColor = new THREE.Color('#581c87')

  for (let i = 0; i < count; i++) {
    // 创建螺旋银河形状
    const radius = Math.random() * 25
    const spinAngle = radius * 0.3
    const branchAngle = (i % 3) * ((2 * Math.PI) / 3)

    const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.3
    const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.3
    const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.3

    positions[i * 3] = Math.cos(branchAngle + spinAngle) * radius + randomX
    positions[i * 3 + 1] = randomY * 0.5
    positions[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

    // 颜色渐变：中心更亮，边缘更暗
    const mixedColor = new THREE.Color()
    if (radius < 8) {
      mixedColor.lerpColors(innerColor, middleColor, radius / 8)
    } else {
      mixedColor.lerpColors(middleColor, outerColor, (radius - 8) / 17)
    }

    colors[i * 3] = mixedColor.r
    colors[i * 3 + 1] = mixedColor.g
    colors[i * 3 + 2] = mixedColor.b
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 0.8,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
    vertexColors: true,
  })

  galaxy = new THREE.Points(geometry, material)
  scene.add(galaxy)
}
//创建星星
const createStars = () => {
  const geometry = new THREE.BufferGeometry()
  const vertices = []

  for (let i = 0; i < 5000; i++) {
    vertices.push(
      Math.random() * 600 - 300,
      Math.random() * 600 - 300,
      Math.random() * 600 - 300
    )
  }

  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(vertices, 3)
  )

  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 1,
    transparent: true
  })

  stars = new THREE.Points(geometry, material)
  scene.add(stars)
}
//银河和星星的动画
const animateStarsAndGalaxy = () => {
  if (stars) {
    stars.rotation.y += 0.0004
    stars.rotation.x += 0.0002
  }
  if (galaxy) {
    galaxy.rotation.y += 0.0002
    galaxy.rotation.x += 0.0001

  }
}
//改变相机
const updateCamera = () => {
  const targetPos = cameraPositions[currentPageStore.currentIndex]
  console.log(currentPageStore.currentIndex)
  targetPosition.set(targetPos.position[0], targetPos.position[1], targetPos.position[2])
  targetLookAt.set(targetPos.lookAt[0], targetPos.lookAt[1], targetPos.lookAt[2])

  // 平滑过渡相机位置
  camera.position.lerp(targetPosition, 0.02)
  camera.lookAt(targetLookAt)
}

const createRain = () => {
  const cloudGeometry = new THREE.BufferGeometry()
  const cloudVertices = []
  const cloudCount = 200

  for (let i = 0; i < cloudCount; i++) {
    cloudVertices.push(
      Math.random() * 400 - 200,
      150 + Math.random() * 20,
      Math.random() * 400 - 200
    )
  }

  cloudGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(cloudVertices, 3)
  )

  const cloudMaterial = new THREE.PointsMaterial({
    color: 0x444444,
    size: 15,
    transparent: true,
    opacity: 0.3,
    depthWrite: false
  })

  cloudParticles = new THREE.Points(cloudGeometry, cloudMaterial)
  scene.add(cloudParticles)

  rainLines = new THREE.Group()
  const rainCount = 1000

  for (let i = 0; i < rainCount; i++) {
    const geometry = new THREE.BufferGeometry()
    const vertices = new Float32Array([
      0, 0, 0,
      0, -15, 0
    ])
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
    const material = new THREE.LineBasicMaterial({
      color: 0x6699cc,
      transparent: true,
      opacity: 0.6
    })

    const line = new THREE.Line(geometry, material)
    line.position.set(
      Math.random() * 400 - 200,
      Math.random() * 300 + 150,
      Math.random() * 400 - 200
    )
    rainLines.add(line)
  }
  scene.add(rainLines)
}

const animateRain = () => {
  if (!rainLines) return

  const cloudPositions = cloudParticles.geometry.attributes.position.array as Float32Array
  for (let i = 0; i < cloudPositions.length; i += 3) {
    cloudPositions[i] += Math.sin(Date.now() * 0.001) * 0.02
  }
  cloudParticles.geometry.attributes.position.needsUpdate = true

  const fallSpeed = 2
  rainLines.children.forEach(line => {
    line.position.y -= fallSpeed

    if (line.position.y < -150) {
      line.position.y = 150 + Math.random() * 50
      line.position.x = Math.random() * 400 - 200
      line.position.z = Math.random() * 400 - 200
    }
  })
}

const animate = () => {
  animationId = requestAnimationFrame(animate)
  if (darkModeStore.isDark) {
    animateStarsAndGalaxy()
    updateCamera()
  } else {
    animateRain()
  }
  // 渲染场景
  renderer.render(scene, camera)
}

watch(() => darkModeStore.isDark, (newValue) => {
  if (!scene) return
  //移除旧元素
  if (stars) scene.remove(stars)
  if (rainLines) scene.remove(rainLines)
  if (cloudParticles) scene.remove(cloudParticles)
  if (galaxy) scene.remove(galaxy)

  if (newValue) {
    createStars()
  } else {
    createRain()
  }
})
watch(() => currentPageStore.currentIndex, (newValue) => {
  if (newValue) {
    updateCamera()
  }
})

const handleResize = () => {
  if (!camera || !renderer) return

  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

onMounted(() => {
  initThreeJS()
  window.addEventListener('resize', handleResize)

})

onUnmounted(() => {
  window.addEventListener('resize', handleResize)
});

onBeforeUnmount(() => {
  // 清理Three.js资源
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  if (renderer) {
    renderer.dispose()
  }
  if (scene) {
    scene.clear()
  }
  // 清理事件监听器
  window.removeEventListener('resize', handleResize)
})
</script>