/**
 * 图标预处理脚本
 * 在构建时自动扫描 Svelte 组件中使用的图标，并生成内联 SVG 数据
 *
 * 使用方法：node scripts/generate-icons.js
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { getIconData, iconToSVG, iconToHTML, replaceIDs } from "@iconify/utils";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, "..");
const SRC_DIR = join(ROOT_DIR, "src");
const OUTPUT_FILE = join(SRC_DIR, "constants", "icons.ts");

// 支持的图标集及其包名
const ICON_SETS = {
	"material-symbols": "@iconify-json/material-symbols",
	"fa7-solid": "@iconify-json/fa7-solid",
	"fa7-brands": "@iconify-json/fa7-brands",
	"fa7-regular": "@iconify-json/fa7-regular",
	mdi: "@iconify-json/mdi",
	"simple-icons": "@iconify-json/simple-icons",
	mingcute: "@iconify-json/mingcute",
	"svg-spinners": "@iconify-json/svg-spinners",
};

// 图标集数据缓存
const iconSetCache = new Map();

/**
 * 递归获取目录下所有文件
 */
function getAllFiles(dir, extensions = [".astro", ".ts"]) {
	const files = [];

	function walk(currentDir) {
		try {
			const items = readdirSync(currentDir);
			for (const item of items) {
				const fullPath = join(currentDir, item);
				try {
					const stat = statSync(fullPath);

					if (stat.isDirectory()) {
						// 跳过 node_modules 和隐藏目录
						if (!item.startsWith(".") && item !== "node_modules") {
							walk(fullPath);
						}
					} else if (extensions.some((ext) => item.endsWith(ext))) {
						files.push(fullPath);
					}
				} catch (err) {
					// 跳过无法访问的文件
				}
			}
		} catch (err) {
			// 跳过无法访问的目录
		}
	}

	walk(dir);
	return files;
}

/**
 * 从文件内容中提取图标名称
 */
function extractIconNames(content) {
	const icons = new Set();

	// 匹配各种图标使用模式
	// 使用前缀列表确保只匹配真正的图标
	const iconPrefixes = Object.keys(ICON_SETS).join("|");
	const patterns = [
		// name="xxx:yyy" 或 name='xxx:yyy' (Icon 组件) - 捕获完整的 prefix:iconname
		new RegExp(`name=["']((?:${iconPrefixes}):[a-z0-9-]+)["']`, "gi"),
		// name={`xxx:yyy`}
		new RegExp(`name=\\{[\\'\\"]((?:${iconPrefixes}):[a-z0-9-]+)[\\'\\"]\\}`, "gi"),
		// icon="xxx:yyy" 或 icon='xxx:yyy' (HTML 属性格式)
		new RegExp(`icon=["']((?:${iconPrefixes}):[a-z0-9-]+)["']`, "gi"),
		// icon={`xxx:yyy`} (模板字符串格式)
		new RegExp(`icon=\\{[\\'\\"]((?:${iconPrefixes}):[a-z0-9-]+)[\\'\\"]\\}`, "gi"),
		// icon: "xxx:yyy" 或 icon: 'xxx:yyy' (TypeScript 对象字面量格式)
		new RegExp(`icon:\\s*["']((?:${iconPrefixes}):[a-z0-9-]+)["']`, "gi"),
		// getIconSvg("xxx:yyy") 或 getIconSvg('xxx:yyy')
		new RegExp(`getIconSvg\\(["']((?:${iconPrefixes}):[a-z0-9-]+)["']\\)`, "gi"),
		// hasIcon("xxx:yyy")
		new RegExp(`hasIcon\\(["']((?:${iconPrefixes}):[a-z0-9-]+)["']\\)`, "gi"),
	];

	for (const pattern of patterns) {
		let match;
		while ((match = pattern.exec(content)) !== null) {
			icons.add(match[1]);
		}
	}

	return icons;
}

/**
 * 加载图标集数据
 */
async function loadIconSet(prefix) {
	if (iconSetCache.has(prefix)) {
		return iconSetCache.get(prefix);
	}

	const packageName = ICON_SETS[prefix];
	if (!packageName) {
		console.warn(`⚠️  未知图标集: ${prefix}`);
		return null;
	}

	try {
		// 动态导入图标集 JSON
		const iconSetPath = join(ROOT_DIR, "node_modules", packageName, "icons.json");
		if (!existsSync(iconSetPath)) {
			console.warn(`⚠️  图标集文件不存在: ${iconSetPath}`);
			return null;
		}
		const data = JSON.parse(readFileSync(iconSetPath, "utf-8"));
		iconSetCache.set(prefix, data);
		return data;
	} catch (error) {
		console.warn(`⚠️  无法加载图标集 ${packageName}: ${error.message}`);
		return null;
	}
}

