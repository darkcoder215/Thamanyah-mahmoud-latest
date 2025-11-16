import React from "react"
import { JobOfferFormData, JobOfferFormProps } from "@/components/Form/JobOfferFormTypes"
import PageFooter from "@/components/Form/Preview/PageFooter"

export default function BasicInfoPageV2({
	formData,
	levels,
}: {
	formData: JobOfferFormData
	levels: JobOfferFormProps["levels"]
}) {
	const firstName = formData.name.split(" ")[0]

	return (
		<div className="page font-8-sans" style={{width: '100%', height: '100%', position: 'relative', background: '#F2EEE4', overflow: 'hidden'}}>
			{/* Small black rectangle - decorative */}
			<div style={{width: 32, height: 36, left: 40, top: 766, position: 'absolute', background: 'black'}} />

			{/* Green bar at top */}
			<div style={{width: 661.48, height: 27.65, left: -18.28, top: -13.11, position: 'absolute', opacity: 0.89, background: '#03BB6E'}} />

			{/* Welcome message */}
			<div style={{width: 499, left: 48, top: 138, position: 'absolute', textAlign: 'right', color: 'black', fontSize: 14, fontFamily: 'Thmanyah sans 1.2', fontWeight: '400', lineHeight: 21, letterSpacing: 0.05, wordWrap: 'break-word'}}>
				نتمنى أن تكون معنا في سعينا لإثراء المحتوى العربي وتغيير ثقافة الصحافة في الوطن العربي. يسعدنا العمل معك على النحو التالي:
			</div>

			{/* Job title box */}
			<div style={{width: 510, height: 65, left: 37, top: 204, position: 'absolute', background: '#3BC17B', borderRadius: 16}} />
			<div style={{left: 249, top: 216, position: 'absolute', color: 'black', fontSize: 14, fontFamily: 'Thmanyah sans 1.2', fontWeight: '400', lineHeight: 21, letterSpacing: 0.44, wordWrap: 'break-word'}}>
				المسمّى الوظيفي
			</div>
			<div style={{left: 261, top: 238, position: 'absolute', color: 'black', fontSize: 14, fontFamily: 'Thmanyah sans 1.2', fontWeight: '700', lineHeight: 21, letterSpacing: 0.44, wordWrap: 'break-word'}}>
				{formData.jobTitle}
			</div>

			{/* Info boxes backgrounds */}
			<div style={{width: 344, height: 69, left: 203, top: 278, position: 'absolute', background: '#ABD9AB', borderRadius: 16}} />
			<div style={{width: 344, height: 69, left: 203, top: 352, position: 'absolute', background: '#ABD9AB', borderRadius: 16}} />
			<div style={{width: 160, height: 143, left: 37, top: 278, position: 'absolute', background: '#ABD9AB', borderRadius: 16}} />

			{/* Level label */}
			<div style={{width: 45, height: 16, left: 99, top: 287, position: 'absolute', color: 'black', fontSize: 12, fontFamily: 'Thmanyah sans 1.2', fontWeight: '300', lineHeight: 21, letterSpacing: 0.38, wordWrap: 'break-word'}}>
				المستوى
			</div>

			{/* First row: Team | Department | Management */}
			<div style={{left: 223.50, top: 290, position: 'absolute', justifyContent: 'flex-start', alignItems: 'center', gap: 16, display: 'inline-flex'}}>
				<div style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'inline-flex'}}>
					<div style={{textAlign: 'center', color: 'black', fontSize: 12, fontFamily: 'Thmanyah sans 1.2', fontWeight: '300', lineHeight: 21, letterSpacing: 0.38, wordWrap: 'break-word'}}>الفريق</div>
					<div style={{textAlign: 'center', color: 'black', fontSize: 12, fontFamily: 'Thmanyah sans 1.2', fontWeight: '700', lineHeight: 21, letterSpacing: 0.38, wordWrap: 'break-word'}}>
						{formData.team}
					</div>
				</div>
				<div style={{width: 42, height: 0, transform: 'rotate(90deg)', transformOrigin: 'top left', outline: '1px black solid', outlineOffset: '-0.50px'}}></div>
				<div style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'inline-flex'}}>
					<div style={{alignSelf: 'stretch', textAlign: 'center', color: 'black', fontSize: 12, fontFamily: 'Thmanyah sans 1.2', fontWeight: '300', lineHeight: 21, letterSpacing: 0.38, wordWrap: 'break-word'}}>القسم</div>
					<div style={{textAlign: 'center', color: 'black', fontSize: 12, fontFamily: 'Thmanyah sans 1.2', fontWeight: '700', lineHeight: 21, letterSpacing: 0.38, wordWrap: 'break-word'}}>
						{formData.department}
					</div>
				</div>
				<div style={{width: 42, height: 0, transform: 'rotate(90deg)', transformOrigin: 'top left', outline: '1px black solid', outlineOffset: '-0.50px'}}></div>
				<div style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'inline-flex'}}>
					<div style={{textAlign: 'center', color: 'black', fontSize: 12, fontFamily: 'Thmanyah sans 1.2', fontWeight: '300', lineHeight: 21, letterSpacing: 0.38, wordWrap: 'break-word'}}>الإدارة</div>
					<div style={{textAlign: 'center', color: 'black', fontSize: 12, fontFamily: 'Thmanyah sans 1.2', fontWeight: '700', lineHeight: 21, letterSpacing: 0.38, wordWrap: 'break-word'}}>
						{formData.department}
					</div>
				</div>
			</div>

			{/* Second row: City | Work Type | Direct Manager */}
			<div style={{width: 338, left: 209, top: 366, position: 'absolute', justifyContent: 'center', alignItems: 'center', gap: 16, display: 'inline-flex'}}>
				<div style={{width: 92, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'inline-flex'}}>
					<div style={{textAlign: 'center', color: 'black', fontSize: 12, fontFamily: 'Thmanyah sans 1.2', fontWeight: '300', lineHeight: 21, letterSpacing: 0.38, wordWrap: 'break-word'}}>
						{formData.contractCity ? 'مدينة التعاقد' : (formData.contractCountry ? 'بلد التعاقد' : 'موقع العمل')}
					</div>
					<div style={{textAlign: 'center', color: 'black', fontSize: 12, fontFamily: 'Thmanyah sans 1.2', fontWeight: '700', lineHeight: 21, letterSpacing: 0.38, wordWrap: 'break-word'}}>
						{formData.contractCity || formData.contractCountry || 'الرياض'}
					</div>
				</div>
				<div style={{width: 42, height: 0, transform: 'rotate(90deg)', transformOrigin: 'top left', outline: '1px black solid', outlineOffset: '-0.50px'}}></div>
				<div style={{width: 66, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'inline-flex'}}>
					<div style={{textAlign: 'center', color: 'black', fontSize: 12, fontFamily: 'Thmanyah sans 1.2', fontWeight: '300', lineHeight: 21, letterSpacing: 0.38, wordWrap: 'break-word'}}>نوع الدوام</div>
					<div style={{textAlign: 'center', color: 'black', fontSize: 12, fontFamily: 'Thmanyah sans 1.2', fontWeight: '700', lineHeight: 21, letterSpacing: 0.38, wordWrap: 'break-word'}}>
						{formData.workType}
					</div>
				</div>
				<div style={{width: 42, height: 0, transform: 'rotate(90deg)', transformOrigin: 'top left', outline: '1px black solid', outlineOffset: '-0.50px'}}></div>
				<div style={{width: 94, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'inline-flex'}}>
					<div style={{alignSelf: 'stretch', textAlign: 'center', color: 'black', fontSize: 12, fontFamily: 'Thmanyah sans 1.2', fontWeight: '300', lineHeight: 21, letterSpacing: 0.38, wordWrap: 'break-word'}}>المدير المباشر</div>
					<div style={{textAlign: 'center', color: 'black', fontSize: 12, fontFamily: 'Thmanyah sans 1.2', fontWeight: '700', lineHeight: 21, letterSpacing: 0.38, wordWrap: 'break-word'}}>
						{formData.directManager}
					</div>
				</div>
			</div>

			{/* Level chart - only show if level > 0 */}
			{levels && formData.level > 0 && (
				<>
					{/* Arabic level names */}
					{levels.map((level, index) => {
						if (level.level === 0) return null
						const isSelected = level.level === formData.level
						return (
							<div
								key={`ar-${level.level}`}
								style={{
									width: 54,
									height: isSelected ? 14 : 12,
									left: 129,
									top: 312 + (index - 1) * 20,
									position: 'absolute',
									textAlign: 'right',
									color: isSelected ? 'black' : '#315545',
									fontSize: isSelected ? 12 : 11,
									fontFamily: 'Thmanyah sans 1.2',
									fontWeight: isSelected ? '700' : '300',
									wordWrap: 'break-word'
								}}
							>
								{level.roleAR}
							</div>
						)
					})}

					{/* Numbers */}
					{levels.map((level, index) => {
						if (level.level === 0) return null
						const isSelected = level.level === formData.level
						return (
							<div
								key={`num-${level.level}`}
								style={{
									width: 6,
									height: isSelected ? 12 : 11,
									left: 114,
									top: 312 + (index - 1) * 20,
									position: 'absolute',
									color: isSelected ? 'black' : '#315545',
									fontSize: 10,
									fontFamily: 'Thmanyah sans 1.2',
									fontWeight: isSelected ? '700' : '300',
									wordWrap: 'break-word'
								}}
							>
								{level.level}
							</div>
						)
					})}

					{/* English level names */}
					{levels.map((level, index) => {
						if (level.level === 0) return null
						const isSelected = level.level === formData.level
						return (
							<div
								key={`en-${level.level}`}
								style={{
									width: 45,
									height: isSelected ? 14 : 12,
									left: 50,
									top: 312 + (index - 1) * 20,
									position: 'absolute',
									color: isSelected ? 'black' : '#315545',
									fontSize: isSelected ? 12 : 11,
									fontFamily: 'Thmanyah sans 1.2',
									fontWeight: isSelected ? '700' : '300',
									wordWrap: 'break-word'
								}}
							>
								{level.roleEN}
							</div>
						)
					})}
				</>
			)}

			{/* Expectations heading */}
			<div style={{left: 226, top: 455, position: 'absolute', textAlign: 'right', color: 'black', fontSize: 24, fontFamily: 'Thmanyah serif display 1.2', fontWeight: '900', letterSpacing: 0.79, wordWrap: 'break-word'}}>
				في هذه الوظيفة نتوقع منك التالي:
			</div>

			{/* Expectations list */}
			<div style={{left: 101, top: 509, position: 'absolute', textAlign: 'right', color: 'black', fontSize: 12, fontFamily: 'Thmanyah sans 1.2', fontWeight: '300', lineHeight: 21, letterSpacing: 0.38, wordWrap: 'break-word'}}>
				{formData.expectations.join('.\n')}
			</div>

			{/* Greeting with emoji and name */}
			<div style={{left: 374.50, top: 83, position: 'absolute', justifyContent: 'flex-start', alignItems: 'center', gap: 10, display: 'inline-flex'}}>
				<div style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'inline-flex'}}>
					<div style={{textAlign: 'center', color: 'black', fontSize: 32, fontFamily: 'Thmanyah sans 1.2', fontWeight: '700', lineHeight: 21, letterSpacing: 1, wordWrap: 'break-word'}}>
						👋🏻
					</div>
				</div>
				<div style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'inline-flex'}}>
					<div style={{textAlign: 'center', color: 'black', fontSize: 32, fontFamily: 'Thmanyah serif display 1.2', fontWeight: '900', letterSpacing: 1.06, wordWrap: 'break-word'}}>
						أهـلاً {firstName}
					</div>
				</div>
			</div>

			<PageFooter />
		</div>
	)
}
