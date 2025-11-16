import React from "react"
import Image from "next/image"
import EditableWrapper from "./EditableWrapper"

interface CoverPageV2Props {
	name: string
	editMode?: boolean
	scale?: number
}

export default function CoverPageV2({ name, editMode = false, scale = 1 }: CoverPageV2Props) {
	const formatToday = () => {
		const date = new Date()
		const day = date.getDate()
		const year = date.getFullYear()
		const month = date.toLocaleDateString("ar", { month: "long" })
		return `${day} ${month} ${year}`
	}

	const Wrapper = editMode ? EditableWrapper : React.Fragment

	return (
		<div
			className="page-v2 mb-4 border-0! bg-black! print:bg-black!"
			style={{ background: 'black' }}
		>
			{/* Thmanyah Logo */}
			{editMode ? (
				<EditableWrapper initialLeft={195} initialTop={379} label="Logo">
					<Image
						src="/logo.png"
						alt="Thmanyah"
						width={341}
						height={68}
						className="object-contain"
					/>
				</EditableWrapper>
			) : (
				<div style={{ position: 'absolute', left: 195, top: 379 }}>
					<Image
						src="/logo.png"
						alt="Thmanyah"
						width={341}
						height={68}
						className="object-contain"
					/>
				</div>
			)}

			{/* Name */}
			{editMode ? (
				<EditableWrapper initialLeft={406} initialTop={452} label="Name">
					<div
						className="font-8-display text-white"
						style={{
							fontSize: 29,
							fontWeight: '400',
							letterSpacing: 0.96,
							textAlign: 'right'
						}}
					>
						{name}
					</div>
				</EditableWrapper>
			) : (
				<div
					className="font-8-display text-white absolute"
					style={{
						left: 406,
						top: 452,
						fontSize: 29,
						fontWeight: '400',
						letterSpacing: 0.96,
						textAlign: 'right'
					}}
				>
					{name}
				</div>
			)}

			{/* Date */}
			{editMode ? (
				<EditableWrapper initialLeft={479} initialTop={795} label="Date">
					<div
						className="font-8-sans text-white"
						style={{
							fontSize: 12,
							fontWeight: '500'
						}}
					>
						{formatToday()}
					</div>
				</EditableWrapper>
			) : (
				<div
					className="font-8-sans text-white absolute"
					style={{
						left: 479,
						top: 795,
						fontSize: 12,
						fontWeight: '500'
					}}
				>
					{formatToday()}
				</div>
			)}

			{/* White icon/rectangle */}
			{editMode ? (
				<EditableWrapper initialLeft={56} initialTop={774} label="Icon">
					<div
						style={{
							width: 32,
							height: 36,
							background: 'white'
						}}
					/>
				</EditableWrapper>
			) : (
				<div
					style={{
						width: 32,
						height: 36,
						left: 56,
						top: 774,
						position: 'absolute',
						background: 'white'
					}}
				/>
			)}
		</div>
	)
}
