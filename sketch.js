let spriteSheet1, spriteSheet2;
let frames1 = [];
let frames2 = [];
const NUM_FRAMES1 = 16;
const FRAME_DURATION1 = 100; // ms per frame for first sprite

const NUM_FRAMES2 = 18;
const FRAME_DURATION2 = 80; // ms per frame for second sprite

// Animation control
let playing = false; // start as not playing
let currentFrame1 = 0;
let currentFrame2 = 0;
let lastUpdate1 = 0;
let lastUpdate2 = 0;

function preload() {
  // 載入兩個精靈表：`1/all.png` (16 幀) 與 `2/all.png` (18 幀)
  spriteSheet1 = loadImage('1/all.png');
  spriteSheet2 = loadImage('2/all.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noSmooth();

  // 將精靈表切成獨立影格，放入陣列內，避免浮點 source rectangle 導致的接縫
  if (spriteSheet1) {
    const frameWf1 = spriteSheet1.width / NUM_FRAMES1;
    const frameH1 = spriteSheet1.height;
    for (let i = 0; i < NUM_FRAMES1; i++) {
      const sx = Math.round(i * frameWf1);
      const sw = Math.round(frameWf1);
      // 使用 get() 取出每一幀（會回傳一個 p5.Image）
      frames1[i] = spriteSheet1.get(sx, 0, sw, frameH1);
    }
  }

  if (spriteSheet2) {
    const frameWf2 = spriteSheet2.width / NUM_FRAMES2;
    const frameH2 = spriteSheet2.height;
    for (let i = 0; i < NUM_FRAMES2; i++) {
      const sx = Math.round(i * frameWf2);
      const sw = Math.round(frameWf2);
      frames2[i] = spriteSheet2.get(sx, 0, sw, frameH2);
    }
  }
}

function mousePressed() {
  // 按一下切換播放狀態
  playing = !playing;
  // 當剛開始播放，重置 lastUpdate 時間，避免跳格
  const now = millis();
  lastUpdate1 = now;
  lastUpdate2 = now;
}

function draw() {
  // 全畫面背景色 #ffc2d1
  background('#ffc2d1');

  // 若兩個都還沒處理好就跳過
  if (frames1.length === 0 && frames2.length === 0) return;

  const now = millis();
  // 只有在 playing 時才推進影格索引
  if (playing) {
    if (frames1.length > 0) {
      const elapsed1 = now - lastUpdate1;
      if (elapsed1 >= FRAME_DURATION1) {
        const steps = floor(elapsed1 / FRAME_DURATION1);
        currentFrame1 = (currentFrame1 + steps) % frames1.length;
        lastUpdate1 += steps * FRAME_DURATION1;
      }
    }

    if (frames2.length > 0) {
      const elapsed2 = now - lastUpdate2;
      if (elapsed2 >= FRAME_DURATION2) {
        const steps2 = floor(elapsed2 / FRAME_DURATION2);
        currentFrame2 = (currentFrame2 + steps2) % frames2.length;
        lastUpdate2 += steps2 * FRAME_DURATION2;
      }
    }
  }

  // 第一個精靈
  let dw1 = 0, dh1 = 0, idx1 = 0;
  if (frames1.length > 0) {
    idx1 = currentFrame1 % frames1.length;
    const img1 = frames1[idx1];
    const scale1 = 1;
    dw1 = img1.width * scale1;
    dh1 = img1.height * scale1;
  }

  // 第二個精靈
  let dw2 = 0, dh2 = 0, idx2 = 0;
  if (frames2.length > 0) {
    idx2 = currentFrame2 % frames2.length;
    const img2 = frames2[idx2];
    const scale2 = 1;
    dw2 = img2.width * scale2;
    dh2 = img2.height * scale2;
  }

  // 兩個角色左右排列、整體置中
  const sep = 20; // 角色間距
  const totalWidth = dw1 + (dw1 > 0 && dw2 > 0 ? sep : 0) + dw2;
  const startX = width / 2 - totalWidth / 2;
  const y = height / 2 - Math.max(dh1, dh2) / 2;

  // 繪製第一個（若存在）
  if (frames1.length > 0) {
    const dx1 = startX;
    image(frames1[idx1], dx1, y, dw1, dh1);
  }

  // 繪製第二個（若存在）
  if (frames2.length > 0) {
    const dx2 = startX + dw1 + (dw1 > 0 && dw2 > 0 ? sep : 0);
    image(frames2[idx2], dx2, y, dw2, dh2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
