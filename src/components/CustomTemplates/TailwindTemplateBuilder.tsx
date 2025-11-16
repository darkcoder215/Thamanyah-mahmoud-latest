"use client"

import React, { useState } from "react"
import { Input, Button, Upload, message, Steps, Card, Modal, Alert } from "antd"
import { UploadOutlined } from "@ant-design/icons"
import TailwindPage from "../JobOffer/Preview/TailwindPage"
import { type JobOfferFormData } from "../Form/JobOfferFormTypes"

const { TextArea } = Input

interface FieldMapping {
	originalText: string
	mappedField: string // e.g., "formData.name", "formData.jobTitle"
	elementIndex: number
}

interface ImageUpload {
	src: string // Original src from JSX
	uploadedUrl: string // Base64 or uploaded URL
}

/**
 * TailwindTemplateBuilder - Visual template creator
 *
 * Workflow:
 * 1. User pastes Tailwind JSX from Figma
 * 2. System previews it and detects missing images
 * 3. User uploads images for each <img> tag
 * 4. User clicks text elements to map them to form fields
 * 5. System generates preview with real data
 * 6. User saves template
 */
export default function TailwindTemplateBuilder() {
	const [currentStep, setCurrentStep] = useState(0)
	const [jsxCode, setJsxCode] = useState("")
	const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([])
	const [imageUploads, setImageUploads] = useState<ImageUpload[]>([])
	const [templateName, setTemplateName] = useState("")
	const [showFieldMapper, setShowFieldMapper] = useState(false)

	// Sample form data for preview
	const sampleFormData: Partial<JobOfferFormData> = {
		name: "أيمن الحارثي",
		jobTitle: "مدير محتوى | Content Manager",
		department: "ثقافة المنظومة",
		team: "التطوير التنظيمي",
		directManager: "أسيل باعبدالله",
		workType: "كامل",
		contractCity: "الرياض",
		level: 2,
		expectations: [
			"إدارة وتنفيذ قسم ومهام إدارة المواهب والتطوير التنظيمي بالكامل",
			"تطوير وتنفيذ سلم الرواتب والمستويات داخلها",
			"تطوير وتنفيذ تقييم الأداء",
		],
	}

	// Step 1: Parse JSX and detect images
	const parseJSX = () => {
		// Detect <img> tags
		const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/g
		const images: ImageUpload[] = []
		let match

		while ((match = imgRegex.exec(jsxCode)) !== null) {
			images.push({
				src: match[1],
				uploadedUrl: "",
			})
		}

		setImageUploads(images)

		if (images.length > 0) {
			message.info(`Found ${images.length} image(s). Please upload them in the next step.`)
		} else {
			message.success("No images detected. Proceeding to field mapping.")
		}

		setCurrentStep(1)
	}

	// Step 2: Detect text fields for mapping
	const detectTextFields = () => {
		// This is a simplified version - in production, you'd parse the JSX AST
		// For now, we'll use regex to find text content
		const textRegex = />([^<>]+)</g
		const mappings: FieldMapping[] = []
		let index = 0
		let match

		while ((match = textRegex.exec(jsxCode)) !== null) {
			const text = match[1].trim()
			// Skip empty strings, emojis, and very short text
			if (text.length > 2 && !/^[\d\s]+$/.test(text) && !/[👋🏻]/.test(text)) {
				mappings.push({
					originalText: text,
					mappedField: "", // User will fill this
					elementIndex: index++,
				})
			}
		}

		setFieldMappings(mappings)
		setCurrentStep(2)
	}

	// Step 3: Generate component code
	const generateTemplate = () => {
		let modifiedJSX = jsxCode

		// Replace images with uploaded URLs
		imageUploads.forEach((img) => {
			if (img.uploadedUrl) {
				modifiedJSX = modifiedJSX.replace(img.src, img.uploadedUrl)
			}
		})

		// Replace text with field mappings
		fieldMappings.forEach((mapping) => {
			if (mapping.mappedField) {
				modifiedJSX = modifiedJSX.replace(
					`>${mapping.originalText}<`,
					`>{${mapping.mappedField}}<`
				)
			}
		})

		// Save to localStorage or database
		const template = {
			name: templateName,
			jsx: modifiedJSX,
			mappings: fieldMappings,
			images: imageUploads,
			createdAt: new Date().toISOString(),
		}

		localStorage.setItem(`custom-template-${templateName}`, JSON.stringify(template))
		message.success(`Template "${templateName}" saved successfully!`)

		// Show generated code
		Modal.info({
			title: "Generated Template Component",
			width: 800,
			content: (
				<div>
					<Alert
						message="Template Saved!"
						description={`You can now use this template by selecting "${templateName}" from the custom templates dropdown.`}
						type="success"
						style={{ marginBottom: 16 }}
					/>
					<pre style={{ background: "#f5f5f5", padding: 16, overflow: "auto", maxHeight: 400 }}>
						{generateComponentCode(templateName, modifiedJSX)}
					</pre>
				</div>
			),
		})
	}

	const generateComponentCode = (name: string, jsx: string) => {
		return `"use client"

import React from "react"
import TailwindPage from "../JobOffer/Preview/TailwindPage"
import { type JobOfferFormData } from "../Form/JobOfferFormTypes"

interface ${name}Props {
  formData: JobOfferFormData
  editMode?: boolean
}

export default function ${name}({ formData, editMode = false }: ${name}Props) {
  return (
    <TailwindPage editMode={editMode}>
      ${jsx}
    </TailwindPage>
  )
}
`
	}

	const renderPreview = () => {
		try {
			// Convert font classes
			let previewJSX = jsxCode
				.replace(/font-\['Thmanyah_sans[^']*'\]/g, "font-8-sans")
				.replace(/font-\['Thmanyah_serif_display[^']*'\]/g, "font-8-display")
				.replace(/font-\['Thmanyah_serif[^']*'\]/g, "font-8-serif")

			return (
				<div dangerouslySetInnerHTML={{ __html: `<div class="page-v2">${previewJSX}</div>` }} />
			)
		} catch (error) {
			return <Alert message="Invalid JSX" description="Please check your code syntax." type="error" />
		}
	}

	const availableFields = [
		{ value: "formData.name", label: "Name (الاسم)" },
		{ value: "formData.jobTitle", label: "Job Title (المسمى الوظيفي)" },
		{ value: "formData.department", label: "Department (القسم)" },
		{ value: "formData.team", label: "Team (الفريق)" },
		{ value: "formData.directManager", label: "Direct Manager (المدير المباشر)" },
		{ value: "formData.workType", label: "Work Type (نوع الدوام)" },
		{ value: "formData.contractCity", label: "City (المدينة)" },
		{ value: "formData.level", label: "Level (المستوى)" },
		{ value: "formData.monthlySalary", label: "Monthly Salary (الراتب الشهري)" },
		{ value: "formData.basicSalary", label: "Basic Salary (الراتب الأساسي)" },
		{ value: "formData.housingAllowance", label: "Housing Allowance (بدل سكن)" },
	]

	return (
		<div style={{ padding: 24 }}>
			<Steps
				current={currentStep}
				items={[
					{ title: "Paste JSX" },
					{ title: "Upload Images" },
					{ title: "Map Fields" },
					{ title: "Preview & Save" },
				]}
				style={{ marginBottom: 32 }}
			/>

			{/* Step 0: Paste JSX */}
			{currentStep === 0 && (
				<Card title="Step 1: Paste Tailwind JSX from Figma">
					<Alert
						message="Instructions"
						description={
							<ol style={{ margin: 0, paddingLeft: 20 }}>
								<li>Open Figma Dev Mode (Shift+D)</li>
								<li>Select "Tailwind CSS" from the code dropdown</li>
								<li>Copy the entire JSX code</li>
								<li>Paste it below</li>
							</ol>
						}
						type="info"
						style={{ marginBottom: 16 }}
					/>
					<TextArea
						value={jsxCode}
						onChange={(e) => setJsxCode(e.target.value)}
						placeholder="Paste your Tailwind JSX here..."
						rows={20}
						style={{ fontFamily: "monospace", fontSize: 12 }}
					/>
					<Button
						type="primary"
						size="large"
						onClick={parseJSX}
						disabled={!jsxCode}
						style={{ marginTop: 16 }}
					>
						Parse & Continue →
					</Button>
				</Card>
			)}

			{/* Step 1: Upload Images */}
			{currentStep === 1 && (
				<Card title="Step 2: Upload Images">
					{imageUploads.length === 0 ? (
						<Alert
							message="No Images Detected"
							description="Your template doesn't have any images. Proceeding to field mapping."
							type="success"
						/>
					) : (
						<div>
							{imageUploads.map((img, index) => (
								<div key={index} style={{ marginBottom: 16, padding: 16, border: "1px solid #d9d9d9", borderRadius: 8 }}>
									<div style={{ marginBottom: 8 }}>
										<strong>Image {index + 1}:</strong> <code>{img.src}</code>
									</div>
									<Upload
										accept="image/*"
										showUploadList={false}
										beforeUpload={(file) => {
											const reader = new FileReader()
											reader.onload = (e) => {
												const newUploads = [...imageUploads]
												newUploads[index].uploadedUrl = e.target?.result as string
												setImageUploads(newUploads)
												message.success(`Image ${index + 1} uploaded!`)
											}
											reader.readAsDataURL(file)
											return false
										}}
									>
										<Button icon={<UploadOutlined />}>
											{img.uploadedUrl ? "✓ Uploaded - Click to Replace" : "Upload Image"}
										</Button>
									</Upload>
								</div>
							))}
						</div>
					)}
					<Button type="primary" size="large" onClick={detectTextFields} style={{ marginTop: 16 }}>
						Continue to Field Mapping →
					</Button>
				</Card>
			)}

			{/* Step 2: Map Fields */}
			{currentStep === 2 && (
				<Card title="Step 3: Map Text Fields to Form Data">
					<Alert
						message="Map Static Text to Dynamic Fields"
						description="For each text element, select which form field it should display. Leave unmapped if it should remain static."
						type="info"
						style={{ marginBottom: 16 }}
					/>
					<div style={{ maxHeight: 500, overflowY: "auto" }}>
						{fieldMappings.map((mapping, index) => (
							<div key={index} style={{ marginBottom: 16, padding: 12, background: "#f5f5f5", borderRadius: 4 }}>
								<div style={{ marginBottom: 8 }}>
									<strong>Text:</strong> "{mapping.originalText}"
								</div>
								<select
									value={mapping.mappedField}
									onChange={(e) => {
										const newMappings = [...fieldMappings]
										newMappings[index].mappedField = e.target.value
										setFieldMappings(newMappings)
									}}
									style={{ width: "100%", padding: 8, fontSize: 14 }}
								>
									<option value="">Keep as static text</option>
									{availableFields.map((field) => (
										<option key={field.value} value={field.value}>
											{field.label}
										</option>
									))}
								</select>
							</div>
						))}
					</div>
					<Button
						type="primary"
						size="large"
						onClick={() => setCurrentStep(3)}
						style={{ marginTop: 16 }}
					>
						Preview Template →
					</Button>
				</Card>
			)}

			{/* Step 3: Preview & Save */}
			{currentStep === 3 && (
				<Card title="Step 4: Preview & Save Template">
					<Input
						placeholder="Template Name (e.g., 'BlueOceanTheme')"
						value={templateName}
						onChange={(e) => setTemplateName(e.target.value)}
						style={{ marginBottom: 16 }}
						size="large"
					/>

					<Alert
						message="Preview with Sample Data"
						description="Below is how your template will look with real form data."
						type="success"
						style={{ marginBottom: 16 }}
					/>

					{/* Preview would go here - using iframe or direct render */}
					<div style={{ border: "2px solid #1890ff", padding: 16, background: "white", marginBottom: 16 }}>
						{renderPreview()}
					</div>

					<Button
						type="primary"
						size="large"
						onClick={generateTemplate}
						disabled={!templateName}
					>
						💾 Save Template
					</Button>
				</Card>
			)}
		</div>
	)
}
