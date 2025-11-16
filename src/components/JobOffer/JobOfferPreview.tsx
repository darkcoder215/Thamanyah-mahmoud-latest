import React, { useEffect, useState } from "react"
import { type JobOfferFormData, type JobOfferFormProps } from "../Form/JobOfferFormTypes"
import { managers } from "../Form/ManagerSign"
import Cover from "../Form/Preview/Cover"
import Outro from "../Form/Preview/Outro"
import PreviewActions from "../Shared/PreviewActions"
import TempBasicInfoPage from "../TempOffer/Preview/BasicInfoPage"
import BasicInfoPage from "./Preview/BasicInfoPage"
import SalaryPage from "./Preview/SalaryPage"
import CustomTemplateRenderer, { CustomTemplate } from "./CustomTemplateRenderer"
import CoverPageV2 from "./Preview/CoverPageV2"
import BasicInfoPageV2 from "./Preview/BasicInfoPageV2"
import SalaryPageV2 from "./Preview/SalaryPageV2"
import PreviewControls from "./Preview/PreviewControls"
import { Alert } from "antd"

interface JobOfferPreviewProps {
	formData: JobOfferFormData
	levels: JobOfferFormProps["levels"]
	onEdit: () => void
}

const JobOfferPreview: React.FC<JobOfferPreviewProps> = ({ formData, levels, onEdit }) => {
	const [customTemplate, setCustomTemplate] = useState<CustomTemplate | null>(null)
	const [editMode, setEditMode] = useState(false)
	const [scale, setScale] = useState(1)

	// Load custom template if theme is custom
	useEffect(() => {
		if (formData.theme === "custom" && formData.customTemplateId) {
			const stored = localStorage.getItem("customTemplates")
			if (stored) {
				try {
					const templates: CustomTemplate[] = JSON.parse(stored)
					const template = templates.find((t) => t.id === formData.customTemplateId)
					setCustomTemplate(template || null)
				} catch (error) {
					console.error("Error loading custom template:", error)
				}
			}
		}
	}, [formData.theme, formData.customTemplateId])
	const handleFileUpload = async (file: File) => {
		const data = new FormData()
		data.append("pdf", file)
		data.append("offerData", JSON.stringify(formData))

		const response = await fetch("https://hook.eu1.make.com/y7agyrr6d16y57vrcnuz1qv1h16e8j80", {
			method: "POST",
			body: data,
		})
		if (!response.ok) {
			throw new Error("Network response was not ok")
		}
	}

	useEffect(() => {
		if (typeof window !== "undefined") {
			window.document.title = `العرض الوظيفي - ${formData.name}`
		}
	}, [formData.name])

	const selectedManager = formData.managerSignName
		? managers.find((m) => m.value === formData.managerSignName)
		: null

	// Render custom template if selected
	if (formData.theme === "custom") {
		if (!customTemplate) {
			return (
				<>
					<Alert
						message="خطأ في تحميل القالب"
						description="لم يتم العثور على القالب المخصص المحدد. الرجاء اختيار قالب آخر أو العودة للتعديل."
						type="error"
						showIcon
						className="m-6"
					/>
					<PreviewActions
						onEdit={onEdit}
						onFileUpload={handleFileUpload}
						email={formData.email}
					/>
				</>
			)
		}

		return (
			<>
				<div className="overflow-x-auto">
					<Cover
						forLeague={false}
						name={formData.name}
						title={formData.contractType === "employment" ? "عرض وظيفي" : "عرض تعاوني"}
					/>
					<CustomTemplateRenderer template={customTemplate} formData={formData} />
					<Outro />
				</div>
				<PreviewActions
					onEdit={onEdit}
					onFileUpload={handleFileUpload}
					email={formData.email}
				/>
			</>
		)
	}

	// Render latest theme (V2 design)
	if (formData.theme === "latest") {
		return (
			<>
				<PreviewControls
					onEditModeToggle={setEditMode}
					onScaleChange={setScale}
				/>
				<div className="overflow-x-auto">
					<CoverPageV2 name={formData.name} editMode={editMode} scale={scale} />
					<BasicInfoPageV2 formData={formData} levels={levels} editMode={editMode} scale={scale} />
					<SalaryPageV2 formData={formData} editMode={editMode} scale={scale} />
					<Outro />
				</div>
				<PreviewActions
					onEdit={onEdit}
					onFileUpload={handleFileUpload}
					email={formData.email}
				/>
			</>
		)
	}

	// Default rendering for general and league themes
	return (
		<>
			<div className={`overflow-x-auto ${formData.theme === "league" ? "theme-league" : ""}`}>
				<Cover
					forLeague={formData.theme === "league"}
					name={formData.name}
					cover={formData.leagueCoverImage}
					title={formData.contractType === "employment" ? "عرض وظيفي" : "عرض تعاوني"}
				/>
				{formData.contractType === "employment" ? (
					<>
						<BasicInfoPage formData={formData} levels={levels} />
						<SalaryPage formData={formData} />
					</>
				) : (
					<TempBasicInfoPage
						formData={{
							name: formData.name,
							email: formData.email,
							jobTitle: formData.jobTitle,
							directManager: formData.directManager,
							duration: formData.contractDuration || "",
							recruiter: formData.managerSignName || formData.directManager,
							recruiterJobTitle:
								formData.managerSignName && selectedManager
									? selectedManager.jobTitle
									: formData.directManagerJobTitle,
							team: formData.team,
							department: formData.department,
							expectations: formData.expectations,
							netSalary: formData.monthlySalary,
							formType: "collaboration",
						}}
					/>
				)}
				<Outro />
			</div>
			<PreviewActions
				onEdit={onEdit}
				onFileUpload={handleFileUpload}
				email={formData.email}
			/>
		</>
	)
}

export default JobOfferPreview
