"use client"

import React, { useState } from "react"
import { Button, Space, Alert } from "antd"

interface PreviewControlsProps {
	onEditModeToggle: (enabled: boolean) => void
	onScaleChange: (scale: number) => void
}

export default function PreviewControls({ onEditModeToggle }: PreviewControlsProps) {
	const [editMode, setEditMode] = useState(false)

	return (
		<div className="hide-print mb-6" style={{ maxWidth: 800, margin: '0 auto' }}>
			<Alert
				message={
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						<div>
							<strong style={{ fontSize: 16 }}>🛠️ Edit Mode</strong>
							<div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
								{editMode
									? "All elements are now draggable! Drag them to reposition. New positions will be logged to console."
									: "Click the button to make all elements draggable and adjustable."}
							</div>
						</div>
						<Button
							type={editMode ? "primary" : "default"}
							size="large"
							danger={editMode}
							onClick={() => {
								const newMode = !editMode
								setEditMode(newMode)
								onEditModeToggle(newMode)
							}}
							style={{ marginLeft: 16 }}
						>
							{editMode ? "✓ Exit Edit Mode" : "✏️ Enable Edit Mode"}
						</Button>
					</div>
				}
				type={editMode ? "success" : "info"}
				showIcon={false}
				style={{ border: `2px solid ${editMode ? '#ff6b00' : '#1890ff'}` }}
			/>

			{editMode && (
				<>
					<Alert
						message="⚠️ IMPORTANT: Disable Edit Mode Before Printing/Downloading!"
						description="Make sure to click 'Exit Edit Mode' before you print or download the PDF to avoid any editing artifacts."
						type="error"
						showIcon
						style={{ marginTop: 12, marginBottom: 12 }}
					/>
					<Alert
						message="Instructions"
						description={
							<ul style={{ margin: 0, paddingLeft: 20 }}>
								<li><strong>Drag elements:</strong> Click and drag any orange-bordered element to move it</li>
								<li><strong>Alignment guides:</strong> Blue crosshairs appear while dragging to help you align elements</li>
								<li><strong>Snap to grid:</strong> Elements automatically snap to common alignment points</li>
								<li><strong>Font info:</strong> See which font class is used in the dark badge (font-8-sans, font-8-display, etc.)</li>
								<li><strong>Coordinates:</strong> Live position (L/T) and dimensions shown in orange bar</li>
								<li><strong>Image upload:</strong> Click "📁 Upload" on the logo to change the image</li>
								<li><strong>Console logs:</strong> Final positions logged to browser console (F12) when you release</li>
							</ul>
						}
						type="warning"
						showIcon
						style={{ marginTop: 12 }}
						closable
					/>
				</>
			)}
		</div>
	)
}
