<template>
  <main class="grid md:grid-cols-1 lg:grid-cols-2 
  border rounded-2xl border-gray-400/20 border-2">

    <div class="mb-10 lg:col-span-1 rounded-lg shadow-md p-6">
      <div class="h-[400px] rounded-lg relative">
        <svg ref="chartRef" class="w-full h-full"></svg>
      </div>
    </div>
    <div class="mb-10 lg:col-span-1 rounded-lg shadow-md p-6">
      <div class="h-[400px] rounded-lg flex items-center justify-center">
        <svg ref="particlesRef" class="w-full h-full"></svg>
      </div>
    </div>

    <div class="lg:col-span-2 mt-4 p-4 rounded-lg">
      <h4 class="mb-3">{{ selectedAge }}所投入的时间</h4>
      <div class="space-y-3">
        <div v-for="activity in activities" :key="activity.key" class="w-full">
          <div class="flex justify-between mb-1 text-sm">
            <span>{{ activity.key }}</span>
            <span>{{ getCurrentAgeData(activity.key) }}%</span>
          </div>
          <div class=" h-2 rounded-full overflow-hidden">
            <div class="h-full rounded-full transition-all duration-500" :style="{
              width: `${getCurrentAgeData(activity.key)}%`,
              backgroundColor: activity.color
            }"></div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as d3 from 'd3';

// 状态
const selectedAge = ref(8);
const chartRef = ref<SVGElement | null>(null);
const particlesRef = ref<SVGElement | null>(null);

// 定义时间数据类型
interface TimeData {
  age: number;
  Front_end: number;
  Hardware: number;
  Drone: number;
  SkateBoard: number;
  [key: string]: number;
}

// 活动定义
const activities = [
  { key: "Front_end", color: "#8dd3c7" },
  { key: "Hardware", color: "#80b1d3" },

  { key: "Drone", color: "#4db6ac" },
  { key: "SkateBoard", color: "#a4c2f4" },
];

// 模拟时间数据 (0-24岁)
const timeData: TimeData[] = [
  { age: 15, Front_end: 0, Hardware: 5, Drone: 0, SkateBoard: 0 },
  { age: 16, Front_end: 0, Hardware: 10, Drone: 0, SkateBoard: 0 },
  { age: 17, Front_end: 0, Hardware: 5, Drone: 50, SkateBoard: 5 },
  { age: 18, Front_end: 0, Hardware: 5, Drone: 40, SkateBoard: 0 },
  { age: 19, Front_end: 0, Hardware: 30, Drone: 20, SkateBoard: 20 },
  { age: 20, Front_end: 10, Hardware: 40, Drone: 0, SkateBoard: 20 },
  { age: 21, Front_end: 50, Hardware: 30, Drone: 0, SkateBoard: 0 }
];

// 获取当前年龄的数据
const getCurrentAgeData = (key: string): number => {
  const exactMatch = timeData.find(d => d.age === selectedAge.value);
  if (exactMatch) return exactMatch[key];

  // 如果没有精确匹配，则进行插值计算
  const lowerData = [...timeData].reverse().find(d => d.age <= selectedAge.value);
  const upperData = timeData.find(d => d.age >= selectedAge.value);

  if (!lowerData || !upperData) return timeData[0][key];

  if (lowerData.age === upperData.age) return lowerData[key];

  // 线性插值
  const ratio = (selectedAge.value - lowerData.age) / (upperData.age - lowerData.age);
  return Math.round(lowerData[key] + (upperData[key] - lowerData[key]) * ratio);
};

