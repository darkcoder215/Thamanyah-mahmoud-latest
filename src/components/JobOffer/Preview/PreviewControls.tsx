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
				<Alert
					message="Instructions"
					description={
						<ul style={{ margin: 0, paddingLeft: 20 }}>
							<li>Click and drag any orange-bordered element to move it</li>
							<li>See live coordinates (L: left, T: top) and dimensions in the orange bar</li>
							<li>Click "📁 Upload" on the logo to change the image</li>
							<li>New positions are logged to browser console for you to copy</li>
							<li>Check the console (F12) to get the final coordinates</li>
						</ul>
					}
					type="warning"
					showIcon
					style={{ marginTop: 12 }}
					closable
				/>
			)}
		</div>
	)
}
