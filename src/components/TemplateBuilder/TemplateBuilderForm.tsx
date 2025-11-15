"use client"

import React, { useState } from "react"
import { Button, Form, Input, message, Card, Upload, Modal } from "antd"
import { InboxOutlined } from "@ant-design/icons"

const { TextArea } = Input

export interface CustomTemplate {
	id: string
	name: string
	description: string
	code: string // The JSX/HTML code
	assets: { [placeholder: string]: string } // placeholder URL -> uploaded URL
	createdAt: string
}

const TemplateBuilderForm: React.FC<{
	onSave: (template: CustomTemplate) => void
	onCancel: () => void
}> = ({ onSave, onCancel }) => {
	const [templateName, setTemplateName] = useState("")
	const [templateDescription, setTemplateDescription] = useState("")
	const [code, setCode] = useState("")
	const [assets, setAssets] = useState<{ [key: string]: string }>({})
	const [detectedAssets, setDetectedAssets] = useState<string[]>([])
	const [detectedVariables, setDetectedVariables] = useState<string[]>([])
	const [currentStep, setCurrentStep] = useState<"code" | "assets" | "preview">("code")
	const [form] = Form.useForm()

	const detectAssets = (code: string): string[] => {
		// Find all src="..." and src='...' attributes in the code
		const srcRegex = /src=["'{]([^"'}]+)["'}]/g
		const matches = []
		let match

		while ((match = srcRegex.exec(code)) !== null) {
			const url = match[1]
			// Include ALL src URLs (user can replace placeholder URLs)
			matches.push(url)
		}

		return [...new Set(matches)] // Remove duplicates
	}

	const detectVariables = (code: string): string[] => {
		// Find all {formData.xxx} patterns
		const varRegex = /\{formData\.(\w+)\}/g
		const matches = []
		let match

		while ((match = varRegex.exec(code)) !== null) {
			matches.push(match[1])
		}

		return [...new Set(matches)] // Remove duplicates
	}

	const convertJSXStylesToHTML = (html: string): string => {
		let result = html

		// STEP 1: Convert style={{...}} (proper JSX inline styles)
		let searchStart = 0
		while (true) {
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
			const styleContent = result.substring(styleStart + 8, i)

			// Convert to CSS string
			const cssString = convertStyleObjectToCSS(styleContent)

			// Replace in result
			const before = result.substring(0, styleStart)
			const after = result.substring(i + 2)
			result = before + `style="${cssString}"` + after

			searchStart = styleStart + cssString.length + 10
		}

		// STEP 2: Convert style="..." with JS object syntax (Figma malformed export)
		// Matches: style="color: 'black', fontSize: 10, ..."
		result = result.replace(/style="([^"]*?,.*?)"/g, (match, content) => {
			// Check if it has JS object syntax (contains commas and colons)
			if (content.includes(',') && content.includes(':')) {
				const cssString = convertStyleObjectToCSS(content)
				return `style="${cssString}"`
			}
			return match // Keep as-is if it's already valid CSS
		})

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

			// Properties that need 'px' suffix when numeric
			const needsPxSuffix = ['width', 'height', 'top', 'left', 'right', 'bottom',
				'fontSize', 'letterSpacing', 'lineHeight', 'margin', 'padding',
				'borderRadius', 'gap']

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

				// Add 'px' suffix to numeric values (including decimals) that need it
				// Match integers or decimals: 10, 10.5, -10, -10.5
				if (needsPxSuffix.includes(key) && /^-?\d+(\.\d+)?$/.test(value)) {
					value = value + 'px'
				}

				return `${cssKey}: ${value}`
			}).filter(Boolean).join('; ')

			return cssProperties
		} catch (error) {
			console.error('Error converting style object:', error)
			return ''
		}
	}

	const handleCodeNext = () => {
		if (!templateName.trim()) {
			message.error("الرجاء إدخال اسم القالب")
			return
		}
		if (!code.trim()) {
			message.error("الرجاء إدخال كود القالب")
			return
		}

		const detected = detectAssets(code)
		const variables = detectVariables(code)

		setDetectedAssets(detected)
		setDetectedVariables(variables)

		console.log("🔍 Detected assets:", detected)
		console.log("🔍 Detected variables:", variables)

		if (detected.length > 0) {
			setCurrentStep("assets")
		} else {
			setCurrentStep("preview")
		}
	}

	const handleImageUpload = async (placeholder: string, file: File) => {
		// Convert to base64 for storage
		return new Promise<void>((resolve, reject) => {
			const reader = new FileReader()
			reader.onload = () => {
				setAssets((prev) => ({
					...prev,
					[placeholder]: reader.result as string,
				}))
				resolve()
			}
			reader.onerror = reject
			reader.readAsDataURL(file)
		})
	}

	const handleSaveTemplate = () => {
		const template: CustomTemplate = {
			id: `template-${Date.now()}`,
			name: templateName,
			description: templateDescription,
			code: code,
			assets: assets,
			createdAt: new Date().toISOString(),
		}
		onSave(template)
		message.success("تم حفظ القالب بنجاح!")
	}

	const generatePreviewHTML = (): string => {
		let html = code

		console.log("🎨 Generating preview HTML...")
		console.log("📝 Original code length:", html.length)
		console.log("📝 First 500 chars:", html.substring(0, 500))

		// Step 1: Convert JSX to HTML
		// Remove import statements
		html = html.replace(/import\s+.+from\s+['"].+['"];?\s*/g, "")

		// Remove export statements
		html = html.replace(/export\s+(default\s+)?/g, "")

		// Extract just the JSX return value if it's in a component
		const returnMatch = html.match(/return\s*\(([\s\S]*)\);?\s*\}?\s*$/m)
		if (returnMatch) {
			html = returnMatch[1]
		}

		// Remove any remaining function wrapper
		html = html.replace(/^.*?=>\s*{?\s*/m, "")
		html = html.replace(/^.*?function.*?\{?\s*/m, "")

		// Convert className to class
		html = html.replace(/className=/g, "class=")

		// Convert JSX inline styles style={{...}} to HTML style="..."
		console.log("🔄 Converting JSX styles to HTML...")
		const beforeConversion = html.substring(0, 200)
		html = convertJSXStylesToHTML(html)
		const afterConversion = html.substring(0, 200)
		console.log("📊 Before conversion:", beforeConversion)
		console.log("📊 After conversion:", afterConversion)

		// Remove self-closing tags that aren't valid HTML (except img, br, hr, input)
		html = html.replace(/<(div|span|p|h1|h2|h3|h4|h5|h6|a|button|section|article|header|footer|nav|main|aside)([^>]*?)\s*\/>/g, "<$1$2></$1>")

		// Step 2: Replace asset placeholders with uploaded images
		Object.entries(assets).forEach(([placeholder, uploadedUrl]) => {
			const escapedPlaceholder = placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
			html = html.replace(new RegExp(`src=["']${escapedPlaceholder}["']`, "g"), `src="${uploadedUrl}"`)
		})

		// Step 3: Replace formData placeholders with sample data
		const sampleData: Record<string, string> = {
			name: "أحمد محمد",
			jobTitle: "مدير منتج",
			monthlySalary: "15,000",
			email: "test@example.com",
			company: "شركة تقنية",
			department: "تطوير المنتجات",
			startDate: "2024-01-01",
			salary: "15000",
		}

		detectedVariables.forEach((varName) => {
			const value = sampleData[varName] || `[${varName}]`
			html = html.replace(new RegExp(`\\{formData\\.${varName}\\}`, "g"), value)
		})

		console.log("✅ Preview HTML generated, length:", html.length)

		return html.trim()
	}

	return (
		<div className="mx-auto max-w-6xl p-6">
			<h1 className="mb-6 text-2xl font-bold">إنشاء قالب مخصص</h1>

			{currentStep === "code" && (
				<Card>
					<Form form={form} layout="vertical">
						<Form.Item label="اسم القالب" required>
							<Input
								value={templateName}
								onChange={(e) => setTemplateName(e.target.value)}
								placeholder="مثال: قالب عرض وظيفة - التصميم الأزرق"
								size="large"
							/>
						</Form.Item>

						<Form.Item label="وصف القالب">
							<Input
								value={templateDescription}
								onChange={(e) => setTemplateDescription(e.target.value)}
								placeholder="وصف مختصر للقالب"
								size="large"
							/>
						</Form.Item>

						<Form.Item
							label="كود HTML/JSX"
							required
							help="الصق كود HTML/JSX مباشرة. استخدم {formData.name} للإشارة إلى بيانات النموذج، واستخدم src='placeholder.png' للصور"
						>
							<TextArea
								value={code}
								onChange={(e) => setCode(e.target.value)}
								placeholder={`مثال:
<div className="p-8">
  <img src="logo.png" alt="Logo" />
  <h1>{formData.name}</h1>
  <p>{formData.jobTitle}</p>
  <p>الراتب: {formData.monthlySalary} ريال</p>
</div>`}
								rows={20}
								style={{ fontFamily: "monospace", fontSize: "14px" }}
							/>
						</Form.Item>

						<div className="flex gap-2">
							<Button type="primary" onClick={handleCodeNext} size="large">
								التالي
							</Button>
							<Button onClick={onCancel} size="large">
								إلغاء
							</Button>
						</div>
					</Form>
				</Card>
			)}

			{currentStep === "assets" && (
				<Card title="رفع الصور والأصول">
					<p className="mb-4 text-gray-600">
						تم اكتشاف {detectedAssets.length} صورة/أصل في الكود. يرجى رفع الملفات المطلوبة:
					</p>

					<div className="space-y-4">
						{detectedAssets.map((placeholder) => (
							<div key={placeholder} className="rounded border p-4">
								<div className="mb-2 flex items-center justify-between">
									<code className="text-sm">{placeholder}</code>
									{assets[placeholder] && (
										<span className="text-sm text-green-600">✓ تم الرفع</span>
									)}
								</div>
								<Upload
									accept="image/*"
									showUploadList={false}
									beforeUpload={(file) => {
										handleImageUpload(placeholder, file)
										return false
									}}
								>
									<Button icon={<InboxOutlined />}>
										{assets[placeholder] ? "تغيير الصورة" : "رفع الصورة"}
									</Button>
								</Upload>
								{assets[placeholder] && (
									<img
										src={assets[placeholder]}
										alt={placeholder}
										className="mt-2 h-20 rounded border object-contain"
									/>
								)}
							</div>
						))}
					</div>

					<div className="mt-6 flex gap-2">
						<Button onClick={() => setCurrentStep("code")}>السابق</Button>
						<Button
							type="primary"
							onClick={() => setCurrentStep("preview")}
							disabled={detectedAssets.some((p) => !assets[p])}
						>
							المعاينة
						</Button>
					</div>
				</Card>
			)}

			{currentStep === "preview" && (
				<Card title="معاينة القالب">
					{detectedVariables.length > 0 && (
						<div className="mb-4 rounded bg-green-50 p-3 text-sm text-green-800">
							<strong>المتغيرات المكتشفة:</strong> تم العثور على {detectedVariables.length} متغير
							في القالب:{" "}
							<code className="rounded bg-green-100 px-1">
								{detectedVariables.map(v => `{formData.${v}}`).join(", ")}
							</code>
						</div>
					)}

					<div className="mb-4 rounded bg-blue-50 p-3 text-sm text-blue-800">
						<strong>ملاحظة:</strong> هذه معاينة باستخدام بيانات تجريبية. سيتم استبدال
						القيم بالبيانات الفعلية عند الاستخدام.
					</div>

					<div
						className="mb-6 rounded border bg-white p-8"
						style={{ direction: "rtl", minHeight: "800px" }}
						dangerouslySetInnerHTML={{ __html: generatePreviewHTML() }}
					/>

					{/* Debug info */}
					<details className="mb-4 text-xs text-gray-600">
						<summary className="cursor-pointer">عرض HTML المُحوّل (للتطوير)</summary>
						<pre className="mt-2 max-h-96 overflow-auto rounded bg-gray-100 p-4">
							{generatePreviewHTML()}
						</pre>
					</details>

					<div className="flex gap-2">
						<Button
							onClick={() =>
								setCurrentStep(detectedAssets.length > 0 ? "assets" : "code")
							}
						>
							السابق
						</Button>
						<Button type="primary" onClick={handleSaveTemplate} size="large">
							حفظ القالب
						</Button>
					</div>
				</Card>
			)}
		</div>
	)
}

export default TemplateBuilderForm