// 绘制堆叠面积图
const drawChart = () => {
  if (!chartRef.value) return;

  const svg = d3.select(chartRef.value);
  const width = chartRef.value.clientWidth;
  const height = chartRef.value.clientHeight;
  const margin = { top: 20, right: 30, bottom: 40, left: 50 };
  const innerWidth = width;
  const innerHeight = height;

  // 清除之前的内容
  svg.selectAll("*").remove();

  // 创建图表组
  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // 创建x轴比例尺
  const x = d3.scaleLinear()
    .domain([15, 21])
    .range([0, innerWidth]);

  // 创建y轴比例尺
  const y = d3.scaleLinear()
    .domain([0, 100])
    .range([innerHeight, 0]);

  // 创建颜色比例尺
  const color = d3.scaleOrdinal<string>()
    .domain(activities.map(a => a.key))
    .range(activities.map(a => a.color));

  // 创建堆叠生成器
  const stack = d3.stack<TimeData>()
    .keys(activities.map(a => a.key))
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetNone);

  // 生成堆叠数据
  const stackedData = stack(timeData);

  // 创建区域生成器
  const area = d3.area<d3.SeriesPoint<TimeData>>()
    .x(d => x(d.data.age))
    .y0(d => y(d[0]))
    .y1(d => y(d[1]))
    .curve(d3.curveBasis);

  // 绘制区域
  g.selectAll(".area")
    .data(stackedData)
    .enter()
    .append("path")
    .attr("class", "area")
    .attr("d", area)
    .attr("fill", d => color(d.key))
    .attr("opacity", 0.8)
    .attr("stroke", "#fff")
    .attr("stroke-width", 0.5);

  // 添加网格线
  g.selectAll(".grid-line")
    .data(y.ticks(5))
    .enter()
    .append("line")
    .attr("class", "grid-line")
    .attr("x1", 0)
    .attr("x2", innerWidth)
    .attr("y1", d => y(d))
    .attr("y2", d => y(d))
    .attr("stroke", "#fff")
    .attr("stroke-width", 1);

  // 添加x轴
  g.append("g")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(x).ticks(12));

  // 添加y轴
  g.append("g")
    .call(d3.axisLeft(y).tickFormat(d => `${d}%`).ticks(5));

  // 添加活动标签
  const activityPositions = [
    { key: "Front_end", x: 15, y: 80 },
    { key: "Drone", x: 15, y: 70 },
    { key: "Hardware", x: 15, y: 60 },
    { key: "SkateBoard", x: 15, y: 50 }
  ];

  g.selectAll(".activity-label")
    .data(activityPositions)
    .enter()
    .append("text")
    .attr("class", "activity-label")
    .attr("x", d => x(d.x))
    .attr("y", d => y(d.y))
    .attr("font-size", "14px")
    .attr("font-weight", "bold")
    .attr("fill", d => color(d.key))
    .text(d => activities.find(a => a.key === d.key)?.key || "");

  // 添加当前年龄指示线
  g.append("line")
    .attr("class", "age-indicator")
    .attr("x1", x(selectedAge.value))
    .attr("y1", 0)
    .attr("x2", x(selectedAge.value))
    .attr("y2", innerHeight)
    .attr("stroke", "#ff6b6b")
    .attr("stroke-width", 2)
    .attr("stroke-dasharray", "5,5");

  // 添加当前年龄标签
  g.append("text")
    .attr("class", "age-indicator-label")
    .attr("x", x(selectedAge.value))
    .attr("y", -5)
    .attr("text-anchor", "middle")
    .attr("fill", "#ff6b6b")
    .attr("font-weight", "bold")
    .text(`${selectedAge.value}岁`);

  // 添加交互层，用于选择年龄
  g.append("rect")
    .attr("class", "overlay")
    .attr("width", innerWidth)
    .attr("height", innerHeight)
    .attr("fill", "none")
    .attr("pointer-events", "all")
    .on("click", function (event) {
      const [mouseX] = d3.pointer(event);
      const xValue = x.invert(mouseX);

      // 找到最接近的数据点
      const bisect = d3.bisector((d: TimeData) => d.age).left;
      const index = bisect(timeData, xValue);
      const d0 = timeData[Math.max(0, index - 1)];
      const d1 = timeData[Math.min(timeData.length - 1, index)];
      const d = xValue - d0.age > d1.age - xValue ? d1 : d0;

      // 更新选中的年龄
      selectedAge.value = d.age;
    });
};

interface Particle {
  x: number;
  y: number;
  color: string;
  radius: number;
  angle: number;
  speed: number;
}

// 绘制粒子图（修复动画版本）
const drawParticles = () => {
  if (!particlesRef.value) return;

  const svg = d3.select(particlesRef.value);
  const width = particlesRef.value.clientWidth;
  const height = particlesRef.value.clientHeight;

  // 清除之前的内容
  svg.selectAll("*").remove();

  // 创建图表组
  const g = svg.append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

  // 获取当前年龄数据
  const currentData = activities.map(activity => ({
    key: activity.key,
    value: getCurrentAgeData(activity.key),
    color: activity.color
  }));

  // 生成粒子数据
  const particles: Particle[] = currentData.flatMap(activity => {
    const count = Math.ceil((activity.value / 100) * 50); // 简化粒子数量计算
    return Array.from({ length: count }, () => ({
      x: 0,
      y: 0,
      color: activity.color,
      radius: Math.random() * 3 + 2,
      angle: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.8 + 0.2
    }));
  });

  // 初始化粒子位置
  particles.forEach(particle => {
    const radius = Math.random() * Math.min(width, height) * 0.3;
    particle.x = Math.cos(particle.angle) * radius;
    particle.y = Math.sin(particle.angle) * radius;
  });

  // 创建粒子元素
  const particleElements = g.selectAll(".particle")
    .data(particles)
    .enter()
    .append("circle")
    .attr("class", "particle")
    .attr("r", 0)
    .attr("fill", d => d.color)
    .attr("opacity", 0.8);

  // 入场动画
  particleElements
    .transition()
    .duration(800)
    .attr("r", d => d.radius);

  // 创建动画循环
  const animate = () => {
    particles.forEach(particle => {
      // 更新角度产生曲线运动
      particle.angle += particle.speed * 0.02;
      // 计算新位置
      const radius = Math.min(width, height) * 0.3 * (0.8 + Math.sin(Date.now() * 0.001) * 0.2);
      particle.x = Math.cos(particle.angle) * radius;
      particle.y = Math.sin(particle.angle) * radius;
    });

    // 直接更新位置（移除transition实现流畅动画）
    particleElements
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);

    requestAnimationFrame(animate);
  };

  animate();
};

// 处理窗口大小变化
let resizeTimeout: number | null = null;
const handleResize = () => {
  if (resizeTimeout) {
    window.clearTimeout(resizeTimeout);
  }
  resizeTimeout = window.setTimeout(() => {
    drawChart();
    drawParticles();
  }, 300);
};

// 监听选中年龄变化Q
watch(selectedAge, () => {
  drawChart();
  drawParticles();
});

onMounted(() => {
  drawChart();
  drawParticles();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>