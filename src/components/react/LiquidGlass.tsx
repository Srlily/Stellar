/**
 * LiquidGlass 液态玻璃 React 组件
 * 基于 liquid-glass-react 库的实现方法，使用 SVG 位移滤镜 + backdrop-filter 实现
 *
 * 核心原理：
 * 1. SVG feDisplacementMap 对边缘区域产生折射扭曲
 * 2. backdrop-filter: blur() + saturate() 实现玻璃模糊与饱和度增强
 * 3. 色散效果（chromatic aberration）通过 RGB 通道分离实现
 * 4. 径向渐变遮罩控制位移仅在边缘生效，中心保持清晰
 */
import { type CSSProperties, forwardRef, useId } from "react";

// ==================== 类型定义 ====================

export type GlassRefractionMode = "standard" | "polar" | "prominent";

export interface LiquidGlassProps {
	children: React.ReactNode;
	className?: string;
	style?: CSSProperties;
	/** 位移强度，控制边缘扭曲程度，0-200 */
	displacementScale?: number;
	/** 背景模糊量，0-1 */
	blurAmount?: number;
	/** 背景饱和度，100-300 */
	saturation?: number;
	/** 色散强度，控制 RGB 通道分离，0-20 */
	aberrationIntensity?: number;
	/** 圆角半径，0-999（999 = 完全圆角） */
	cornerRadius?: number;
	/** 内边距 */
	padding?: string;
	/** 是否处于明亮背景上（自动加深色调） */
	overLight?: boolean;
	/** 折射模式 */
	mode?: GlassRefractionMode;
	/** 点击事件 */
	onClick?: () => void;
}

// ==================== SVG 滤镜组件 ====================

/**
 * GlassFilter：生成 SVG 位移滤镜
 *
 * 工作原理：
 * - feImage 引入位移贴图
 * - 对 R/G/B 三个通道分别做不同强度的 feDisplacementMap，产生色散
 * - 用径向渐变遮罩让位移仅作用于边缘（中心保持原图）
 * - 最终通过 screen 混合模式合成三通道
 */
