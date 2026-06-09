import { LIGHT_MODE, DARK_MODE, SYSTEM_MODE } from "../constants/index";

// ==================== 背景配置类型 ====================

// 背景模式类型
export type BackgroundMode = "fullscreen" | "overlay" | "none";

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

// 背景配置
export interface BackgroundConfig {
	mode: BackgroundMode;
	src: BackgroundImageSource;
	fullscreen: FullscreenConfig;
	overlay: OverlayConfig;
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

// 主页配置
export interface HomeConfig {
	avatar?: {
		baseName?: string;
		path?: string;
		extension?: string;
		url?: string | { light?: string; dark?: string };
	};
	headerInfo?: HeaderInfoType;
	hitokotoUrl?: string;
	customInfo?: CustomInfoItem[];
	typewriter?: TypewriterConfig;
	socialLinks?: SocialLinksConfig; // 社交链接配置
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

	// 主页布局：vertical（垂直排列）| horizontal（水平排列）
	homeLayout?: "vertical" | "horizontal";

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