"use client"

import React, { useMemo } from "react"
import { formatNumbers } from "@/utils/helpers"

interface TemplatePreviewProps {
	code: string
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({ code }) => {
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
		expectations: ["توقع 1", "توقع 2", "توقع 3"],
		targets: ["هدف 1", "هدف 2"],
	}

	const previewHTML = useMemo(() => {
		let html = code

		// Replace {formData.fieldName} with sample values
		html = html.replace(/\{formData\.(\w+)\}/g, (match, fieldName) => {
			const value = sampleFormData[fieldName as keyof typeof sampleFormData]

			// Format numbers
			if (typeof value === "number") {
				return formatNumbers(value)
			}

			// Join arrays
			if (Array.isArray(value)) {
				return value.join(", ")
			}

			// Return as string
			return String(value || "")
		})

		return html
	}, [code])

	return (
		<div
			className="rounded border bg-white p-8"
			style={{ direction: "rtl", fontFamily: "sans-serif" }}
		>
			<div className="mb-4 rounded bg-blue-50 p-3 text-sm text-blue-800">
				<strong>ملاحظة:</strong> هذه معاينة باستخدام بيانات تجريبية. سيتم استبدال القيم
				بالبيانات الفعلية عند الاستخدام.
			</div>
			<div dangerouslySetInnerHTML={{ __html: previewHTML }} />
		</div>
	)
}

export default TemplatePreview
