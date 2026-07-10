import { gsap } from "gsap";

export { gsap };

// 淡入动画
export function fadeIn(
  targets: string | Element | Element[],
  options: {
    duration?: number;
    delay?: number;
    y?: number;
    opacity?: number;
    ease?: string;
  } = {}
) {
  const { duration = 0.8, delay = 0, y = 30, opacity = 0, ease = "power2.out" } = options;

  return gsap.fromTo(
    targets,
    { opacity, y },
    { opacity: 1, y: 0, duration, delay, ease }
  );
}

// 淡出动画
export function fadeOut(
  targets: string | Element | Element[],
  options: {
    duration?: number;
    delay?: number;
    y?: number;
    ease?: string;
  } = {}
) {
  const { duration = 0.5, delay = 0, y = -30, ease = "power2.in" } = options;

  return gsap.to(targets, { opacity: 0, y, duration, delay, ease });
}

// 弹入动画
export function bounceIn(
  targets: string | Element | Element[],
  options: {
    duration?: number;
    delay?: number;
    scale?: number;
    ease?: string;
  } = {}
) {
  const { duration = 0.6, delay = 0, scale = 0.8, ease = "back.out(1.7)" } = options;

  return gsap.fromTo(
    targets,
    { opacity: 0, scale },
    { opacity: 1, scale: 1, duration, delay, ease }
  );
}

// 滑入动画
export function slideIn(
  targets: string | Element | Element[],
  options: {
    direction?: "left" | "right" | "up" | "down";
    duration?: number;
    delay?: number;
    distance?: number;
    ease?: string;
  } = {}
) {
  const {
    direction = "up",
    duration = 0.6,
    delay = 0,
    distance = 50,
    ease = "power2.out",
  } = options;

  const fromVars: gsap.TweenVars = { opacity: 0, duration, delay, ease };
  const toVars: gsap.TweenVars = { opacity: 1, duration, delay, ease };

  switch (direction) {
    case "left":
      fromVars.x = -distance;
      toVars.x = 0;
      break;
    case "right":
      fromVars.x = distance;
      toVars.x = 0;
      break;
    case "up":
      fromVars.y = distance;
      toVars.y = 0;
      break;
    case "down":
      fromVars.y = -distance;
      toVars.y = 0;
      break;
  }

  return gsap.fromTo(targets, fromVars, toVars);
}

// 交错动画（子元素依次动画）
export function staggerIn(
  targets: string | Element | Element[],
  options: {
    duration?: number;
    stagger?: number;
    delay?: number;
    y?: number;
    ease?: string;
  } = {}
) {
  const {
    duration = 0.6,
    stagger = 0.1,
    delay = 0,
    y = 30,
    ease = "power2.out",
  } = options;

  return gsap.fromTo(
    targets,
    { opacity: 0, y },
    { opacity: 1, y: 0, duration, delay, stagger, ease }
  );
}

// 脉动动画
export function pulse(
  targets: string | Element | Element[],
  options: {
    duration?: number;
    scale?: number;
    repeat?: number;
    yoyo?: boolean;
  } = {}
) {
  const {
    duration = 0.4,
    scale = 1.1,
    repeat = -1,
    yoyo = true,
  } = options;

  return gsap.to(targets, {
    scale,
    duration,
    repeat,
    yoyo,
    ease: "power1.inOut",
  });
}

// 旋转动画
export function spin(
  targets: string | Element | Element[],
  options: {
    duration?: number;
    degrees?: number;
    repeat?: number;
    ease?: string;
  } = {}
) {
  const { duration = 1, degrees = 360, repeat = -1, ease = "power0" } = options;

  return gsap.to(targets, {
    rotation: degrees,
    duration,
    repeat,
    ease,
  });
}

// 打字机效果
export function typeWriter(
  targets: string | Element | Element[],
  options: {
    duration?: number;
    speed?: number;
  } = {}
) {
  const elements = typeof targets === "string" ? document.querySelectorAll(targets) : targets;
  const { speed = 50 } = options;

  return gsap.to(elements, {
    duration: 0,
    opacity: 1,
    onComplete: () => {
      elements.forEach((el) => {
        const text = el.textContent || "";
        el.textContent = "";
        gsap.to(el, {
          duration: text.length * (speed / 1000),
          textContent: text,
          ease: "none",
        });
      });
    },
  });
}

// 页面进入动画
export function pageEnter(options: { duration?: number; stagger?: number } = {}) {
  const { duration = 0.6, stagger = 0.08 } = options;

  // 获取主内容区域的元素
  const contentElements = ".animate-on-enter";

  return gsap.fromTo(
    contentElements,
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      ease: "power2.out",
    }
  );
}

// 滚动触发动画
export function scrollTrigger(
  targets: string | Element | Element[],
  options: {
    trigger?: string | Element;
    start?: string;
    end?: string;
    toggleActions?: string;
    animation: (target: Element) => gsap.core.Tween;
  }
) {
  const {
    trigger = targets,
    start = "top 80%",
    end = "bottom 20%",
    toggleActions = "play none none reverse",
    animation,
  } = options;

  return gsap.fromTo(
    targets,
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: {
        trigger,
        start,
        end,
        toggleActions,
      },
    }
  );
}
