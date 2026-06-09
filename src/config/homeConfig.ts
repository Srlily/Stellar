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
};
