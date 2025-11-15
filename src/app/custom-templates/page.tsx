"use client"

import React, { useState, useEffect } from "react"
import { Button, Card, Modal, Empty, Popconfirm, message } from "antd"
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons"
import TemplateBuilderForm, {
	CustomTemplate,
} from "@/components/TemplateBuilder/TemplateBuilderForm"

const CustomTemplatesPage: React.FC = () => {
	const [templates, setTemplates] = useState<CustomTemplate[]>([])
	const [showBuilder, setShowBuilder] = useState(false)
	const [previewTemplate, setPreviewTemplate] = useState<CustomTemplate | null>(null)

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

	const handleSaveTemplate = (template: CustomTemplate) => {
		const newTemplates = [...templates, template]
		saveTemplates(newTemplates)
		setShowBuilder(false)
		message.success(`تم حفظ القالب "${template.name}" بنجاح!`)
	}

	const handleDeleteTemplate = (id: string) => {
		const newTemplates = templates.filter((t) => t.id !== id)
		saveTemplates(newTemplates)
		message.success("تم حذف القالب")
	}

	const handlePreview = (template: CustomTemplate) => {
		setPreviewTemplate(template)
	}

	return (
		<div className="min-h-screen p-6">
			<div className="mx-auto max-w-7xl">
				<div className="mb-8 flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold">القوالب المخصصة</h1>
						<p className="mt-2 text-gray-600">
							أنشئ قوالب مخصصة من تصاميم Figma واستخدمها في عروض العمل
						</p>
					</div>
					<Button
						type="primary"
						size="large"
						icon={<PlusOutlined />}
						onClick={() => setShowBuilder(true)}
					>
						إنشاء قالب جديد
					</Button>
				</div>

				{templates.length === 0 ? (
					<Card>
						<Empty
							description={
								<div>
									<p className="mb-2 text-lg">لا توجد قوالب مخصصة بعد</p>
									<p className="text-gray-600">
										ابدأ بإنشاء قالبك الأول من تصميم Figma
									</p>
								</div>
							}
						>
							<Button
								type="primary"
								icon={<PlusOutlined />}
								onClick={() => setShowBuilder(true)}
							>
								إنشاء قالب جديد
							</Button>
						</Empty>
					</Card>
				) : (
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
						{templates.map((template) => (
							<Card
								key={template.id}
								title={template.name}
								extra={
									<div className="flex gap-2">
										<Button
											type="text"
											size="small"
											icon={<EyeOutlined />}
											onClick={() => handlePreview(template)}
										/>
										<Popconfirm
											title="هل أنت متأكد من حذف هذا القالب؟"
											onConfirm={() => handleDeleteTemplate(template.id)}
											okText="نعم"
											cancelText="لا"
										>
											<Button
												type="text"
												size="small"
												danger
												icon={<DeleteOutlined />}
											/>
										</Popconfirm>
									</div>
								}
								className="hover:shadow-lg"
							>
								<p className="mb-4 text-sm text-gray-600">{template.description}</p>
								<div className="space-y-2 text-xs text-gray-500">
									<div>
										<strong>الصور:</strong> {Object.keys(template.assets || {}).length}{" "}
										صورة
									</div>
									<div>
										<strong>تاريخ الإنشاء:</strong>{" "}
										{new Date(template.createdAt).toLocaleDateString("ar")}
									</div>
								</div>
							</Card>
						))}
					</div>
				)}

				{/* Template Builder Modal */}
				<Modal
					open={showBuilder}
					onCancel={() => setShowBuilder(false)}
					footer={null}
					width="95%"
					style={{ top: 20 }}
					destroyOnClose
				>
					<TemplateBuilderForm
						onSave={handleSaveTemplate}
						onCancel={() => setShowBuilder(false)}
					/>
				</Modal>

				{/* Preview Modal */}
				<Modal
					open={!!previewTemplate}
					onCancel={() => setPreviewTemplate(null)}
					footer={null}
					width="90%"
					title={`معاينة: ${previewTemplate?.name}`}
				>
					{previewTemplate && (
						<div className="space-y-4">
							<div className="rounded-lg bg-gray-50 p-4">
								<h3 className="mb-2 font-semibold">معلومات القالب</h3>
								<p className="mb-2 text-sm">{previewTemplate.description}</p>
								<div className="space-y-1 text-xs text-gray-600">
									<p>
										الصور: {Object.keys(previewTemplate.assets || {}).length} صورة
									</p>
									<p>عدد الأحرف: {previewTemplate.code.length}</p>
									<p>
										تاريخ الإنشاء:{" "}
										{new Date(previewTemplate.createdAt).toLocaleDateString("ar")}
									</p>
								</div>
							</div>

							{Object.keys(previewTemplate.assets || {}).length > 0 && (
								<div className="rounded-lg border bg-white p-4">
									<h4 className="mb-2 font-semibold text-sm">الصور المرفوعة</h4>
									<div className="grid grid-cols-3 gap-2">
										{Object.entries(previewTemplate.assets).map(
											([placeholder, url]) => (
												<div
													key={placeholder}
													className="rounded border p-2 text-center"
												>
													<img
														src={url}
														alt={placeholder}
														className="mx-auto mb-1 h-16 object-contain"
													/>
													<code className="block truncate text-xs text-gray-500">
														{placeholder}
													</code>
												</div>
											),
										)}
									</div>
								</div>
							)}

							<div className="max-h-96 overflow-auto rounded-lg border bg-gray-100 p-4">
								<h4 className="mb-2 font-semibold text-sm">الكود</h4>
								<pre className="text-xs" style={{ direction: "ltr" }}>
									<code>{previewTemplate.code}</code>
								</pre>
							</div>
						</div>
					)}
				</Modal>
			</div>
		</div>
	)
}

export default CustomTemplatesPage
