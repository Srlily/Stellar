import { LIGHT_MODE, DARK_MODE, SYSTEM_MODE } from "../constants/index";

// ==================== 液态玻璃视觉配置类型 ====================

// 液态玻璃折射模式
// - standard: 标准折射，均匀位移
// - polar: 极坐标折射，环形扭曲
// - prominent: 突出折射，中心放大效果
export type GlassRefractionMode = "standard" | "polar" | "prominent";

// 液态玻璃视觉配置（与浅色/暗色主题叠加，不作为独立模式）
// 关闭后回退到普通卡片外观，深浅色切换始终生效
export interface GlassThemeConfig {
	enable?: boolean; // 是否启用液态玻璃视觉效果（默认 false）
	refractionMode?: GlassRefractionMode; // 折射模式，默认 "standard"
	displacementScale?: number; // 位移强度，0-200，默认 70
	blurAmount?: number; // 模糊程度，0-1，默认 0.0625
	saturation?: number; // 饱和度，100-300，默认 140
	aberrationIntensity?: number; // 色散强度，0-20，默认 2
	cornerRadius?: number; // 卡片圆角半径，0-999，默认 24
}

// ==================== 背景配置类型 ====================

// 背景模式类型
export type BackgroundMode = "fullscreen" | "overlay" | "none";

// 背景加载动画类型
// - shimmer: 流光扫描效果
// - pulse: 呼吸脉冲效果
// - wave: 波纹扩散效果
// - none: 无加载动画，直接淡入
export type BackgroundLoadingEffect = "shimmer" | "pulse" | "wave" | "none";

// 背景图片源配置
// 支持格式：
// - string: 所有模式共用同一张图片
// - string[]: 所有模式共用一组图片（随机显示）
// - { light: ..., dark: ... }: 根据主题显示不同图片
export interface BackgroundImageSource {
	desktop: string | string[] | { light: string | string[]; dark: string | string[] };
	mobile: string | string[] | { light: string | string[]; dark: string | string[] };
}

// 全屏壁纸模式配置
export interface FullscreenConfig {
	position?: string; // 图片位置，支持所有CSS object-position值，如: 'center', 'top', 'bottom'
}

// 全屏透明覆盖模式配置
export interface OverlayConfig {
	opacity?: number; // 壁纸透明度，0-1
	blur?: number; // 背景模糊度
	cardOpacity?: number; // 卡片透明度，0-1
}

// 背景对齐方式
// - "center": 左右居中对齐（默认）
// - "center-center": 左右上下均居中对齐
export type BackgroundAlign = "center" | "center-center";

// 背景配置
export interface BackgroundConfig {
	mode: BackgroundMode;
	src: BackgroundImageSource;
	fullscreen: FullscreenConfig;
	overlay: OverlayConfig;
	loadingEffect?: BackgroundLoadingEffect; // 加载动画效果，默认 "shimmer"
	align?: BackgroundAlign; // 对齐方式，默认 "center"（左右居中）
}

// ==================== 主页配置类型 ====================

// 标题下方信息项类型（支持字符串或对象）
export type CustomInfoItem = string | {
	text: string; // 显示文本
	icon?: string; // 可选图标名称，使用 Icon 组件的 name 格式
};

// 自定义信息打字机效果配置
export type TypewriterConfig = {
	enable: boolean; // 是否启用打字机效果
	// 打字机开启 → 循环显示所有自定义信息
	// 打字机关闭 → 每次刷新随机显示一条自定义信息
	speed?: number; // 打字速度（毫秒）
	deleteSpeed?: number; // 删除速度（毫秒）
	pauseTime?: number; // 完全显示后的暂停时间（毫秒）
};

// 标题下方信息类型
export type HeaderInfoType = "subtitle" | "description" | "hitokoto" | "custom" | null | "";

// ==================== 社交链接类型 ====================

// 社交平台类型
export type SocialPlatform =
	| "email"
	| "github"
	| "bilibili"
	| "steam"
	| "twitter"
	| "discord"
	| "telegram"
	| "youtube"
	| "zhihu"
	| "weibo"
	| "netease_cloud_music"
	| "zhihu"
	| "juejin"
	| "jianshu"
	| "custom";

// 社交链接项
export interface SocialLinkItem {
	platform: SocialPlatform; // 社交平台
	url: string; // 链接地址
	label?: string; // 自定义标签（仅 custom 平台需要）
	icon?: string; // 自定义图标名称（仅 custom 平台需要）
}

// 社交链接配置
export interface SocialLinksConfig {
	enable?: boolean; // 是否启用社交链接
	items?: SocialLinkItem[]; // 社交链接列表
}

// ==================== 导航卡片类型 ====================

