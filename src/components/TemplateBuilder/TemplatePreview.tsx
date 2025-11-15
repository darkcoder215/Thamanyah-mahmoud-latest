"use client"

import React, { useState, useEffect } from "react"
import { Button, Switch, Slider, InputNumber, Collapse, message } from "antd"
import { EyeOutlined, SaveOutlined } from "@ant-design/icons"

interface TemplatePreviewProps {
	convertedCode: string
	assets: { [key: string]: string }
	dataFields: { [key: string]: string }
	onSave: () => void
	onBack: () => void
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({
	convertedCode,
	assets,
	dataFields,
	onSave,
	onBack,
}) => {
	const [processedCode, setProcessedCode] = useState("")
	const [showGuides, setShowGuides] = useState(false)
	const [zoom, setZoom] = useState(100)
	const [adjustments, setAdjustments] = useState({
		paddingTop: 120,
		paddingBottom: 120,
		paddingInline: 42,
		fontSize: 14,
	})

	// Sample data for preview
	const sampleFormData = {
		name: "عبدالله أحمد",
		jobTitle: "مدير منتج | Product Manager",
		jobTitleEn: "Product Manager",
		department: "المنتجات",
		team: "فريق التطوير",
		directManager: "علي بوصالح",
		directManagerJobTitle: "الرئيس التنفيذي للتقنية",
		monthlySalary: 17500,
		basicSalary: 8203,
		housingAllowance: 2051,
		transportAllowance: 246,
		additionalAllowances: 7000,
		netSalary: 15859,
		managerSignName: "عبدالله الربدي",
		email: "test@thmanyah.com",
		level: 3,
	}

	useEffect(() => {
		let code = convertedCode

		// Replace assets
		Object.entries(assets).forEach(([placeholder, uploadedUrl]) => {
			code = code.replace(new RegExp(placeholder, "g"), uploadedUrl)
		})

		// Replace data fields
		Object.entries(dataFields).forEach(([placeholder, field]) => {
			if (field.startsWith("formData.")) {
				// Replace with JSX expression
				code = code.replace(
					new RegExp(`>${placeholder}<`, "g"),
					`>{${field}}<`,
				)
			} else {
				// Replace with static value
				code = code.replace(
					new RegExp(`>${placeholder}<`, "g"),
					`>${field}<`,
				)
			}
		})

		setProcessedCode(code)
	}, [convertedCode, assets, dataFields])

	const handleAdjustmentChange = (key: string, value: number) => {
		setAdjustments((prev) => ({ ...prev, [key]: value }))
	}

	const generatePreviewHTML = (): string => {
		// For preview, we'll create a simplified version that can be rendered
		let html = processedCode

		// Replace formData references with actual values for preview
		Object.entries(sampleFormData).forEach(([key, value]) => {
			const regex = new RegExp(`{formData\\.${key}}`, "g")
			html = html.replace(regex, String(value))
		})

		// Remove React/Next.js specific parts for HTML preview
		html = html.replace(/import .+;/g, "")
		html = html.replace(/interface .+\{[\s\S]+?\}/g, "")
		html = html.replace(/const CustomTemplate[\s\S]+?= \(\{[^}]+\}\) => \{/g, "")
		html = html.replace(/return \(/g, "")
		html = html.replace(/\}\s*export default CustomTemplate/g, "")
		html = html.replace(/<Image /g, "<img ")
		html = html.replace(/className=/g, "class=")

		return html
	}

	const handleSave = () => {
		if (!processedCode) {
			message.error("لا يوجد كود للحفظ")
			return
		}

		// Add adjustments to the code as CSS variables
		const finalCode = `${processedCode}

// Template Adjustments (applied via CSS)
/*
.page {
  padding-top: ${adjustments.paddingTop}px;
  padding-bottom: ${adjustments.paddingBottom}px;
  padding-inline: ${adjustments.paddingInline}px;
  font-size: ${adjustments.fontSize}pt;
}
*/`

		onSave()
	}

	return (
		<div>
			<h2 className="mb-4 text-xl font-semibold">المعاينة والحفظ</h2>

			<div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
				{/* Controls Panel */}
				<div className="space-y-4">
					<div className="rounded-lg border bg-white p-4">
						<h3 className="mb-3 font-semibold">أدوات المعاينة</h3>

						<div className="mb-3">
							<label className="mb-2 flex items-center justify-between">
								<span>إظهار خطوط الإرشاد</span>
								<Switch checked={showGuides} onChange={setShowGuides} />
							</label>
						</div>

						<div className="mb-3">
							<label className="mb-2 block">التكبير: {zoom}%</label>
							<Slider
								min={50}
								max={150}
								value={zoom}
								onChange={setZoom}
								marks={{ 50: "50%", 100: "100%", 150: "150%" }}
							/>
						</div>
					</div>

					<Collapse
						items={[
							{
								key: "1",
								label: "ضبط الأبعاد",
								children: (
									<div className="space-y-3">
										<div>
											<label className="mb-1 block text-sm">
												المسافة العلوية (px)
											</label>
											<InputNumber
												min={0}
												max={300}
												value={adjustments.paddingTop}
												onChange={(val) =>
													handleAdjustmentChange("paddingTop", val || 120)
												}
												className="w-full"
											/>
										</div>

										<div>
											<label className="mb-1 block text-sm">
												المسافة السفلية (px)
											</label>
											<InputNumber
												min={0}
												max={300}
												value={adjustments.paddingBottom}
												onChange={(val) =>
													handleAdjustmentChange("paddingBottom", val || 120)
												}
												className="w-full"
											/>
										</div>

										<div>
											<label className="mb-1 block text-sm">
												المسافة الجانبية (px)
											</label>
											<InputNumber
												min={0}
												max={100}
												value={adjustments.paddingInline}
												onChange={(val) =>
													handleAdjustmentChange("paddingInline", val || 42)
												}
												className="w-full"
											/>
										</div>

										<div>
											<label className="mb-1 block text-sm">
												حجم الخط (pt)
											</label>
											<InputNumber
												min={8}
												max={24}
												value={adjustments.fontSize}
												onChange={(val) =>
													handleAdjustmentChange("fontSize", val || 14)
												}
												className="w-full"
											/>
										</div>
									</div>
								),
							},
						]}
					/>

					<div className="rounded-lg border bg-blue-50 p-4">
						<h4 className="mb-2 font-semibold text-blue-900">
							البيانات المستخدمة في المعاينة
						</h4>
						<div className="space-y-1 text-sm text-blue-800">
							<p>الاسم: {sampleFormData.name}</p>
							<p>الوظيفة: {sampleFormData.jobTitle}</p>
							<p>الراتب: {sampleFormData.monthlySalary} ريال</p>
						</div>
					</div>
				</div>

				{/* Preview Area */}
				<div className="lg:col-span-2">
					<div
						className={`overflow-auto rounded-lg border-2 bg-gray-100 p-4 ${
							showGuides ? "border-dashed border-blue-500" : "border-gray-300"
						}`}
						style={{
							height: "calc(100vh - 200px)",
							minHeight: "600px",
						}}
					>
						<div
							style={{
								transform: `scale(${zoom / 100})`,
								transformOrigin: "top center",
								transition: "transform 0.2s",
							}}
						>
							<div
								className="page relative mx-auto bg-background"
								style={{
									paddingTop: `${adjustments.paddingTop}px`,
									paddingBottom: `${adjustments.paddingBottom}px`,
									paddingInline: `${adjustments.paddingInline}px`,
									fontSize: `${adjustments.fontSize}pt`,
								}}
							>
								{showGuides && (
									<>
										{/* Guide lines */}
										<div className="pointer-events-none absolute inset-0 border-2 border-dashed border-red-500 opacity-50" />
										<div className="pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-red-500 opacity-50" />
										<div className="pointer-events-none absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-red-500 opacity-50" />
									</>
								)}

								{/* Render preview */}
								<div dangerouslySetInnerHTML={{ __html: generatePreviewHTML() }} />
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="mt-6 flex justify-between">
				<Button onClick={onBack}>السابق</Button>
				<Button type="primary" icon={<SaveOutlined />} onClick={handleSave} size="large">
					حفظ القالب
				</Button>
			</div>
		</div>
	)
}

export default TemplatePreview
