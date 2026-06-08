import { siteConfig } from "../config";
import type I18nKey from "./i18nKey";
import { zh_CN } from "./languages/zh_CN";
import { en_US } from "./languages/en_US";

export type Translation = {
	[K in I18nKey]: string;
};

const defaultTranslation = en_US;

const map: { [key: string]: Translation } = {
	en_us: en_US,
    zh_cn: zh_CN,
};

export function getTranslation(lang: string): Translation {
	return map[lang.toLowerCase()] || defaultTranslation;
}

export function i18n(key: I18nKey): string {
	const lang = siteConfig.lang || "en_us";
	const currentLang = getTranslation(lang);
	const value = currentLang[key];

	if (!value && lang.toLowerCase() !== "zh_cn") {
		const chineseValue = zh_CN[key];
		if (chineseValue) {
			return chineseValue;
		}
	}

	return value || defaultTranslation[key];
}
