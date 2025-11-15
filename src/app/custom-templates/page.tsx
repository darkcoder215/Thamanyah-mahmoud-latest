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
										<strong>الأصول:</strong> {Object.keys(template.assets).length}{" "}
										صورة/أيقونة
									</div>
									<div>
										<strong>حقول البيانات:</strong>{" "}
										{Object.keys(template.dataFields).length} حقل
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
								<div className="text-xs text-gray-600">
									<p>عدد الأصول: {Object.keys(previewTemplate.assets).length}</p>
									<p>
										حقول البيانات:{" "}
										{Object.keys(previewTemplate.dataFields).length}
									</p>
								</div>
							</div>

							<div className="max-h-96 overflow-auto rounded-lg border bg-gray-100 p-4">
								<pre className="text-xs">
									<code>{previewTemplate.convertedCode}</code>
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
