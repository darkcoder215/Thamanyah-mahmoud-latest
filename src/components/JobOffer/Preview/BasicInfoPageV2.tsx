import React from "react"
import { JobOfferFormData, JobOfferFormProps } from "@/components/Form/JobOfferFormTypes"
import PageFooter from "@/components/Form/Preview/PageFooter"
import EditableWrapper from "./EditableWrapper"

export default function BasicInfoPageV2({
	formData,
	levels,
	editMode = false,
	scale = 1,
}: {
	formData: JobOfferFormData
	levels: JobOfferFormProps["levels"]
	editMode?: boolean
	scale?: number
}) {
	const firstName = formData.name.split(" ")[0]

	return (
		<div
			className="page-v2 font-8-sans"
			style={{
				background: '#F2EEE4'
			}}
		>
			{/* Small black rectangle - decorative */}
			{editMode ? (
				<EditableWrapper
					initialLeft={40}
					initialTop={766}
					label="Black Rectangle"
					width={32}
					height={36}
				>
					<div
						style={{
							width: 32,
							height: 36,
							background: 'black'
						}}
					/>
				</EditableWrapper>
			) : (
				<div
					style={{
						width: 32,
						height: 36,
						left: 40,
						top: 766,
						position: 'absolute',
						background: 'black'
					}}
				/>
			)}

			{/* Green bar at top */}
			{editMode ? (
				<EditableWrapper
					initialLeft={-18.28}
					initialTop={-13.11}
					label="Green Bar"
					width={661.48}
					height={27.65}
				>
					<div
						style={{
							width: 661.48,
							height: 27.65,
							opacity: 0.89,
							background: '#03BB6E'
						}}
					/>
				</EditableWrapper>
			) : (
				<div
					style={{
						width: 661.48,
						height: 27.65,
						left: -18.28,
						top: -13.11,
						position: 'absolute',
						opacity: 0.89,
						background: '#03BB6E'
					}}
				/>
			)}

			{/* Welcome message */}
			{editMode ? (
				<EditableWrapper
					initialLeft={48}
					initialTop={138}
					label="Welcome Message"
					width={499}
					height={60}
				>
					<div
						className="font-8-sans"
						style={{
							width: 499,
							textAlign: 'right',
							color: 'black',
							fontSize: 14,
							fontWeight: '400',
							lineHeight: '21px',
							letterSpacing: 0.05
						}}
					>
						نتمنى أن تكون معنا في سعينا لإثراء المحتوى العربي وتغيير ثقافة الصحافة في الوطن العربي. يسعدنا العمل معك على النحو التالي:
					</div>
				</EditableWrapper>
			) : (
				<div
					className="font-8-sans"
					style={{
						width: 499,
						left: 48,
						top: 138,
						position: 'absolute',
						textAlign: 'right',
						color: 'black',
						fontSize: 14,
						fontWeight: '400',
						lineHeight: '21px',
						letterSpacing: 0.05
					}}
				>
					نتمنى أن تكون معنا في سعينا لإثراء المحتوى العربي وتغيير ثقافة الصحافة في الوطن العربي. يسعدنا العمل معك على النحو التالي:
				</div>
			)}

			{/* Job title box */}
			{editMode ? (
				<EditableWrapper
					initialLeft={37}
					initialTop={204}
					label="Job Title Section"
					width={510}
					height={65}
				>
					<div
						style={{
							width: 510,
							height: 65,
							background: '#3BC17B',
							borderRadius: 16,
							position: 'relative'
						}}
					>
						<div
							className="font-8-sans"
							style={{
								left: 212,
								top: 12,
								position: 'absolute',
								color: 'black',
								fontSize: 14,
								fontWeight: '400',
								lineHeight: '21px',
								letterSpacing: 0.44
							}}
						>
							المسمّى الوظيفي
						</div>
						<div
							className="font-8-sans"
							style={{
								left: 224,
								top: 34,
								position: 'absolute',
								color: 'black',
								fontSize: 14,
								fontWeight: '700',
								lineHeight: '21px',
								letterSpacing: 0.44
							}}
						>
							{formData.jobTitle}
						</div>
					</div>
				</EditableWrapper>
			) : (
				<>
					<div
						style={{
							width: 510,
							height: 65,
							left: 37,
							top: 204,
							position: 'absolute',
							background: '#3BC17B',
							borderRadius: 16
						}}
					/>
					<div
						className="font-8-sans"
						style={{
							left: 249,
							top: 216,
							position: 'absolute',
							color: 'black',
							fontSize: 14,
							fontWeight: '400',
							lineHeight: '21px',
							letterSpacing: 0.44
						}}
					>
						المسمّى الوظيفي
					</div>
					<div
						className="font-8-sans"
						style={{
							left: 261,
							top: 238,
							position: 'absolute',
							color: 'black',
							fontSize: 14,
							fontWeight: '700',
							lineHeight: '21px',
							letterSpacing: 0.44
						}}
					>
						{formData.jobTitle}
					</div>
				</>
			)}

			{/* Info boxes backgrounds */}
			{editMode ? (
				<>
					<EditableWrapper
						initialLeft={203}
						initialTop={278}
						label="Info Box 1"
						width={344}
						height={69}
					>
						<div
							style={{
								width: 344,
								height: 69,
								background: '#ABD9AB',
								borderRadius: 16
							}}
						/>
					</EditableWrapper>
					<EditableWrapper
						initialLeft={203}
						initialTop={352}
						label="Info Box 2"
						width={344}
						height={69}
					>
						<div
							style={{
								width: 344,
								height: 69,
								background: '#ABD9AB',
								borderRadius: 16
							}}
						/>
					</EditableWrapper>
					<EditableWrapper
						initialLeft={37}
						initialTop={278}
						label="Level Box"
						width={160}
						height={143}
					>
						<div
							style={{
								width: 160,
								height: 143,
								background: '#ABD9AB',
								borderRadius: 16
							}}
						/>
					</EditableWrapper>
				</>
			) : (
				<>
					<div
						style={{
							width: 344,
							height: 69,
							left: 203,
							top: 278,
							position: 'absolute',
							background: '#ABD9AB',
							borderRadius: 16
						}}
					/>
					<div
						style={{
							width: 344,
							height: 69,
							left: 203,
							top: 352,
							position: 'absolute',
							background: '#ABD9AB',
							borderRadius: 16
						}}
					/>
					<div
						style={{
							width: 160,
							height: 143,
							left: 37,
							top: 278,
							position: 'absolute',
							background: '#ABD9AB',
							borderRadius: 16
						}}
					/>
				</>
			)}

			{/* Level label */}
			{editMode ? (
				<EditableWrapper
					initialLeft={99}
					initialTop={287}
					label="Level Label"
					width={45}
					height={16}
				>
					<div
						className="font-8-sans"
						style={{
							width: 45,
							height: 16,
							color: 'black',
							fontSize: 12,
							fontWeight: '300',
							lineHeight: '21px',
							letterSpacing: 0.38
						}}
					>
						المستوى
					</div>
				</EditableWrapper>
			) : (
				<div
					className="font-8-sans"
					style={{
						width: 45,
						height: 16,
						left: 99,
						top: 287,
						position: 'absolute',
						color: 'black',
						fontSize: 12,
						fontWeight: '300',
						lineHeight: '21px',
						letterSpacing: 0.38
					}}
				>
					المستوى
				</div>
			)}

			{/* First row: Team | Department | Management */}
			{editMode ? (
				<EditableWrapper
					initialLeft={223.50}
					initialTop={290}
					label="Team/Dept/Mgmt"
					width={324}
					height={42}
				>
					<div
						style={{
							justifyContent: 'flex-start',
							alignItems: 'center',
							gap: 16,
							display: 'inline-flex'
						}}
					>
						<div style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'inline-flex' }}>
							<div className="font-8-sans" style={{ textAlign: 'center', color: 'black', fontSize: 12, fontWeight: '300', lineHeight: '21px', letterSpacing: 0.38 }}>
								الفريق
							</div>
							<div className="font-8-sans" style={{ textAlign: 'center', color: 'black', fontSize: 12, fontWeight: '700', lineHeight: '21px', letterSpacing: 0.38 }}>
								{formData.team}
							</div>
						</div>
						<div style={{ width: 42, height: 0, transform: 'rotate(90deg)', transformOrigin: 'top left', outline: '1px black solid', outlineOffset: '-0.50px' }} />
						<div style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'inline-flex' }}>
							<div className="font-8-sans" style={{ alignSelf: 'stretch', textAlign: 'center', color: 'black', fontSize: 12, fontWeight: '300', lineHeight: '21px', letterSpacing: 0.38 }}>
								القسم
							</div>
							<div className="font-8-sans" style={{ textAlign: 'center', color: 'black', fontSize: 12, fontWeight: '700', lineHeight: '21px', letterSpacing: 0.38 }}>
								{formData.department}
							</div>
						</div>
						<div style={{ width: 42, height: 0, transform: 'rotate(90deg)', transformOrigin: 'top left', outline: '1px black solid', outlineOffset: '-0.50px' }} />
						<div style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'inline-flex' }}>
							<div className="font-8-sans" style={{ textAlign: 'center', color: 'black', fontSize: 12, fontWeight: '300', lineHeight: '21px', letterSpacing: 0.38 }}>
								الإدارة
							</div>
							<div className="font-8-sans" style={{ textAlign: 'center', color: 'black', fontSize: 12, fontWeight: '700', lineHeight: '21px', letterSpacing: 0.38 }}>
								{formData.department}
							</div>
						</div>
					</div>
				</EditableWrapper>
			) : (
				<div
					style={{
						left: 223.50,
						top: 290,
						position: 'absolute',
						justifyContent: 'flex-start',
						alignItems: 'center',
						gap: 16,
						display: 'inline-flex'
					}}
				>
					<div style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'inline-flex' }}>
						<div className="font-8-sans" style={{ textAlign: 'center', color: 'black', fontSize: 12, fontWeight: '300', lineHeight: '21px', letterSpacing: 0.38 }}>
							الفريق
						</div>
						<div className="font-8-sans" style={{ textAlign: 'center', color: 'black', fontSize: 12, fontWeight: '700', lineHeight: '21px', letterSpacing: 0.38 }}>
							{formData.team}
						</div>
					</div>
					<div style={{ width: 42, height: 0, transform: 'rotate(90deg)', transformOrigin: 'top left', outline: '1px black solid', outlineOffset: '-0.50px' }} />
					<div style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'inline-flex' }}>
						<div className="font-8-sans" style={{ alignSelf: 'stretch', textAlign: 'center', color: 'black', fontSize: 12, fontWeight: '300', lineHeight: '21px', letterSpacing: 0.38 }}>
							القسم
						</div>
						<div className="font-8-sans" style={{ textAlign: 'center', color: 'black', fontSize: 12, fontWeight: '700', lineHeight: '21px', letterSpacing: 0.38 }}>
							{formData.department}
						</div>
					</div>
					<div style={{ width: 42, height: 0, transform: 'rotate(90deg)', transformOrigin: 'top left', outline: '1px black solid', outlineOffset: '-0.50px' }} />
					<div style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'inline-flex' }}>
						<div className="font-8-sans" style={{ textAlign: 'center', color: 'black', fontSize: 12, fontWeight: '300', lineHeight: '21px', letterSpacing: 0.38 }}>
							الإدارة
						</div>
						<div className="font-8-sans" style={{ textAlign: 'center', color: 'black', fontSize: 12, fontWeight: '700', lineHeight: '21px', letterSpacing: 0.38 }}>
							{formData.department}
						</div>
					</div>
				</div>
			)}

			{/* Second row: City | Work Type | Direct Manager */}
			{editMode ? (
				<EditableWrapper
					initialLeft={209}
					initialTop={366}
					label="City/WorkType/Manager"
					width={338}
					height={42}
				>
					<div
						style={{
							width: 338,
							justifyContent: 'center',
							alignItems: 'center',
							gap: 16,
							display: 'inline-flex'
						}}
					>
						<div style={{ width: 92, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'inline-flex' }}>
							<div className="font-8-sans" style={{ textAlign: 'center', color: 'black', fontSize: 12, fontWeight: '300', lineHeight: '21px', letterSpacing: 0.38 }}>
								{formData.contractCity ? 'مدينة التعاقد' : (formData.contractCountry ? 'بلد التعاقد' : 'موقع العمل')}
							</div>
							<div className="font-8-sans" style={{ textAlign: 'center', color: 'black', fontSize: 12, fontWeight: '700', lineHeight: '21px', letterSpacing: 0.38 }}>
								{formData.contractCity || formData.contractCountry || 'الرياض'}
							</div>
						</div>
						<div style={{ width: 42, height: 0, transform: 'rotate(90deg)', transformOrigin: 'top left', outline: '1px black solid', outlineOffset: '-0.50px' }} />
						<div style={{ width: 66, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'inline-flex' }}>
							<div className="font-8-sans" style={{ textAlign: 'center', color: 'black', fontSize: 12, fontWeight: '300', lineHeight: '21px', letterSpacing: 0.38 }}>
								نوع الدوام
							</div>
							<div className="font-8-sans" style={{ textAlign: 'center', color: 'black', fontSize: 12, fontWeight: '700', lineHeight: '21px', letterSpacing: 0.38 }}>
								{formData.workType}
							</div>
						</div>
						<div style={{ width: 42, height: 0, transform: 'rotate(90deg)', transformOrigin: 'top left', outline: '1px black solid', outlineOffset: '-0.50px' }} />
						<div style={{ width: 94, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'inline-flex' }}>
							<div className="font-8-sans" style={{ alignSelf: 'stretch', textAlign: 'center', color: 'black', fontSize: 12, fontWeight: '300', lineHeight: '21px', letterSpacing: 0.38 }}>
								المدير المباشر
							</div>
							<div className="font-8-sans" style={{ textAlign: 'center', color: 'black', fontSize: 12, fontWeight: '700', lineHeight: '21px', letterSpacing: 0.38 }}>
								{formData.directManager}
							</div>
						</div>
					</div>
				</EditableWrapper>
			) : (
				<div
					style={{
						width: 338,
						left: 209,
						top: 366,
						position: 'absolute',
						justifyContent: 'center',
						alignItems: 'center',
						gap: 16,
						display: 'inline-flex'
					}}
				>
					<div style={{ width: 92, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'inline-flex' }}>
						<div className="font-8-sans" style={{ textAlign: 'center', color: 'black', fontSize: 12, fontWeight: '300', lineHeight: '21px', letterSpacing: 0.38 }}>
							{formData.contractCity ? 'مدينة التعاقد' : (formData.contractCountry ? 'بلد التعاقد' : 'موقع العمل')}
						</div>
						<div className="font-8-sans" style={{ textAlign: 'center', color: 'black', fontSize: 12, fontWeight: '700', lineHeight: '21px', letterSpacing: 0.38 }}>
							{formData.contractCity || formData.contractCountry || 'الرياض'}
						</div>
					</div>
					<div style={{ width: 42, height: 0, transform: 'rotate(90deg)', transformOrigin: 'top left', outline: '1px black solid', outlineOffset: '-0.50px' }} />
					<div style={{ width: 66, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'inline-flex' }}>
						<div className="font-8-sans" style={{ textAlign: 'center', color: 'black', fontSize: 12, fontWeight: '300', lineHeight: '21px', letterSpacing: 0.38 }}>
							نوع الدوام
						</div>
						<div className="font-8-sans" style={{ textAlign: 'center', color: 'black', fontSize: 12, fontWeight: '700', lineHeight: '21px', letterSpacing: 0.38 }}>
							{formData.workType}
						</div>
					</div>
					<div style={{ width: 42, height: 0, transform: 'rotate(90deg)', transformOrigin: 'top left', outline: '1px black solid', outlineOffset: '-0.50px' }} />
					<div style={{ width: 94, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'inline-flex' }}>
						<div className="font-8-sans" style={{ alignSelf: 'stretch', textAlign: 'center', color: 'black', fontSize: 12, fontWeight: '300', lineHeight: '21px', letterSpacing: 0.38 }}>
							المدير المباشر
						</div>
						<div className="font-8-sans" style={{ textAlign: 'center', color: 'black', fontSize: 12, fontWeight: '700', lineHeight: '21px', letterSpacing: 0.38 }}>
							{formData.directManager}
						</div>
					</div>
				</div>
			)}

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
								className="font-8-sans"
								style={{
									width: 54,
									height: isSelected ? 14 : 12,
									left: 129,
									top: 312 + (index - 1) * 20,
									position: 'absolute',
									textAlign: 'right',
									color: isSelected ? 'black' : '#315545',
									fontSize: isSelected ? 12 : 11,
									fontWeight: isSelected ? '700' : '300'
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
								className="font-8-sans"
								style={{
									width: 6,
									height: isSelected ? 12 : 11,
									left: 114,
									top: 312 + (index - 1) * 20,
									position: 'absolute',
									color: isSelected ? 'black' : '#315545',
									fontSize: 10,
									fontWeight: isSelected ? '700' : '300'
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
								className="font-8-sans"
								style={{
									width: 45,
									height: isSelected ? 14 : 12,
									left: 50,
									top: 312 + (index - 1) * 20,
									position: 'absolute',
									color: isSelected ? 'black' : '#315545',
									fontSize: isSelected ? 12 : 11,
									fontWeight: isSelected ? '700' : '300'
								}}
							>
								{level.roleEN}
							</div>
						)
					})}
				</>
			)}

			{/* Expectations heading */}
			{editMode ? (
				<EditableWrapper
					initialLeft={226}
					initialTop={455}
					label="Expectations Heading"
					width={321}
					height={35}
				>
					<div
						className="font-8-display"
						style={{
							textAlign: 'right',
							color: 'black',
							fontSize: 24,
							fontWeight: '900',
							letterSpacing: 0.79
						}}
					>
						في هذه الوظيفة نتوقع منك التالي:
					</div>
				</EditableWrapper>
			) : (
				<div
					className="font-8-display"
					style={{
						left: 226,
						top: 455,
						position: 'absolute',
						textAlign: 'right',
						color: 'black',
						fontSize: 24,
						fontWeight: '900',
						letterSpacing: 0.79
					}}
				>
					في هذه الوظيفة نتوقع منك التالي:
				</div>
			)}

			{/* Expectations list */}
			{editMode ? (
				<EditableWrapper
					initialLeft={101}
					initialTop={509}
					label="Expectations List"
					width={446}
					height={200}
				>
					<div
						className="font-8-sans"
						style={{
							textAlign: 'right',
							color: 'black',
							fontSize: 12,
							fontWeight: '300',
							lineHeight: '21px',
							letterSpacing: 0.38
						}}
					>
						{formData.expectations.join('.\n')}
					</div>
				</EditableWrapper>
			) : (
				<div
					className="font-8-sans"
					style={{
						left: 101,
						top: 509,
						position: 'absolute',
						textAlign: 'right',
						color: 'black',
						fontSize: 12,
						fontWeight: '300',
						lineHeight: '21px',
						letterSpacing: 0.38
					}}
				>
					{formData.expectations.join('.\n')}
				</div>
			)}

			{/* Greeting with emoji and name */}
			{editMode ? (
				<EditableWrapper
					initialLeft={374.50}
					initialTop={83}
					label="Greeting"
					width={173}
					height={42}
				>
					<div
						style={{
							justifyContent: 'flex-start',
							alignItems: 'center',
							gap: 10,
							display: 'inline-flex'
						}}
					>
						<div style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'inline-flex' }}>
							<div
								className="font-8-sans"
								style={{
									textAlign: 'center',
									color: 'black',
									fontSize: 32,
									fontWeight: '700',
									lineHeight: '21px',
									letterSpacing: 1
								}}
							>
								👋🏻
							</div>
						</div>
						<div style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'inline-flex' }}>
							<div
								className="font-8-display"
								style={{
									textAlign: 'center',
									color: 'black',
									fontSize: 32,
									fontWeight: '900',
									letterSpacing: 1.06
								}}
							>
								أهـلاً {firstName}
							</div>
						</div>
					</div>
				</EditableWrapper>
			) : (
				<div
					style={{
						left: 374.50,
						top: 83,
						position: 'absolute',
						justifyContent: 'flex-start',
						alignItems: 'center',
						gap: 10,
						display: 'inline-flex'
					}}
				>
					<div style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'inline-flex' }}>
						<div
							className="font-8-sans"
							style={{
								textAlign: 'center',
								color: 'black',
								fontSize: 32,
								fontWeight: '700',
								lineHeight: '21px',
								letterSpacing: 1
							}}
						>
							👋🏻
						</div>
					</div>
					<div style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'inline-flex' }}>
						<div
							className="font-8-display"
							style={{
								textAlign: 'center',
								color: 'black',
								fontSize: 32,
								fontWeight: '900',
								letterSpacing: 1.06
							}}
						>
							أهـلاً {firstName}
						</div>
					</div>
				</div>
			)}

		</div>
	)
}
