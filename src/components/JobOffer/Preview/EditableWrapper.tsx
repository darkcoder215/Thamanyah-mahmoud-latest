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
	canUploadImage = false,
	onPositionChange,
	onImageChange,
}: EditableWrapperProps) {
	const [position, setPosition] = useState({ left: initialLeft, top: initialTop })
	const [isDragging, setIsDragging] = useState(false)

	const handleMouseDown = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		setIsDragging(true)

		const startX = e.clientX
		const startY = e.clientY
		const startLeft = position.left
		const startTop = position.top

		const handleMouseMove = (moveEvent: MouseEvent) => {
			const deltaX = moveEvent.clientX - startX
			const deltaY = moveEvent.clientY - startY
			const newLeft = startLeft + deltaX
			const newTop = startTop + deltaY
			setPosition({ left: newLeft, top: newTop })
			onPositionChange?.(newLeft, newTop)
		}

		const handleMouseUp = () => {
			setIsDragging(false)
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
		<div
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
	)
}

