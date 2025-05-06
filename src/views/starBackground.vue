<template>
  <div ref="container" class="w-full h-full"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as THREE from 'three'


const props = defineProps<{
  isDark: boolean
}>()

const container = ref<HTMLDivElement>() 
let scene: THREE.Scene                 
let camera: THREE.PerspectiveCamera     // ͸��ͶӰ���
let renderer: THREE.WebGLRenderer       // WebGL��Ⱦ��

let stars: THREE.Points                 // �ǿ�����ϵͳ
let rainLines: THREE.Group              // ���������
let cloudParticles: THREE.Points        // ��������ϵͳ
let animationFrameId: number            // ����֡ID������ȡ��������


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

  // ��������ʣ���ɫ����С1px������͸����
  const material = new THREE.PointsMaterial({
    color: 0xffffff,    // ��ɫ
    size: 1,            // ���С
    transparent: true   // ����͸��
  })

  stars = new THREE.Points(geometry, material)
  scene.add(stars)
}

const animateStars = () => {
  if (!stars) return
  stars.rotation.y += 0.0005
}


const createRainEffect = () => {
  const cloudGeometry = new THREE.BufferGeometry()
  const cloudVertices = []
  const cloudCount = 200

  for (let i = 0; i < cloudCount; i++) {
    cloudVertices.push(
      Math.random() * 400 - 200, // x �� [-200, 200)
      150 + Math.random() * 20,  // y �� [150, 170)
      Math.random() * 400 - 200  // z �� [-200, 200)
    )
  }

  cloudGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(cloudVertices, 3)
  )

  const cloudMaterial = new THREE.PointsMaterial({
    color: 0x444444,
    size: 15,            // ��ߴ��ģ���ƶ�
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
      0, 0, 0,   // ���
      0, -15, 0  // �յ㣨�������죩
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
  animationFrameId = requestAnimationFrame(animate)

  if (props.isDark) {
    animateStars()
  } else {
    animateRain()
  }

  renderer.render(scene, camera)
}

const initScene = () => {
  if (!container.value) return

  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.z = 100

  renderer = new THREE.WebGLRenderer({ alpha: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  container.value.appendChild(renderer.domElement)



  if (props.isDark) {
    createStars()
  } else {
    createRainEffect()
  }
  animate()
}
watch(() => props.isDark, (newValue) => {
  if (!scene) return

  if (stars) scene.remove(stars)
  if (rainLines) scene.remove(rainLines)
  if (cloudParticles) scene.remove(cloudParticles)

  // ������Ч��
  if (newValue) {
    createStars()
  } else {
    createRainEffect()
  }
})

// �������ڴ�С�仯
const handleResize = () => {
  if (!camera || !renderer) return

  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

onMounted(() => {
  initScene()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  window.removeEventListener('resize', handleResize)
})
</script>