// 导航卡片项
export interface NavCardItem {
	title: string; // 卡片标题
	url: string; // 链接地址
	description?: string; // 卡片描述
	icon?: string; // 图标名称（可选）
	image?: string; // 图片 URL（可选，优先级高于图标）
}

// 导航卡片配置
export interface NavCardsConfig {
	enable?: boolean; // 是否启用导航卡片
	items?: NavCardItem[]; // 导航卡片列表
	columns?: number; // 每行显示的卡片数量，默认4
	showMoreButton?: boolean; // 是否显示更多按钮（默认false）
	maxRows?: number; // 最多显示的行数（showMoreButton为false时生效），0表示不限制
	autoFavicon?: boolean; // 是否自动解析网站的 favicon 图标（默认true）
	faviconSize?: number; // 自动解析的 favicon 图标大小（默认48，单位px）
	iconSize?: number; // icon 图标大小（默认24，单位px）
	// 卡片尺寸配置
	cardSize?: {
		// 图标容器宽度（默认 48px = h-12 w-12）
		iconBox?: number;
		// 卡片内边距（默认 16px = p-4）
		padding?: number;
		// 卡片圆角（默认 16px = rounded-2xl）
		rounded?: number;
		// 卡片最小宽度（px），设置后每张卡片最小宽度为此值
		// 配合 columns 使用：实际宽度 = max(列数均分宽度, minWidth)
		minWidth?: number;
	};
}

// ==================== 时间与天气卡片类型 ====================

// 天气 API 来源
// - "wttr": wttr.in（免费，无需 API key，自动 IP 定位）
// - "weatherapi": WeatherAPI.com（免费 100万次/月，支持 lang 参数）
// - "qweather": 和风天气（免费额度，JWT 认证，支持简体中文）
// - "amap": 高德天气（免费额度，原生中文，需要城市编码）
// - "caiyun": 彩云天气（免费额度，需要经纬度坐标）
export type WeatherApiSource = "wttr" | "weatherapi" | "qweather" | "amap" | "caiyun";

// 时间与天气卡片配置
export interface TimeWeatherConfig {
	enable?: boolean; // 是否启用时间与天气卡片
	layout?: "double" | "single"; // 布局模式：双卡片（默认）或单卡片
	showLabels?: boolean; // 是否显示"当前时间"和"天气"标签文字，默认 true
	align?: "left" | "center" | "right"; // 卡片内文字对齐方式，默认 "left"
	time?: {
		enable?: boolean; // 是否启用时间显示
		format?: "12" | "24"; // 时间格式，默认 "24"
		showSeconds?: boolean; // 是否显示秒，默认 true
		showDate?: boolean; // 是否显示日期，默认 true
		dateInline?: boolean; // 单卡片下日期是否与时间同行显示，默认 false
	};
	weather?: {
		enable?: boolean; // 是否启用天气显示
		city?: string; // 城市名称（wttr/WeatherAPI/QWeather 使用，留空自动 IP 定位）
		cityCode?: string; // 高德城市编码（amap 使用，如 "110000"）
		location?: string; // 经纬度坐标（caiyun 使用，如 "116.41,39.92"）
		apiSource?: WeatherApiSource; // 天气 API 来源，默认 "wttr"
		apiKey?: string; // 对应 API 的 Key（wttr 不需要）
		privateKey?: string; // 和风天气 Private Key（JWT 认证用）
	};
}

// ==================== 技能卡片类型 ====================

// 技能卡片项
export interface SkillItem {
	name: string; // 技能名称
	level?: number; // 熟练度 1-100（可选）
}

// 技能卡片配置
export interface SkillCardsConfig {
	enable?: boolean; // 是否启用技能卡片
	columns?: number; // 每行显示的技能数量（默认4）
	iconSize?: number; // 图标大小（默认24，单位px）
	items?: SkillItem[]; // 技能列表
	gradient?: {
		colors: string[]; // 渐变色数组，至少2个颜色，支持多个中间色
		direction?: "left" | "right" | "center"; // 渐变方向，默认 "right"
	};
}

// ==================== 项目卡片类型 ====================

// 项目卡片项
export interface ProjectItem {
	name: string; // 项目名称
	url: string; // 项目链接
	description?: string; // 项目描述
	image?: string; // 项目图片（可选）
	icon?: string; // 项目图标（可选）
	tags?: string[]; // 项目标签（可选）
}

// 项目卡片配置
export interface ProjectCardsConfig {
	enable?: boolean; // 是否启用项目卡片
	columns?: number; // 每行显示的项目数量（默认3）
	showMoreButton?: boolean; // 是否显示更多按钮（默认false）
	maxRows?: number; // 最多显示的行数（showMoreButton为false时生效），0表示不限制
	iconSize?: number; // 图标大小（默认24，单位px）
	items?: ProjectItem[]; // 项目列表
}

// ==================== 两页式滚动配置类型 ====================

