"use client"

import React, { useState, useEffect } from "react"
import { Button, Card, Input, message, Modal, Upload } from "antd"
import { PlusOutlined, EditOutlined, DeleteOutlined, InboxOutlined } from "@ant-design/icons"

const { TextArea } = Input

export interface CustomTemplate {
	id: string
	name: string
	description: string
	htmlCode: string // Simple HTML with {formData.xxx} placeholders
	previewImage?: string // Optional screenshot for preview
	createdAt: string
}

const CustomTemplates: React.FC = () => {
	const [templates, setTemplates] = useState<CustomTemplate[]>([])
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [editingTemplate, setEditingTemplate] = useState<CustomTemplate | null>(null)
	const [formName, setFormName] = useState("")
	const [formDescription, setFormDescription] = useState("")
	const [formHtmlCode, setFormHtmlCode] = useState("")
	const [previewImage, setPreviewImage] = useState("")

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

	const handleSave = () => {
		if (!formName.trim()) {
			message.error("الرجاء إدخال اسم القالب")
			return
		}
		if (!formHtmlCode.trim()) {
			message.error("الرجاء إدخال كود HTML")
			return
		}

		if (editingTemplate) {
			// Update existing
			const updated = templates.map((t) =>
				t.id === editingTemplate.id
					? {
							...t,
							name: formName,
							description: formDescription,
							htmlCode: formHtmlCode,
							previewImage,
					  }
					: t,
			)
			saveTemplates(updated)
			message.success("تم تحديث القالب بنجاح")
		} else {
			// Create new
			const newTemplate: CustomTemplate = {
				id: `template-${Date.now()}`,
				name: formName,
				description: formDescription,
				htmlCode: formHtmlCode,
				previewImage,
				createdAt: new Date().toISOString(),
			}
			saveTemplates([...templates, newTemplate])
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
				const filtered = templates.filter((t) => t.id !== id)
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
		setPreviewImage(template.previewImage || "")
		setIsModalOpen(true)
	}

	const handleCloseModal = () => {
		setIsModalOpen(false)
		setEditingTemplate(null)
		setFormName("")
		setFormDescription("")
		setFormHtmlCode("")
		setPreviewImage("")
	}

	const handleImageUpload = (file: File) => {
		const reader = new FileReader()
		reader.onload = () => {
			setPreviewImage(reader.result as string)
		}
		reader.readAsDataURL(file)
		return false // Prevent auto upload
	}

	return (
		<div className="mx-auto max-w-6xl p-6">
			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-2xl font-bold">القوالب المخصصة</h1>
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
				<ul className="mt-2 list-inside list-disc space-y-1">
					<li>
						اكتب كود HTML بسيط (ليس JSX أو React!)
					</li>
					<li>
						استخدم المتغيرات مثل: <code className="rounded bg-blue-100 px-1">{"{formData.name}"}</code>,{" "}
						<code className="rounded bg-blue-100 px-1">{"{formData.jobTitle}"}</code>,{" "}
						<code className="rounded bg-blue-100 px-1">{"{formData.monthlySalary}"}</code>
					</li>
					<li>سيتم استبدال هذه المتغيرات تلقائيًا بالبيانات الفعلية عند إنشاء العرض</li>
					<li>يمكنك استخدام inline CSS مباشرة: <code className="rounded bg-blue-100 px-1">{`style="color: red; font-size: 20px"`}</code></li>
				</ul>
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
							cover={
								template.previewImage ? (
									<img
										alt={template.name}
										src={template.previewImage}
										className="h-48 object-cover"
									/>
								) : (
									<div className="flex h-48 items-center justify-center bg-gray-100 text-gray-400">
										لا توجد صورة معاينة
									</div>
								)
							}
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
				width={900}
				footer={[
					<Button key="cancel" onClick={handleCloseModal}>
						إلغاء
					</Button>,
					<Button key="save" type="primary" onClick={handleSave}>
						{editingTemplate ? "حفظ التغييرات" : "إنشاء القالب"}
					</Button>,
				]}
			>
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
						<label className="mb-1 block text-sm font-medium">صورة المعاينة (اختياري)</label>
						<Upload
							accept="image/*"
							showUploadList={false}
							beforeUpload={handleImageUpload}
							maxCount={1}
						>
							<Button icon={<InboxOutlined />}>رفع صورة معاينة</Button>
						</Upload>
						{previewImage && (
							<img
								src={previewImage}
								alt="Preview"
								className="mt-2 h-32 rounded border object-cover"
							/>
						)}
					</div>

					<div>
						<label className="mb-1 block text-sm font-medium">كود HTML *</label>
						<div className="mb-2 rounded bg-yellow-50 p-2 text-xs text-yellow-800">
							<strong>مثال:</strong>
							<pre className="mt-1 overflow-auto">
								{`<div style="padding: 20px; background: #f5f5f5;">
  <h1 style="color: #333;">{formData.name}</h1>
  <p>المسمى الوظيفي: {formData.jobTitle}</p>
  <p>الراتب: {formData.monthlySalary} ريال</p>
</div>`}
							</pre>
						</div>
						<TextArea
							value={formHtmlCode}
							onChange={(e) => setFormHtmlCode(e.target.value)}
							placeholder="الصق كود HTML هنا..."
							rows={15}
							style={{ fontFamily: "monospace", fontSize: "13px" }}
						/>
						<p className="mt-1 text-xs text-gray-500">
							عدد الأحرف: {formHtmlCode.length}
						</p>
					</div>
				</div>
			</Modal>
		</div>
	)
}

export default CustomTemplates
