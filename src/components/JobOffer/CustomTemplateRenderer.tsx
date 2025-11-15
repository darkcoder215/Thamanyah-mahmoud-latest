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

const convertStyleObjectToString = (styleStr: string): string => {
	try {
		// Remove the style={{ and }} wrapper
		const cleaned = styleStr.replace(/^style=\{\{/, '').replace(/\}\}$/, '')

		// Split by commas (but not commas inside quotes)
		const properties = []
		let current = ''
		let inQuotes = false

		for (let i = 0; i < cleaned.length; i++) {
			const char = cleaned[i]
			if (char === "'" || char === '"') {
				inQuotes = !inQuotes
			}
			if (char === ',' && !inQuotes) {
				properties.push(current.trim())
				current = ''
			} else {
				current += char
			}
		}
		if (current.trim()) {
			properties.push(current.trim())
		}

		// Convert each property
		const cssProperties = properties.map(prop => {
			const [key, ...valueParts] = prop.split(':')
			let value = valueParts.join(':').trim()

			// Remove quotes
			value = value.replace(/^['"]/, '').replace(/['"]$/, '')

			// Convert camelCase to kebab-case
			const cssKey = key.trim().replace(/([A-Z])/g, '-$1').toLowerCase()

			return `${cssKey}: ${value}`
		}).join('; ')

		return `style="${cssProperties}"`
	} catch (error) {
		console.error('Error converting style:', error)
		return styleStr
	}
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
			// Step 1: Replace asset placeholders with uploaded images
			console.log("🖼️ Replacing assets...")
			Object.entries(template.assets).forEach(([placeholder, uploadedUrl]) => {
				html = html.replace(
					new RegExp(`src=["']${placeholder}["']`, "g"),
					`src="${uploadedUrl}"`,
				)
			})

			// Step 2: Replace {formData.field} placeholders with actual values
			console.log("📝 Replacing form data placeholders...")
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

			// Step 3: Convert JSX to HTML
			console.log("🔄 Converting JSX to HTML...")

			// Remove import statements
			html = html.replace(/import\s+.+from\s+['"].+['"];?\s*/g, "")

			// Remove export statements
			html = html.replace(/export\s+(default\s+)?/g, "")

			// Convert className to class
			html = html.replace(/className=/g, "class=")

			// Convert JSX inline styles style={{...}} to HTML style="..."
			html = html.replace(/style=\{\{([^}]+)\}\}/g, (match) => {
				return convertStyleObjectToString(match)
			})

			// Remove self-closing tags that aren't valid HTML
			html = html.replace(/<(\w+)([^>]*?)\s*\/>/g, "<$1$2></$1>")

			// Extract just the JSX return value if it's in a component
			const returnMatch = html.match(/return\s*\(([\s\S]*)\);?\s*\}?\s*$/m)
			if (returnMatch) {
				html = returnMatch[1]
			}

			// Remove any remaining function wrapper
			html = html.replace(/^.*?=>\s*{?\s*/m, "")
			html = html.replace(/^.*?function.*?\{?\s*/m, "")

			console.log("✅ Template rendering complete!")

			return html.trim()
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
