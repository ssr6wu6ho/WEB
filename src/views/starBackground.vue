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
  { position: [40, 20, 30], lookAt: [0, 0, 0] }, // 右上角视角
  { position: [0, 40, 20], lookAt: [0, 0, 0] }, // 顶部视角
  { position: [-40, 10, 30], lookAt: [0, 0, 0] }, // 左侧视角
  { position: [20, -30, 40], lookAt: [0, 0, 0] }, // 底部斜视角
]

// 修改后的创建银河函数 - 更大半径，中心密度更高
const createGalaxy = () => {
  const count = 15000 // 增加粒子数量以获得更好的效果
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count) // 添加大小数组用于不同大小的粒子

  // 调整颜色 - 更符合真实星系
  const innerColor = new THREE.Color('#ffffff') // 中心白色
  const middleColor = new THREE.Color('#ffd700') // 中间金黄色
  const outerColor = new THREE.Color('#4169e1') // 外围蓝色
  const edgeColor = new THREE.Color('#191970') // 边缘深蓝色

  for (let i = 0; i < count; i++) {
    // 使用指数分布让中心密度更高
    const random = Math.random()
    const radius = Math.pow(random, 0.3) * 70 //使用指数分布

    // 螺旋角度 - 调整螺旋紧密度
    const spinAngle = radius * 0.15 // 减小螺旋角度系数，让螺旋更自然
    const branchAngle = (i % 4) * ((2 * Math.PI) / 4) // 改为4个螺旋臂

    // 随机偏移 - 根据半径调整偏移量
    const randomFactor = Math.pow(radius / 80, 0.5) // 外围偏移更大
    const randomX = Math.pow(Math.random(), 2) * (Math.random() < 0.5 ? 1 : -1) * randomFactor * 2
    const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * randomFactor * 0.5
    const randomZ = Math.pow(Math.random(), 2) * (Math.random() < 0.5 ? 1 : -1) * randomFactor * 2

    positions[i * 3] = Math.cos(branchAngle + spinAngle) * radius + randomX
    positions[i * 3 + 1] = randomY
    positions[i * 3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

    // 更复杂的颜色渐变系统
    const mixedColor = new THREE.Color()
    const normalizedRadius = radius / 80

    if (normalizedRadius < 0.1) {
      // 核心区域 - 白色到金黄色
      mixedColor.lerpColors(innerColor, middleColor, normalizedRadius / 0.1)
    } else if (normalizedRadius < 0.4) {
      // 中间区域 - 金黄色到蓝色
      mixedColor.lerpColors(middleColor, outerColor, (normalizedRadius - 0.1) / 0.3)
    } else {
      // 外围区域 - 蓝色到深蓝色
      mixedColor.lerpColors(outerColor, edgeColor, (normalizedRadius - 0.4) / 0.6)
    }

    colors[i * 3] = mixedColor.r
    colors[i * 3 + 1] = mixedColor.g
    colors[i * 3 + 2] = mixedColor.b

    // 根据距离中心的远近设置粒子大小 - 中心更大更亮
    sizes[i] = Math.max(0.3, (1 - normalizedRadius) * 2 + Math.random() * 0.5)
  }
  //定义粒子的几何形状（这里只有点，没有面）
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1)) // 添加大小属性

  const material = new THREE.PointsMaterial({
    size: 1.2, // 基础大小
    sizeAttenuation: true, // 距离越远，粒子越小（透视效果）
    transparent: true, // 允许透明
    opacity: 0.8, // 整体透明度
    depthWrite: false,  // 不写入深度缓冲区（防止粒子相互遮挡）
    vertexColors: true, // 使用顶点颜色（即colors数组）
    blending: THREE.AdditiveBlending, // 添加发光效果
  })

  galaxy = new THREE.Points(geometry, material)
  scene.add(galaxy)
}

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
  //console.log(currentPageStore.currentIndex)

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
    createGalaxy() // 使用新的银河创建函数
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