// 两页式滚动配置
export interface PageScrollConfig {
	// 是否启用无限循环滚动（滚到底自动跳顶部 / 滚到顶自动跳底部）
	// 关闭时：滚动到顶部/底部即停止（无 snap 反弹）
	infiniteLoop?: boolean;
	// 是否启用 CSS scroll-snap（滚动停止自动对齐到页面边界，自带丝滑动画）
	// 关闭时：纯滚动，无 snap（适合不喜欢 snap 行为的用户）
	scrollSnap?: boolean;
	// ScrollTrigger scrub 延迟（秒），越大动画越"跟手"
	// 0 = 完全跟手；0.4 = 跟随 + 400ms 减速感（推荐）
	scrubDelay?: number;
}

// 主页配置
export interface HomeConfig {
	avatar?: {
		baseName?: string;
		path?: string;
		extension?: string;
		url?: string | { light?: string; dark?: string };
		// 标题（h1）显示文字
		// 留空则使用 siteConfig.title
		title?: string;
		// 标题（h1）相对于头像（img）的位置
		// - "bottom"（默认）：标题在头像下方
		// - "left"：标题在头像左侧（与头像水平排列）
		titlePosition?: "bottom" | "left";
	};
	headerInfo?: HeaderInfoType;
	hitokotoUrl?: string;
	customInfo?: CustomInfoItem[];
	typewriter?: TypewriterConfig;
	socialLinks?: SocialLinksConfig; // 社交链接配置
	timeWeather?: TimeWeatherConfig; // 时间与天气卡片配置
	navCards?: NavCardsConfig; // 导航卡片配置
	skillCards?: SkillCardsConfig; // 技能卡片配置
	projectCards?: ProjectCardsConfig; // 项目卡片配置
}

// ==================== 站点配置类型 ====================

export type SiteConfig = {
	title: string; // 站点标题，用于生成 <meta name="og:title">
	subtitle: string; // 站点副标题，用于生成 <meta name="og:title">
	site_url: string; // 站点 URL，用于生成 <meta name="og:url">
	description?: string; // 网站描述，用于生成 <meta name="description">
	keywords?: string[]; // 站点关键词，用于生成 <meta name="keywords">

	lang: "en_US" | "zh_CN";

	// 主题模式
	// 选项："light" | "dark" | "system"
	// - light: 始终使用亮色模式
	// - dark: 始终使用暗色模式
	// - system: 跟随系统主题
	theme?: typeof LIGHT_MODE | typeof DARK_MODE | typeof SYSTEM_MODE;

	// 液态玻璃视觉配置（与 light/dark 叠加，关闭时回退到普通卡片外观）
	glassTheme?: GlassThemeConfig;

	// 两页式滚动配置（仅 homeLayout === "vertical" 时生效）
	pageScroll?: PageScrollConfig;

	// 主页布局：vertical（垂直排列）| horizontal（水平排列）
	homeLayout?: "vertical" | "horizontal";

	// 网站备案信息
	filing?: {
		icp?: {
			number: string; // ICP 备案号
			url?: string; // 备案查询链接
		};
		publicSecurity?: {
			number: string; // 网安备案号
			url?: string; // 备案查询链接
		};
	};

	// 统计分析
	analytics?: {
		googleAnalyticsId?: string; // Google Analytics ID
		microsoftClarityId?: string; // Microsoft Clarity ID
		umamiAnalytics?: {
			websiteId?: string; // Umami Website ID
			scriptUrl?: string; // Umami JS地址，支持使用自建
			replaysScriptUrl?: string; // Umami 会话回放脚本地址
			trackOutboundLinks?: boolean; // 是否追踪出站链接点击事件，默认 true
			collectWebVitals?: boolean; // 是否自动收集访客浏览器核心网页指标，默认 false
			replays?: {
				enabled?: boolean; // 是否启用会话回放，默认 false
				sampleRate?: number; // 录制会话采样率，范围 0-1，默认 0.15
				maskLevel?: "moderate" | "strict"; // 隐私遮罩级别，默认 moderate
				maxDuration?: number; // 单次录制最大时长（毫秒），默认 300000
				blockSelector?: string; // 需要完全排除录制的元素 CSS 选择器
			};
		};
		la51Analytics?: {
			Id?: string; // 51la 统计 ID
			sdkUrl?: string; // 自定义 SDK 地址，防止 DNS 污染，默认为 "//sdk.51.la/js-sdk-pro.min.js"
			ck?: string; // 多个统计 ID 的数据分离标识，默认与 id 相同
			autoTrack?: boolean; // 开启事件分析功能，默认 true
			hashMode?: boolean; // 单页面应用统计（Vue/React 等），默认 false
			screenRecord?: boolean; // 开启网站录屏功能，默认 true
		};
	};

};
