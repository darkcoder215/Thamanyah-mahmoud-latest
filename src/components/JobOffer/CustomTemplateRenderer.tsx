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

const convertJSXStylesToHTML = (html: string): string => {
	let result = html
	let searchStart = 0

	while (true) {
		// Find next occurrence of style={{
		const styleStart = result.indexOf('style={{', searchStart)
		if (styleStart === -1) break

		// Find the matching }} by counting braces
		let braceCount = 0
		let i = styleStart + 7 // Start after 'style={{'
		let foundEnd = false

		for (; i < result.length - 1; i++) {
			if (result[i] === '{') braceCount++
			if (result[i] === '}') {
				if (braceCount === 0 && result[i + 1] === '}') {
					foundEnd = true
					break
				}
				braceCount--
			}
		}

		if (!foundEnd) {
			searchStart = styleStart + 1
			continue
		}

		// Extract the style object content
		const styleContent = result.substring(styleStart + 8, i) // +8 for 'style={{'

		// Convert to CSS string
		const cssString = convertStyleObjectToCSS(styleContent)

		// Replace in result
		const before = result.substring(0, styleStart)
		const after = result.substring(i + 2) // +2 for '}}'
		result = before + `style="${cssString}"` + after

		searchStart = styleStart + cssString.length + 10
	}

	return result
}

const convertStyleObjectToCSS = (styleContent: string): string => {
	try {
		// Split by commas but respect quotes and nested objects
		const properties = []
		let current = ''
		let inQuotes = false
		let quoteChar = ''
		let braceDepth = 0

		for (let i = 0; i < styleContent.length; i++) {
			const char = styleContent[i]

			if ((char === "'" || char === '"') && styleContent[i - 1] !== '\\') {
				if (!inQuotes) {
					inQuotes = true
					quoteChar = char
				} else if (char === quoteChar) {
					inQuotes = false
				}
			}

			if (!inQuotes) {
				if (char === '{') braceDepth++
				if (char === '}') braceDepth--
			}

			if (char === ',' && !inQuotes && braceDepth === 0) {
				if (current.trim()) properties.push(current.trim())
				current = ''
			} else {
				current += char
			}
		}
		if (current.trim()) properties.push(current.trim())

		// Convert each property from JS to CSS
		const cssProperties = properties.map(prop => {
			const colonIndex = prop.indexOf(':')
			if (colonIndex === -1) return ''

			const key = prop.substring(0, colonIndex).trim()
			let value = prop.substring(colonIndex + 1).trim()

			// Remove quotes around values
			value = value.replace(/^['"]/, '').replace(/['"]$/, '')

			// Convert camelCase to kebab-case
			const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()

			return `${cssKey}: ${value}`
		}).filter(Boolean).join('; ')

		return cssProperties
	} catch (error) {
		console.error('Error converting style object:', error)
		return ''
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
			html = convertJSXStylesToHTML(html)

			// Remove self-closing tags that aren't valid HTML (except img, br, hr, input)
			html = html.replace(/<(div|span|p|h1|h2|h3|h4|h5|h6|a|button|section|article|header|footer|nav|main|aside)([^>]*?)\s*\/>/g, "<$1$2></$1>")

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
