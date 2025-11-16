"use client"

import React, { useState, useEffect } from "react"
import { Button, Card, Input, message, Modal, Steps, Select, Form, Tag, Space, Divider, Tabs } from "antd"
import { PlusOutlined, EditOutlined, DeleteOutlined, ArrowRightOutlined, ArrowLeftOutlined, CodeOutlined, Html5Outlined } from "@ant-design/icons"
import { CustomTemplate, CustomField } from "@/components/JobOffer/CustomTemplateRenderer"
import TailwindTemplateBuilder from "@/components/CustomTemplates/TailwindTemplateBuilder"

const { TextArea } = Input
const { Step } = Steps
const { Option } = Select

// Standard fields available in JobOfferFormData
const STANDARD_FIELDS = [
	{ value: "name", label: "اسم الموظف", type: "text" },
	{ value: "email", label: "البريد الإلكتروني", type: "text" },
	{ value: "jobTitle", label: "المسمى الوظيفي", type: "text" },
	{ value: "jobTitleEn", label: "المسمى الوظيفي (إنجليزي)", type: "text" },
	{ value: "workType", label: "نوع الدوام", type: "text" },
	{ value: "directManager", label: "المدير المباشر", type: "text" },
	{ value: "directManagerJobTitle", label: "مسمى المدير المباشر", type: "text" },
	{ value: "team", label: "الفريق", type: "text" },
	{ value: "department", label: "القسم", type: "text" },
	{ value: "level", label: "المستوى", type: "number" },
	{ value: "monthlySalary", label: "الراتب الشهري", type: "number" },
	{ value: "basicSalary", label: "الراتب الأساسي", type: "number" },
	{ value: "housingAllowance", label: "بدل السكن", type: "number" },
	{ value: "transportAllowance", label: "بدل النقل", type: "number" },
	{ value: "additionalAllowances", label: "بدلات إضافية", type: "number" },
	{ value: "netSalary", label: "صافي الراتب", type: "number" },
	{ value: "managerSignName", label: "اسم المدير الموقع", type: "text" },
	{ value: "contractDuration", label: "مدة العقد", type: "text" },
]

