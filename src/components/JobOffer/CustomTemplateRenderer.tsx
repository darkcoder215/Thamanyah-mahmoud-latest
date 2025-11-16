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

	return (
		<div className="page font-8-sans text-[14pt] font-light" dir="rtl">
			<div dangerouslySetInnerHTML={{ __html: renderedHTML }} />
			<PageFooter />
		</div>
	)
}

export default CustomTemplateRenderer
