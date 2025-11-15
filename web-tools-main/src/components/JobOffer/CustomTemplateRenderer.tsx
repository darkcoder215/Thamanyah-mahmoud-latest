"use client"

import React, { useMemo } from "react"
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
		let html = template.convertedCode

		// Replace asset placeholders with actual uploaded assets
		Object.entries(template.assets).forEach(([placeholder, uploadedUrl]) => {
			html = html.replace(new RegExp(placeholder, "g"), uploadedUrl)
		})

		// Replace data field placeholders with actual formData values
		Object.entries(template.dataFields).forEach(([placeholder, field]) => {
			if (field.startsWith("formData.")) {
				// Extract the field name
				const fieldName = field.replace("formData.", "") as keyof JobOfferFormData
				let value = formData[fieldName]

				// Format numbers if needed
				if (typeof value === "number") {
					value = formatNumbers(value) as typeof value
				}

				// Replace placeholder with actual value
				const regex = new RegExp(`>{${field}}<`, "g")
				html = html.replace(regex, `>${value}<`)

				// Also replace without curly braces for backward compatibility
				const regex2 = new RegExp(`>${placeholder}<`, "g")
				html = html.replace(regex2, `>${value}<`)
			} else {
				// Static value - replace directly
				html = html.replace(new RegExp(`>${placeholder}<`, "g"), `>${field}<`)
			}
		})

		// Clean up React/Component syntax for rendering
		html = html.replace(/import .+;/g, "")
		html = html.replace(/interface .+\{[^}]+\}/gs, "")
		html = html.replace(/const CustomTemplate.+ = \(.+\) => \{/gs, "")
		html = html.replace(/return \(/g, "")
		html = html.replace(/\}\s*export default CustomTemplate/gs, "")
		html = html.replace(/<Image /g, "<img ")
		html = html.replace(/className=/g, "class=")
		html = html.replace(/srcSet/g, "")
		html = html.replace(/fill/g, "")

		return html
	}, [template, formData])

	return (
		<div className="page font-8-sans text-[14pt] font-light">
			<div dangerouslySetInnerHTML={{ __html: renderedHTML }} />
			<PageFooter />
		</div>
	)
}

export default CustomTemplateRenderer
