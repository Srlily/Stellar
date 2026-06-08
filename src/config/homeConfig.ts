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
};
