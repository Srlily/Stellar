import type { SiteConfig } from "@/types/config";
// import { fontConfig } from "./fontConfig";

// 定义站点语言
// 语言代码，例如：'zh_CN', 'en_US', 。
const SITE_LANG = "zh_CN";

export const siteConfig: SiteConfig = {
	// 站点标题
	title: "Steilar",

	// 站点副标题
	subtitle: "一个简洁高效的 Astro 站点",

	// 站点 URL
	site_url: "",

	// 站点描述
	description:"Steilar 星澜",

	// 站点关键词
	keywords: [
		"Astro",
		"Steilar",
	],

	// 主页布局模式
	// 选项："vertical" | "horizontal"
	// 由 src/pages/index.astro 读取并切换到对应的页面文件
	homeLayout: "horizontal",

	// 主题模式
	// 选项："light" | "dark" | "system"
	// - light: 始终使用亮色模式
	// - dark: 始终使用暗色模式
	// - system: 跟随系统主题
	theme: "system",

	// 液态玻璃主题配置
	// 启用后作为独立模式，深浅色切换失效且不显示切换按钮
	glassTheme: {
		// 是否启用液态玻璃主题（默认关闭）
		enable: false,
		// 折射模式：standard（标准）| polar（极坐标）| prominent（突出）
		refractionMode: "standard",
		// 位移强度，0-200
		displacementScale: 70,
		// 模糊程度，0-1
		blurAmount: 0.0625,
		// 饱和度，100-300
		saturation: 140,
		// 色散强度，0-20
		aberrationIntensity: 2,
		// 圆角半径，0-999（999 = 完全圆角）
		cornerRadius: 24,
	},

	// 统计分析
	analytics: {
		// Google Analytics ID
		googleAnalyticsId: "",
		// Microsoft Clarity ID
		microsoftClarityId: "",
		// Umami 统计配置
		umamiAnalytics: {
			// Umami Website ID
			websiteId: "",
			// Umami JS地址，支持使用自建
			scriptUrl: "https://umami-server.com/js/umami.js",
			// Umami 会话回放脚本地址，支持使用自建
			replaysScriptUrl: "https://umami-server.com/recorder.js",
			// 是否追踪出站链接
			trackOutboundLinks: true,
			// 是否收集浏览器性能指标
			collectWebVitals: true,
			// 会话回放配置
			replays: {
				// 是否启用会话回放
				enabled: false,
				// 录制会话采样率，范围 0-1，例如 0.15 表示记录 15% 的会话
				sampleRate: 0.15,
				// 隐私遮罩级别："moderate" 会遮罩所有输入框；"strict" 额外遮罩页面全部文本
				maskLevel: "moderate",
				// 单次录制最大时长（毫秒）
				maxDuration: 300000,
				// 需要排除录制的元素 CSS 选择器，例如 ".sensitive-widget"
				blockSelector: "",
			},
		},
		// 51la 统计配置
		la51Analytics: {
			// 51la 统计 ID
			Id: "",
			// 自定义 SDK JS 地址，防止 DNS 污染，留空使用默认地址
			sdkUrl: "",
			// 多个统计 ID 的数据分离标识，留空则使用 Id
			ck: "",
			// 是否开启事件分析功能
			autoTrack: false,
			//  Hash路由模式, 项目使用History API路由, 所以不必开启默认false
			hashMode: false,
			// 是否开启网站录屏功能
			screenRecord: true,
		},
	},

	// 站点语言，在本配置文件顶部SITE_LANG定义
	lang: SITE_LANG,
};