const CustomTemplates: React.FC = () => {
	const [templates, setTemplates] = useState<CustomTemplate[]>([])
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [editingTemplate, setEditingTemplate] = useState<CustomTemplate | null>(null)
	const [currentStep, setCurrentStep] = useState(0)

	// Step 1: Basic info
	const [formName, setFormName] = useState("")
	const [formDescription, setFormDescription] = useState("")
	const [formHtmlCode, setFormHtmlCode] = useState("")
	const [originalWidth, setOriginalWidth] = useState<number>(0)
	const [originalHeight, setOriginalHeight] = useState<number>(0)

	// Step 2: Text mapping
	const [detectedTexts, setDetectedTexts] = useState<string[]>([])
	const [fieldMappings, setFieldMappings] = useState<Record<string, string>>({})
	const [customFields, setCustomFields] = useState<CustomField[]>([])

	// New custom field form
	const [newFieldName, setNewFieldName] = useState("")
	const [newFieldLabel, setNewFieldLabel] = useState("")
	const [newFieldType, setNewFieldType] = useState<"text" | "number">("text")

	// Load templates from localStorage
	useEffect(() => {
		const stored = localStorage.getItem("customTemplates")
		if (stored) {
			try {
				setTemplates(JSON.parse(stored))
			} catch (error) {
				console.error("Error loading templates:", error)
			}
		}
	}, [])

	// Save templates to localStorage
	const saveTemplates = (newTemplates: CustomTemplate[]) => {
		localStorage.setItem("customTemplates", JSON.stringify(newTemplates))
		setTemplates(newTemplates)
	}

	// Auto-detect dimensions from HTML
	const detectDimensions = (html: string): { width: number; height: number } | null => {
		try {
			const parser = new DOMParser()
			const doc = parser.parseFromString(html, 'text/html')
			const firstDiv = doc.body.querySelector('div')

			if (firstDiv) {
				const style = firstDiv.getAttribute('style') || ''

				// Try to extract width and height from inline styles
				const widthMatch = style.match(/width:\s*(\d+(?:\.\d+)?)(px|mm)?/)
				const heightMatch = style.match(/height:\s*(\d+(?:\.\d+)?)(px|mm)?/)

				if (widthMatch && heightMatch) {
					let width = parseFloat(widthMatch[1])
					let height = parseFloat(heightMatch[1])

					// Convert mm to px if needed (1mm ≈ 3.7795px at 96dpi)
					if (widthMatch[2] === 'mm') width = width * 3.7795
					if (heightMatch[2] === 'mm') height = height * 3.7795

					return { width: Math.round(width), height: Math.round(height) }
				}
			}
		} catch (error) {
			console.error("Error detecting dimensions:", error)
		}
		return null
	}

	// Extract text from HTML
	const extractTextFromHTML = (html: string): string[] => {
		const parser = new DOMParser()
		const doc = parser.parseFromString(html, 'text/html')
		const texts: string[] = []

		const walk = (node: Node) => {
			if (node.nodeType === Node.TEXT_NODE) {
				const text = node.textContent?.trim()
				if (text && text.length > 0) {
					texts.push(text)
				}
			} else if (node.nodeType === Node.ELEMENT_NODE) {
				node.childNodes.forEach(walk)
			}
		}

		walk(doc.body)

		// Remove duplicates and filter out very short texts
		return Array.from(new Set(texts)).filter(t => t.length > 1)
	}

	// Smart field suggestion based on text content
	const suggestField = (text: string): string | null => {
		const lowerText = text.toLowerCase()

		// Check for numbers (likely salary)
		if (/^\d{1,3}(,\d{3})*(\.\d+)?$/.test(text) || /\d+/.test(text)) {
			if (text.includes(',') || parseInt(text.replace(/,/g, '')) > 1000) {
				return "monthlySalary"
			}
			return "level"
		}

		// Check for email pattern
		if (/@/.test(text)) {
			return "email"
		}

		// Arabic text patterns
		if (text.includes('مدير') || text.includes('Manager')) {
			if (text.length < 30) return "directManager"
			return "directManagerJobTitle"
		}

		if (text.includes('الفريق') || text.includes('فريق')) {
			return "team"
		}

		if (text.includes('القسم') || text.includes('قسم') || text.includes('إدارة')) {
			return "department"
		}

		// Short Arabic text likely a name
		if (/^[\u0600-\u06FF\s]{2,30}$/.test(text)) {
			return "name"
		}

		// Longer text might be job title
		if (text.length > 5 && text.length < 50) {
			return "jobTitle"
		}

		return null
	}

	const handleAutoDetectDimensions = () => {
		if (!formHtmlCode.trim()) {
			message.warning("الرجاء إدخال كود HTML أولاً")
			return
		}

		const detected = detectDimensions(formHtmlCode)
		if (detected) {
			setOriginalWidth(detected.width)
			setOriginalHeight(detected.height)
			message.success(`تم اكتشاف الأبعاد: ${detected.width}px × ${detected.height}px`)
		} else {
			message.warning("لم يتم العثور على أبعاد في الكود. الرجاء إدخالها يدوياً.")
		}
	}

	const handleStep1Next = () => {
		if (!formName.trim()) {
			message.error("الرجاء إدخال اسم القالب")
			return
		}
		if (!formHtmlCode.trim()) {
			message.error("الرجاء إدخال كود HTML")
			return
		}

		// Auto-detect dimensions if not provided
		if (!originalWidth || !originalHeight) {
			const detected = detectDimensions(formHtmlCode)
			if (detected) {
				setOriginalWidth(detected.width)
				setOriginalHeight(detected.height)
				console.log(`📐 Auto-detected dimensions: ${detected.width}px × ${detected.height}px`)
			}
		}

		// Extract text and auto-suggest mappings
		const texts = extractTextFromHTML(formHtmlCode)
		setDetectedTexts(texts)

		// Auto-suggest field mappings
		const autoMappings: Record<string, string> = {}
		texts.forEach(text => {
			const suggestion = suggestField(text)
			if (suggestion) {
				autoMappings[text] = suggestion
			}
		})
		setFieldMappings(autoMappings)

		setCurrentStep(1)
	}

	const handleFieldMappingChange = (text: string, fieldName: string) => {
		setFieldMappings(prev => ({
			...prev,
			[text]: fieldName
		}))
	}

	const handleAddCustomField = () => {
		if (!newFieldName.trim() || !newFieldLabel.trim()) {
			message.error("الرجاء إدخال اسم الحقل والعنوان")
			return
		}

		// Check if field already exists
		if (STANDARD_FIELDS.some(f => f.value === newFieldName) ||
		    customFields.some(f => f.name === newFieldName)) {
			message.error("هذا الحقل موجود بالفعل")
			return
		}

		const newField: CustomField = {
			name: newFieldName,
			label: newFieldLabel,
			type: newFieldType
		}

		setCustomFields(prev => [...prev, newField])
		message.success(`تم إضافة الحقل "${newFieldLabel}"`)

		// Reset form
		setNewFieldName("")
		setNewFieldLabel("")
		setNewFieldType("text")
	}

	const handleStep2Next = () => {
		// Check if all texts are mapped
		const unmapped = detectedTexts.filter(text => !fieldMappings[text])
		if (unmapped.length > 0) {
			message.warning(`يوجد ${unmapped.length} نص غير مرتبط. يمكنك المتابعة أو ربطهم أولاً.`)
		}

		setCurrentStep(2)
	}

	const handleSave = () => {
		const template: CustomTemplate = {
			id: editingTemplate?.id || `template-${Date.now()}`,
			name: formName,
			description: formDescription,
			htmlCode: formHtmlCode,
			fieldMappings,
			customFields,
			originalWidth: originalWidth || undefined,
			originalHeight: originalHeight || undefined,
			createdAt: editingTemplate?.createdAt || new Date().toISOString(),
		}

		if (editingTemplate) {
			const updated = templates.map(t => t.id === editingTemplate.id ? template : t)
			saveTemplates(updated)
			message.success("تم تحديث القالب بنجاح")
		} else {
			saveTemplates([...templates, template])
			message.success("تم إنشاء القالب بنجاح")
		}

		handleCloseModal()
	}

	const handleDelete = (id: string) => {
		Modal.confirm({
			title: "هل أنت متأكد من حذف هذا القالب؟",
			content: "لا يمكن التراجع عن هذا الإجراء",
			okText: "حذف",
			cancelText: "إلغاء",
			onOk: () => {
				const filtered = templates.filter(t => t.id !== id)
				saveTemplates(filtered)
				message.success("تم حذف القالب بنجاح")
			},
		})
	}

	const handleEdit = (template: CustomTemplate) => {
		setEditingTemplate(template)
		setFormName(template.name)
		setFormDescription(template.description)
		setFormHtmlCode(template.htmlCode)
		setOriginalWidth(template.originalWidth || 0)
		setOriginalHeight(template.originalHeight || 0)
		setFieldMappings(template.fieldMappings || {})
		setCustomFields(template.customFields || [])
		setCurrentStep(0)
		setIsModalOpen(true)
	}

	const handleCloseModal = () => {
		setIsModalOpen(false)
		setEditingTemplate(null)
		setFormName("")
		setFormDescription("")
		setFormHtmlCode("")
		setOriginalWidth(0)
		setOriginalHeight(0)
		setFieldMappings({})
		setCustomFields([])
		setDetectedTexts([])
		setCurrentStep(0)
		setNewFieldName("")
		setNewFieldLabel("")
		setNewFieldType("text")
	}

	const generatePreviewHTML = (): string => {
		let html = formHtmlCode

		console.log("🎨 Generating preview HTML...")
		console.log("📝 Original HTML:", html.substring(0, 500))

		// Replace mapped text with sample values
		const sampleData: Record<string, any> = {
			name: "أحمد محمد",
			email: "ahmed@example.com",
			jobTitle: "مدير محتوى",
			jobTitleEn: "Content Manager",
			workType: "كامل",
			directManager: "علي أحمد",
			directManagerJobTitle: "مدير القسم",
			team: "المحتوى",
			department: "التحرير",
			level: 2,
			monthlySalary: "15,000",
			basicSalary: "8,500",
			housingAllowance: "4,000",
			transportAllowance: "500",
			additionalAllowances: "2,000",
			netSalary: "14,250",
		}

		Object.entries(fieldMappings).forEach(([text, fieldName]) => {
			const value = sampleData[fieldName] || `[${fieldName}]`
			const escapedText = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
			const regex = new RegExp(escapedText, 'g')
			html = html.replace(regex, String(value))
			console.log(`📝 Replacing "${text}" with "${value}"`)
		})

		console.log("✅ Final HTML:", html.substring(0, 500))
		console.log("📊 HTML length:", html.length)

		return html
	}

	return (
		<div className="mx-auto max-w-6xl p-6">
			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-2xl font-bold">القوالب المخصصة</h1>
			</div>

			<Tabs
				defaultActiveKey="tailwind"
				size="large"
				items={[
					{
						key: "tailwind",
						label: (
							<span>
								<CodeOutlined /> Tailwind JSX (Recommended)
							</span>
						),
						children: <TailwindTemplateBuilder />,
					},
					{
						key: "html",
						label: (
							<span>
								<Html5Outlined /> HTML Builder (Legacy)
							</span>
						),
						children: (
							<div>
								<div className="mb-6 flex items-center justify-between">
									<Button
										type="primary"
					icon={<PlusOutlined />}
					onClick={() => setIsModalOpen(true)}
					size="large"
				>
					إنشاء قالب جديد
				</Button>
			</div>

			<div className="mb-4 rounded bg-blue-50 p-4 text-sm text-blue-800">
				<strong>💡 كيف تعمل القوالب المخصصة؟</strong>
				<ol className="mt-2 list-inside list-decimal space-y-1">
					<li>صمم قالبك في Figma بحجم A4 (210mm × 297mm)</li>
					<li>انسخ كود HTML من Figma (Dev Mode → HTML)</li>
					<li>الصق الكود في النموذج</li>
					<li>سيتم اكتشاف كل النصوص تلقائيًا</li>
					<li>اربط كل نص بحقل من البيانات (مثل: الاسم، المسمى الوظيفي، الراتب)</li>
					<li>يمكنك إضافة حقول مخصصة جديدة</li>
					<li>معاينة القالب ثم حفظه</li>
				</ol>
				<div className="mt-3 rounded bg-blue-100 p-2 text-xs">
					<strong>📌 نصائح مهمة:</strong>
					<ul className="mt-1 list-inside list-disc space-y-0.5">
						<li>استخدم نصوص واضحة قابلة للقراءة في التصميم</li>
						<li>تجنب التصاميم المعقدة بطبقات متعددة</li>
						<li>تأكد من أن جميع العناصر مرئية (ليست مخفية أو شفافة)</li>
						<li>اختبر القالب في المعاينة قبل الحفظ</li>
					</ul>
				</div>
			</div>

			{templates.length === 0 ? (
				<Card>
					<div className="py-12 text-center text-gray-500">
						<p className="mb-4">لا توجد قوالب مخصصة بعد</p>
						<Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
							إنشاء أول قالب
						</Button>
					</div>
				</Card>
			) : (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{templates.map((template) => (
						<Card
							key={template.id}
							hoverable
							actions={[
								<Button
									key="edit"
									type="text"
									icon={<EditOutlined />}
									onClick={() => handleEdit(template)}
								>
									تعديل
								</Button>,
								<Button
									key="delete"
									type="text"
									danger
									icon={<DeleteOutlined />}
									onClick={() => handleDelete(template.id)}
								>
									حذف
								</Button>,
							]}
						>
							<Card.Meta
								title={template.name}
								description={
									<div>
										<p className="mb-2 text-xs text-gray-600">{template.description}</p>
										<div className="mb-2">
											<Tag color="blue">{Object.keys(template.fieldMappings || {}).length} نص مربوط</Tag>
											{template.customFields && template.customFields.length > 0 && (
												<Tag color="green">{template.customFields.length} حقل مخصص</Tag>
											)}
										</div>
										<p className="text-xs text-gray-400">
											تم الإنشاء: {new Date(template.createdAt).toLocaleDateString("ar-SA")}
										</p>
									</div>
								}
							/>
						</Card>
					))}
				</div>
			)}

			<Modal
				title={editingTemplate ? "تعديل القالب" : "إنشاء قالب جديد"}
				open={isModalOpen}
				onCancel={handleCloseModal}
				width={1000}
				footer={null}
			>
				<Steps current={currentStep} className="mb-6">
					<Step title="المعلومات الأساسية" />
					<Step title="ربط النصوص" />
					<Step title="المعاينة والحفظ" />
				</Steps>

				{/* Step 1: Basic Info */}
				{currentStep === 0 && (
					<div className="space-y-4">
						<div>
							<label className="mb-1 block text-sm font-medium">اسم القالب *</label>
							<Input
								value={formName}
								onChange={(e) => setFormName(e.target.value)}
								placeholder="مثال: قالب العرض الوظيفي - الأزرق"
								size="large"
							/>
						</div>

						<div>
							<label className="mb-1 block text-sm font-medium">وصف القالب</label>
							<Input
								value={formDescription}
								onChange={(e) => setFormDescription(e.target.value)}
								placeholder="وصف مختصر للقالب"
								size="large"
							/>
						</div>

						<div>
							<label className="mb-1 block text-sm font-medium">كود HTML من Figma *</label>
							<div className="mb-2 rounded bg-yellow-50 p-2 text-xs text-yellow-800">
								<strong>📌 كيفية النسخ من Figma:</strong>
								<ol className="mt-1 list-inside list-decimal space-y-0.5">
									<li>صمم الإطار (Frame) بحجم A4: 210mm × 297mm</li>
									<li>افتح Figma وحدد الإطار</li>
									<li>اضغط على Dev Mode في الأعلى</li>
									<li>اختر "HTML" من القائمة المنسدلة (ليس JSX)</li>
									<li>انسخ الكود والصقه هنا</li>
								</ol>
								<div className="mt-2 rounded bg-yellow-100 p-1.5">
									<strong>⚠️ ملاحظة:</strong> تأكد من نسخ HTML وليس JSX/React
								</div>
							</div>
							<TextArea
								value={formHtmlCode}
								onChange={(e) => setFormHtmlCode(e.target.value)}
								placeholder="الصق كود HTML من Figma هنا..."
								rows={15}
								style={{ fontFamily: "monospace", fontSize: "13px" }}
							/>
							<p className="mt-1 text-xs text-gray-500">
								عدد الأحرف: {formHtmlCode.length}
							</p>
						</div>

						<div>
							<label className="mb-2 block text-sm font-medium">أبعاد الإطار الأصلي (بالبكسل)</label>
							<div className="rounded bg-blue-50 p-3 text-xs text-blue-800">
								<strong>💡 لماذا نحتاج الأبعاد؟</strong>
								<p className="mt-1">
									Figma يستخدم تحديد موضع مطلق (absolute positioning) بناءً على أبعاد الإطار الأصلي.
									لتحقيق عرض دقيق، نحتاج لمعرفة هذه الأبعاد حتى نقوم بالتحجيم الصحيح.
								</p>
								<div className="mt-2 rounded bg-blue-100 p-2">
									<strong>📏 كيف تحصل على الأبعاد من Figma:</strong>
									<ol className="mt-1 list-inside list-decimal space-y-0.5">
										<li>حدد الإطار (Frame) في Figma</li>
										<li>انظر إلى لوحة Design في الجانب الأيمن</li>
										<li>ستجد W (Width) و H (Height)</li>
										<li>أدخل هذه القيم هنا (سيتم التحويل تلقائياً إذا لزم الأمر)</li>
									</ol>
								</div>
							</div>
							<div className="mt-3 grid gap-3 md:grid-cols-2">
								<div>
									<label className="mb-1 block text-xs font-medium">العرض (Width) بالبكسل</label>
									<Input
										type="number"
										value={originalWidth || ""}
										onChange={(e) => setOriginalWidth(parseInt(e.target.value) || 0)}
										placeholder="مثال: 794"
										size="large"
										min={0}
									/>
									<p className="mt-1 text-xs text-gray-500">
										A4 width ≈ 794px (210mm)
									</p>
								</div>
								<div>
									<label className="mb-1 block text-xs font-medium">الارتفاع (Height) بالبكسل</label>
									<Input
										type="number"
										value={originalHeight || ""}
										onChange={(e) => setOriginalHeight(parseInt(e.target.value) || 0)}
										placeholder="مثال: 1123"
										size="large"
										min={0}
									/>
									<p className="mt-1 text-xs text-gray-500">
										A4 height ≈ 1123px (297mm)
									</p>
								</div>
							</div>
							<Button
								type="dashed"
								onClick={handleAutoDetectDimensions}
								size="small"
								className="mt-2"
							>
								🔍 محاولة الكشف التلقائي من الكود
							</Button>
							{originalWidth > 0 && originalHeight > 0 && (
								<div className="mt-2 rounded bg-green-50 p-2 text-xs text-green-800">
									✅ الأبعاد: {originalWidth}px × {originalHeight}px
								</div>
							)}
						</div>

						<div className="flex justify-end gap-2">
							<Button onClick={handleCloseModal}>إلغاء</Button>
							<Button type="primary" icon={<ArrowLeftOutlined />} onClick={handleStep1Next}>
								التالي: ربط النصوص
							</Button>
						</div>
					</div>
				)}

				{/* Step 2: Text Mapping */}
				{currentStep === 1 && (
					<div className="space-y-4">
						<div className="rounded bg-green-50 p-3 text-sm text-green-800">
							<strong>✅ تم اكتشاف {detectedTexts.length} نص في الكود</strong>
							<p className="mt-1">اربط كل نص بحقل من البيانات. تم اقتراح ربط تلقائي ذكي، يمكنك تعديله.</p>
						</div>

						<div className="max-h-96 space-y-3 overflow-y-auto rounded border p-4">
							{detectedTexts.map((text, index) => (
								<div key={index} className="flex items-start gap-3 rounded border bg-gray-50 p-3">
									<div className="flex-1">
										<div className="mb-1 text-xs font-medium text-gray-500">النص المكتشف:</div>
										<div className="rounded bg-white p-2 text-sm">{text}</div>
									</div>
									<div className="flex-1">
										<div className="mb-1 text-xs font-medium text-gray-500">ربط بحقل:</div>
										<Select
											value={fieldMappings[text]}
											onChange={(value) => handleFieldMappingChange(text, value)}
											placeholder="اختر حقل..."
											style={{ width: "100%" }}
											allowClear
										>
											<Option value="">لا تربط هذا النص</Option>
											<Select.OptGroup label="الحقول القياسية">
												{STANDARD_FIELDS.map(field => (
													<Option key={field.value} value={field.value}>
														{field.label}
													</Option>
												))}
											</Select.OptGroup>
											{customFields.length > 0 && (
												<Select.OptGroup label="الحقول المخصصة">
													{customFields.map(field => (
														<Option key={field.name} value={field.name}>
															{field.label} (مخصص)
														</Option>
													))}
												</Select.OptGroup>
											)}
										</Select>
									</div>
								</div>
							))}
						</div>

						<Divider>إضافة حقل مخصص جديد</Divider>

						<div className="rounded border bg-blue-50 p-4">
							<p className="mb-3 text-sm text-blue-800">
								إذا لم تجد الحقل المناسب، يمكنك إنشاء حقل مخصص جديد
							</p>
							<div className="grid gap-3 md:grid-cols-3">
								<div>
									<label className="mb-1 block text-xs font-medium">اسم الحقل (إنجليزي)</label>
									<Input
										value={newFieldName}
										onChange={(e) => setNewFieldName(e.target.value)}
										placeholder="companyName"
										size="small"
									/>
								</div>
								<div>
									<label className="mb-1 block text-xs font-medium">العنوان (عربي)</label>
									<Input
										value={newFieldLabel}
										onChange={(e) => setNewFieldLabel(e.target.value)}
										placeholder="اسم الشركة"
										size="small"
									/>
								</div>
								<div>
									<label className="mb-1 block text-xs font-medium">النوع</label>
									<Select
										value={newFieldType}
										onChange={(value) => setNewFieldType(value)}
										size="small"
										style={{ width: "100%" }}
									>
										<Option value="text">نص</Option>
										<Option value="number">رقم</Option>
									</Select>
								</div>
							</div>
							<Button
								type="dashed"
								icon={<PlusOutlined />}
								onClick={handleAddCustomField}
								size="small"
								className="mt-3"
							>
								إضافة الحقل
							</Button>

							{customFields.length > 0 && (
								<div className="mt-3">
									<div className="text-xs font-medium text-gray-600">الحقول المخصصة المضافة:</div>
									<Space wrap className="mt-2">
										{customFields.map(field => (
											<Tag
												key={field.name}
												color="green"
												closable
												onClose={() => setCustomFields(prev => prev.filter(f => f.name !== field.name))}
											>
												{field.label} ({field.type})
											</Tag>
										))}
									</Space>
								</div>
							)}
						</div>

						<div className="flex justify-between">
							<Button icon={<ArrowRightOutlined />} onClick={() => setCurrentStep(0)}>
								السابق
							</Button>
							<Button type="primary" icon={<ArrowLeftOutlined />} onClick={handleStep2Next}>
								التالي: المعاينة
							</Button>
						</div>
					</div>
				)}

				{/* Step 3: Preview */}
				{currentStep === 2 && (
					<div className="space-y-4">
						<div className="rounded bg-blue-50 p-3 text-sm text-blue-800">
							<strong>👁️ معاينة القالب</strong>
							<p className="mt-1">هذه معاينة بيانات تجريبية. سيتم استبدالها بالبيانات الفعلية عند الاستخدام.</p>
							<p className="mt-1 text-xs">
								💡 نصيحة: افتح وحدة التحكم في المتصفح (F12) لرؤية سجلات التصحيح التفصيلية
							</p>
						</div>

						<div className="rounded bg-yellow-50 p-3 text-xs text-yellow-800">
							<strong>⚠️ إذا كانت المعاينة فارغة أو غير صحيحة:</strong>
							<ul className="mt-1 list-inside list-disc space-y-1">
								<li>تأكد من أن كود HTML يحتوي على محتوى مرئي (نصوص، عناصر)</li>
								<li>تحقق من أن العناصر لديها أبعاد (width, height) في الـ styles</li>
								<li>تجنب استخدام position: absolute من Figma - قد يتسبب في مشاكل</li>
								<li>تأكد من أن الخطوط والألوان واضحة</li>
								<li>افحص HTML الخام أدناه وافتح وحدة التحكم (F12)</li>
								<li>القالب سيكون بحجم A4 (210mm × 297mm) مع padding</li>
							</ul>
						</div>

						<div>
							<div className="mb-2 text-sm font-medium">معاينة مرئية:</div>
							{originalWidth > 0 && originalHeight > 0 && (
								<div className="mb-2 rounded bg-purple-50 p-2 text-xs text-purple-800">
									📐 سيتم عرض القالب بأبعاد {originalWidth}px × {originalHeight}px مع التحجيم التلقائي ليناسب صفحة A4
								</div>
							)}
							<div className="overflow-auto rounded border-2 border-blue-500 bg-white" style={{ maxHeight: "800px" }}>
								<div className="page font-8-sans text-[14pt] font-light" dir="rtl">
									<div
										className="figma-content"
										style={(() => {
											if (!originalWidth || !originalHeight) {
												return {}
											}

											const pageWidthPx = 210 * 3.7795
											const pageHeightPx = 297 * 3.7795
											const paddingInlinePx = 42
											const paddingVerticalPx = 120

											const availableWidth = pageWidthPx - (paddingInlinePx * 2)
											const availableHeight = pageHeightPx - (paddingVerticalPx * 2)

											const scaleX = availableWidth / originalWidth
											const scaleY = availableHeight / originalHeight
											const scale = Math.min(scaleX, scaleY, 1)

											return {
												width: `${originalWidth}px`,
												height: `${originalHeight}px`,
												transform: `scale(${scale})`,
												transformOrigin: 'top right',
											}
										})()}
										dangerouslySetInnerHTML={{ __html: generatePreviewHTML() }}
									/>
								</div>
							</div>
						</div>

						<details className="rounded border bg-gray-50 p-3">
							<summary className="cursor-pointer text-sm font-medium text-gray-700">
								🔍 عرض HTML الخام (للتطوير)
							</summary>
							<pre className="mt-2 max-h-64 overflow-auto rounded bg-gray-100 p-3 text-xs">
								{generatePreviewHTML()}
							</pre>
						</details>

						<div className="rounded bg-gray-50 p-3">
							<div className="text-xs font-medium text-gray-600">ملخص القالب:</div>
							<ul className="mt-2 list-inside list-disc text-sm text-gray-700">
								<li>{Object.keys(fieldMappings).length} نص مربوط بحقول البيانات</li>
								<li>{customFields.length} حقل مخصص جديد</li>
								<li>{detectedTexts.length - Object.keys(fieldMappings).length} نص غير مربوط (سيبقى كما هو)</li>
								{originalWidth > 0 && originalHeight > 0 && (
									<li>الأبعاد الأصلية: {originalWidth}px × {originalHeight}px</li>
								)}
								<li>طول HTML النهائي: {generatePreviewHTML().length} حرف</li>
							</ul>
						</div>

						<div className="flex justify-between">
							<Button icon={<ArrowRightOutlined />} onClick={() => setCurrentStep(1)}>
								السابق
							</Button>
							<Button type="primary" onClick={handleSave}>
								{editingTemplate ? "حفظ التغييرات" : "إنشاء القالب"}
							</Button>
						</div>
					</div>
				)}
			</Modal>
							</div>
						),
					},
				]}
			/>
		</div>
	)
}

export default CustomTemplates
