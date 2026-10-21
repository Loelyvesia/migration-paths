<script setup lang="ts">
import { computed, ref } from 'vue'
import { birds, STATUS_COLOR, type Bird, type Status } from './data'

const selectedId = ref('arctern')
const statusFilter = ref<Status | '全部'>('全部')
const month = ref(10)

const selected = computed<Bird>(() => birds.find(b => b.id === selectedId.value) ?? birds[0])
const visible = computed(() => statusFilter.value === '全部' ? birds : birds.filter(b => b.status === statusFilter.value))

// flyway geometry
const W = 820, H = 560, px = { l: 46, r: 130, t: 24, b: 30 }
function yOf(lat: number) { return px.t + ((70 - lat) / (70 + 60)) * (H - px.t - px.b) }
function xOf(i: number, n: number) { return px.l + ((i + 0.5) / n) * (W - px.l - px.r) }

interface Path { b: Bird; x: number; y0: number; y3: number; d: string }
const paths = computed<Path[]>(() =>
  visible.value.map((b, i, arr) => {
    const x = xOf(i, arr.length)
    const y0 = yOf(b.breedLat), y3 = yOf(b.winterLat)
    const ym = (y0 + y3) / 2, bend = 26
    const d = `M${x},${y0} C${x + bend},${ym} ${x - bend},${ym} ${x},${y3}`
    return { b, x, y0, y3, d }
  }),
)

function progressOf(b: Bird) {
  if (month <= b.startMonth) return 0
  if (month >= b.endMonth) return 1
  return (month - b.startMonth) / (b.endMonth - b.startMonth)
}
function bezier(t: number, p0: number, p1: number, p2: number, p3: number) {
  const u = 1 - t
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3
}
const marker = computed(() => {
  const b = selected.value
  const idx = visible.value.findIndex(x => x.id === b.id)
  if (idx < 0) return null
  const x = xOf(idx, visible.value.length)
  const y0 = yOf(b.breedLat), y3 = yOf(b.winterLat)
  const ym = (y0 + y3) / 2, bend = 26
  const t = progressOf(b)
  return { x: bezier(t, x, x + bend, x - bend, x), y: bezier(t, y0, ym, ym, y3) }
})

const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
</script>

<template>
  <main class="app">
    <header class="hero">
      <p class="kicker">数据可视化 · 候鸟迁徙</p>
      <h1>迁徙路径</h1>
      <p class="lede">
        把 16 种候鸟的繁殖地（北方）与越冬地（南方）连成航线，纵轴即纬度。
        选择一种鸟并拖动月份，观察它在一年中的位置，以及不同物种的迁徙窗口差异。
      </p>
      <p class="note">航线为按纬度与迁徙方向的示意路径，距离与月份为简化参考值。</p>
    </header>

    <section class="controls">
      <div class="filters">
        <button :class="{ on: statusFilter === '全部' }" @click="statusFilter = '全部'">全部</button>
        <button v-for="s in ['长程迁徙', '短程迁徙', '濒危'] as const" :key="s" :class="{ on: statusFilter === s }" @click="statusFilter = s">{{ s }}</button>
      </div>
      <label class="month">
        月份
        <input type="range" v-model.number="month" min="1" max="12" aria-label="月份" />
        <output>{{ month }} 月</output>
      </label>
    </section>

    <section class="map-panel">
      <h2>航线板</h2>
      <p class="sub">纵轴 = 纬度（+70°N 至 −60°S），横轴 = 物种排布；圆点为所选物种在当前月份的位置。</p>
      <svg :viewBox="`0 0 ${W} ${H}`" class="flyway" role="img" aria-label="候鸟迁徙航线图">
        <line v-for="lat in [60, 40, 20, 0, -20, -40, -60]" :key="lat" :x1="px.l" :y1="yOf(lat)" :x2="W-px.r" :y2="yOf(lat)" class="lat" />
        <text v-for="lat in [60, 40, 20, 0, -20, -40, -60]" :key="'l'+lat" :x="px.l-6" :y="yOf(lat)+3" class="lat-label" text-anchor="end">{{ lat }}°</text>
        <path
          v-for="p in paths" :key="p.b.id"
          :d="p.d"
          fill="none"
          :stroke="STATUS_COLOR[p.b.status]"
          :stroke-width="selected.id === p.b.id ? 3.5 : 1.4"
          :opacity="selected.id === p.b.id ? 1 : 0.75"
          class="route"
          @click="selectedId = p.b.id"
        >
          <title>{{ p.b.name }}（{{ p.b.en }}）{{ p.b.distKm.toLocaleString() }} km</title>
        </path>
        <circle v-if="marker" :cx="marker.x" :cy="marker.y" r="7" class="marker" />
      </svg>
      <div class="legend">
        <span v-for="s in ['长程迁徙', '短程迁徙', '濒危'] as const" :key="s"><i :style="{ background: STATUS_COLOR[s] }"></i>{{ s }}</span>
      </div>
    </section>

    <section class="split">
      <div class="panel">
        <h2>{{ selected.name }} · {{ selected.en }}</h2>
        <dl>
          <div><dt>迁徙距离</dt><dd>{{ selected.distKm.toLocaleString() }} km</dd></div>
          <div><dt>迁徙月份</dt><dd>{{ selected.startMonth }}–{{ selected.endMonth }} 月</dd></div>
          <div><dt>繁殖纬度</dt><dd>{{ selected.breedLat }}°N</dd></div>
          <div><dt>越冬纬度</dt><dd>{{ selected.winterLat }}°S</dd></div>
        </dl>
        <p class="status-line">状态：<strong :style="{ color: STATUS_COLOR[selected.status] }">{{ selected.status }}</strong></p>
      </div>

      <div class="panel">
        <h2>迁徙窗口（月份）</h2>
        <p class="sub">每种鸟一条，色条即南迁月份窗口；点击行可选中。</p>
        <div class="timeline">
          <div v-for="b in visible" :key="b.id" class="t-row" :class="{ sel: b.id === selected.id }" @click="selectedId = b.id">
            <span class="t-name">{{ b.name }}</span>
            <span class="t-months">
              <i
                v-for="m in MONTHS" :key="m"
                :class="{ fill: m >= b.startMonth && m <= b.endMonth }"
                :style="m >= b.startMonth && m <= b.endMonth ? { background: STATUS_COLOR[b.status] } : {}"
              ></i>
            </span>
          </div>
        </div>
      </div>
    </section>

    <footer class="about">
      <h2>关于这份数据</h2>
      <p>
        纬度、迁徙距离与南迁月份为已知迁徙路线的简化参考值；航线为示意曲线，不代表真实 GPS 轨迹。
        视觉编码：<strong>纵轴位置 = 纬度，颜色 = 迁徙类型，圆点 = 所选物种当月位置</strong>。
      </p>
    </footer>
  </main>
