"use client"

import React, { useEffect, useState } from "react"
import { Button, Select, Table, Tag, Input, message } from "antd"
import { LinkOutlined } from "@ant-design/icons"

interface DataMapperProps {
	convertedCode: string
	assets: { [key: string]: string }
	onDataMap: (dataFields: { [key: string]: string }) => void
	onBack: () => void
}

interface DataField {
	key: string
	placeholder: string
	suggestedField: string | null
	mappedField: string | null
	type: "text" | "number"
}

// Available formData fields
const AVAILABLE_FIELDS = [
	{ value: "formData.name", label: "اسم الموظف", type: "text" },
	{ value: "formData.jobTitle", label: "المسمى الوظيفي (عربي)", type: "text" },
	{ value: "formData.jobTitleEn", label: "المسمى الوظيفي (إنجليزي)", type: "text" },
	{ value: "formData.department", label: "القسم", type: "text" },
	{ value: "formData.team", label: "الفريق", type: "text" },
	{ value: "formData.directManager", label: "المدير المباشر", type: "text" },
	{ value: "formData.directManagerJobTitle", label: "مسمى المدير", type: "text" },
	{ value: "formData.monthlySalary", label: "الراتب الشهري", type: "number" },
	{ value: "formData.basicSalary", label: "الراتب الأساسي", type: "number" },
	{ value: "formData.housingAllowance", label: "بدل السكن", type: "number" },
	{ value: "formData.transportAllowance", label: "بدل النقل", type: "number" },
	{ value: "formData.additionalAllowances", label: "البدلات الإضافية", type: "number" },
	{ value: "formData.netSalary", label: "الراتب الصافي", type: "number" },
	{ value: "formData.managerSignName", label: "اسم الموقع", type: "text" },
	{ value: "formData.email", label: "البريد الإلكتروني", type: "text" },
	{ value: "formData.level", label: "المستوى", type: "number" },
	{ value: "CUSTOM", label: "نص مخصص (لا تربط)", type: "text" },
]

