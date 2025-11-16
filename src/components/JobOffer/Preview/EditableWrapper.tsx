"use client"

import React, { useState } from "react"

interface EditableWrapperProps {
	children: React.ReactNode
	initialLeft: number
	initialTop: number
	label: string
	onPositionChange?: (left: number, top: number) => void
}

export default function EditableWrapper({
	children,
	initialLeft,
	initialTop,
	label,
	onPositionChange,
}: EditableWrapperProps) {
	const [isDragging, setIsDragging] = useState(false)
	const [position, setPosition] = useState({ left: initialLeft, top: initialTop })
	const [isEditing, setIsEditing] = useState(false)

	if (!isEditing) {
		return (
			<div
				style={{
					position: 'absolute',
					left: position.left,
					top: position.top,
				}}
				onDoubleClick={(e) => {
					e.stopPropagation()
					setIsEditing(true)
				}}
			>
				{children}
			</div>
		)
	}

	return (
		<div
			style={{
				position: 'absolute',
				left: position.left,
				top: position.top,
				border: '2px dashed #ff6b00',
				padding: '2px',
				cursor: isDragging ? 'grabbing' : 'grab',
				background: isDragging ? 'rgba(255, 107, 0, 0.1)' : 'transparent',
			}}
			onMouseDown={(e) => {
				e.preventDefault()
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
				}

				document.addEventListener('mousemove', handleMouseMove)
				document.addEventListener('mouseup', handleMouseUp)
			}}
		>
			<div
				style={{
					position: 'absolute',
					top: -20,
					left: 0,
					background: '#ff6b00',
					color: 'white',
					padding: '2px 8px',
					fontSize: '10px',
					borderRadius: '3px',
					whiteSpace: 'nowrap',
					userSelect: 'none',
				}}
			>
				{label} (L: {Math.round(position.left)}, T: {Math.round(position.top)})
				<button
					onClick={(e) => {
						e.stopPropagation()
						setIsEditing(false)
					}}
					style={{
						marginLeft: '8px',
						background: 'white',
						color: '#ff6b00',
						border: 'none',
						borderRadius: '2px',
						padding: '0 4px',
						cursor: 'pointer',
						fontSize: '10px',
					}}
				>
					✓
				</button>
			</div>
			{children}
		</div>
	)
}
