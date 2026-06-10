import type { HomeConfig } from "@/types/config";

export const homeConfig: HomeConfig = {
	// 头像 / Logo 配置
	avatar: {
		baseName: "Stellar",
		path: "assets/images",
	},

	// 标题下方信息区域配置
	// 选项：
	//   "subtitle" - 显示副标题（subtitle 字段）
	//   "description" - 显示站点描述（description 字段）
	//   "hitokoto" - 显示随机一言（调用 hitokoto API）
	//   "custom" - 显示自定义内容列表（customInfo 字段）
	//   null / "" - 不显示任何内容
	headerInfo: "custom",

	// 随机一言 API URL（当 headerInfo 为 "hitokoto" 时使用）
	hitokotoUrl: "https://v1.hitokoto.cn/?c=a&c=b&c=c",

	// 自定义信息列表（当 headerInfo 为 "custom" 时使用）
	// 简单字符串数组：["信息1", "信息2", "信息3"]
	customInfo: [
		"欢迎来到 Stellar の小站",
		"愿你在此找到片刻安宁",
		"于星海之间，记录生活",
	],

	// 打字机效果配置（适用于 headerInfo 为 "hitokoto" 或 "custom" 时）
	typewriter: {
		// 是否启用打字机效果
		enable: true,
		// 打字速度（毫秒）
		speed: 100,
		// 删除速度（毫秒）
		deleteSpeed: 50,
		// 完全显示后的暂停时间（毫秒）
		pauseTime: 2000,
	},

	// 社交链接配置
	socialLinks: {
		// 是否启用社交链接（false 可关闭显示）
		enable: true,
		// 社交链接列表
		items: [
			{
				platform: "email",
				url: "mailto:example@example.com",
			},
			{
				platform: "github",
				url: "https://github.com/yourusername",
			},
			{
				platform: "bilibili",
				url: "https://space.bilibili.com/youruid",
			},
			{
				platform: "steam",
				url: "https://steamcommunity.com/id/yourid",
			},
			// 可用的平台类型：
			// email, github, bilibili, steam, twitter, discord,
			// telegram, youtube, zhihu, weibo, netease_cloud_music,
			// juejin, jianshu, custom
			// custom 平台需要额外配置 label 和 icon:
			// {
			//   platform: "custom",
			//   url: "https://example.com",
			//   label: "自定义链接",
			//   icon: "material-symbols:link"
			// }
		],
	},

	// 时间与天气卡片配置
	timeWeather: {
		// 是否启用时间与天气卡片（false 可关闭显示）
		enable: true,
		// 布局模式："double"（双卡片，默认）| "single"（单卡片合并显示）
		layout: "single",
		// 是否显示"当前时间"和"天气"标签文字（默认 true）
		showLabels: true,
		// 卡片内文字对齐方式："left"（左对齐）| "center"（居中）| "right"（右对齐）
		align: "center",
		// 时间显示配置
		time: {
			// 是否启用时间显示
			enable: true,
			// 时间格式："12" (12小时制) | "24" (24小时制)
			format: "24",
			// 是否显示秒
			showSeconds: true,
			// 是否显示日期
			showDate: true,
			// 单卡片下日期是否与时间同行显示（默认 false，日期另起一行）
			dateInline: false,
		},
		// 天气显示配置
		weather: {
			// 是否启用天气显示
			enable: true,
			// 城市名称（wttr/WeatherAPI/QWeather 使用，留空自动 IP 定位）
			city: "",
			// 高德城市编码（仅 amap 使用，如 "110000" 北京、"320100" 南京）
			// 查询地址：https://lbs.amap.com/api/webservice/guide/api/weather
			cityCode: "",
			// 经纬度坐标（仅 caiyun 使用，如 "116.41,39.92"）
			// 格式：经度,纬度
			location: "",
			// 天气 API 来源（默认 "wttr"，无需 API Key）
			// "wttr"            - wttr.in，免费无需 Key，自动 IP 定位
			// "weatherapi"      - WeatherAPI.com，免费 100万次/月
			// "qweather"        - 和风天气，JWT 认证，支持简体中文
			// "amap"            - 高德天气，免费额度，原生中文，需要 cityCode
			// "caiyun"          - 彩云天气，免费额度，需要 location 经纬度
			apiSource: "wttr",
			// 对应 API 的 Key（wttr 不需要，其他 API 必填）
			// WeatherAPI.com:   https://www.weatherapi.com/
			// 和风天气:         https://dev.qweather.com/ （JWT 认证，需同时填 privateKey）
			// 高德天气:         https://lbs.amap.com/
			// 彩云天气:         https://dashboard.caiyunapp.com/
			apiKey: "",
			// 和风天气 Private Key（仅 qweather 使用，用于生成 JWT Token）
			// 在和风天气控制台 → 项目管理 → 认证认证 获取
			privateKey: "",
		},
	},

	// 导航卡片配置
	navCards: {
		// 是否启用导航卡片（false 可关闭显示）
		enable: true,
		// 每行显示的卡片数量（默认4）
		columns: 4,
		// 是否显示更多按钮（默认false，"更多"按钮占据一格）
		showMoreButton: false,
		// 最多显示的行数（showMoreButton 为 false 时生效，0 表示不限制）
		maxRows: 2,
		// 是否自动解析网站的 favicon 图标（默认true，优先级低于 image 和 icon）
		autoFavicon: false,
		// 自动解析的 favicon 图标大小（默认48，单位px）
		faviconSize: 32,
		// icon 图标大小（默认24，单位px）
		iconSize: 32,
		// 导航卡片列表
		items: [
			// 可配置的字段：
			// title: 卡片标题（必填）
			// url: 链接地址（必填）
			// description: 卡片描述（可选）
			// icon: 图标名称（可选），使用 iconify 格式，如 "material-symbols:home"
			// image: 图片 URL（可选），优先级高于 icon
			{ title: "Stellar 仓库", url: "https://github.com/Srlily/Stellar", description: "开源个人主页项目", icon: "fa7-brands:github" },
			{ title: "Srlily", url: "https://github.com/Srlily", description: "GitHub", icon: "fa7-brands:github" },
			{ title: "nulijiazaizhong", url: "https://github.com/nulijiazaizhong", description: "GitHub", icon: "fa7-brands:github" },
			{ title: "技术博客", url: "https://blog.example.com", description: "分享技术文章与教程", icon: "material-symbols:article-outline-rounded" },
			{ title: "在线工具", url: "https://tool.example.com", description: "常用开发工具集合", icon: "material-symbols:build-outline-rounded" },
			{ title: "图床服务", url: "https://img.example.com", description: "图片托管与分享", icon: "material-symbols:image-outline-rounded" },
			{ title: "API 文档", url: "https://api.example.com", description: "接口文档与示例", icon: "material-symbols:code-rounded" },
			{ title: "演示站点", url: "https://demo.example.com", description: "在线演示与预览", icon: "material-symbols:play-circle-outline-rounded" },
			{ title: "问题反馈", url: "https://github.com/Srlily/Stellar/issues", description: "提交 Bug 或建议", icon: "material-symbols:feedback-outline-rounded" },
		],
	},

	// 技能卡片配置
	skillCards: {
		// 是否启用技能卡片
		enable: true,
		// 每行显示的技能数量（默认4）
		columns: 2,
		// 图标大小（默认24，单位px）
		iconSize: 24,
		// 进度条渐变色配置（可选）
		gradient: {
			colors: ["#4ade80", "#22c55e", "#16a34a"], // 绿色渐变
			direction: "right", // 渐变方向：left(从右到左)、right(从左到右)、center(从中间向两边)
		},
		// 技能列表
		items: [
			// 可配置的字段：
			// name: 技能名称（必填）
			// level: 熟练度 1-100（可选）
			{ name: "TypeScript", level: 85 },
			{ name: "JavaScript", level: 90 },
			{ name: "React", level: 75 },
			{ name: "Vue.js", level: 80 },
			{ name: "Node.js", level: 70 },
			{ name: "Python", level: 65 },
			{ name: "Git", level: 85 },
			{ name: "CSS/SCSS", level: 80 },
		],
	},

	// 项目卡片配置
	projectCards: {
		// 是否启用项目卡片
		enable: true,
		// 每行显示的项目数量（默认3）
		columns: 3,
		// 是否显示更多按钮（默认false，"更多"按钮占据一格）
		showMoreButton: false,
		// 最多显示的行数（showMoreButton 为 false 时生效，0 表示不限制）
		maxRows: 2,
		// 图标大小（默认24，单位px）
		iconSize: 32,
		// 项目列表
		items: [
			// 可配置的字段：
			// name: 项目名称（必填）
			// url: 项目链接（必填）
			// description: 项目描述（可选）
			// image: 项目图片（可选）
			// icon: 项目图标（可选）
			// tags: 项目标签（可选）
			{ name: "Blog", url: "https://blog.example.com", description: "基于 Next.js 的技术博客", icon: "material-symbols:article-outline-rounded", tags: ["Next.js", "React", "TypeScript"] },
			{ name: "Dashboard", url: "https://dashboard.example.com", description: "数据可视化监控面板", icon: "material-symbols:dashboard-outline-rounded", tags: ["Vue.js", "ECharts", "Node.js"] },
			{ name: "Mall", url: "https://mall.example.com", description: "电商系统前端项目", icon: "material-symbols:shopping-cart-outline-rounded", tags: ["React", "Redux", "Ant Design"] },
			{ name: "Chat", url: "https://chat.example.com", description: "实时聊天应用", icon: "material-symbols:chat-outline-rounded", tags: ["Socket.io", "Express", "MongoDB"] },
			{ name: "Wiki", url: "https://wiki.example.com", description: "团队知识库系统", icon: "material-symbols:menu-book-outline-rounded", tags: ["Nuxt.js", "Markdown", "PostgreSQL"] },
			{ name: "Calendar", url: "https://calendar.example.com", description: "日程管理工具", icon: "material-symbols:event-outline-rounded", tags: ["React", "FullCalendar", "NestJS"] },
			{ name: "Music", url: "https://music.example.com", description: "在线音乐播放器", icon: "material-symbols:music-note-outline-rounded", tags: ["Vue3", "AUDIO", "Web Audio API"] },
		],
	},
};
