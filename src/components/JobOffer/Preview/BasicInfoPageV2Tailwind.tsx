"use client"

import React from "react"
import TailwindPage from "./TailwindPage"
import { type JobOfferFormData } from "../../Form/JobOfferFormTypes"

interface BasicInfoPageV2TailwindProps {
	formData: JobOfferFormData
	levels?: any
	editMode?: boolean
	scale?: number
}

/**
 * EXAMPLE: How to use TailwindPage with Figma JSX
 *
 * 1. Copy Tailwind JSX from Figma Dev Mode
 * 2. Paste it inside <TailwindPage>
 * 3. Replace hardcoded text with {formData.name}, {formData.jobTitle}, etc.
 * 4. That's it! Fonts auto-convert, PDF generation works, edit mode works.
 */
export default function BasicInfoPageV2Tailwind({ formData, levels, editMode = false }: BasicInfoPageV2TailwindProps) {
	const firstName = formData.name.split(" ")[0]

	return (
		<TailwindPage editMode={editMode}>
			{/* PASTE FIGMA TAILWIND JSX BELOW THIS LINE */}
			<div className="w-[595px] h-[842px] relative bg-stone-200 overflow-hidden">
				{/* Small black rectangle */}
				<div className="w-8 h-9 left-[40px] top-[766px] absolute bg-black" />

				{/* Green bar at top */}
				<div className="w-[661.48px] h-7 left-[-18.28px] top-[-13.11px] absolute opacity-90 bg-emerald-500" />

				{/* Welcome message */}
				<div className="w-[499px] left-[48px] top-[138px] absolute text-right justify-start text-black text-sm font-normal font-['Thmanyah_sans_1.2'] leading-5 tracking-tight">
					نتمنى أن تكون معنا في سعينا لإثراء المحتوى العربي وتغيير ثقافة الصحافة في الوطن العربي. يسعدنا العمل معك على النحو التالي:
				</div>

				{/* Job title box */}
				<div className="w-[510px] h-16 left-[37px] top-[204px] absolute bg-green-400 rounded-2xl" />
				<div className="left-[249px] top-[216px] absolute justify-start text-black text-sm font-normal font-['Thmanyah_sans_1.2'] leading-5 tracking-wide">
					المسمّى الوظيفي
				</div>
				<div className="left-[261px] top-[238px] absolute justify-start text-black text-sm font-bold font-['Thmanyah_sans_1.2'] leading-5 tracking-wide">
					{formData.jobTitle}
				</div>

				{/* Info boxes backgrounds */}
				<div className="w-80 h-16 left-[203px] top-[278px] absolute bg-green-300 rounded-2xl" />
				<div className="w-80 h-16 left-[203px] top-[352px] absolute bg-green-300 rounded-2xl" />
				<div className="w-40 h-36 left-[37px] top-[278px] absolute bg-green-300 rounded-2xl" />

				{/* Level label */}
				<div className="w-11 h-4 left-[99px] top-[287px] absolute justify-start text-black text-xs font-light font-['Thmanyah_sans_1.2'] leading-5 tracking-tight">
					المستوى
				</div>

				{/* First row: Team | Department | Management */}
				<div className="left-[223.50px] top-[290px] absolute inline-flex justify-start items-center gap-4">
					<div className="inline-flex flex-col justify-center items-center">
						<div className="text-center justify-start text-black text-xs font-light font-['Thmanyah_sans_1.2'] leading-5 tracking-tight">
							الفريق
						</div>
						<div className="text-center justify-start text-black text-xs font-bold font-['Thmanyah_sans_1.2'] leading-5 tracking-tight">
							{formData.team}
						</div>
					</div>
					<div className="w-10 h-0 origin-top-left rotate-90 outline outline-1 outline-offset-[-0.50px] outline-black"></div>
					<div className="inline-flex flex-col justify-center items-center">
						<div className="self-stretch text-center justify-start text-black text-xs font-light font-['Thmanyah_sans_1.2'] leading-5 tracking-tight">
							القسم
						</div>
						<div className="text-center justify-start text-black text-xs font-bold font-['Thmanyah_sans_1.2'] leading-5 tracking-tight">
							{formData.department}
						</div>
					</div>
					<div className="w-10 h-0 origin-top-left rotate-90 outline outline-1 outline-offset-[-0.50px] outline-black"></div>
					<div className="inline-flex flex-col justify-center items-center">
						<div className="text-center justify-start text-black text-xs font-light font-['Thmanyah_sans_1.2'] leading-5 tracking-tight">
							الإدارة
						</div>
						<div className="text-center justify-start text-black text-xs font-bold font-['Thmanyah_sans_1.2'] leading-5 tracking-tight">
							{formData.department}
						</div>
					</div>
				</div>

				{/* Second row: City | Work Type | Direct Manager */}
				<div className="w-80 left-[209px] top-[366px] absolute inline-flex justify-center items-center gap-4">
					<div className="w-24 inline-flex flex-col justify-center items-center">
						<div className="text-center justify-start text-black text-xs font-light font-['Thmanyah_sans_1.2'] leading-5 tracking-tight">
							{formData.contractCity ? 'مدينة التعاقد' : (formData.contractCountry ? 'بلد التعاقد' : 'موقع العمل')}
						</div>
						<div className="text-center justify-start text-black text-xs font-bold font-['Thmanyah_sans_1.2'] leading-5 tracking-tight">
							{formData.contractCity || formData.contractCountry || 'الرياض'}
						</div>
					</div>
					<div className="w-10 h-0 origin-top-left rotate-90 outline outline-1 outline-offset-[-0.50px] outline-black"></div>
					<div className="w-16 inline-flex flex-col justify-center items-center">
						<div className="text-center justify-start text-black text-xs font-light font-['Thmanyah_sans_1.2'] leading-5 tracking-tight">
							نوع الدوام
						</div>
						<div className="text-center justify-start text-black text-xs font-bold font-['Thmanyah_sans_1.2'] leading-5 tracking-tight">
							{formData.workType}
						</div>
					</div>
					<div className="w-10 h-0 origin-top-left rotate-90 outline outline-1 outline-offset-[-0.50px] outline-black"></div>
					<div className="w-24 inline-flex flex-col justify-center items-center">
						<div className="self-stretch text-center justify-start text-black text-xs font-light font-['Thmanyah_sans_1.2'] leading-5 tracking-tight">
							المدير المباشر
						</div>
						<div className="text-center justify-start text-black text-xs font-bold font-['Thmanyah_sans_1.2'] leading-5 tracking-tight">
							{formData.directManager}
						</div>
					</div>
				</div>

				{/* Expectations heading */}
				<div className="left-[226px] top-[455px] absolute text-right justify-start text-black text-2xl font-black font-['Thmanyah_serif_display_1.2'] tracking-wide">
					في هذه الوظيفة نتوقع منك التالي:
				</div>

				{/* Expectations list */}
				<div className="left-[101px] top-[509px] absolute text-right justify-start text-black text-xs font-light font-['Thmanyah_sans_1.2'] leading-5 tracking-tight">
					{formData.expectations.join('.\n')}
				</div>

				{/* Greeting with emoji and name */}
				<div className="left-[374.50px] top-[83px] absolute inline-flex justify-start items-center gap-2.5">
					<div className="inline-flex flex-col justify-center items-center">
						<div className="text-center justify-start text-black text-3xl font-bold font-['Thmanyah_sans_1.2'] leading-5 tracking-wide">
							👋🏻
						</div>
					</div>
					<div className="inline-flex flex-col justify-center items-center">
						<div className="text-center justify-start text-black text-3xl font-black font-['Thmanyah_serif_display_1.2'] tracking-wide">
							أهـلاً {firstName}
						</div>
					</div>
				</div>
			</div>
			{/* PASTE FIGMA TAILWIND JSX ABOVE THIS LINE */}
		</TailwindPage>
	)
}