</template>

<style>
:root { --bg: #eaf4f9; --ink: #173a52; --muted: #668399; --line: #c9deeb; color-scheme: light; }
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--ink); font-family: 'Trebuchet MS', 'Segoe UI', system-ui, sans-serif; }
.app { max-width: 1120px; margin: 0 auto; padding: 48px 22px 80px; }
.kicker { color: #2f6fb8; letter-spacing: 0.32em; text-transform: uppercase; font-size: 12px; }
h1 { font-size: clamp(44px, 8vw, 84px); margin: 10px 0 14px; line-height: 1; font-weight: 700; }
.lede { max-width: 64ch; font-size: 17px; line-height: 1.75; color: #31546d; }
.note { color: var(--muted); font-size: 13px; }

.controls { display: flex; flex-wrap: wrap; gap: 22px; align-items: center; margin: 26px 0; }
.filters { display: flex; gap: 8px; flex-wrap: wrap; }
.filters button { background: transparent; border: 1px solid var(--line); color: var(--ink); border-radius: 999px; padding: 8px 15px; cursor: pointer; font-size: 14px; }
.filters button.on { background: #173a52; color: #fff; border-color: #173a52; }
.filters button:focus-visible, .month input:focus-visible { outline: 2px solid #2f6fb8; outline-offset: 2px; }
.month { display: flex; gap: 10px; align-items: center; font-size: 14px; color: #31546d; }
.month input { accent-color: #2f6fb8; }
.month output { font-weight: 700; }

.map-panel { background: #f6fbfe; border: 1px solid var(--line); border-radius: 18px; padding: 22px; }
.map-panel h2, .panel h2 { margin: 0 0 6px; font-size: 20px; }
.sub { color: var(--muted); font-size: 13px; margin: 0 0 12px; }
.flyway { width: 100%; height: auto; }
.lat { stroke: #d7e6f0; stroke-width: 1; }
.lat-label { fill: #8aa3b5; font-size: 10px; }
.route { cursor: pointer; }
.marker { fill: #c2543f; stroke: #fff; stroke-width: 2; }
.legend { display: flex; gap: 16px; margin-top: 6px; font-size: 13px; color: #31546d; }
.legend i { display: inline-block; width: 12px; height: 12px; border-radius: 50%; margin-right: 5px; }

.split { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 22px; margin-top: 26px; }
.panel { background: #f6fbfe; border: 1px solid var(--line); border-radius: 16px; padding: 22px; }
dl { margin: 12px 0; display: grid; grid-template-columns: 1fr 1fr; gap: 10px 18px; }
dt { color: var(--muted); font-size: 12px; }
dd { margin: 2px 0 0; font-size: 16px; font-weight: 700; }
.status-line { font-size: 15px; }

.timeline { display: flex; flex-direction: column; gap: 5px; }
.t-row { display: flex; align-items: center; gap: 12px; padding: 4px 6px; border-radius: 6px; cursor: pointer; }
.t-row:hover { background: #e4f0f7; }
.t-row.sel { background: #d4e8f4; }
.t-name { flex: 0 0 92px; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.t-months { flex: 1; display: grid; grid-template-columns: repeat(12, 1fr); gap: 2px; }
.t-months i { height: 14px; border-radius: 3px; background: #e6eff5; }

.about { margin-top: 42px; border-top: 1px solid var(--line); padding-top: 26px; max-width: 72ch; }
.about p { color: #31546d; line-height: 1.75; }

@media (max-width: 820px) {
  .split { grid-template-columns: 1fr; }
  .t-name { flex-basis: 68px; }
}
@media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
</style>
