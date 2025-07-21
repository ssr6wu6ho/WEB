<template>
  <div ref="containerRef" class="w-screen h-screen overflow-hidden relative">
    <canvas ref="canvasRef" class="w-full h-full"></canvas>

    <!-- 页面指示器 -->
    <div class="absolute right-8 top-1/2 transform -translate-y-1/2 z-10">
      <div class="flex flex-col space-y-4">
        <button v-for="page in 5" :key="page - 1" @click="setCurrentPage(page - 1)" :class="[
          'w-3 h-3 rounded-full border-2 transition-all duration-300',
          currentPage === page - 1
            ? 'bg-purple-400 border-purple-400'
            : 'bg-transparent border-purple-300 hover:border-purple-400'
        ]" />
      </div>
    </div>
    <!-- 滚动提示 -->
    <div v-if="currentPage === 0" class="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
      <div class="text-purple-300 text-center">
        <div class="w-6 h-10 border-2 border-purple-300 rounded-full mx-auto">
          <div class="w-1 h-3 bg-purple-300 rounded-full mx-auto mt-2 animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

// 响应式数据
const containerRef = ref<HTMLDivElement>()
const canvasRef = ref<HTMLCanvasElement>()
const currentPage = ref(0)

// Three.js 相关变量
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let starField: THREE.Points
let galaxy: THREE.Points
let stars: THREE.Points
let animationId: number

// 相机位置配置
const cameraPositions = [
  { position: [0, 0, 50], lookAt: [0, 0, 0] }, // 正面视角
  { position: [40, 20, 30], lookAt: [0, 0, 0] }, // 右上角视角
  { position: [0, 40, 20], lookAt: [0, 0, 0] }, // 顶部视角
  { position: [-40, 10, 30], lookAt: [0, 0, 0] }, // 左侧视角
  { position: [20, -30, 40], lookAt: [0, 0, 0] }, // 底部斜视角
]

// 目标位置和朝向
const targetPosition = new THREE.Vector3()
const targetLookAt = new THREE.Vector3()

// 初始化Three.js场景
const initThreeJS = () => {
  if (!canvasRef.value) return

  // 创建场景
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x1a0d2e)

  // 创建相机
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, 0, 50)

  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ canvas: canvasRef.value, antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  // 添加环境光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.1)
  scene.add(ambientLight)

  // 创建星空背景
  createStarField()

  // 创建银河
  createGalaxy()

  // 开始渲染循环
  animate()
}


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

// 创建星空背景
const createStarField = () => {
  const count = 3000
  const positions = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 200
    positions[i * 3 + 1] = (Math.random() - 0.5) * 200
    positions[i * 3 + 2] = (Math.random() - 0.5) * 200
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const material = new THREE.PointsMaterial({
    color: 0x9333ea,
    size: 0.3,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.6,
    depthWrite: false,
  })

  starField = new THREE.Points(geometry, material)
  scene.add(starField)
}

// 创建银河
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

// 动画循环
const animate = () => {
  animationId = requestAnimationFrame(animate)

  // 旋转星空和银河
  if (starField) {
    starField.rotation.y += 0.0002
  }
  if (galaxy) {
    galaxy.rotation.y += 0.001
  }

  // 更新相机位置
  updateCamera()

  // 渲染场景
  renderer.render(scene, camera)
}

// 更新相机位置
const updateCamera = () => {
  const targetPos = cameraPositions[currentPage.value]
  targetPosition.set(targetPos.position[0], targetPos.position[1], targetPos.position[2])
  targetLookAt.set(targetPos.lookAt[0], targetPos.lookAt[1], targetPos.lookAt[2])

  // 平滑过渡相机位置
  camera.position.lerp(targetPosition, 0.02)
  camera.lookAt(targetLookAt)
}

// 设置当前页面
const setCurrentPage = (page: number) => {
  if (page >= 0 && page <= 4) {
    currentPage.value = page
  }
}

// 处理滚动事件
const handleWheel = (event: WheelEvent) => {
  event.preventDefault()

  if (event.deltaY > 0 && currentPage.value < 4) {
    currentPage.value++
  } else if (event.deltaY < 0 && currentPage.value > 0) {
    currentPage.value--
  }
}

// 处理窗口大小变化
const handleResize = () => {
  if (!camera || !renderer) return

  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

// 组件挂载
onMounted(() => {
  initThreeJS()

  // 添加事件监听器
  if (containerRef.value) {
    containerRef.value.addEventListener('wheel', handleWheel, { passive: false })
  }
  window.addEventListener('resize', handleResize)
})

// 组件卸载
onUnmounted(() => {
  // 清理事件监听器
  if (containerRef.value) {
    containerRef.value.removeEventListener('wheel', handleWheel)
  }
  window.removeEventListener('resize', handleResize)

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
})


</script>

<style scoped>
/* 确保canvas填满容器 */
canvas {
  display: block;
}

/* 动画类 */
.animate-bounce {
  animation: bounce 1s infinite;
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes bounce {

  0%,
  100% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }

  50% {
    transform: none;
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}

@keyframes pulse {
  50% {
    opacity: .5;
  }
}
</style>