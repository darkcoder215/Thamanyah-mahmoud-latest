"use client"

import React, { useMemo, useEffect } from "react"
import Image from "next/image"
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

		let html = template.convertedCode

		try {
			// Step 1: Replace asset placeholders with actual uploaded assets
			console.log("🖼️ Replacing assets...")
			let assetCount = 0
			Object.entries(template.assets).forEach(([placeholder, uploadedUrl]) => {
				const escapedPlaceholder = placeholder.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
				const regex = new RegExp(escapedPlaceholder, "g")
				const matches = html.match(regex)
				if (matches) {
					assetCount += matches.length
					html = html.replace(regex, uploadedUrl)
					console.log(`✅ Replaced ${matches.length} occurrence(s) of ${placeholder}`)
				}
			})
			console.log(`✅ Total assets replaced: ${assetCount}`)

			// Step 2: Replace data field placeholders with actual formData values
			console.log("📝 Replacing data fields...")
			let fieldCount = 0
			Object.entries(template.dataFields).forEach(([placeholder, field]) => {
				if (field.startsWith("formData.")) {
					// Extract the field name
					const fieldName = field.replace("formData.", "") as keyof JobOfferFormData
					let value: string | number | boolean | string[] | undefined = formData[fieldName]

					// Format numbers if needed (converts number to formatted string)
					if (typeof value === "number") {
						value = formatNumbers(value)
					}

					// Convert arrays to comma-separated strings
					if (Array.isArray(value)) {
						value = value.join(", ")
					}

					console.log(`📌 Mapping: ${placeholder} → ${field} = ${value}`)

					// Replace {formData.field} pattern
					const regex1 = new RegExp(`\\{${field.replace(".", "\\.")}\\}`, "g")
					const matches1 = html.match(regex1)
					if (matches1) {
						fieldCount += matches1.length
						html = html.replace(regex1, String(value))
						console.log(`✅ Replaced ${matches1.length} JSX expression(s)`)
					}

					// Replace >placeholder< pattern
					const escapedPlaceholder = placeholder.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
					const regex2 = new RegExp(`>${escapedPlaceholder}<`, "g")
					const matches2 = html.match(regex2)
					if (matches2) {
						fieldCount += matches2.length
						html = html.replace(regex2, `>${value}<`)
						console.log(`✅ Replaced ${matches2.length} text content(s)`)
					}
				} else if (field !== "CUSTOM") {
					// Static value - replace directly
					const escapedPlaceholder = placeholder.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
					const regex = new RegExp(`>${escapedPlaceholder}<`, "g")
					const matches = html.match(regex)
					if (matches) {
						fieldCount += matches.length
						html = html.replace(regex, `>${field}<`)
						console.log(`✅ Replaced ${matches.length} static value(s): ${placeholder} → ${field}`)
					}
				}
			})
			console.log(`✅ Total data fields replaced: ${fieldCount}`)

			// Step 3: Clean up React/Component syntax for rendering
			console.log("🧹 Cleaning up code for rendering...")
			html = html.replace(/import .+;/g, "")
			html = html.replace(/interface .+\{[\s\S]+?\}/g, "")
			html = html.replace(/const CustomTemplate[\s\S]+? = \([\s\S]+?\) => \{/g, "")
			html = html.replace(/return \(/g, "")
			html = html.replace(/\}\s*export default CustomTemplate/g, "")

			// Fix Image components for HTML rendering
			html = html.replace(
				/<Image ([^>]*?)src="([^"]+)"([^>]*?)\/>/g,
				'<img $1src="$2"$3style="object-fit: contain;" />',
			)

			// Convert className to class for HTML
			html = html.replace(/className=/g, "class=")

			// Remove React-specific props
			html = html.replace(/srcSet="[^"]*"/g, "")
			html = html.replace(/fill(?==)/g, "")

			console.log("✅ Template rendering complete!")
			console.log("📄 Final HTML length:", html.length, "characters")

			return html
		} catch (error) {
			console.error("❌ Error rendering template:", error)
			return `<div class="text-red-500">خطأ في عرض القالب: ${error instanceof Error ? error.message : "خطأ غير معروف"}</div>`
		}
	}, [template, formData])

	useEffect(() => {
		console.log("🔍 CustomTemplateRenderer mounted")
		console.log("Template ID:", template.id)
		console.log("Template name:", template.name)
	}, [template])

	return (
		<div className="page font-8-sans text-[14pt] font-light" dir="rtl">
			<div dangerouslySetInnerHTML={{ __html: renderedHTML }} />
			<PageFooter />
		</div>
	)
}

export default CustomTemplateRenderer