/**
 * 获取单个图标的 SVG
 */
async function getIconSvg(iconName) {
	const [prefix, name] = iconName.split(":");
	if (!prefix || !name) {
		console.warn(`⚠️  无效的图标名称: ${iconName}`);
		return null;
	}

	const iconSet = await loadIconSet(prefix);
	if (!iconSet) {
		return null;
	}

	const iconData = getIconData(iconSet, name);
	if (!iconData) {
		console.warn(`⚠️  图标未找到: ${iconName}`);
		return null;
	}

	// 转换为 SVG
	const renderData = iconToSVG(iconData, {
		height: null,
		width: null,
	});

	let svg = iconToHTML(replaceIDs(renderData.body), renderData.attributes);

	// 确保支持 currentColor
	if (!svg.includes("currentColor")) {
		svg = svg.replace("<svg", '<svg fill="currentColor"');
	}

	// 移除固定尺寸属性，使用 style 来控制大小
	svg = svg.replace(/\s+width="[^"]*"/g, "");
	svg = svg.replace(/\s+height="[^"]*"/g, "");
	// 添加 style 让 SVG 填满父容器
	svg = svg.replace("<svg", '<svg style="width: 100%; height: 100%;"');

	return svg;
}

/**
 * 生成 icons.ts 文件
 */
function generateIconsFile(iconsMap) {
	const iconEntries = Array.from(iconsMap.entries())
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([name, svg]) => `\t"${name}":\n\t\t'${svg.replace(/'/g, "\\'")}'`)
		.join(",\n");

	const content = `/**
 * 自动生成的图标数据文件
 * 由 scripts/generate-icons.js 在构建时生成
 * 请勿手动编辑此文件
 */

const iconSvgData: Record<string, string> = {
${iconEntries}
};

/**
 * 根据 iconify 格式的图标名获取内联 SVG HTML
 * @param iconName 图标名称，如 "material-symbols:search"
 * @returns SVG HTML 字符串
 */
export function getIconSvg(iconName: string): string {
	return iconSvgData[iconName] || "";
}

/**
 * 检查图标是否可用
 */
export function hasIcon(iconName: string): boolean {
	return iconName in iconSvgData;
}

/**
 * 获取所有可用图标名称
 */
export function getAvailableIcons(): string[] {
	return Object.keys(iconSvgData);
}

export default iconSvgData;
`;

	return content;
}

/**
 * 主函数
 */
async function main() {
	console.log("🔍 扫描源文件中的图标使用...\n");

	// 获取所有源文件
	const files = getAllFiles(SRC_DIR);
	console.log(`📁 找到 ${files.length} 个源文件\n`);

	// 收集所有使用的图标
	const allIcons = new Set();

	for (const file of files) {
		// 跳过 icons.ts 文件本身
		if (file.endsWith("icons.ts")) continue;

		const content = readFileSync(file, "utf-8");
		const icons = extractIconNames(content);

		for (const icon of icons) {
			allIcons.add(icon);
		}
	}

	console.log(`🎨 发现 ${allIcons.size} 个不同的图标:\n`);

	// 按图标集分组显示
	const iconsBySet = {};
	for (const icon of allIcons) {
		const [prefix] = icon.split(":");
		if (!iconsBySet[prefix]) {
			iconsBySet[prefix] = [];
		}
		iconsBySet[prefix].push(icon);
	}

	for (const [prefix, icons] of Object.entries(iconsBySet)) {
		console.log(`   ${prefix}: ${icons.length} 个图标`);
	}
	console.log("");

	// 获取所有图标的 SVG
	const iconsMap = new Map();
	let successCount = 0;
	let failCount = 0;

	for (const iconName of allIcons) {
		const svg = await getIconSvg(iconName);
		if (svg) {
			iconsMap.set(iconName, svg);
			successCount++;
		} else {
			failCount++;
		}
	}

	console.log(`✅ 成功加载 ${successCount} 个图标`);
	if (failCount > 0) {
		console.log(`❌ 失败 ${failCount} 个图标`);
	}

	// 生成输出文件
	const output = generateIconsFile(iconsMap);
	writeFileSync(OUTPUT_FILE, output, "utf-8");

	console.log(`\n📝 已生成: ${OUTPUT_FILE}`);
	console.log(`📦 文件大小: ${(Buffer.byteLength(output, "utf-8") / 1024).toFixed(2)} KB\n`);
}

main().catch(console.error);
