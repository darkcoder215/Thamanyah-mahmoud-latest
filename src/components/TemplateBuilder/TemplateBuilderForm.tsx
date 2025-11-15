"use client"

import React, { useState } from "react"
import { Button, Form, Input, Modal, Steps, Upload, message } from "antd"
import { InboxOutlined } from "@ant-design/icons"
import StyleConverter from "./StyleConverter"
import AssetManager from "./AssetManager"
import DataMapper from "./DataMapper"
import TemplatePreview from "./TemplatePreview"

const { TextArea } = Input
const { Step } = Steps

export interface CustomTemplate {
	id: string
	name: string
	description: string
	originalCode: string
	convertedCode: string
	assets: { [key: string]: string } // placeholder URL -> uploaded asset
	dataFields: { [key: string]: string } // template placeholder -> formData field
	createdAt: string
}

const TemplateBuilderForm: React.FC<{
	onSave: (template: CustomTemplate) => void
	onCancel: () => void
}> = ({ onSave, onCancel }) => {
	const [currentStep, setCurrentStep] = useState(0)
	const [figmaCode, setFigmaCode] = useState("")
	const [templateName, setTemplateName] = useState("")
	const [templateDescription, setTemplateDescription] = useState("")
	const [convertedCode, setConvertedCode] = useState("")
	const [assets, setAssets] = useState<{ [key: string]: string }>({})
	const [dataFields, setDataFields] = useState<{ [key: string]: string }>({})
	const [form] = Form.useForm()

	const handleCodeSubmit = () => {
		if (!figmaCode.trim()) {
			message.error("الرجاء إدخال كود Figma")
			return
		}
		// Move to style conversion step
		setCurrentStep(1)
	}

	const handleStyleConversion = (converted: string) => {
		setConvertedCode(converted)
		setCurrentStep(2)
	}

	const handleAssetsUpload = (uploadedAssets: { [key: string]: string }) => {
		setAssets(uploadedAssets)
		setCurrentStep(3)
	}

	const handleDataMapping = (mappedFields: { [key: string]: string }) => {
		setDataFields(mappedFields)
		setCurrentStep(4)
	}

	const handleSaveTemplate = () => {
		const template: CustomTemplate = {
			id: `template-${Date.now()}`,
			name: templateName,
			description: templateDescription,
			originalCode: figmaCode,
			convertedCode,
			assets,
			dataFields,
			createdAt: new Date().toISOString(),
		}
		onSave(template)
		message.success("تم حفظ القالب بنجاح!")
	}

	const nextStep = () => {
		if (currentStep < 4) {
			setCurrentStep((prev) => prev + 1)
		}
	}

	const prevStep = () => {
		if (currentStep > 0) {
			setCurrentStep((prev) => prev - 1)
		}
	}

	return (
		<div className="mx-auto max-w-6xl p-6">
			<h1 className="mb-6 text-2xl font-bold">إنشاء قالب مخصص من Figma</h1>

			<Steps current={currentStep} className="mb-8">
				<Step title="إدخال الكود" />
				<Step title="تحويل الأنماط" />
				<Step title="رفع الأصول" />
				<Step title="ربط البيانات" />
				<Step title="المعاينة" />
			</Steps>

			<div className="rounded-lg border bg-white p-6">
				{currentStep === 0 && (
					<div>
						<h2 className="mb-4 text-xl font-semibold">معلومات القالب</h2>
						<Form form={form} layout="vertical">
							<Form.Item
								label="اسم القالب"
								name="templateName"
								rules={[{ required: true, message: "الرجاء إدخال اسم القالب" }]}
							>
								<Input
									value={templateName}
									onChange={(e) => setTemplateName(e.target.value)}
									placeholder="مثال: قالب المزايا الوظيفية"
								/>
							</Form.Item>

							<Form.Item
								label="وصف القالب"
								name="templateDescription"
								rules={[{ required: false }]}
							>
								<TextArea
									value={templateDescription}
									onChange={(e) => setTemplateDescription(e.target.value)}
									placeholder="وصف مختصر للقالب..."
									rows={2}
								/>
							</Form.Item>

							<Form.Item
								label="كود Figma (React JSX)"
								name="figmaCode"
								rules={[{ required: true, message: "الرجاء إدخال كود Figma" }]}
							>
								<TextArea
									value={figmaCode}
									onChange={(e) => setFigmaCode(e.target.value)}
									placeholder="الصق كود JSX من Figma Dev Mode هنا..."
									rows={15}
									style={{ fontFamily: "monospace" }}
								/>
							</Form.Item>
						</Form>

						<div className="mt-4 text-sm text-gray-600">
							<p className="mb-2">
								<strong>كيفية الحصول على الكود من Figma:</strong>
							</p>
							<ol className="mr-5 list-decimal space-y-1">
								<li>افتح التصميم في Figma</li>
								<li>فعّل وضع Dev Mode (Shift + D)</li>
								<li>اختر العنصر المطلوب</li>
								<li>اختر "React" من القائمة</li>
								<li>انسخ الكود والصقه هنا</li>
							</ol>
						</div>
					</div>
				)}

				{currentStep === 1 && (
					<StyleConverter
						figmaCode={figmaCode}
						onConvert={handleStyleConversion}
						onBack={prevStep}
					/>
				)}

				{currentStep === 2 && (
					<AssetManager
						convertedCode={convertedCode}
						onAssetsUpload={handleAssetsUpload}
						onBack={prevStep}
					/>
				)}

				{currentStep === 3 && (
					<DataMapper
						convertedCode={convertedCode}
						assets={assets}
						onDataMap={handleDataMapping}
						onBack={prevStep}
					/>
				)}

				{currentStep === 4 && (
					<TemplatePreview
						convertedCode={convertedCode}
						assets={assets}
						dataFields={dataFields}
						onSave={handleSaveTemplate}
						onBack={prevStep}
					/>
				)}

				{currentStep === 0 && (
					<div className="mt-6 flex justify-between">
						<Button onClick={onCancel}>إلغاء</Button>
						<Button type="primary" onClick={handleCodeSubmit}>
							التالي
						</Button>
					</div>
				)}
			</div>
		</div>
	)
}

export default TemplateBuilderForm
