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

// ==================== 卡片悬停动画 ====================

/**
 * 卡片 hover 动画配置
 * - 鼠标悬入：卡片上浮+缩放+阴影增强，子元素（图标/标题/箭头）有各自微动效
 * - 鼠标移出：所有属性平滑复位
 */
export interface CardHoverConfig {
  /** 卡片元素选择器 */
  selector: string;
  /** 图标容器选择器（默认 [data-icon-container]） */
  iconSelector?: string;
  /** 标题/主内容选择器（默认 h3） */
  contentSelector?: string;
  /** 尾部箭头选择器（可选） */
  arrowSelector?: string;
  /** 图标悬入动画 */
  iconAnim?: gsap.TweenVars;
  /** 内容悬入动画 */
  contentAnim?: gsap.TweenVars;
  /** 悬停时阴影（默认 primary 紫调柔和阴影） */
  shadow?: string;
}

const DEFAULT_SHADOW = "0 12px 30px -8px rgba(99, 102, 241, 0.3)";

/**
 * 为一组卡片初始化 GSAP 悬停动画。
 * 可传入单个配置或配置数组（便于一张页面不同卡片用不同微动效）。
 */
export function initCardHover(
  config: CardHoverConfig | CardHoverConfig[]
): void {
  const configs = Array.isArray(config) ? config : [config];
  configs.forEach(initOneCardHover);
}

function initOneCardHover(cfg: CardHoverConfig): void {
  const cards = document.querySelectorAll<HTMLElement>(cfg.selector);
  if (!cards.length) return;

  const iconSel = cfg.iconSelector ?? "[data-icon-container]";
  const contentSel = cfg.contentSelector ?? "h3";
  const shadow = cfg.shadow ?? DEFAULT_SHADOW;

  cards.forEach((card) => {
    const icon = card.querySelector<HTMLElement>(iconSel);
    const content = card.querySelector<HTMLElement>(contentSel);
    const arrow = cfg.arrowSelector
      ? card.querySelector<HTMLElement>(cfg.arrowSelector)
      : null;

    card.addEventListener("mouseenter", () => {
      gsap.killTweensOf([card, icon, content, arrow].filter(Boolean));
      gsap.to(card, {
        y: -6,
        scale: 1.04,
        boxShadow: shadow,
        duration: 0.35,
        ease: "power2.out",
        overwrite: true,
      });
      if (icon && cfg.iconAnim) {
        gsap.to(icon, {
          ...cfg.iconAnim,
          duration: 0.4,
          ease: "back.out(1.7)",
          overwrite: true,
        });
      }
      if (content && cfg.contentAnim) {
        gsap.to(content, {
          ...cfg.contentAnim,
          duration: 0.3,
          ease: "power2.out",
          overwrite: true,
        });
      }
      if (arrow) {
        gsap.to(arrow, {
          x: 4,
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
          overwrite: true,
        });
      }
    });

    card.addEventListener("mouseleave", () => {
      // 1. 先 kill 残留 tween
      gsap.killTweensOf([card, icon, content, arrow].filter(Boolean));
      // 2. 用 gsap.set 立即归零关键属性（避免动画结束时残留）
      if (icon) gsap.set(icon, { clearProps: "scale,rotate,x,y,skewX,skewY,transformOrigin" });
      if (content) gsap.set(content, { clearProps: "scale,x,y" });
      if (arrow) gsap.set(arrow, { clearProps: "x" });
      // 3. 用 tween 平滑过渡到归零状态（但不再使用 clearProps 避免再次残留）
      gsap.to(card, {
        y: 0,
        scale: 1,
        boxShadow: "0 0 0 rgba(0,0,0,0)",
        duration: 0.25,
        ease: "power2.out",
        overwrite: true,
      });
      if (icon) {
        gsap.to(icon, {
          scale: 1,
          rotate: 0,
          x: 0,
          y: 0,
          skewX: 0,
          skewY: 0,
          transformOrigin: "50% 50%",
          duration: 0.25,
          ease: "power2.out",
          overwrite: true,
        });
      }
      if (content) {
        gsap.to(content, {
          scale: 1,
          x: 0,
          y: 0,
          duration: 0.25,
          ease: "power2.out",
          overwrite: true,
        });
      }
      if (arrow) {
        gsap.to(arrow, {
          x: 0,
          opacity: 0,
          duration: 0.25,
          ease: "power2.out",
          overwrite: true,
        });
      }
    });
  });
}

// ==================== 圆形社交图标按钮悬停动画 ====================

/**
 * 圆形/方形小图标按钮的 hover 动画（适用于社交链接等）
 * - 按钮轻微缩放+上浮
 * - 图标整体旋转（默认 360°，俏皮自旋效果）
 * - 颜色/背景/边框仍由 CSS hover 控制
 */
export interface IconButtonConfig {
  /** 按钮元素选择器 */
  selector: string;
  /** 悬停缩放比例（默认 1.08） */
  scale?: number;
  /** 悬停 Y 偏移（默认 -2） */
  y?: number;
  /** 图标旋转角度（默认 360） */
  iconRotate?: number;
  /** 图标选择器（默认 [data-icon-container]） */
  iconSelector?: string;
  /** 悬停阴影（默认 primary 紫调） */
  shadow?: string;
}

const ICON_BTN_SHADOW = "0 8px 20px -4px rgba(99, 102, 241, 0.35)";

/**
 * 为一组圆形社交按钮初始化 GSAP 悬停动画。
 */
export function initIconButtonHover(
  config: IconButtonConfig | IconButtonConfig[]
): void {
  const configs = Array.isArray(config) ? config : [config];
  configs.forEach(initOneIconButton);
}

function initOneIconButton(cfg: IconButtonConfig): void {
  const buttons = document.querySelectorAll<HTMLElement>(cfg.selector);
  if (!buttons.length) return;

  const scale = cfg.scale ?? 1.08;
  const y = cfg.y ?? -2;
  const rotate = cfg.iconRotate ?? 360;
  const iconSel = cfg.iconSelector ?? "[data-icon-container]";
  const shadow = cfg.shadow ?? ICON_BTN_SHADOW;

  buttons.forEach((btn) => {
    const icon = btn.querySelector<HTMLElement>(iconSel);

    btn.addEventListener("mouseenter", () => {
      gsap.to(btn, {
        y,
        scale,
        boxShadow: shadow,
        duration: 0.3,
        ease: "power2.out",
      });
      if (icon) {
        gsap.to(icon, {
          rotate,
          duration: 0.6,
          ease: "back.out(1.7)",
        });
      }
    });

    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, {
        y: 0,
        scale: 1,
        boxShadow: "0 0 0 rgba(0,0,0,0)",
        duration: 0.3,
        ease: "power2.out",
      });
      if (icon) {
        gsap.to(icon, {
          rotate: 0,
          duration: 0.4,
          ease: "power2.out",
        });
      }
    });
  });
}
