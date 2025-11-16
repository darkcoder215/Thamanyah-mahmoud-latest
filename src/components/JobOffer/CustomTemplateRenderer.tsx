"use client"

import React, { useMemo } from "react"
import PageFooter from "@/components/Form/Preview/PageFooter"
import { JobOfferFormData } from "@/components/Form/JobOfferFormTypes"
import { formatNumbers } from "@/utils/helpers"

export interface CustomField {
	name: string // Internal field name (e.g., "companyName")
	label: string // Display label in Arabic (e.g., "اسم الشركة")
	type: "text" | "number" // Field type
}

export interface CustomTemplate {
	id: string
	name: string
	description: string
	htmlCode: string // HTML with text that will be mapped
	fieldMappings: Record<string, string> // text → field name mapping
	customFields: CustomField[] // Additional fields beyond standard formData
	originalWidth?: number // Original Figma frame width in pixels
	originalHeight?: number // Original Figma frame height in pixels
	previewImage?: string
	createdAt: string
}

interface CustomTemplateRendererProps {
	template: CustomTemplate
	formData: JobOfferFormData
}

const CustomTemplateRenderer: React.FC<CustomTemplateRendererProps> = ({
	template,
	formData,
}) => {
	const renderedHTML = useMemo(() => {
		console.log("🎨 Rendering custom template:", template.name)
		console.log("📊 Form data:", formData)
		console.log("🗺️ Field mappings:", template.fieldMappings)

		let html = template.htmlCode

		try {
			if (!html || html.trim().length === 0) {
				console.error("❌ Template HTML is empty!")
				return `<div class="p-8 text-red-500">خطأ: القالب فارغ</div>`
			}

			console.log("📝 Original HTML length:", html.length)
			console.log("📝 First 200 chars:", html.substring(0, 200))

			// Replace each mapped text with its corresponding field value
			Object.entries(template.fieldMappings || {}).forEach(([originalText, fieldName]) => {
				const value = formData[fieldName as keyof JobOfferFormData]

				let replacementValue = ""

				// Format the value based on type
				if (typeof value === "number") {
					replacementValue = formatNumbers(value)
				} else if (Array.isArray(value)) {
					replacementValue = value.join(", ")
				} else {
					replacementValue = String(value || "")
				}

				// Escape special regex characters in the original text
				const escapedText = originalText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

				// Replace all occurrences of the original text
				const regex = new RegExp(escapedText, 'g')
				const beforeLength = html.length
				html = html.replace(regex, replacementValue)
				const afterLength = html.length

				console.log(`📝 Replacing "${originalText}" with "${replacementValue}"`)
				console.log(`   HTML length changed: ${beforeLength} → ${afterLength}`)
			})

			console.log("✅ Template rendering complete!")
			console.log("📄 Final HTML length:", html.length)
			console.log("📄 Final first 200 chars:", html.substring(0, 200))

			const result = html.trim()

			if (result.length === 0) {
				console.error("❌ Final rendered HTML is empty!")
				return `<div class="p-8 text-red-500">خطأ: HTML النهائي فارغ. تحقق من وحدة التحكم للتفاصيل.</div>`
			}

			return result
		} catch (error) {
			console.error("❌ Error rendering template:", error)
			return `<div class="p-8 text-red-500">خطأ في عرض القالب: ${error instanceof Error ? error.message : "خطأ غير معروف"}</div>`
		}
	}, [template, formData])

	// Calculate scaling if original dimensions are provided
	const scaleStyle = useMemo(() => {
		if (!template.originalWidth || !template.originalHeight) {
			return {}
		}

		// A4 page content area (excluding padding)
		// Page: 210mm x 297mm
		// Padding: 42px inline, 120px top/bottom
		// Converting to pixels at 96dpi: 1mm ≈ 3.7795px
		const pageWidthPx = 210 * 3.7795 // ≈ 794px
		const pageHeightPx = 297 * 3.7795 // ≈ 1123px
		const paddingInlinePx = 42
		const paddingVerticalPx = 120

		const availableWidth = pageWidthPx - (paddingInlinePx * 2)
		const availableHeight = pageHeightPx - (paddingVerticalPx * 2)

		// Calculate scale factors for width and height
		const scaleX = availableWidth / template.originalWidth
		const scaleY = availableHeight / template.originalHeight

		// Use the smaller scale to ensure it fits in both dimensions
		const scale = Math.min(scaleX, scaleY, 1) // Don't scale up, only down

		console.log("📐 Scaling calculation:")
		console.log(`   Original: ${template.originalWidth}px × ${template.originalHeight}px`)
		console.log(`   Available: ${availableWidth.toFixed(0)}px × ${availableHeight.toFixed(0)}px`)
		console.log(`   Scale: ${scale.toFixed(3)}`)

		return {
			width: `${template.originalWidth}px`,
			height: `${template.originalHeight}px`,
			transform: `scale(${scale})`,
			transformOrigin: 'top right', // RTL, so anchor to top right
		}
	}, [template.originalWidth, template.originalHeight])

	return (
		<div className="page font-8-sans text-[14pt] font-light" dir="rtl">
			<div
				className="figma-content"
				style={scaleStyle}
				dangerouslySetInnerHTML={{ __html: renderedHTML }}
			/>
			<PageFooter />
		</div>
	)
}

export default CustomTemplateRenderer
