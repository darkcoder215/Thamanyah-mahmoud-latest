"use client"

import React, { useMemo } from "react"
import PageFooter from "@/components/Form/Preview/PageFooter"
import { JobOfferFormData } from "@/components/Form/JobOfferFormTypes"
import { CustomTemplate } from "@/components/TemplateBuilder/TemplateBuilderForm"
import { formatNumbers } from "@/utils/helpers"

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

		let html = template.code

		try {
			// Replace {formData.field} placeholders with actual values
			console.log("📝 Replacing form data placeholders...")

			// Replace all {formData.fieldName} patterns
			html = html.replace(/\{formData\.(\w+)\}/g, (match, fieldName) => {
				const value = formData[fieldName as keyof JobOfferFormData]

				// Format numbers
				if (typeof value === "number") {
					return formatNumbers(value)
				}

				// Join arrays
				if (Array.isArray(value)) {
					return value.join(", ")
				}

				// Return as string
				return String(value || "")
			})

			console.log("✅ Template rendering complete!")

			return html
		} catch (error) {
			console.error("❌ Error rendering template:", error)
			return `<div class="text-red-500">خطأ في عرض القالب: ${error instanceof Error ? error.message : "خطأ غير معروف"}</div>`
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
