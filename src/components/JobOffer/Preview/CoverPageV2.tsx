import React from "react"
import PageFooter from "@/components/Form/Preview/PageFooter"

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
		<div className="page mb-4 flex flex-col justify-center border-0! bg-black! print:bg-black!" style={{ background: 'black', overflow: 'hidden', position: 'relative' }}>
			{/* Name */}
			<div style={{left: 406, top: 452, position: 'absolute', textAlign: 'right', color: 'white', fontSize: 29, fontFamily: 'Thmanyah serif display 1.2', fontWeight: '400', letterSpacing: 0.96, wordWrap: 'break-word'}}>
				{name}
			</div>

			{/* Date */}
			<div style={{left: 479, top: 795, position: 'absolute', color: 'white', fontSize: 12, fontFamily: 'Thmanyah sans 1.2', fontWeight: '500', wordWrap: 'break-word'}}>
				{formatToday()}
			</div>

			{/* White icon/rectangle */}
			<div style={{width: 32, height: 36, left: 56, top: 774, position: 'absolute', background: 'white'}} />

			{/* Thmanyah Arabic Logo - SVG paths converted from design */}
			<div style={{width: 341, height: 68, left: 195, top: 379, position: 'absolute', overflow: 'hidden'}}>
				<div style={{width: 78.79, height: 38.21, left: 0, top: 29.79, position: 'absolute', background: 'white'}} />
				<div style={{width: 13.72, height: 9.79, left: 73.50, top: 31.06, position: 'absolute', background: 'white'}} />
				<div style={{width: 27.40, height: 40.84, left: 84.75, top: -0.02, position: 'absolute', background: 'white'}} />
				<div style={{width: 19.55, height: 31.48, left: 108.98, top: 22.50, position: 'absolute', background: 'white'}} />
				<div style={{width: 30.76, height: 39.34, left: 126.07, top: 1.50, position: 'absolute', background: 'white'}} />
				<div style={{width: 20.54, height: 35.97, left: 158.82, top: 16.60, position: 'absolute', background: 'white'}} />
				<div style={{width: 102.31, height: 47.33, left: 191.87, top: 5.11, position: 'absolute', background: 'white'}} />
				<div style={{width: 24.76, height: 31.69, left: 289.31, top: 22.56, position: 'absolute', background: 'white'}} />
				<div style={{width: 29.40, height: 26.87, left: 311.60, top: 13.98, position: 'absolute', background: 'white'}} />
			</div>
		</div>
	)
}
