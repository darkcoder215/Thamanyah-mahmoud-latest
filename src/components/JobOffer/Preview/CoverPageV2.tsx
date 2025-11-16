import React from "react"
import Image from "next/image"

interface CoverPageV2Props {
	name: string
}

export default function CoverPageV2({ name }: CoverPageV2Props) {
	const formatToday = () => {
		const date = new Date()
		const day = date.getDate()
		const year = date.getFullYear()
		const month = date.toLocaleDateString("ar", { month: "long" })
		return `${day} ${month} ${year}`
	}

	return (
		<div
			className="page-v2 mb-4 border-0! bg-black! print:bg-black!"
			style={{ background: 'black' }}
		>
			{/* Thmanyah Logo */}
			<div style={{ position: 'absolute', left: 195, top: 379 }}>
				<Image
					src="/logo.png"
					alt="Thmanyah"
					width={341}
					height={68}
					className="object-contain"
				/>
			</div>

			{/* Name */}
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

			{/* Date */}
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

			{/* White icon/rectangle */}
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
		</div>
	)
}
