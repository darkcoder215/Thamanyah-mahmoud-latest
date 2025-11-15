import React, { useState, useEffect } from "react"
import Image from "next/image"
import { InboxOutlined } from "@ant-design/icons"
import { Form, Input, Radio, Select, Upload, message, Alert } from "antd"
import { type JobOfferFormProps } from "./JobOfferFormTypes"
import ManagerSign from "./ManagerSign"
import { CustomTemplate } from "@/components/TemplateBuilder/TemplateBuilderForm"

const { Option } = Select

const BasicInfo: React.FC<JobOfferFormProps> = ({ formData, setFormData, levels }) => {
	const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>([])

	// Load custom templates from localStorage
	useEffect(() => {
		const stored = localStorage.getItem("customTemplates")
		if (stored) {
			try {
				setCustomTemplates(JSON.parse(stored))
			} catch (error) {
				console.error("Error loading custom templates:", error)
			}
		}
	}, [])
	return (
		<>
			{/* ========== GROUP 1: Document Configuration ========== */}
			<Form.Item
				label="نوع العقد"
				name="contractType"
				rules={[
					{
						required: true,
					},
				]}
			>
				<Radio.Group
					value={formData.contractType}
					options={[
						{ value: "employment", label: "توظيف" },
						{ value: "collaboration", label: "تعاون" },
					]}
					onChange={(e) => {
						setFormData({
							...formData,
							contractType: e.target.value,
						})
					}}
				/>
			</Form.Item>
			<Form.Item
				label="نوع الطلب"
				name="offerType"
				rules={[
					{
						required: true,
					},
				]}
			>
				<Radio.Group
					value={formData.offerType}
					options={[
						{ value: "general", label: "عام" },
						{ value: "technical", label: "تقني" },
						{ value: "managerial", label: "إداري" },
					]}
					onChange={(e) => {
						setFormData({
							...formData,
							offerType: e.target.value,
						})
					}}
				/>
			</Form.Item>
			<Form.Item
				label="المظهر 🎨"
				name="theme"
				rules={[
					{
						required: true,
					},
				]}
			>
				<Radio.Group
					value={formData.theme}
					optionType="button"
					buttonStyle="outline"
					options={[
						{ value: "general", label: "عام" },
						{ value: "league", label: "دوري ⚽" },
						{ value: "custom", label: "قالب مخصص 🎨" },
					]}
					onChange={(e) => {
						setFormData({
							...formData,
							theme: e.target.value,
							customTemplateId: undefined, // Reset custom template when changing theme
						})
					}}
				/>
			</Form.Item>

			{/* Custom template selector */}
			{formData.theme === "custom" && (
				<Form.Item
					label="اختر القالب المخصص"
					name="customTemplateId"
					rules={[
						{
							required: true,
							message: "الرجاء اختيار قالب مخصص",
						},
					]}
				>
					{customTemplates.length === 0 ? (
						<Alert
							message="لا توجد قوالب مخصصة"
							description={
								<span>
									قم بإنشاء قالب مخصص من صفحة{" "}
									<a href="/custom-templates" target="_blank">
										إدارة القوالب المخصصة
									</a>
								</span>
							}
							type="warning"
							showIcon
						/>
					) : (
						<Select
							value={formData.customTemplateId}
							onChange={(value) =>
								setFormData({
									...formData,
									customTemplateId: value,
								})
							}
							placeholder="اختر قالبًا من القائمة"
						>
							{customTemplates.map((template) => (
								<Option key={template.id} value={template.id}>
									{template.name}
									{template.description && (
										<span className="text-xs text-gray-500">
											{" "}
											- {template.description}
										</span>
									)}
								</Option>
							))}
						</Select>
					)}
				</Form.Item>
			)}

			{/* Image upload for league theme */}
			{formData.theme === "league" && (
				<Form.Item label="صورة الغلاف A4 (اختياري)">
					<Upload.Dragger
						accept="image/*"
						maxCount={1}
						showUploadList={false}
						beforeUpload={(file) => {
							const isImage = file.type.startsWith("image/")
							if (!isImage) {
								message.error("يرجى رفع صورة فقط")
								return Upload.LIST_IGNORE
							}
							const reader = new FileReader()
							reader.onload = (e) => {
								setFormData({
									...formData,
									leagueCoverImage: e.target?.result as string,
								})
							}
							reader.readAsDataURL(file)
							return false // Prevent upload
						}}
						style={{ width: "100%" }}
					>
						<p className="ant-upload-drag-icon">
							{formData.leagueCoverImage ? (
								<Image
									alt="League Cover Preview"
									src={formData.leagueCoverImage}
									width={100}
									height={150}
									className="mx-auto h-auto"
								/>
							) : (
								<InboxOutlined />
							)}
						</p>
						<p className="ant-upload-text">اسحب الصورة هنا أو انقر للرفع</p>
					</Upload.Dragger>
				</Form.Item>
			)}

			<Form.Item
				label="مستلمو البريد"
				name="email"
				className="mb-10!"
				initialValue={formData.email}
				rules={[
					{
						required: false,
						message: "يرجى إدخال بريد إلكتروني صحيح.",
						validator: (_, value: string) => {
							const emails = value.split(",").map((email) => email.trim())
							const isValid = emails.every((email: string) =>
								/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
							)
							return !emails || isValid // make it required
								? Promise.resolve()
								: Promise.reject(new Error("يرجى إدخال بريد إلكتروني صحيح."))
						},
					},
				]}
				tooltip={{
					title: "كل بريد يُكتب هنا ستصله نسخة من الملف النهائي عند إرساله.",
					placement: "top",
				}}
				help={"يمكنك إضافة بريد إلكتروني واحد أو أكثر عن طريق إضافة فاصلة (,) بين كل بريد."}
			>
				<Input
					type="email"
					onChange={(e) =>
						setFormData({
							...formData,
							email: e.target.value,
						})
					}
				/>
			</Form.Item>

			{/* ========== GROUP 2: Candidate Information ========== */}
			<Form.Item
				label="الاسم"
				name="name"
				initialValue={formData.name}
				rules={[
					{
						required: true,
					},
				]}
			>
				<Input
					onChange={(e) =>
						setFormData({
							...formData,
							name: e.target.value,
						})
					}
				/>
			</Form.Item>
			<Form.Item
				label="المسمى الوظيفي (بالعربية)"
				name="jobTitle"
				rules={[
					{
						required: true,
						message: "يرجى إدخال المسمى الوظيفي بالعربية.",
					},
				]}
			>
				<Input
					value={formData.jobTitle}
					placeholder="مثال: مديرة منتج"
					onChange={(e) =>
						setFormData({
							...formData,
							jobTitle: e.target.value,
						})
					}
				/>
			</Form.Item>
			<Form.Item
				label="المسمى الوظيفي (بالإنجليزية)"
				name="jobTitleEn"
				rules={[
					{
						required: false,
					},
				]}
			>
				<Input
					value={formData.jobTitleEn}
					placeholder="مثال: Product Manager"
					onChange={(e) =>
						setFormData({
							...formData,
							jobTitleEn: e.target.value,
						})
					}
				/>
			</Form.Item>

			{/* ========== GROUP 3: Organizational Structure ========== */}
			<Form.Item
				label="القسم"
				name="department"
				rules={[
					{
						required: true,
					},
				]}
			>
				<Input
					value={formData.department}
					onChange={(e) =>
						setFormData({
							...formData,
							department: e.target.value,
						})
					}
				/>
			</Form.Item>
			<Form.Item
				label="الفريق"
				name="team"
				rules={[
					{
						required: true,
					},
				]}
			>
				<Input
					value={formData.team}
					onChange={(e) =>
						setFormData({
							...formData,
							team: e.target.value,
						})
					}
				/>
			</Form.Item>
			<Form.Item
				label="المدير المباشر"
				name="directManager"
				rules={[
					{
						required: true,
					},
				]}
			>
				<Input
					value={formData.directManager}
					onChange={(e) =>
						setFormData({
							...formData,
							directManager: e.target.value,
						})
					}
				/>
			</Form.Item>
			<Form.Item
				label="المسمى الوظيفي للمدير المباشر"
				name="directManagerJobTitle"
				rules={[
					{
						required: true,
					},
				]}
			>
				<Input
					value={formData.directManagerJobTitle}
					onChange={(e) =>
						setFormData({
							...formData,
							directManagerJobTitle: e.target.value,
						})
					}
				/>
			</Form.Item>

			{/* ========== GROUP 4: Employment Details ========== */}
			<Form.Item
				label="نوع الدوام"
				name="workTypeParent"
				rules={[
					{
						required: true,
					},
				]}
			>
				<Radio.Group
					value={formData.workTypeParent}
					options={[
						{ value: "employee", label: "موظف" },
						{ value: "contract", label: "متعاقد" },
					]}
					onChange={(e) => {
						setFormData({
							...formData,
							workTypeParent: e.target.value,
							// Reset dependent fields
							workType: e.target.value === "employee" ? formData.workType : undefined,
							contractDuration:
								e.target.value === "contract"
									? formData.contractDuration
									: undefined,
						})
					}}
				/>
			</Form.Item>

			{/* If employee, show work type options */}
			{formData.workTypeParent === "employee" && (
				<Form.Item
					label="نوع الدوام"
					name="workType"
					rules={[
						{
							required: true,
						},
					]}
				>
					<Radio.Group
						value={formData.workType}
						options={[
							{ value: "كامل", label: "كامل" },
							{ value: "جزئي", label: "جزئي" },
						]}
						onChange={(e) => {
							setFormData({
								...formData,
								workType: e.target.value,
							})
						}}
					/>
				</Form.Item>
			)}

			{/* If contract, show contract duration */}
			{formData.workTypeParent === "contract" && (
				<Form.Item
					label="مدة التعاقد"
					name="contractDuration"
					rules={[
						{
							required: true,
						},
					]}
				>
					<Input
						value={formData.contractDuration}
						placeholder="3 أشهر"
						onChange={(e) =>
							setFormData({
								...formData,
								contractDuration: e.target.value,
							})
						}
					/>
				</Form.Item>
			)}
			<Form.Item
				label="بلد التعاقد"
				name="contractCountry"
				rules={[
					{
						required: false,
					},
				]}
				tooltip="املأ هذا الحقل إذا كان التعاقد خارج السعودية"
			>
				<Input
					value={formData.contractCountry}
					placeholder="سوريا"
					onChange={(e) =>
						setFormData({
							...formData,
							contractCountry: e.target.value,
						})
					}
				/>
			</Form.Item>
			<Form.Item
				label="مدينة التعاقد"
				name="contractCity"
				rules={[
					{
						required: false,
					},
				]}
				tooltip="املأ هذا الحقل إذا كان التعاقد داخل السعودية"
			>
				<Input
					value={formData.contractCity}
					placeholder="الرياض"
					onChange={(e) =>
						setFormData({
							...formData,
							contractCity: e.target.value,
						})
					}
				/>
			</Form.Item>
			<Form.Item
				label="المستوى"
				name="level"
				rules={[
					{
						required: true,
					},
				]}
			>
				<Select
					value={formData.level}
					onChange={(value) => setFormData({ ...formData, level: value })}
				>
					{levels.map((level) => (
						<Option key={level.level} value={level.level}>
							{level.level > 0 ? level.level : ""}
							{level.roleEN ? " ." : ""}
							{level.roleAR}
							{level.roleEN ? " | " : ""}
							{level.roleEN}
						</Option>
					))}
				</Select>
			</Form.Item>

			{/* ========== GROUP 5: Authorization ========== */}
			<ManagerSign formData={formData} setFormData={setFormData} />
		</>
	)
}

export default BasicInfo
