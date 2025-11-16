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
			// Replace each mapped text with its corresponding field value
			Object.entries(template.fieldMappings).forEach(([originalText, fieldName]) => {
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
				html = html.replace(regex, replacementValue)

				console.log(`📝 Replaced "${originalText}" with "${replacementValue}"`)
			})

			console.log("✅ Template rendering complete!")
			console.log("📄 Final HTML length:", html.length)

			return html.trim()
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
