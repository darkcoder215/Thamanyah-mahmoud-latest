"use client"

import React, { useState } from "react"
import { Upload, message } from "antd"
import { UploadOutlined } from "@ant-design/icons"

interface EditableWrapperProps {
	children: React.ReactNode
	initialLeft: number
	initialTop: number
	label: string
	width?: number
	height?: number
	fontInfo?: string // e.g., "font-8-display, 24px, 900"
	canUploadImage?: boolean
	onPositionChange?: (left: number, top: number) => void
	onImageChange?: (imageUrl: string) => void
}

export default function EditableWrapper({
	children,
	initialLeft,
	initialTop,
	label,
	width,
	height,
	fontInfo,
	canUploadImage = false,
	onPositionChange,
	onImageChange,
}: EditableWrapperProps) {
	const [position, setPosition] = useState({ left: initialLeft, top: initialTop })
	const [isDragging, setIsDragging] = useState(false)
	const [showAlignmentGuides, setShowAlignmentGuides] = useState(false)

	// Common alignment points (page center, thirds, etc.)
	const alignmentPoints = {
		horizontal: [0, 48, 73, 171, 224, 297.5, 322, 407, 547], // Common X positions
		vertical: [0, 80, 131, 204, 278, 313, 421, 615, 689, 766], // Common Y positions
	}

	const handleMouseDown = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		setIsDragging(true)
		setShowAlignmentGuides(true)

		const startX = e.clientX
		const startY = e.clientY
		const startLeft = position.left
		const startTop = position.top

		const handleMouseMove = (moveEvent: MouseEvent) => {
			const deltaX = moveEvent.clientX - startX
			const deltaY = moveEvent.clientY - startY
			let newLeft = startLeft + deltaX
			let newTop = startTop + deltaY

			// Snap to alignment points (within 5px)
			const snapThreshold = 5
			for (const point of alignmentPoints.horizontal) {
				if (Math.abs(newLeft - point) < snapThreshold) {
					newLeft = point
				}
			}
			for (const point of alignmentPoints.vertical) {
				if (Math.abs(newTop - point) < snapThreshold) {
					newTop = point
				}
			}

			setPosition({ left: newLeft, top: newTop })
			onPositionChange?.(newLeft, newTop)
		}

		const handleMouseUp = () => {
			setIsDragging(false)
			setShowAlignmentGuides(false)
			document.removeEventListener('mousemove', handleMouseMove)
			document.removeEventListener('mouseup', handleMouseUp)

			// Log to console for easy copying
			console.log(`${label}: left=${Math.round(position.left)}, top=${Math.round(position.top)}`)
		}

		document.addEventListener('mousemove', handleMouseMove)
		document.addEventListener('mouseup', handleMouseUp)
	}

	const handleImageUpload = (file: File) => {
		const reader = new FileReader()
		reader.onload = (e) => {
			const imageUrl = e.target?.result as string
			onImageChange?.(imageUrl)
			message.success('Image uploaded! (Note: This is preview only, update code to make permanent)')
		}
		reader.readAsDataURL(file)
		return false // Prevent default upload
	}

	return (
		<>
			{/* Alignment guides - only show when dragging */}
			{showAlignmentGuides && (
				<>
					{/* Vertical guide at current X position */}
					<div
						style={{
							position: 'absolute',
							left: position.left,
							top: 0,
							width: 1,
							height: '100%',
							background: '#00bfff',
							opacity: 0.5,
							pointerEvents: 'none',
							zIndex: 999,
						}}
					/>
					{/* Horizontal guide at current Y position */}
					<div
						style={{
							position: 'absolute',
							left: 0,
							top: position.top,
							width: '100%',
							height: 1,
							background: '#00bfff',
							opacity: 0.5,
							pointerEvents: 'none',
							zIndex: 999,
						}}
					/>
				</>
			)}

			{/* Editable wrapper */}
			<div
				className="editable-wrapper-container"
				style={{
					position: 'absolute',
					left: position.left,
					top: position.top,
					border: '2px dashed #ff6b00',
					padding: '4px',
					cursor: isDragging ? 'grabbing' : 'grab',
					background: isDragging ? 'rgba(255, 107, 0, 0.2)' : 'rgba(255, 107, 0, 0.1)',
					boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
				}}
				onMouseDown={handleMouseDown}
			>
				{/* Info Bar */}
				<div
					className="editable-wrapper-infobar"
					style={{
						position: 'absolute',
						top: -30,
						left: 0,
						background: '#ff6b00',
						color: 'white',
						padding: '4px 12px',
						fontSize: '11px',
						borderRadius: '4px',
						whiteSpace: 'nowrap',
						userSelect: 'none',
						fontWeight: 600,
						boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
						zIndex: 1000,
						display: 'flex',
						gap: '8px',
						alignItems: 'center',
					}}
				>
					<span>{label}</span>
					{fontInfo && (
						<span style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '2px', fontSize: '9px' }}>
							{fontInfo}
						</span>
					)}
					<span style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: '2px' }}>
						L: {Math.round(position.left)}
					</span>
					<span style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: '2px' }}>
						T: {Math.round(position.top)}
					</span>
					{width && height && (
						<span style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: '2px' }}>
							{width}×{height}px
						</span>
					)}
					{canUploadImage && (
						<Upload
							accept="image/*"
							showUploadList={false}
							beforeUpload={handleImageUpload}
						>
							<button
								onClick={(e) => e.stopPropagation()}
								style={{
									background: 'white',
									color: '#ff6b00',
									border: 'none',
									borderRadius: '3px',
									padding: '2px 8px',
									cursor: 'pointer',
									fontSize: '10px',
									fontWeight: 600,
								}}
							>
								📁 Upload
							</button>
						</Upload>
					)}
				</div>

				{/* Content */}
				<div style={{ pointerEvents: 'none' }}>
					{children}
				</div>
			</div>
		</>
	)
}
