"use client"

import React, { useState } from "react"
import { Input, Button, Upload, message, Steps, Card, Select, InputNumber, Space, Tag, Divider } from "antd"
import { UploadOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons"
import type { UploadFile } from "antd"

const { TextArea } = Input

interface TextStyle {
	name: string
	classes: string[]
}

interface ColorStyle {
	name: string
	hex: string
}

interface TextElement {
	id: string
	content: string
	styleIndex: number
	x: number
	y: number
	mappedField: string
	pageNumber: number
}

interface BackgroundPage {
	pageNumber: number
	imageUrl: string
}

/**
 * منشئ القوالب المخصصة بتقنية Tailwind
 *
 * سير العمل:
 * 1. استيراد خلفية التصميم (بدون نصوص) وتحديد عدد الصفحات
 * 2. إدخال أنماط النصوص من Figma
 * 3. إدخال أنماط الألوان من Figma
 * 4. إضافة عناصر النص على الخلفية
 * 5. ربط الحقول بالبيانات
 * 6. المعاينة والحفظ
 */
export default function TailwindTemplateBuilder() {
	const [currentStep, setCurrentStep] = useState(0)

	// JSX Import
	const [jsxCode, setJsxCode] = useState("")
	const [importMode, setImportMode] = useState<"jsx" | "manual" | null>(null)

	// Step 1: Background and pages
	const [numberOfPages, setNumberOfPages] = useState(1)
	const [backgroundPages, setBackgroundPages] = useState<BackgroundPage[]>([])

	// Step 2: Text styles
	const [textStylesInput, setTextStylesInput] = useState("")
	const [textStyles, setTextStyles] = useState<TextStyle[]>([])

	// Step 3: Color styles
	const [colorStylesInput, setColorStylesInput] = useState("")
	const [colorStyles, setColorStyles] = useState<ColorStyle[]>([])

	// Step 4: Text elements
	const [textElements, setTextElements] = useState<TextElement[]>([])
	const [selectedPage, setSelectedPage] = useState(1)

	// Step 5: Template info
	const [templateName, setTemplateName] = useState("")

	// Parse text styles from Figma format
	const parseTextStyles = () => {
		try {
			const blocks = textStylesInput.split("---").filter(b => b.trim())
			const parsed: TextStyle[] = []

			blocks.forEach((block) => {
				const lines = block.trim().split("\n").filter(l => l.trim())
				if (lines.length === 0) return

				// First line is the name (starts with //)
				const nameLine = lines.find(l => l.startsWith("//"))
				const name = nameLine ? nameLine.replace("//", "").trim() : "بدون اسم"

				// Rest are classes
				const classes = lines.filter(l => !l.startsWith("//")).map(l => l.trim())

				parsed.push({ name, classes })
			})

			setTextStyles(parsed)
			message.success(`تم استيراد ${parsed.length} نمط نص بنجاح`)
			setCurrentStep(2)
		} catch (error) {
			message.error("خطأ في تحليل أنماط النصوص. تأكد من التنسيق الصحيح")
		}
	}

	// Parse color styles from Figma format
	const parseColorStyles = () => {
		try {
			const lines = colorStylesInput.split("\n").filter(l => l.trim())
			const parsed: ColorStyle[] = []

			lines.forEach((line, index) => {
				const match = line.match(/([0-9A-Fa-f]{6});\s*\/\/\s*(.*)/)
				if (match) {
					const hex = match[1]
					const name = match[2].trim() || `لون ${index + 1}`
					parsed.push({ name, hex })
				}
			})

			setColorStyles(parsed)
			message.success(`تم استيراد ${parsed.length} لون بنجاح`)
			setCurrentStep(3)
		} catch (error) {
			message.error("خطأ في تحليل أنماط الألوان. تأكد من التنسيق الصحيح")
		}
	}

	// Parse JSX code to extract text elements with positions
	const parseJSXCode = () => {
		try {
			const elements: TextElement[] = []
			const stylesMap = new Map<string, number>()
			const newStyles: TextStyle[] = []

			// Extract all div elements with text content
			const divRegex = /<div\s+className="([^"]+)"[^>]*>([^<]+)<\/div>/g
			let match

			while ((match = divRegex.exec(jsxCode)) !== null) {
				const className = match[1]
				const textContent = match[2].trim()

				// Skip if no text content or just whitespace/emojis
				if (!textContent || textContent.length === 0) continue
				if (/^[\s👋🏻]+$/.test(textContent)) continue

				// Extract position from className
				const leftMatch = className.match(/left-\[(\d+)px\]/)
				const topMatch = className.match(/top-\[(\d+)px\]/)

				if (!leftMatch || !topMatch) continue

				const x = parseInt(leftMatch[1])
				const y = parseInt(topMatch[1])

				// Extract text style classes (all classes related to text appearance)
				const classes = className.split(/\s+/).filter(cls =>
					cls.startsWith('text-') ||
					cls.startsWith('font-') ||
					cls.startsWith('leading-') ||
					cls.startsWith('tracking-') ||
					cls.startsWith('justify-')
				)

				const classesKey = classes.join(' ')

				// Find or create style index
				let styleIndex = stylesMap.get(classesKey)
				if (styleIndex === undefined) {
					styleIndex = newStyles.length
					stylesMap.set(classesKey, styleIndex)
					newStyles.push({
						name: textContent.substring(0, 20) + (textContent.length > 20 ? '...' : ''),
						classes: classes
					})
				}

				elements.push({
					id: `text-${Date.now()}-${elements.length}`,
					content: textContent,
					styleIndex: styleIndex,
					x: x,
					y: y,
					mappedField: "",
					pageNumber: 1
				})
			}

			if (elements.length === 0) {
				message.warning("لم يتم العثور على عناصر نصية في الكود. تأكد من تنسيق JSX الصحيح")
				return
			}

			setTextElements(elements)
			setTextStyles(newStyles)
			message.success(`تم استخراج ${elements.length} عنصر نصي بنجاح!`)

			// Auto-advance to next step
			setCurrentStep(1)
		} catch (error) {
			console.error("JSX parsing error:", error)
			message.error("خطأ في تحليل كود JSX. تأكد من التنسيق الصحيح")
		}
	}

	// Handle background upload for each page
	const handleBackgroundUpload = (file: File, pageNumber: number) => {
		const reader = new FileReader()
		reader.onload = (e) => {
			const newPages = [...backgroundPages]
			const existingIndex = newPages.findIndex(p => p.pageNumber === pageNumber)

			if (existingIndex >= 0) {
				newPages[existingIndex].imageUrl = e.target?.result as string
			} else {
				newPages.push({
					pageNumber,
					imageUrl: e.target?.result as string
				})
			}

			setBackgroundPages(newPages.sort((a, b) => a.pageNumber - b.pageNumber))
			message.success(`تم رفع خلفية الصفحة ${pageNumber}`)
		}
		reader.readAsDataURL(file)
		return false
	}

	// Add new text element
	const addTextElement = () => {
		const newElement: TextElement = {
			id: `text-${Date.now()}`,
			content: "نص جديد",
			styleIndex: 0,
			x: 50,
			y: 50,
			mappedField: "",
			pageNumber: selectedPage
		}
		setTextElements([...textElements, newElement])
	}

	// Update text element
	const updateTextElement = (id: string, updates: Partial<TextElement>) => {
		setTextElements(elements =>
			elements.map(el => el.id === id ? { ...el, ...updates } : el)
		)
	}

	// Delete text element
	const deleteTextElement = (id: string) => {
		setTextElements(elements => elements.filter(el => el.id !== id))
	}

	// Available form fields
	const availableFields = [
		{ value: "", label: "لا تربط (نص ثابت)" },
		{ value: "formData.name", label: "الاسم" },
		{ value: "formData.jobTitle", label: "المسمى الوظيفي" },
		{ value: "formData.department", label: "القسم" },
		{ value: "formData.team", label: "الفريق" },
		{ value: "formData.directManager", label: "المدير المباشر" },
		{ value: "formData.workType", label: "نوع الدوام" },
		{ value: "formData.contractCity", label: "مدينة التعاقد" },
		{ value: "formData.level", label: "المستوى" },
		{ value: "formData.monthlySalary", label: "الراتب الشهري" },
		{ value: "formData.basicSalary", label: "الراتب الأساسي" },
		{ value: "formData.housingAllowance", label: "بدل السكن" },
		{ value: "formData.transportAllowance", label: "بدل النقل" },
	]

	// Generate component code
	const generateComponentCode = () => {
		const componentName = templateName.replace(/\s+/g, "")

		let code = `"use client"\n\nimport React from "react"\nimport { type JobOfferFormData } from "../Form/JobOfferFormTypes"\n\n`

		// Add text styles as CSS classes
		code += `const styles = {\n`
		textStyles.forEach((style, idx) => {
			const className = style.classes
				.join(" ")
				.replace(/font-\['Thmanyah_sans[^']*'\]/g, "font-8-sans")
				.replace(/font-\['Thmanyah_serif_display[^']*'\]/g, "font-8-display")
				.replace(/font-\['Thmanyah_serif[^']*'\]/g, "font-8-serif")
			code += `  style${idx}: "${className}",\n`
		})
		code += `}\n\n`

		code += `interface ${componentName}Props {\n  formData: JobOfferFormData\n  editMode?: boolean\n}\n\n`

		code += `export default function ${componentName}({ formData, editMode = false }: ${componentName}Props) {\n`
		code += `  return (\n    <div className="template-container">\n`

		// Generate pages
		backgroundPages.forEach(page => {
			code += `      {/* صفحة ${page.pageNumber} */}\n`
			code += `      <div className="page-v2 relative" style={{ backgroundImage: 'url(${page.imageUrl})', backgroundSize: 'cover' }}>\n`

			// Add text elements for this page
			const pageElements = textElements.filter(el => el.pageNumber === page.pageNumber)
			pageElements.forEach(el => {
				const content = el.mappedField ? `{${el.mappedField}}` : `"${el.content}"`
				code += `        <div className={styles.style${el.styleIndex}} style={{ position: 'absolute', left: '${el.x}px', top: '${el.y}px' }}>\n`
				code += `          ${content}\n`
				code += `        </div>\n`
			})

			code += `      </div>\n\n`
		})

		code += `    </div>\n  )\n}\n`

		return code
	}

	// Save template
	const saveTemplate = () => {
		if (!templateName.trim()) {
			message.error("الرجاء إدخال اسم القالب")
			return
		}

		const template = {
			name: templateName,
			numberOfPages,
			backgroundPages,
			textStyles,
			colorStyles,
			textElements,
			createdAt: new Date().toISOString()
		}

		localStorage.setItem(`custom-template-${templateName}`, JSON.stringify(template))

		const code = generateComponentCode()
		console.log("Generated code:", code)

		message.success(`تم حفظ القالب "${templateName}" بنجاح`)

		// Show code modal or download
		const blob = new Blob([code], { type: 'text/plain' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = `${templateName}.tsx`
		a.click()
	}

	return (
		<div style={{ padding: 24 }}>
			{/* Initial mode selection */}
			{importMode === null && (
				<Card title="اختر طريقة إنشاء القالب">
					<div style={{ display: 'flex', gap: 16, justifyContent: 'center', padding: 24 }}>
						<Card
							hoverable
							style={{ width: 300, textAlign: 'center' }}
							onClick={() => setImportMode("jsx")}
						>
							<div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
							<h3>استيراد كود Tailwind JSX</h3>
							<p style={{ color: '#666', fontSize: 13 }}>
								الصق كود JSX من Figma مباشرة<br/>
								سيتم استخراج المواضع والأنماط تلقائياً
							</p>
							<div style={{ marginTop: 16, padding: 8, background: '#e6f7ff', borderRadius: 4, fontSize: 12 }}>
								⚡ أسرع وأسهل
							</div>
						</Card>

						<Card
							hoverable
							style={{ width: 300, textAlign: 'center' }}
							onClick={() => {
								setImportMode("manual")
								setCurrentStep(0)
							}}
						>
							<div style={{ fontSize: 48, marginBottom: 16 }}>🎨</div>
							<h3>طريقة يدوية</h3>
							<p style={{ color: '#666', fontSize: 13 }}>
								رفع خلفية + إضافة النصوص يدوياً<br/>
								تحكم كامل في كل عنصر
							</p>
							<div style={{ marginTop: 16, padding: 8, background: '#fff7e6', borderRadius: 4, fontSize: 12 }}>
								🎯 تحكم كامل
							</div>
						</Card>
					</div>
				</Card>
			)}

			{/* JSX Import Mode */}
			{importMode === "jsx" && currentStep === 0 && (
				<Card title="استيراد كود Tailwind JSX">
					<div style={{ marginBottom: 16, padding: 12, background: '#e6f7ff', borderRadius: 4 }}>
						<strong>📋 كيفية الحصول على كود JSX من Figma:</strong>
						<ol style={{ marginTop: 8, marginBottom: 0, paddingRight: 20 }}>
							<li>افتح Figma وحدد الإطار (Frame)</li>
							<li>اضغط على <strong>Dev Mode</strong> في الأعلى</li>
							<li>من القائمة المنسدلة، اختر <strong>Tailwind CSS</strong></li>
							<li>انسخ الكود كاملاً والصقه أدناه</li>
						</ol>
					</div>

					<TextArea
						value={jsxCode}
						onChange={(e) => setJsxCode(e.target.value)}
						placeholder='<div className="w-[595px] h-[842px]">
  <div className="left-[261px] top-[238px] absolute text-black">مدير محتوى</div>
  ...
</div>'
						rows={20}
						style={{ fontFamily: "monospace", fontSize: 12, marginBottom: 16 }}
					/>

					<div style={{ marginBottom: 16, padding: 12, background: '#fff7e6', borderRadius: 4 }}>
						<strong>💡 ما الذي سيحدث:</strong>
						<ul style={{ marginTop: 8, marginBottom: 0, paddingRight: 20 }}>
							<li>سيتم استخراج جميع النصوص تلقائياً</li>
							<li>سيتم قراءة المواضع من <code>left-[XXpx]</code> و <code>top-[XXpx]</code></li>
							<li>سيتم تجميع الأنماط المتشابهة</li>
							<li>ستحتاج فقط لرفع الخلفية وربط الحقول</li>
						</ul>
					</div>

					<Space>
						<Button onClick={() => setImportMode(null)}>
							← العودة
						</Button>
						<Button
							type="primary"
							size="large"
							onClick={parseJSXCode}
							disabled={!jsxCode.trim()}
						>
							تحليل واستخراج النصوص →
						</Button>
					</Space>
				</Card>
			)}

			{/* Show steps only after mode is selected and not on initial JSX import step */}
			{importMode !== null && !(importMode === "jsx" && currentStep === 0) && (
				<Steps
					current={importMode === "jsx" ? currentStep - 1 : currentStep}
					items={
						importMode === "jsx"
							? [
									{ title: "الخلفية" },
									{ title: "ربط الحقول" },
									{ title: "الحفظ" },
							  ]
							: [
									{ title: "الخلفية" },
									{ title: "أنماط النصوص" },
									{ title: "أنماط الألوان" },
									{ title: "عناصر النص" },
									{ title: "ربط الحقول" },
									{ title: "الحفظ" },
							  ]
					}
					style={{ marginBottom: 32 }}
				/>
			)}

			{/* Step 0: Upload Background (for manual mode) */}
			{importMode === "manual" && currentStep === 0 && (
				<Card title="الخطوة 1: استيراد خلفية التصميم">
					<div style={{ marginBottom: 24 }}>
						<label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
							عدد الصفحات في القالب
						</label>
						<InputNumber
							min={1}
							max={10}
							value={numberOfPages}
							onChange={(val) => setNumberOfPages(val || 1)}
							style={{ width: 200 }}
						/>
						<div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
							كم صفحة في قالب العرض الوظيفي؟ (عادة 1-3 صفحات)
						</div>
					</div>

					<Divider />

					<div style={{ marginBottom: 16 }}>
						<strong>📤 رفع خلفيات الصفحات</strong>
						<div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
							قم بتصدير التصميم من Figma <strong>بدون النصوص</strong> (فقط الخلفية والأشكال والألوان)
						</div>
					</div>

					{Array.from({ length: numberOfPages }, (_, i) => i + 1).map(pageNum => {
						const uploaded = backgroundPages.find(p => p.pageNumber === pageNum)
						return (
							<div key={pageNum} style={{ marginBottom: 16, padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
								<div style={{ marginBottom: 8 }}>
									<strong>الصفحة {pageNum}</strong>
								</div>
								<Upload
									accept="image/*"
									showUploadList={false}
									beforeUpload={(file) => handleBackgroundUpload(file, pageNum)}
								>
									<Button icon={<UploadOutlined />} type={uploaded ? "default" : "primary"}>
										{uploaded ? "✓ تم الرفع - انقر للتغيير" : "رفع خلفية الصفحة"}
									</Button>
								</Upload>
								{uploaded && (
									<div style={{ marginTop: 8 }}>
										<img src={uploaded.imageUrl} alt={`صفحة ${pageNum}`} style={{ maxWidth: 200, border: '1px solid #ddd' }} />
									</div>
								)}
							</div>
						)
					})}

					<Button
						type="primary"
						size="large"
						onClick={() => setCurrentStep(1)}
						disabled={backgroundPages.length !== numberOfPages}
						style={{ marginTop: 16 }}
					>
						التالي: أنماط النصوص →
					</Button>
				</Card>
			)}

			{/* Step 1 (JSX Mode): Upload Background */}
			{importMode === "jsx" && currentStep === 1 && (
				<Card title="رفع خلفية التصميم">
					<div style={{ marginBottom: 16, padding: 12, background: '#fff7e6', borderRadius: 4 }}>
						<strong>✅ تم استخراج {textElements.length} عنصر نصي بنجاح!</strong>
						<div style={{ marginTop: 8, fontSize: 13 }}>
							الآن ارفع صورة الخلفية (بدون النصوص) لكي تظهر النصوص عليها
						</div>
					</div>

					<div style={{ marginBottom: 16 }}>
						<Upload
							accept="image/*"
							showUploadList={false}
							beforeUpload={(file) => handleBackgroundUpload(file, 1)}
						>
							<Button icon={<UploadOutlined />} type={backgroundPages.length > 0 ? "default" : "primary"} size="large">
								{backgroundPages.length > 0 ? "✓ تم الرفع - انقر للتغيير" : "رفع خلفية التصميم"}
							</Button>
						</Upload>
						{backgroundPages.length > 0 && (
							<div style={{ marginTop: 16 }}>
								<img src={backgroundPages[0].imageUrl} alt="خلفية" style={{ maxWidth: 400, border: '2px solid #1890ff', borderRadius: 8 }} />
							</div>
						)}
					</div>

					<div style={{ marginBottom: 16, padding: 12, background: '#e6f7ff', borderRadius: 4 }}>
						<strong>📊 العناصر المستخرجة:</strong>
						<div style={{ marginTop: 8, maxHeight: 200, overflowY: 'auto' }}>
							{textElements.slice(0, 10).map((el, idx) => (
								<div key={idx} style={{ fontSize: 12, padding: 4, background: '#fff', margin: '4px 0', borderRadius: 4 }}>
									<strong>{el.content}</strong> - الموضع: ({el.x}, {el.y})
								</div>
							))}
							{textElements.length > 10 && (
								<div style={{ fontSize: 12, color: '#666', marginTop: 8 }}>
									... و {textElements.length - 10} عنصر آخر
								</div>
							)}
						</div>
					</div>

					<Space>
						<Button onClick={() => setCurrentStep(0)}>
							← السابق
						</Button>
						<Button
							type="primary"
							size="large"
							onClick={() => setCurrentStep(2)}
							disabled={backgroundPages.length === 0}
						>
							التالي: ربط الحقول →
						</Button>
					</Space>
				</Card>
			)}

			{/* Step 1 (Manual Mode): Text Styles */}
			{importMode === "manual" && currentStep === 1 && (
				<Card title="الخطوة 2: إدخال أنماط النصوص من Figma">
					<div style={{ marginBottom: 16, padding: 12, background: '#e6f7ff', borderRadius: 4 }}>
						<strong>📋 كيفية الحصول على أنماط النصوص من Figma:</strong>
						<ol style={{ marginTop: 8, marginBottom: 0, paddingRight: 20 }}>
							<li>افتح Figma واختر أي نص</li>
							<li>في لوحة الخصائص على اليمين، انقر على "Inspect"</li>
							<li>انسخ كل الأنماط المعروضة (Font, Size, Weight, etc.)</li>
							<li>الصق كل نمط هنا بالتنسيق التالي:</li>
						</ol>
						<pre style={{ marginTop: 8, padding: 8, background: '#fff', fontSize: 11 }}>
{`// اسم النمط أو النص المثالي
text-black
text-sm
font-bold
font-['Thmanyah_sans_1.2']
leading-5
tracking-tight
---`}
						</pre>
						<div style={{ fontSize: 12, color: '#0050b3' }}>
							💡 افصل كل نمط بـ --- على سطر منفصل
						</div>
					</div>

					<TextArea
						value={textStylesInput}
						onChange={(e) => setTextStylesInput(e.target.value)}
						placeholder="الصق أنماط النصوص هنا..."
						rows={20}
						style={{ fontFamily: "monospace", fontSize: 12, marginBottom: 16 }}
					/>

					<Space>
						<Button onClick={() => setCurrentStep(0)}>
							← السابق
						</Button>
						<Button
							type="primary"
							size="large"
							onClick={parseTextStyles}
							disabled={!textStylesInput.trim()}
						>
							تحليل وحفظ الأنماط →
						</Button>
					</Space>

					{textStyles.length > 0 && (
						<div style={{ marginTop: 16 }}>
							<Divider>الأنماط المحفوظة ({textStyles.length})</Divider>
							<Space wrap>
								{textStyles.map((style, idx) => (
									<Tag key={idx} color="blue">{style.name}</Tag>
								))}
							</Space>
						</div>
					)}
				</Card>
			)}

			{/* Step 2: Color Styles */}
			{currentStep === 2 && (
				<Card title="الخطوة 3: إدخال أنماط الألوان من Figma">
					<div style={{ marginBottom: 16, padding: 12, background: '#e6f7ff', borderRadius: 4 }}>
						<strong>🎨 كيفية الحصول على أنماط الألوان من Figma:</strong>
						<ol style={{ marginTop: 8, marginBottom: 0, paddingRight: 20 }}>
							<li>افتح Figma وانتقل إلى لوحة الألوان</li>
							<li>انسخ كل لون بصيغة HEX</li>
							<li>الصق بالتنسيق التالي:</li>
						</ol>
						<pre style={{ marginTop: 8, padding: 8, background: '#fff', fontSize: 11 }}>
{`000000; // أسود
03BB6E; // أخضر
F2EEE4; // بيج`}
						</pre>
					</div>

					<TextArea
						value={colorStylesInput}
						onChange={(e) => setColorStylesInput(e.target.value)}
						placeholder="الصق أنماط الألوان هنا..."
						rows={10}
						style={{ fontFamily: "monospace", fontSize: 12, marginBottom: 16 }}
					/>

					<Space>
						<Button onClick={() => setCurrentStep(1)}>
							← السابق
						</Button>
						<Button
							type="primary"
							size="large"
							onClick={parseColorStyles}
							disabled={!colorStylesInput.trim()}
						>
							تحليل وحفظ الألوان →
						</Button>
					</Space>

					{colorStyles.length > 0 && (
						<div style={{ marginTop: 16 }}>
							<Divider>الألوان المحفوظة ({colorStyles.length})</Divider>
							<Space wrap>
								{colorStyles.map((color, idx) => (
									<Tag key={idx} color={`#${color.hex}`} style={{ color: '#000' }}>
										#{color.hex} {color.name}
									</Tag>
								))}
							</Space>
						</div>
					)}
				</Card>
			)}

			{/* Step 3: Add Text Elements */}
			{currentStep === 3 && (
				<Card title="الخطوة 4: إضافة عناصر النص">
					<div style={{ marginBottom: 16 }}>
						<Space>
							<span>الصفحة:</span>
							<Select value={selectedPage} onChange={setSelectedPage} style={{ width: 120 }}>
								{backgroundPages.map(page => (
									<Select.Option key={page.pageNumber} value={page.pageNumber}>
										صفحة {page.pageNumber}
									</Select.Option>
								))}
							</Select>
							<Button icon={<PlusOutlined />} onClick={addTextElement} type="primary">
								إضافة نص
							</Button>
						</Space>
					</div>

					<div style={{ marginBottom: 24, position: 'relative', display: 'inline-block' }}>
						{/* Background preview */}
						{backgroundPages.find(p => p.pageNumber === selectedPage) && (
							<div style={{ position: 'relative', width: 595, height: 842, border: '2px solid #1890ff' }}>
								<img
									src={backgroundPages.find(p => p.pageNumber === selectedPage)?.imageUrl}
									alt={`صفحة ${selectedPage}`}
									style={{ width: '100%', height: '100%', objectFit: 'cover' }}
								/>
								{/* Overlay text elements */}
								{textElements
									.filter(el => el.pageNumber === selectedPage)
									.map(el => {
										const style = textStyles[el.styleIndex]
										const classes = style?.classes.join(" ") || ""
										return (
											<div
												key={el.id}
												className={classes
													.replace(/font-\['Thmanyah_sans[^']*'\]/g, "font-8-sans")
													.replace(/font-\['Thmanyah_serif_display[^']*'\]/g, "font-8-display")
													.replace(/font-\['Thmanyah_serif[^']*'\]/g, "font-8-serif")
												}
												style={{
													position: 'absolute',
													left: el.x,
													top: el.y,
													cursor: 'move',
													padding: 4,
													background: 'rgba(24, 144, 255, 0.2)',
													border: '1px dashed #1890ff'
												}}
												draggable
												onDragEnd={(e) => {
													const rect = e.currentTarget.parentElement?.getBoundingClientRect()
													if (rect) {
														const newX = e.clientX - rect.left
														const newY = e.clientY - rect.top
														updateTextElement(el.id, { x: newX, y: newY })
													}
												}}
											>
												{el.content}
											</div>
										)
									})}
							</div>
						)}
					</div>

					{/* Text elements list */}
					<Divider>عناصر النص في الصفحة {selectedPage} ({textElements.filter(el => el.pageNumber === selectedPage).length})</Divider>

					{textElements.filter(el => el.pageNumber === selectedPage).map(el => (
						<div key={el.id} style={{ marginBottom: 16, padding: 12, background: '#f5f5f5', borderRadius: 4 }}>
							<Space direction="vertical" style={{ width: '100%' }}>
								<Space>
									<span>النص:</span>
									<Input
										value={el.content}
										onChange={(e) => updateTextElement(el.id, { content: e.target.value })}
										style={{ width: 300 }}
									/>
									<Button icon={<DeleteOutlined />} danger size="small" onClick={() => deleteTextElement(el.id)} />
								</Space>
								<Space>
									<span>النمط:</span>
									<Select
										value={el.styleIndex}
										onChange={(val) => updateTextElement(el.id, { styleIndex: val })}
										style={{ width: 300 }}
									>
										{textStyles.map((style, idx) => (
											<Select.Option key={idx} value={idx}>{style.name}</Select.Option>
										))}
									</Select>
								</Space>
								<Space>
									<span>X:</span>
									<InputNumber value={el.x} onChange={(val) => updateTextElement(el.id, { x: val || 0 })} />
									<span>Y:</span>
									<InputNumber value={el.y} onChange={(val) => updateTextElement(el.id, { y: val || 0 })} />
								</Space>
							</Space>
						</div>
					))}

					<Space style={{ marginTop: 16 }}>
						<Button onClick={() => setCurrentStep(2)}>← السابق</Button>
						<Button type="primary" size="large" onClick={() => setCurrentStep(4)}>
							التالي: ربط الحقول →
						</Button>
					</Space>
				</Card>
			)}

			{/* Step 2 (JSX Mode) / Step 4 (Manual Mode): Map Fields */}
			{((importMode === "jsx" && currentStep === 2) || (importMode === "manual" && currentStep === 4)) && (
				<Card title={importMode === "jsx" ? "ربط عناصر النص بحقول البيانات" : "الخطوة 5: ربط عناصر النص بحقول البيانات"}>
					<div style={{ marginBottom: 16, padding: 12, background: '#fff7e6', borderRadius: 4 }}>
						<strong>🔗 اربط كل عنصر نص بحقل من البيانات</strong>
						<div style={{ marginTop: 4, fontSize: 12 }}>
							اترك "لا تربط" إذا كان النص ثابتاً ولا يتغير (مثل "المسمّى الوظيفي:", "الفريق:")
						</div>
					</div>

					<div style={{ maxHeight: 500, overflowY: 'auto' }}>
						{textElements.map(el => (
							<div key={el.id} style={{ marginBottom: 16, padding: 12, background: '#f5f5f5', borderRadius: 4 }}>
								<div style={{ marginBottom: 8 }}>
									<strong>النص:</strong> "{el.content}" | <strong>الموضع:</strong> ({el.x}, {el.y})
								</div>
								<Select
									value={el.mappedField}
									onChange={(val) => updateTextElement(el.id, { mappedField: val })}
									style={{ width: '100%' }}
								>
									{availableFields.map(field => (
										<Select.Option key={field.value} value={field.value}>
											{field.label}
										</Select.Option>
									))}
								</Select>
							</div>
						))}
					</div>

					<Space style={{ marginTop: 16 }}>
						<Button onClick={() => setCurrentStep(importMode === "jsx" ? 1 : 3)}>← السابق</Button>
						<Button type="primary" size="large" onClick={() => setCurrentStep(importMode === "jsx" ? 3 : 5)}>
							التالي: الحفظ →
						</Button>
					</Space>
				</Card>
			)}

			{/* Step 3 (JSX Mode) / Step 5 (Manual Mode): Save */}
			{((importMode === "jsx" && currentStep === 3) || (importMode === "manual" && currentStep === 5)) && (
				<Card title="الخطوة 6: حفظ القالب">
					<div style={{ marginBottom: 16 }}>
						<label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>
							اسم القالب
						</label>
						<Input
							value={templateName}
							onChange={(e) => setTemplateName(e.target.value)}
							placeholder="مثال: قالب العرض الوظيفي - ثمانية"
							size="large"
						/>
					</div>

					<div style={{ padding: 16, background: '#f0f9ff', borderRadius: 4, marginBottom: 16 }}>
						<strong>📊 ملخص القالب:</strong>
						<ul style={{ marginTop: 8, marginBottom: 0 }}>
							<li>عدد الصفحات: {numberOfPages}</li>
							<li>عدد أنماط النصوص: {textStyles.length}</li>
							<li>عدد الألوان: {colorStyles.length}</li>
							<li>عدد عناصر النص: {textElements.length}</li>
							<li>عدد الحقول المربوطة: {textElements.filter(el => el.mappedField).length}</li>
						</ul>
					</div>

					<Space>
						<Button onClick={() => setCurrentStep(importMode === "jsx" ? 2 : 4)}>← السابق</Button>
						<Button
							type="primary"
							size="large"
							onClick={saveTemplate}
							disabled={!templateName.trim()}
						>
							💾 حفظ وتصدير الكود
						</Button>
					</Space>
				</Card>
			)}
		</div>
	)
}
