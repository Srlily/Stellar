/**
 * LiquidGlass 液态玻璃 React 组件
 *
 * 设计目标（重构后）：
 * 1. 不再作为独立"主题模式"使用，而是叠加在 light/dark 主题上的视觉增强。
 * 2. 通过 `--glass-*` CSS 变量驱动外观，自动适配 light/dark（见 global.css）。
 * 3. 当传入 `refraction=true` 时，渲染 SVG feDisplacementMap 滤镜，
 *    给玻璃容器边缘添加折射扭曲与色散效果；
 *    关闭时回退到纯 CSS 玻璃外观（性能更好）。
 *
 * 使用方式：
 *   <LiquidGlass>...</LiquidGlass>                          // 纯 CSS 玻璃
 *   <LiquidGlass refraction cornerRadius={32}>...</LiquidGlass>  // 启用 SVG 折射
 */
import * as React from "react";
import {
	type CSSProperties,
	type ReactElement,
	type ReactNode,
	forwardRef,
	useEffect,
	useId,
	useState,
} from "react";

// ==================== 类型定义 ====================

export type GlassRefractionMode = "standard" | "polar" | "prominent";

export interface LiquidGlassProps {
	children?: ReactNode;
	className?: string;
	style?: CSSProperties;
	/** 是否启用 SVG 位移折射（默认 false，使用纯 CSS 玻璃） */
	refraction?: boolean;
	/** 折射模式：standard | polar | prominent，默认 standard */
	refractionMode?: GlassRefractionMode;
	/** 位移强度，控制边缘扭曲程度，0-200，默认读取 --glass-displacement */
	displacementScale?: number;
	/** 背景模糊量，0-1，默认读取 --glass-blur-amount */
	blurAmount?: number;
	/** 背景饱和度，100-300，默认读取 --glass-saturation */
	saturation?: number;
	/** 色散强度，0-20，默认读取 --glass-aberration */
	aberrationIntensity?: number;
	/** 圆角半径（px），默认读取 --glass-radius */
	cornerRadius?: number;
	/** 内边距 */
	padding?: string;
	/** 是否处于明亮背景上（用于加深色调，可由 CSS 变量覆盖） */
	overLight?: boolean;
	/** 点击事件 */
	onClick?: () => void;
}

// ==================== SVG 滤镜组件（仅在 refraction=true 时渲染） ====================

interface FilterEnv {
	id: string;
	displacementScale: number;
	aberrationIntensity: number;
	width: number;
	height: number;
	mode: GlassRefractionMode;
}

const readCssNumber = (name: string, fallback: number): number => {
	if (typeof window === "undefined") return fallback;
	const raw = getComputedStyle(document.documentElement).getPropertyValue(name);
	const n = parseFloat(raw);
	return Number.isFinite(n) ? n : fallback;
};

/**
 * 监测 light/dark 切换，dark 时让折射色散强度更柔和（避免刺眼）。
 */
function useAdaptiveAberration(baseIntensity: number): number {
	const [intensity, setIntensity] = useState(baseIntensity);

	useEffect(() => {
		const update = () => {
			const isDark = document.documentElement.classList.contains("dark");
			// 暗色下降低色散强度，避免亮色边缘在暗背景上过于刺眼
			setIntensity(isDark ? Math.max(0, baseIntensity * 0.6) : baseIntensity);
		};
		update();
		const obs = new MutationObserver(update);
		obs.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["class"],
		});
		return () => obs.disconnect();
	}, [baseIntensity]);

	return intensity;
}

