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
		setDetectedAssets(detected)

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

		// Step 1: Replace asset placeholders with uploaded images
		Object.entries(assets).forEach(([placeholder, uploadedUrl]) => {
			html = html.replace(new RegExp(`src=["']${placeholder}["']`, "g"), `src="${uploadedUrl}"`)
		})

		// Step 2: Replace formData placeholders with sample data
		const sampleData = {
			name: "أحمد محمد",
			jobTitle: "مدير منتج",
			monthlySalary: "15,000",
			email: "test@example.com",
		}

		Object.entries(sampleData).forEach(([key, value]) => {
			html = html.replace(new RegExp(`\\{formData\\.${key}\\}`, "g"), value)
		})

		// Step 3: Convert JSX to HTML for preview
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
					<div className="mb-4 rounded bg-blue-50 p-3 text-sm text-blue-800">
						<strong>ملاحظة:</strong> هذه معاينة باستخدام بيانات تجريبية. سيتم استبدال
						القيم بالبيانات الفعلية عند الاستخدام.
					</div>

					<div
						className="mb-6 rounded border bg-white p-8"
						style={{ direction: "rtl" }}
						dangerouslySetInnerHTML={{ __html: generatePreviewHTML() }}
					/>

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
