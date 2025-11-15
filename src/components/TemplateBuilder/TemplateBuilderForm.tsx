"use client"

import React, { useState } from "react"
import { Button, Form, Input, message, Card } from "antd"
import TemplatePreview from "./TemplatePreview"

const { TextArea } = Input

export interface CustomTemplate {
	id: string
	name: string
	description: string
	code: string // Just the JSX code, no transformation needed
	createdAt: string
}

const TemplateBuilderForm: React.FC<{
	onSave: (template: CustomTemplate) => void
	onCancel: () => void
}> = ({ onSave, onCancel }) => {
	const [templateName, setTemplateName] = useState("")
	const [templateDescription, setTemplateDescription] = useState("")
	const [code, setCode] = useState("")
	const [showPreview, setShowPreview] = useState(false)
	const [form] = Form.useForm()

	const handleSaveTemplate = () => {
		if (!templateName.trim()) {
			message.error("الرجاء إدخال اسم القالب")
			return
		}
		if (!code.trim()) {
			message.error("الرجاء إدخال كود القالب")
			return
		}

		const template: CustomTemplate = {
			id: `template-${Date.now()}`,
			name: templateName,
			description: templateDescription,
			code: code,
			createdAt: new Date().toISOString(),
		}
		onSave(template)
		message.success("تم حفظ القالب بنجاح!")
	}

	return (
		<div className="mx-auto max-w-6xl p-6">
			<h1 className="mb-6 text-2xl font-bold">إنشاء قالب مخصص</h1>

			<Card className="mb-4">
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
						label="كود JSX"
						required
						help="الصق كود JSX مباشرة. استخدم {formData.name} للإشارة إلى بيانات النموذج"
					>
						<TextArea
							value={code}
							onChange={(e) => setCode(e.target.value)}
							placeholder={`مثال:
<div className="p-8">
  <h1>{formData.name}</h1>
  <p>{formData.jobTitle}</p>
  <p>الراتب: {formData.monthlySalary}</p>
</div>`}
							rows={20}
							style={{ fontFamily: "monospace", fontSize: "14px" }}
						/>
					</Form.Item>

					<div className="flex gap-2">
						<Button type="primary" onClick={handleSaveTemplate} size="large">
							حفظ القالب
						</Button>
						<Button onClick={() => setShowPreview(!showPreview)} size="large">
							{showPreview ? "إخفاء المعاينة" : "معاينة"}
						</Button>
						<Button onClick={onCancel} size="large">
							إلغاء
						</Button>
					</div>
				</Form>
			</Card>

			{showPreview && code && (
				<Card title="معاينة القالب" className="mt-4">
					<TemplatePreview code={code} />
				</Card>
			)}
		</div>
	)
}

export default TemplateBuilderForm
