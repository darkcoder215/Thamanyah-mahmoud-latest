"use client"

import React, { useEffect, useState } from "react"
import { Button, Card, Upload, message } from "antd"
import { InboxOutlined, CheckCircleOutlined } from "@ant-design/icons"
import Image from "next/image"

interface AssetManagerProps {
	convertedCode: string
	onAssetsUpload: (assets: { [key: string]: string }) => void
	onBack: () => void
}

interface AssetItem {
	placeholder: string
	uploadedUrl: string | null
	description: string
}

const AssetManager: React.FC<AssetManagerProps> = ({ convertedCode, onAssetsUpload, onBack }) => {
	const [assets, setAssets] = useState<AssetItem[]>([])
	const [allUploaded, setAllUploaded] = useState(false)

	// Extract placeholder images from code
	const extractPlaceholders = (code: string): AssetItem[] => {
		const placeholders: AssetItem[] = []
		const imageRegex = /src=["']([^"']+)["']/g
		let match

		while ((match = imageRegex.exec(code)) !== null) {
			const url = match[1]
			if (url.includes("placehold.co") || url.startsWith("http")) {
				// Determine description based on context
				let description = "صورة"

				// Try to find context around the image
				const contextStart = Math.max(0, match.index - 200)
				const contextEnd = Math.min(code.length, match.index + 200)
				const context = code.substring(contextStart, contextEnd)

				// Look for nearby text that might describe the image
				if (context.includes("airplane") || context.includes("طيران"))
					description = "أيقونة الطيران"
				else if (context.includes("medical") || context.includes("طبي"))
					description = "أيقونة التأمين الطبي"
				else if (context.includes("flexibility") || context.includes("مرونة"))
					description = "أيقونة المرونة"
				else if (context.includes("weekend") || context.includes("إجازة"))
					description = "أيقونة الإجازات"
				else if (context.includes("laptop") || context.includes("جهاز"))
					description = "أيقونة الجهاز"
				else if (context.includes("logo") || context.includes("شعار")) description = "الشعار"

				placeholders.push({
					placeholder: url,
					uploadedUrl: null,
					description,
				})
			}
		}

		// Remove duplicates
		return placeholders.filter(
			(item, index, self) => index === self.findIndex((t) => t.placeholder === item.placeholder),
		)
	}

	useEffect(() => {
		const extracted = extractPlaceholders(convertedCode)
		setAssets(extracted)
	}, [convertedCode])

	useEffect(() => {
		// Check if all assets are uploaded
		const uploaded = assets.length > 0 && assets.every((asset) => asset.uploadedUrl !== null)
		setAllUploaded(uploaded)
	}, [assets])

	const handleUpload = (index: number, file: File) => {
		console.log(`📤 Uploading asset #${index + 1}:`, file.name)

		// Validate file
		if (!file.type.startsWith("image/")) {
			console.error("❌ Invalid file type:", file.type)
			message.error("يرجى رفع ملف صورة فقط (PNG, JPG, SVG)")
			return false
		}

		// Check file size (max 5MB)
		const maxSize = 5 * 1024 * 1024 // 5MB
		if (file.size > maxSize) {
			console.error("❌ File too large:", file.size, "bytes")
			message.error("حجم الملف كبير جداً. الحد الأقصى 5 ميجابايت")
			return false
		}

		console.log("✅ File validation passed")
		console.log("📦 File size:", (file.size / 1024).toFixed(2), "KB")
		console.log("🎨 File type:", file.type)

		const reader = new FileReader()

		reader.onload = (e) => {
			try {
				const updatedAssets = [...assets]
				const base64 = e.target?.result as string
				updatedAssets[index].uploadedUrl = base64

				console.log(`✅ Asset uploaded successfully: ${updatedAssets[index].description}`)
				console.log("📊 Base64 length:", base64.length, "characters")

				setAssets(updatedAssets)
				message.success(`تم رفع ${updatedAssets[index].description}`)
			} catch (error) {
				console.error("❌ Error processing file:", error)
				message.error("حدث خطأ أثناء معالجة الملف")
			}
		}

		reader.onerror = (error) => {
			console.error("❌ FileReader error:", error)
			message.error("حدث خطأ أثناء قراءة الملف")
		}

		reader.readAsDataURL(file)
		return false // Prevent default upload
	}

	const handleNext = () => {
		if (!allUploaded && assets.length > 0) {
			message.warning("الرجاء رفع جميع الأصول المطلوبة")
			return
		}

		// Create asset mapping
		const assetMap: { [key: string]: string } = {}
		assets.forEach((asset) => {
			if (asset.uploadedUrl) {
				assetMap[asset.placeholder] = asset.uploadedUrl
			}
		})

		onAssetsUpload(assetMap)
	}

	const handleSkip = () => {
		// Allow skipping if no placeholders found
		onAssetsUpload({})
	}

	return (
		<div>
			<h2 className="mb-4 text-xl font-semibold">رفع الأصول (الصور والأيقونات)</h2>

			{assets.length === 0 ? (
				<div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
					<CheckCircleOutlined className="mb-2 text-4xl text-green-500" />
					<p className="text-lg font-medium">لم يتم العثور على أصول تحتاج للرفع</p>
					<p className="text-sm text-gray-600">يمكنك المتابعة للخطوة التالية</p>
				</div>
			) : (
				<>
					<p className="mb-4 text-gray-600">
						تم العثور على <strong>{assets.length}</strong> صورة/أيقونة تحتاج للرفع
					</p>

					<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
						{assets.map((asset, index) => (
							<Card
								key={index}
								className="overflow-hidden"
								cover={
									asset.uploadedUrl ? (
										<div className="relative h-48 bg-gray-100">
											<Image
												src={asset.uploadedUrl}
												alt={asset.description}
												fill
												className="object-contain p-4"
											/>
										</div>
									) : (
										<div className="flex h-48 items-center justify-center bg-gray-100">
											<InboxOutlined className="text-4xl text-gray-400" />
										</div>
									)
								}
							>
								<Card.Meta
									title={asset.description}
									description={
										<div className="mt-2">
											<Upload
												accept="image/*,image/svg+xml"
												showUploadList={false}
												beforeUpload={(file) => handleUpload(index, file)}
											>
												<Button type="primary" block>
													{asset.uploadedUrl ? "تغيير الصورة" : "رفع الصورة"}
												</Button>
											</Upload>
											{asset.uploadedUrl && (
												<div className="mt-2 text-center text-xs text-green-600">
													<CheckCircleOutlined /> تم الرفع
												</div>
											)}
										</div>
									}
								/>
							</Card>
						))}
					</div>

					<div className="mt-4 rounded-lg bg-blue-50 p-4">
						<p className="text-sm text-blue-800">
							<strong>نصيحة:</strong> استخدم صور بصيغة PNG أو SVG للحصول على أفضل
							جودة. يُفضل أن تكون الخلفية شفافة.
						</p>
					</div>
				</>
			)}

			<div className="mt-6 flex justify-between">
				<Button onClick={onBack}>السابق</Button>
				<div className="space-x-2 space-x-reverse">
					{assets.length > 0 && (
						<Button onClick={handleSkip} disabled={allUploaded}>
							تخطي
						</Button>
					)}
					<Button
						type="primary"
						onClick={handleNext}
						disabled={!allUploaded && assets.length > 0}
					>
						التالي
					</Button>
				</div>
			</div>
		</div>
	)
}

export default AssetManager