const GlassFilter = ({
	id,
	displacementScale,
	aberrationIntensity,
	width,
	height,
	mode,
}: FilterEnv): ReactElement => (
	<svg
		style={{ position: "absolute", width, height, pointerEvents: "none" }}
		aria-hidden="true"
	>
		<defs>
			{/* 径向渐变遮罩：中心透明，边缘不透明 */}
			<radialGradient id={`${id}-edge-mask`} cx="50%" cy="50%" r="50%">
				<stop offset="0%" stopColor="black" stopOpacity="0" />
				<stop
					offset={`${Math.max(30, 80 - aberrationIntensity * 2)}%`}
					stopColor="black"
					stopOpacity="0"
				/>
				<stop offset="100%" stopColor="white" stopOpacity="1" />
			</radialGradient>

			{/* 主滤镜：turbulence + displacement + 色散合成 */}
			<filter
				id={id}
				x="-35%"
				y="-35%"
				width="170%"
				height="170%"
				colorInterpolationFilters="sRGB"
			>
				<feTurbulence
					type={mode === "polar" ? "turbulence" : "fractalNoise"}
					baseFrequency={mode === "prominent" ? 0.015 : 0.01}
					numOctaves="3"
					seed="2"
					result="NOISE"
				/>
				<feColorMatrix
					in="NOISE"
					type="saturate"
					values="0"
					result="GRAY_NOISE"
				/>

				<feColorMatrix
					in="GRAY_NOISE"
					type="matrix"
					values="0.3 0.3 0.3 0 0
					        0.3 0.3 0.3 0 0
					        0.3 0.3 0.3 0 0
					        0 0 0 1 0"
					result="EDGE_INTENSITY"
				/>
				<feComponentTransfer in="EDGE_INTENSITY" result="EDGE_MASK">
					<feFuncA
						type="discrete"
						tableValues={`0 ${aberrationIntensity * 0.05} 1`}
					/>
				</feComponentTransfer>

				<feOffset in="SourceGraphic" dx="0" dy="0" result="CENTER_ORIGINAL" />

				{/* R 通道 */}
				<feDisplacementMap
					in="SourceGraphic"
					in2="GRAY_NOISE"
					scale={displacementScale * -1}
					xChannelSelector="R"
					yChannelSelector="B"
					result="RED_DISPLACED"
				/>
				<feColorMatrix
					in="RED_DISPLACED"
					type="matrix"
					values="1 0 0 0 0
					        0 0 0 0 0
					        0 0 0 0 0
					        0 0 0 1 0"
					result="RED_CHANNEL"
				/>

				{/* G 通道 */}
				<feDisplacementMap
					in="SourceGraphic"
					in2="GRAY_NOISE"
					scale={displacementScale * (-1 - aberrationIntensity * 0.05)}
					xChannelSelector="R"
					yChannelSelector="B"
					result="GREEN_DISPLACED"
				/>
				<feColorMatrix
					in="GREEN_DISPLACED"
					type="matrix"
					values="0 0 0 0 0
					        0 1 0 0 0
					        0 0 0 0 0
					        0 0 0 1 0"
					result="GREEN_CHANNEL"
				/>

				{/* B 通道 */}
				<feDisplacementMap
					in="SourceGraphic"
					in2="GRAY_NOISE"
					scale={displacementScale * (-1 - aberrationIntensity * 0.1)}
					xChannelSelector="R"
					yChannelSelector="B"
					result="BLUE_DISPLACED"
				/>
				<feColorMatrix
					in="BLUE_DISPLACED"
					type="matrix"
					values="0 0 0 0 0
					        0 0 0 0 0
					        0 0 1 0 0
					        0 0 0 1 0"
					result="BLUE_CHANNEL"
				/>

				<feBlend
					in="GREEN_CHANNEL"
					in2="BLUE_CHANNEL"
					mode="screen"
					result="GB_COMBINED"
				/>
				<feBlend
					in="RED_CHANNEL"
					in2="GB_COMBINED"
					mode="screen"
					result="RGB_COMBINED"
				/>

				<feGaussianBlur
					in="RGB_COMBINED"
					stdDeviation={Math.max(0.1, 0.5 - aberrationIntensity * 0.1)}
					result="ABERRATED_BLURRED"
				/>

				<feComposite
					in="ABERRATED_BLURRED"
					in2="EDGE_MASK"
					operator="in"
					result="EDGE_ABERRATION"
				/>

				<feComponentTransfer in="EDGE_MASK" result="INVERTED_MASK">
					<feFuncA type="table" tableValues="1 0" />
				</feComponentTransfer>
				<feComposite
					in="CENTER_ORIGINAL"
					in2="INVERTED_MASK"
					operator="in"
					result="CENTER_CLEAN"
				/>

				<feComposite
					in="EDGE_ABERRATION"
					in2="CENTER_CLEAN"
					operator="over"
				/>
			</filter>
		</defs>
	</svg>
);