const GlassFilter: React.FC<{
	id: string;
	displacementScale: number;
	aberrationIntensity: number;
	width: number;
	height: number;
	mode: GlassRefractionMode;
}> = ({ id, displacementScale, aberrationIntensity, width, height, mode }) => (
	<svg
		style={{ position: "absolute", width, height }}
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

			{/* 主滤镜 */}
			<filter
				id={id}
				x="-35%"
				y="-35%"
				width="170%"
				height="170%"
				colorInterpolationFilters="sRGB"
			>
				{/* 用 feTurbulence 生成程序化位移图案 */}
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

				{/* 边缘强度提取 */}
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

				{/* 原始未位移图像（用于中心区域） */}
				<feOffset
					in="SourceGraphic"
					dx="0"
					dy="0"
					result="CENTER_ORIGINAL"
				/>

				{/* 红色通道位移 */}
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

				{/* 绿色通道位移（轻微偏移） */}
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

				{/* 蓝色通道位移（更大偏移） */}
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

				{/* 合成三通道（screen 混合模式） */}
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

				{/* 轻微模糊色散效果 */}
				<feGaussianBlur
					in="RGB_COMBINED"
					stdDeviation={Math.max(0.1, 0.5 - aberrationIntensity * 0.1)}
					result="ABERRATED_BLURRED"
				/>

				{/* 边缘遮罩应用：仅边缘显示色散 */}
				<feComposite
					in="ABERRATED_BLURRED"
					in2="EDGE_MASK"
					operator="in"
					result="EDGE_ABERRATION"
				/>

				{/* 反转遮罩：中心区域保持原图 */}
				<feComponentTransfer in="EDGE_MASK" result="INVERTED_MASK">
					<feFuncA type="table" tableValues="1 0" />
				</feComponentTransfer>
				<feComposite
					in="CENTER_ORIGINAL"
					in2="INVERTED_MASK"
					operator="in"
					result="CENTER_CLEAN"
				/>

				{/* 合并边缘色散与中心原图 */}
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
			displacementScale = 70,
			blurAmount = 0.0625,
			saturation = 140,
			aberrationIntensity = 2,
			cornerRadius = 24,
			padding = "24px 32px",
			overLight = false,
			mode = "standard",
			onClick,
		},
		ref,
	) => {
		const filterId = useId();

		const isFirefox =
			typeof navigator !== "undefined" &&
			navigator.userAgent.toLowerCase().includes("firefox");

		const backdropStyle: CSSProperties = {
			filter: isFirefox ? undefined : `url(#${filterId})`,
			backdropFilter: `blur(${(overLight ? 12 : 4) + blurAmount * 32}px) saturate(${saturation}%)`,
			WebkitBackdropFilter: `blur(${(overLight ? 12 : 4) + blurAmount * 32}px) saturate(${saturation}%)`,
		};

		return (
			<div
				ref={ref}
				className={`relative ${className} ${onClick ? "cursor-pointer" : ""}`}
				style={style}
				onClick={onClick}
			>
				<GlassFilter
					id={filterId}
					displacementScale={displacementScale}
					aberrationIntensity={aberrationIntensity}
					width={400}
					height={400}
					mode={mode}
				/>

				<div
					className="glass"
					style={{
						borderRadius: `${cornerRadius}px`,
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
						className="transition-all duration-150 ease-in-out text-white"
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

				{/* 边框高光层 1 */}
				<span
					style={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						height: "100%",
						width: "100%",
						borderRadius: `${cornerRadius}px`,
						pointerEvents: "none",
						mixBlendMode: "screen",
						opacity: 0.2,
						padding: "1.5px",
						WebkitMask:
							"linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
						WebkitMaskComposite: "xor",
						maskComposite: "exclude",
						boxShadow:
							"0 0 0 0.5px rgba(255, 255, 255, 0.5) inset, 0 1px 3px rgba(255, 255, 255, 0.25) inset, 0 1px 4px rgba(0, 0, 0, 0.35)",
						background: `linear-gradient(135deg, rgba(255,255,255,0.0) 0%, rgba(255,255,255,0.12) 33%, rgba(255,255,255,0.4) 66%, rgba(255,255,255,0.0) 100%)`,
					}}
				/>

				{/* 边框高光层 2（overlay 混合） */}
				<span
					style={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						height: "100%",
						width: "100%",
						borderRadius: `${cornerRadius}px`,
						pointerEvents: "none",
						mixBlendMode: "overlay",
						padding: "1.5px",
						WebkitMask:
							"linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
						WebkitMaskComposite: "xor",
						maskComposite: "exclude",
						boxShadow:
							"0 0 0 0.5px rgba(255, 255, 255, 0.5) inset, 0 1px 3px rgba(255, 255, 255, 0.25) inset, 0 1px 4px rgba(0, 0, 0, 0.35)",
						background: `linear-gradient(135deg, rgba(255,255,255,0.0) 0%, rgba(255,255,255,0.32) 33%, rgba(255,255,255,0.6) 66%, rgba(255,255,255,0.0) 100%)`,
					}}
				/>

				{/* 悬停高光效果 */}
				{onClick && (
					<div
						style={{
							position: "absolute",
							top: "50%",
							left: "50%",
							transform: "translate(-50%, -50%)",
							height: "100%",
							width: "100%",
							borderRadius: `${cornerRadius}px`,
							pointerEvents: "none",
							transition: "all 0.2s ease-out",
							backgroundImage:
								"radial-gradient(circle at 50% 0%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 50%)",
							mixBlendMode: "overlay",
						}}
					/>
				)}
			</div>
		);
	},
);

LiquidGlass.displayName = "LiquidGlass";

export default LiquidGlass;