const DataMapper: React.FC<DataMapperProps> = ({ convertedCode, assets, onDataMap, onBack }) => {
	const [dataFields, setDataFields] = useState<DataField[]>([])
	const [customValues, setCustomValues] = useState<{ [key: string]: string }>({})

	// Extract potential data fields from code
	const extractDataFields = (code: string): DataField[] => {
		const fields: DataField[] = []
		let idCounter = 0

		// Look for number patterns (likely salaries)
		const numberRegex = />\s*(\d{1,3}(?:,\d{3})*|\d+)\s*</g
		let match

		while ((match = numberRegex.exec(code)) !== null) {
			const value = match[1].replace(/,/g, "")
			const number = parseInt(value)

			if (number > 100) {
				// Likely a salary value
				let suggested = null

				// Try to guess the field based on value
				if (number >= 10000 && number <= 50000) suggested = "formData.monthlySalary"
				else if (number >= 5000 && number <= 20000) suggested = "formData.basicSalary"
				else if (number >= 1000 && number <= 5000) suggested = "formData.housingAllowance"
				else if (number >= 100 && number <= 1000) suggested = "formData.transportAllowance"

				fields.push({
					key: `field-${idCounter++}`,
					placeholder: match[1],
					suggestedField: suggested,
					mappedField: suggested,
					type: "number",
				})
			}
		}

		// Look for text that looks like names or titles (Arabic text between tags)
		const arabicTextRegex = />([^<>{}\d]+[\u0600-\u06FF][^<>{}]*)</g

		while ((match = arabicTextRegex.exec(code)) !== null) {
			const text = match[1].trim()

			// Skip if too short or too long
			if (text.length < 3 || text.length > 50) continue

			// Skip common words and labels
			const skipWords = [
				"بدل",
				"الراتب",
				"أجر",
				"المزايا",
				"الإضافية",
				"سنويًا",
				"ريال",
				"التأمين",
				"الطبي",
			]
			if (skipWords.some((word) => text.includes(word))) continue

			let suggested = null

			// Try to guess based on content
			if (text.includes("مدير") || text.includes("رئيس"))
				suggested = "formData.directManagerJobTitle"
			else if (text.match(/^[\u0600-\u06FF\s]{3,30}$/)) suggested = "formData.name"

			fields.push({
				key: `field-${idCounter++}`,
				placeholder: text,
				suggestedField: suggested,
				mappedField: suggested,
				type: "text",
			})
		}

		// Remove duplicates
		return fields.filter(
			(item, index, self) =>
				index === self.findIndex((t) => t.placeholder === item.placeholder),
		)
	}

	useEffect(() => {
		console.log("🔍 Extracting data fields from code...")
		const extracted = extractDataFields(convertedCode)
		console.log(`✅ Found ${extracted.length} data fields to map`)
		setDataFields(extracted)
	}, [convertedCode])

	const handleFieldChange = (key: string, value: string) => {
		console.log(`🔗 Field mapping changed: ${key} → ${value}`)
		setDataFields((prev) =>
			prev.map((field) => (field.key === key ? { ...field, mappedField: value } : field)),
		)
	}

	const handleCustomValueChange = (key: string, value: string) => {
		console.log(`✏️ Custom value set: ${key} = ${value}`)
		setCustomValues((prev) => ({ ...prev, [key]: value }))
	}

	const handleNext = () => {
		console.log("🔍 Validating field mappings...")

		// Check if all fields are mapped
		const unmapped = dataFields.filter((f) => !f.mappedField)
		if (unmapped.length > 0) {
			console.warn("⚠️ Unmapped fields found:", unmapped.length)
			message.warning("الرجاء ربط جميع الحقول أو اختيار 'نص مخصص'")
			return
		}

		// Check custom values
		const missingCustomValues = dataFields.filter(
			(f) => f.mappedField === "CUSTOM" && !customValues[f.key],
		)
		if (missingCustomValues.length > 0) {
			console.warn("⚠️ Missing custom values:", missingCustomValues.length)
			message.warning("الرجاء إدخال القيم المخصصة لجميع الحقول المحددة")
			return
		}

		console.log("✅ All fields validated")

		// Create mapping object
		const mapping: { [key: string]: string } = {}
		dataFields.forEach((field) => {
			if (field.mappedField === "CUSTOM") {
				// Use custom value
				mapping[field.placeholder] = customValues[field.key] || field.placeholder
				console.log(`📌 Custom mapping: ${field.placeholder} = ${customValues[field.key]}`)
			} else if (field.mappedField) {
				mapping[field.placeholder] = field.mappedField
				console.log(`📌 Field mapping: ${field.placeholder} → ${field.mappedField}`)
			}
		})

		console.log("✅ Total mappings created:", Object.keys(mapping).length)
		onDataMap(mapping)
	}

	const handleSkip = () => {
		// Skip mapping - use static values
		onDataMap({})
	}

	const columns = [
		{
			title: "القيمة الحالية",
			dataIndex: "placeholder",
			key: "placeholder",
			render: (text: string, record: DataField) => (
				<div>
					<Tag color={record.type === "number" ? "blue" : "green"}>{record.type}</Tag>
					<span className="font-mono">{text}</span>
				</div>
			),
		},
		{
			title: "ربط بحقل",
			dataIndex: "mappedField",
			key: "mappedField",
			render: (_: string, record: DataField) => (
				<Select
					value={record.mappedField || undefined}
					onChange={(value) => handleFieldChange(record.key, value)}
					placeholder="اختر الحقل المناسب"
					className="w-full"
					options={AVAILABLE_FIELDS}
				/>
			),
		},
		{
			title: "قيمة مخصصة",
			key: "custom",
			render: (_: string, record: DataField) =>
				record.mappedField === "CUSTOM" ? (
					<Input
						value={customValues[record.key] || ""}
						onChange={(e) => handleCustomValueChange(record.key, e.target.value)}
						placeholder="أدخل القيمة المخصصة"
					/>
				) : (
					<span className="text-gray-400">-</span>
				),
		},
	]

	return (
		<div>
			<h2 className="mb-4 text-xl font-semibold">ربط البيانات</h2>

			{dataFields.length === 0 ? (
				<div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
					<LinkOutlined className="mb-2 text-4xl text-blue-500" />
					<p className="text-lg font-medium">لم يتم العثور على بيانات للربط</p>
					<p className="text-sm text-gray-600">
						القالب يحتوي على نصوص ثابتة فقط، يمكنك المتابعة
					</p>
				</div>
			) : (
				<>
					<div className="mb-4 rounded-lg bg-blue-50 p-4">
						<p className="text-sm text-blue-800">
							<strong>كيفية الربط:</strong> اختر الحقل المناسب من قائمة البيانات
							المتاحة لكل قيمة. إذا كانت القيمة ثابتة (لا تتغير)، اختر "نص مخصص"
							وأدخل القيمة النهائية.
						</p>
					</div>

					<Table
						dataSource={dataFields}
						columns={columns}
						rowKey="key"
						pagination={false}
						scroll={{ y: 400 }}
					/>

					<div className="mt-4 text-sm text-gray-600">
						<p>
							عدد الحقول المكتشفة: <strong>{dataFields.length}</strong>
						</p>
						<p>
							الحقول المربوطة:{" "}
							<strong>{dataFields.filter((f) => f.mappedField).length}</strong>
						</p>
					</div>
				</>
			)}

			<div className="mt-6 flex justify-between">
				<Button onClick={onBack}>السابق</Button>
				<div className="space-x-2 space-x-reverse">
					<Button onClick={handleSkip}>تخطي</Button>
					<Button type="primary" onClick={handleNext}>
						التالي
					</Button>
				</div>
			</div>
		</div>
	)
}

export default DataMapper
