"use client"

import React, { useEffect, useState } from "react"
import { Button, Radio, Tabs, message } from "antd"
import { CheckCircleOutlined } from "@ant-design/icons"

interface StyleConverterProps {
	figmaCode: string
	onConvert: (convertedCode: string) => void
	onBack: () => void
}

const StyleConverter: React.FC<StyleConverterProps> = ({ figmaCode, onConvert, onBack }) => {
	const [conversionMode, setConversionMode] = useState<"tailwind" | "css">("tailwind")
	const [convertedCode, setConvertedCode] = useState("")
	const [isConverting, setIsConverting] = useState(false)

	// Style conversion utilities
	const convertInlineStyleToTailwind = (styleObj: Record<string, string>): string => {
		const tailwindClasses: string[] = []

		console.log("🎨 Converting styles:", styleObj)

		// Width & Height
		if (styleObj.width) {
			const width = styleObj.width
			if (width === "100%") tailwindClasses.push("w-full")
			else if (width.includes("px")) {
				const value = parseInt(width)
				tailwindClasses.push(`w-[${value}px]`)
			} else if (width.includes("%")) {
				const value = parseInt(width)
				tailwindClasses.push(`w-[${value}%]`)
			}
		}

		if (styleObj.height) {
			const height = styleObj.height
			if (height === "100%") tailwindClasses.push("h-full")
			else if (height.includes("px")) {
				const value = parseInt(height)
				tailwindClasses.push(`h-[${value}px]`)
			} else if (height.includes("%")) {
				const value = parseInt(height)
				tailwindClasses.push(`h-[${value}%]`)
			}
		}

		// Position
		if (styleObj.position === "relative") tailwindClasses.push("relative")
		if (styleObj.position === "absolute") tailwindClasses.push("absolute")

		// Background
		if (styleObj.background) {
			const bg = styleObj.background
			if (bg === "#F2EEE4") tailwindClasses.push("bg-background")
			else if (bg === "#3BC17B" || bg === "#03BB6E" || bg === "#54b974")
				tailwindClasses.push("bg-green-full")
			else if (bg === "#ABD9AB" || bg === "#AFE4B6") tailwindClasses.push("bg-green-light")
			else if (bg === "black" || bg === "#000") tailwindClasses.push("bg-black")
			else tailwindClasses.push(`bg-[${bg}]`)
		}

		// Border Radius
		if (styleObj.borderRadius) {
			const radius = parseInt(styleObj.borderRadius)
			if (radius === 16) tailwindClasses.push("rounded-2xl")
			else tailwindClasses.push(`rounded-[${radius}px]`)
		}

		// Display & Flex
		if (styleObj.display === "flex" || styleObj.display === "inline-flex") {
			tailwindClasses.push("flex")
			if (styleObj.display === "inline-flex") tailwindClasses.push("inline-flex")
		}

		if (styleObj.flexDirection === "column") tailwindClasses.push("flex-col")

		if (styleObj.justifyContent === "center") tailwindClasses.push("justify-center")
		if (styleObj.justifyContent === "flex-start") tailwindClasses.push("justify-start")
		if (styleObj.justifyContent === "space-between") tailwindClasses.push("justify-between")

		if (styleObj.alignItems === "center") tailwindClasses.push("items-center")
		if (styleObj.alignItems === "flex-start") tailwindClasses.push("items-start")

		if (styleObj.gap) {
			const gap = parseInt(styleObj.gap)
			if (gap === 10) tailwindClasses.push("gap-2.5")
			else if (gap === 12) tailwindClasses.push("gap-3")
			else if (gap === 14) tailwindClasses.push("gap-3.5")
			else tailwindClasses.push(`gap-[${gap}px]`)
		}

		// Text
		if (styleObj.textAlign === "right") tailwindClasses.push("text-right")
		if (styleObj.textAlign === "center") tailwindClasses.push("text-center")

		if (styleObj.color) {
			const color = styleObj.color
			if (color === "black" || color === "#000") tailwindClasses.push("text-black")
			else if (color === "white" || color === "#FFF") tailwindClasses.push("text-white")
			else if (color === "#FF0000") tailwindClasses.push("text-red-500")
			else tailwindClasses.push(`text-[${color}]`)
		}

		if (styleObj.fontSize) {
			const size = parseInt(styleObj.fontSize)
			tailwindClasses.push(`text-[${size}px]`)
		}

		if (styleObj.fontWeight === "700" || styleObj.fontWeight === "bold")
			tailwindClasses.push("font-bold")
		if (styleObj.fontWeight === "900") tailwindClasses.push("font-black")
		if (styleObj.fontWeight === "300") tailwindClasses.push("font-light")
		if (styleObj.fontWeight === "400") tailwindClasses.push("font-normal")

		// Font Family - Critical for Arabic text!
		if (styleObj.fontFamily) {
			const fontFamily = styleObj.fontFamily.toLowerCase()
			console.log("📝 Detecting font family:", fontFamily)

			if (
				fontFamily.includes("thmanyah serif display") ||
				fontFamily.includes("serif display") ||
				fontFamily.includes("display")
			) {
				tailwindClasses.push("font-8-display")
				console.log("✅ Mapped to: font-8-display (Thmanyah Serif Display)")
			} else if (
				fontFamily.includes("thmanyah serif text") ||
				fontFamily.includes("thmanyahseriftext") ||
				(fontFamily.includes("serif") && !fontFamily.includes("display"))
			) {
				tailwindClasses.push("font-8-serif")
				console.log("✅ Mapped to: font-8-serif (Thmanyah Serif Text)")
			} else if (
				fontFamily.includes("thmanyah sans") ||
				fontFamily.includes("thmanyahsans") ||
				fontFamily.includes("sans")
			) {
				tailwindClasses.push("font-8-sans")
				console.log("✅ Mapped to: font-8-sans (Thmanyah Sans)")
			} else {
				// Default to sans for Arabic compatibility
				tailwindClasses.push("font-8-sans")
				console.log("⚠️ Unknown font, defaulting to font-8-sans")
			}
		}

		// Position values (top, left, right, bottom)
		if (styleObj.left) tailwindClasses.push(`left-[${styleObj.left}px]`)
		if (styleObj.top) tailwindClasses.push(`top-[${styleObj.top}px]`)
		if (styleObj.right) tailwindClasses.push(`right-[${styleObj.right}px]`)
		if (styleObj.bottom) tailwindClasses.push(`bottom-[${styleObj.bottom}px]`)

		// Opacity
		if (styleObj.opacity) {
			const opacity = parseFloat(styleObj.opacity)
			tailwindClasses.push(`opacity-${Math.round(opacity * 100)}`)
		}

		// Overflow
		if (styleObj.overflow === "hidden") tailwindClasses.push("overflow-hidden")

		// Text decoration
		if (styleObj.textDecoration === "underline") tailwindClasses.push("underline")

		// Line height
		if (styleObj.lineHeight) {
			const lh = parseInt(styleObj.lineHeight)
			tailwindClasses.push(`leading-[${lh}px]`)
		}

		// Transform
		if (styleObj.transform?.includes("rotate")) {
			const match = styleObj.transform.match(/rotate\((.+?)\)/)
			if (match) tailwindClasses.push(`rotate-[${match[1]}]`)
		}

		// Outline (convert to border)
		if (styleObj.outline) {
			const match = styleObj.outline.match(/(\d+\.?\d*)px (.+?) solid/)
			if (match) {
				const width = parseFloat(match[1])
				const color = match[2]
				tailwindClasses.push(`border-[${Math.ceil(width)}px]`)
				if (color === "black") tailwindClasses.push("border-black")
				else tailwindClasses.push(`border-[${color}]`)
			}
		}

		return tailwindClasses.join(" ")
	}

	const parseStyleObject = (styleString: string): Record<string, string> => {
		const styleObj: Record<string, string> = {}
		const pairs = styleString.split(",").map((s) => s.trim())

		pairs.forEach((pair) => {
			const [key, value] = pair.split(":").map((s) => s.trim())
			if (key && value) {
				// Convert camelCase to kebab-case for CSS properties
				const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase()
				// Remove quotes from values
				const cssValue = value.replace(/['"]/g, "")
				styleObj[key] = cssValue
			}
		})

		return styleObj
	}

	const convertFigmaToReact = (code: string): string => {
		console.log("🚀 Starting Figma to React conversion...")
		console.log("📄 Original code length:", code.length, "characters")

		let converted = code

		try {
			// Fix style attributes - convert object notation to proper React style objects
			let styleCount = 0
			converted = converted.replace(/style=\{\{([^}]+)\}\}/g, (match, styleContent) => {
				styleCount++
				console.log(`🔄 Processing style #${styleCount}`)

				try {
					const styleObj = parseStyleObject(styleContent)

					if (conversionMode === "tailwind") {
						const tailwindClasses = convertInlineStyleToTailwind(styleObj)
						console.log(`✅ Converted to Tailwind: ${tailwindClasses}`)
						return `className="${tailwindClasses}"`
					} else {
						// Keep as inline styles but fix syntax
						return `style={{${styleContent}}}`
					}
				} catch (error) {
					console.error("❌ Error processing style:", error)
					// Return original if conversion fails
					return match
				}
			})

			console.log(`✅ Processed ${styleCount} style objects`)

			// Fix span style attributes
			let spanCount = 0
			converted = converted.replace(/style="([^"]+)"/g, (match, styleContent) => {
				spanCount++
				console.log(`🔄 Processing span style #${spanCount}`)

				try {
					const styleObj = parseStyleObject(styleContent)

					if (conversionMode === "tailwind") {
						const tailwindClasses = convertInlineStyleToTailwind(styleObj)
						return `className="${tailwindClasses}"`
					} else {
						// Convert to React inline style object
						const styleEntries = styleContent
							.split(";")
							.filter((s: string) => s.trim())
							.map((s: string) => {
								const [key, value] = s.split(":").map((x: string) => x.trim())
								const camelKey = key.replace(/-([a-z])/g, (g: string) => g[1].toUpperCase())
								return `${camelKey}: '${value}'`
							})
							.join(", ")
						return `style={{${styleEntries}}}`
					}
				} catch (error) {
					console.error("❌ Error processing span style:", error)
					return match
				}
			})

			console.log(`✅ Processed ${spanCount} span style objects`)

			// Replace img with Next.js Image component
			let imageCount = 0
			converted = converted.replace(
				/<img ([^>]*)src="([^"]+)"([^>]*)\/?>/g,
				(match, before, src, after) => {
					imageCount++
					console.log(`🖼️ Processing image #${imageCount}: ${src}`)
					return `<Image src="${src}" alt="" width={100} height={100} className="object-contain"${before}${after} />`
				},
			)

			console.log(`✅ Processed ${imageCount} images`)

			// Add proper imports
			const imports = `import React from "react"
import Image from "next/image"
import PageFooter from "@/components/Form/Preview/PageFooter"
import { JobOfferFormData } from "@/components/Form/JobOfferFormTypes"

interface CustomTemplateProps {
  formData: JobOfferFormData
}

const CustomTemplate: React.FC<CustomTemplateProps> = ({ formData }) => {
  return (
`

			const closing = `
  )
}

export default CustomTemplate`

			// Wrap in component with RTL support
			converted = `${imports}
    <div className="page font-8-sans text-[14pt] font-light" dir="rtl">
      ${converted}
      <PageFooter />
    </div>
${closing}`

			console.log("✅ Conversion complete!")
			console.log("📄 Converted code length:", converted.length, "characters")

			return converted
		} catch (error) {
			console.error("❌ Fatal error during conversion:", error)
			message.error("حدث خطأ أثناء تحويل الكود. الرجاء المحاولة مرة أخرى.")
			throw error
		}
	}

	const handleConvert = () => {
		setIsConverting(true)
		try {
			const result = convertFigmaToReact(figmaCode)
			setConvertedCode(result)
			message.success("تم تحويل الكود بنجاح!")
		} catch (error) {
			console.error("Conversion error:", error)
			message.error("حدث خطأ أثناء تحويل الكود")
		} finally {
			setIsConverting(false)
		}
	}

	const handleNext = () => {
		if (!convertedCode) {
			message.error("الرجاء تحويل الكود أولاً")
			return
		}
		onConvert(convertedCode)
	}

	useEffect(() => {
		// Auto-convert when component mounts
		handleConvert()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<div>
			<h2 className="mb-4 text-xl font-semibold">تحويل الأنماط</h2>

			<div className="mb-4">
				<label className="mb-2 block font-medium">طريقة التحويل:</label>
				<Radio.Group
					value={conversionMode}
					onChange={(e) => setConversionMode(e.target.value)}
				>
					<Radio.Button value="tailwind">Tailwind CSS (موصى به)</Radio.Button>
					<Radio.Button value="css">Inline Styles</Radio.Button>
				</Radio.Group>
			</div>

			<Button
				type="primary"
				onClick={handleConvert}
				loading={isConverting}
				icon={<CheckCircleOutlined />}
				className="mb-4"
			>
				إعادة تحويل الكود
			</Button>

			<Tabs
				defaultActiveKey="1"
				items={[
					{
						key: "1",
						label: "الكود الأصلي",
						children: (
							<div className="max-h-96 overflow-auto rounded bg-gray-100 p-4">
								<pre className="text-sm">
									<code>{figmaCode}</code>
								</pre>
							</div>
						),
					},
					{
						key: "2",
						label: "الكود المحول",
						children: (
							<div className="max-h-96 overflow-auto rounded bg-gray-100 p-4">
								<pre className="text-sm">
									<code>{convertedCode || "جاري التحويل..."}</code>
								</pre>
							</div>
						),
					},
				]}
			/>

			<div className="mt-6 flex justify-between">
				<Button onClick={onBack}>السابق</Button>
				<Button type="primary" onClick={handleNext} disabled={!convertedCode}>
					التالي
				</Button>
			</div>
		</div>
	)
}

export default StyleConverter