// ==================== 主组件 ====================

const LiquidGlass = forwardRef<HTMLDivElement, LiquidGlassProps>(
	(
		{
			children,
			className = "",
			style,
			refraction = false,
			refractionMode = "standard",
			displacementScale,
			blurAmount,
			saturation,
			aberrationIntensity,
			cornerRadius,
			padding = "24px 32px",
			overLight = false,
			onClick,
		},
		ref: React.ForwardedRef<HTMLDivElement>,
	) => {
		const filterId = useId();

		const isFirefox =
			typeof navigator !== "undefined" &&
			navigator.userAgent.toLowerCase().includes("firefox");

		// 折射参数：未传入时从 CSS 变量读取（实现 light/dark 自适应）
		const dScale =
			displacementScale ?? readCssNumber("--glass-displacement", 70);
		const bAmount = blurAmount ?? readCssNumber("--glass-blur-amount", 0.0625);
		const sat = saturation ?? readCssNumber("--glass-saturation", 140);

		// 暗色下自动降低色散（避免亮色边缘刺眼）
		const baseAberration =
			aberrationIntensity ?? readCssNumber("--glass-aberration", 2);
		const adaptiveAberration = useAdaptiveAberration(baseAberration);

		// 圆角：未传入时读取 CSS 变量
		const [radius, setRadius] = useState<number>(cornerRadius ?? 24);
		useEffect(() => {
			if (cornerRadius !== undefined) {
				setRadius(cornerRadius);
				return;
			}
			const update = () => {
				const v = parseFloat(
					getComputedStyle(document.documentElement).getPropertyValue(
						"--glass-radius",
					),
				);
				if (Number.isFinite(v)) setRadius(v);
			};
			update();
			// CSS 变量可能由其它代码改写，这里监听 style 变化
			const obs = new MutationObserver(update);
			obs.observe(document.documentElement, {
				attributes: true,
				attributeFilter: ["style"],
			});
			return () => obs.disconnect();
		}, [cornerRadius]);

		const backdropStyle: CSSProperties = {
			filter: refraction && !isFirefox ? `url(#${filterId})` : undefined,
			backdropFilter: `blur(${(overLight ? 12 : 4) + bAmount * 32}px) saturate(${sat}%)`,
			WebkitBackdropFilter: `blur(${(overLight ? 12 : 4) + bAmount * 32}px) saturate(${sat}%)`,
		};

		return (
			<div
				ref={ref}
				className={`relative ${className} ${onClick ? "cursor-pointer" : ""}`}
				style={style}
				onClick={onClick}
			>
				{refraction && (
					<GlassFilter
						id={filterId}
						displacementScale={dScale}
						aberrationIntensity={adaptiveAberration}
						width={400}
						height={400}
						mode={refractionMode}
					/>
				)}

				<div
					className="glass glass-card"
					style={{
						borderRadius: `${radius}px`,
						position: "relative",
						display: "inline-flex",
						alignItems: "center",
						gap: "24px",
						padding,
						overflow: "hidden",
						transition: "all 0.2s ease-in-out",
						boxShadow: overLight
							? "0px 16px 70px rgba(0, 0, 0, 0.75)"
							: "0px 12px 40px rgba(0, 0, 0, 0.25)",
					}}
				>
					{/* 模糊背景层 */}
					<span
						className="glass__warp"
						style={{
							...backdropStyle,
							position: "absolute",
							inset: "0",
						}}
					/>

					{/* 内容层（保持清晰） */}
					<div
						className="transition-all duration-150 ease-in-out"
						style={{
							position: "relative",
							zIndex: 1,
							textShadow: overLight
								? "0px 2px 12px rgba(0, 0, 0, 0)"
								: "0px 2px 12px rgba(0, 0, 0, 0.4)",
						}}
					>
						{children}
					</div>
				</div>
			</div>
		);
	},
);

LiquidGlass.displayName = "LiquidGlass";

export default LiquidGlass;