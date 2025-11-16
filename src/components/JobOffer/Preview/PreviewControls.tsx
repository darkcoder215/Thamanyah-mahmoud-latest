"use client"

import React, { useState } from "react"
import { Button, InputNumber, Space, Card } from "antd"

interface PreviewControlsProps {
	onEditModeToggle: (enabled: boolean) => void
	onScaleChange: (scale: number) => void
}

export default function PreviewControls({ onEditModeToggle, onScaleChange }: PreviewControlsProps) {
	const [editMode, setEditMode] = useState(false)
	const [figmaWidth, setFigmaWidth] = useState(595) // Default A4 @ 72dpi
	const [figmaHeight, setFigmaHeight] = useState(842)
	const [scale, setScale] = useState(1)

	const A4_WIDTH_PX = 595 // 210mm @ 72dpi
	const A4_HEIGHT_PX = 842 // 297mm @ 72dpi

	const calculateScale = () => {
		const scaleX = A4_WIDTH_PX / figmaWidth
		const scaleY = A4_HEIGHT_PX / figmaHeight
		const newScale = Math.min(scaleX, scaleY)
		setScale(newScale)
		onScaleChange(newScale)
	}

	return (
		<Card
			className="hide-print mb-4"
			title="🛠️ Preview Controls"
			size="small"
			style={{ maxWidth: 800, margin: '0 auto' }}
		>
			<Space direction="vertical" style={{ width: '100%' }}>
				<Space>
					<Button
						type={editMode ? "primary" : "default"}
						onClick={() => {
							const newMode = !editMode
							setEditMode(newMode)
							onEditModeToggle(newMode)
						}}
					>
						{editMode ? "✓ Exit Edit Mode" : "✏️ Enable Edit Mode"}
					</Button>
					{editMode && (
						<span style={{ fontSize: 12, color: '#666' }}>
							Double-click any element to drag it. Click ✓ to lock position.
						</span>
					)}
				</Space>

				<Space>
					<span>Figma Frame Width (px):</span>
					<InputNumber
						min={100}
						max={2000}
						value={figmaWidth}
						onChange={(val) => setFigmaWidth(val || 595)}
					/>
					<span>Height (px):</span>
					<InputNumber
						min={100}
						max={3000}
						value={figmaHeight}
						onChange={(val) => setFigmaHeight(val || 842)}
					/>
					<Button onClick={calculateScale}>Calculate Scale</Button>
					{scale !== 1 && (
						<span style={{ fontSize: 12, color: '#ff6b00', fontWeight: 'bold' }}>
							Scale: {scale.toFixed(4)}x
						</span>
					)}
				</Space>

				<div style={{ fontSize: 11, color: '#999' }}>
					<strong>Info:</strong> A4 @ 72dpi = 595×842px | @ 96dpi = 794×1123px | @ 150dpi = 1240×1754px
				</div>

				<div style={{ fontSize: 11, color: '#666', background: '#f5f5f5', padding: 8, borderRadius: 4 }}>
					<strong>How to use:</strong><br />
					1. Enter your Figma frame dimensions above<br />
					2. Click "Calculate Scale" to see if scaling is needed<br />
					3. Enable "Edit Mode" to drag elements around<br />
					4. Copy the new positions from the orange labels
				</div>
			</Space>
		</Card>
	)
}
