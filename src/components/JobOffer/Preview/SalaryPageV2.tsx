import React from "react"
import PageFooter from "@/components/Form/Preview/PageFooter"
import { formatNumbers } from "@/utils/helpers"
import { type JobOfferFormData } from "../../Form/JobOfferFormTypes"
import { managers } from "../../Form/ManagerSign"

export default function SalaryPageV2({ formData }: { formData: JobOfferFormData }) {
	// Find the selected manager's details
	const selectedManager = formData.managerSignName
		? managers.find((m) => m.value === formData.managerSignName)
		: null

	return (
		<div
			className="page font-8-sans"
			style={{
				width: '100%',
				height: '100%',
				position: 'relative',
				background: '#F2EEE4',
				overflow: 'hidden'
			}}
		>
			{/* Benefits heading */}
			<div
				className="font-8-display"
				style={{
					left: 286,
					top: 313,
					position: 'absolute',
					textAlign: 'right',
					color: 'black',
					fontSize: 24,
					fontWeight: '900',
					letterSpacing: 0.79
				}}
			>
				المزايـا الوظيفيـة الإضافيـة
			</div>

			{/* Small black rectangle */}
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

			{/* Monthly salary box */}
			<div
				style={{
					width: 499,
					height: 56,
					left: 48,
					top: 131,
					position: 'absolute',
					background: '#3BC17B',
					borderRadius: 16
				}}
			/>

			{/* Salary amount with icon */}
			<div
				style={{
					left: 73,
					top: 147,
					position: 'absolute',
					justifyContent: 'center',
					alignItems: 'center',
					gap: 10,
					display: 'inline-flex'
				}}
			>
				{/* Thmanyah SAR icon - using proper SVG from original */}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 1124.14 1256.39"
					className="inline-block"
					style={{ width: 15, height: 17 }}
				>
					<path
						fill="currentColor"
						d="M699.62,1113.02h0c-20.06,44.48-33.32,92.75-38.4,143.37l424.51-90.24c20.06-44.47,33.31-92.75,38.4-143.37l-424.51,90.24Z"
					/>
					<path
						fill="currentColor"
						d="M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z"
					/>
				</svg>
				<div
					className="font-8-display"
					style={{
						textAlign: 'right',
						color: 'black',
						fontSize: 16,
						fontWeight: '700'
					}}
				>
					({formatNumbers(formData.monthlySalary)})
				</div>
			</div>

			{/* Green bar at top */}
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

			{/* Salary breakdown box */}
			<div
				style={{
					width: 323,
					height: 76,
					left: 224,
					top: 195,
					position: 'absolute',
					background: '#ABD9AB',
					borderRadius: 16
				}}
			/>

			{/* Net salary box */}
			<div
				style={{
					width: 169,
					height: 76,
					left: 48,
					top: 195,
					position: 'absolute',
					background: '#ABD9AB',
					borderRadius: 16
				}}
			/>

			{/* Salary breakdown items */}
			<div
				style={{
					left: 241,
					top: 212,
					position: 'absolute',
					justifyContent: 'flex-start',
					alignItems: 'center',
					gap: 14,
					display: 'inline-flex'
				}}
			>
				<div style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'inline-flex' }}>
					<div className="font-8-sans" style={{ textAlign: 'right', color: 'black', fontSize: 12, fontWeight: '300', lineHeight: '21px', letterSpacing: 0.38 }}>
						بدلات إضافية
					</div>
					<div className="font-8-sans" style={{ textAlign: 'center', color: 'black', fontSize: 12, fontWeight: '700', lineHeight: '21px', letterSpacing: 0.38 }}>
						{formatNumbers(formData.additionalAllowances)}
					</div>
				</div>
				<div style={{ width: 42, height: 0, transform: 'rotate(90deg)', transformOrigin: 'top left', outline: '1px black solid', outlineOffset: '-0.50px' }} />
				<div style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'inline-flex' }}>
					<div className="font-8-sans" style={{ textAlign: 'right', color: 'black', fontSize: 12, fontWeight: '300', lineHeight: '21px', letterSpacing: 0.38 }}>
						بدل نقل
					</div>
					<div className="font-8-sans" style={{ textAlign: 'center', color: 'black', fontSize: 12, fontWeight: '700', lineHeight: '21px', letterSpacing: 0.38 }}>
						{formatNumbers(formData.transportAllowance)}
					</div>
				</div>
				<div style={{ width: 42, height: 0, transform: 'rotate(90deg)', transformOrigin: 'top left', outline: '1px black solid', outlineOffset: '-0.50px' }} />
				<div style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'inline-flex' }}>
					<div className="font-8-sans" style={{ textAlign: 'right', color: 'black', fontSize: 12, fontWeight: '300', lineHeight: '21px', letterSpacing: 0.38 }}>
						بدل سكن
					</div>
					<div className="font-8-sans" style={{ textAlign: 'center', color: 'black', fontSize: 12, fontWeight: '700', lineHeight: '21px', letterSpacing: 0.38 }}>
						{formatNumbers(formData.housingAllowance)}
					</div>
				</div>
				<div style={{ width: 42, height: 0, transform: 'rotate(90deg)', transformOrigin: 'top left', outline: '1px black solid', outlineOffset: '-0.50px' }} />
				<div style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'inline-flex' }}>
					<div className="font-8-sans" style={{ alignSelf: 'stretch', textAlign: 'right', color: 'black', fontSize: 12, fontWeight: '300', lineHeight: '21px', letterSpacing: 0.38 }}>
						أجر أساسي
					</div>
					<div className="font-8-sans" style={{ alignSelf: 'stretch', textAlign: 'center', color: 'black', fontSize: 12, fontWeight: '700', lineHeight: '21px', letterSpacing: 0.38 }}>
						{formatNumbers(formData.basicSalary)}
					</div>
				</div>
			</div>

			{/* Net salary after deductions */}
			<div
				style={{
					left: 73,
					top: 212,
					position: 'absolute',
					justifyContent: 'center',
					alignItems: 'center',
					gap: 12,
					display: 'inline-flex'
				}}
			>
				<div style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'inline-flex' }}>
					<div className="font-8-sans" style={{ textAlign: 'right' }}>
						<span style={{ color: 'black', fontSize: 12, fontWeight: '300', lineHeight: '21px', letterSpacing: 0.38 }}>
							الراتب{' '}
						</span>
						<span style={{ color: 'black', fontSize: 10, fontWeight: '300', lineHeight: '21px', letterSpacing: 0.31 }}>
							(بعد خصم التأمينات)
						</span>
					</div>
					<div className="font-8-sans" style={{ textAlign: 'right', color: 'black', fontSize: 12, fontWeight: '700', lineHeight: '21px', letterSpacing: 0.38 }}>
						{formatNumbers(formData.netSalary)}
					</div>
				</div>
			</div>

			{/* Benefits - Row 1 */}
			<div style={{ width: 245.50, height: 40, left: 301, top: 359, position: 'absolute', background: '#AFE4B6' }} />
			<div className="font-8-sans" style={{ left: 367, top: 364, position: 'absolute', textAlign: 'right' }}>
				<span style={{ color: 'black', fontSize: 10, fontWeight: '700', letterSpacing: 0.31 }}>
					5,000 ريال سنويًا <br />
				</span>
				<span style={{ color: 'black', fontSize: 10, fontWeight: '400', letterSpacing: 0.31 }}>
					بدل السفر لإجازتك السنوية
				</span>
			</div>

			<div style={{ width: 245.50, height: 40, left: 48, top: 359, position: 'absolute', background: '#AFE4B6' }} />
			<div className="font-8-sans" style={{ left: 144, top: 364, position: 'absolute', textAlign: 'right' }}>
				<span style={{ color: 'black', fontSize: 10, fontWeight: '700', letterSpacing: 0.31 }}>
					1,000 ريال سنويًا <br />
				</span>
				<span style={{ color: 'black', fontSize: 10, fontWeight: '400', letterSpacing: 0.31 }}>
					بدل تدريب وتعليم
				</span>
			</div>

			{/* Benefits - Row 2 */}
			<div style={{ width: 245.50, height: 40, left: 301, top: 407, position: 'absolute', background: '#AFE4B6' }} />
			<div className="font-8-sans" style={{ width: 167, left: 310, top: 412, position: 'absolute', textAlign: 'right' }}>
				<span style={{ color: 'black', fontSize: 10, fontWeight: '700', letterSpacing: 0.31 }}>
					التأمين الطبي
				</span>
				<span style={{ color: 'black', fontSize: 10, fontWeight: '400', letterSpacing: 0.31 }}>
					{' '}
					(بوبا فئة: تميّز 3.0) بالإضافة إلى الأهل أو أحد الوالدين
				</span>
			</div>

			<div style={{ width: 245.50, height: 40, left: 48, top: 407, position: 'absolute', background: '#AFE4B6' }} />
			<div className="font-8-sans" style={{ width: 167, left: 57, top: 412, position: 'absolute', textAlign: 'right' }}>
				<span style={{ color: 'black', fontSize: 10, fontWeight: '700', letterSpacing: 0.31 }}>
					تذكرة سفر
					<br />
				</span>
				<span style={{ color: 'black', fontSize: 10, fontWeight: '400', letterSpacing: 0.31 }}>
					في حال انتقالك للرياض{' '}
				</span>
			</div>

			{/* Benefits - Row 3 */}
			<div style={{ width: 245.50, height: 40, left: 301, top: 455, position: 'absolute', background: '#AFE4B6' }} />
			<div className="font-8-sans" style={{ width: 167, left: 310, top: 460, position: 'absolute', textAlign: 'right' }}>
				<span style={{ color: 'black', fontSize: 10, fontWeight: '700', letterSpacing: 0.31 }}>
					التكفّل برسوم الإقامة
					<br />
				</span>
				<span style={{ color: 'black', fontSize: 10, fontWeight: '400', letterSpacing: 0.31 }}>
					للموظّف والتابعين طوال مدة التعاقد
				</span>
			</div>

			<div style={{ width: 245.50, height: 40, left: 301, top: 503, position: 'absolute', background: '#AFE4B6' }} />
			<div className="font-8-sans" style={{ width: 167, left: 310, top: 508, position: 'absolute', textAlign: 'right' }}>
				<span style={{ color: 'black', fontSize: 10, fontWeight: '700', letterSpacing: 0.31 }}>
					عدد أيام إجازات مفتوحة
					<br />
				</span>
				<span style={{ color: 'black', fontSize: 10, fontWeight: '400', textDecoration: 'underline', letterSpacing: 0.31 }}>
					{' '}
					365 يومًا في السنة
				</span>
			</div>

			<div style={{ width: 245.50, height: 40, left: 48, top: 455, position: 'absolute', background: '#AFE4B6' }} />
			<div className="font-8-sans" style={{ width: 167, left: 57, top: 460, position: 'absolute', textAlign: 'right' }}>
				<span style={{ color: 'black', fontSize: 10, fontWeight: '700', letterSpacing: 0.31 }}>
					سكن مؤقت
					<br />
				</span>
				<span style={{ color: 'black', fontSize: 10, fontWeight: '400', letterSpacing: 0.31 }}>
					عند إقامتك في الرياض لمدة أسبوع
				</span>
			</div>

			<div style={{ width: 245.50, height: 40, left: 48, top: 503, position: 'absolute', background: '#AFE4B6' }} />
			<div className="font-8-sans" style={{ width: 167, left: 57, top: 508, position: 'absolute', textAlign: 'right' }}>
				<span style={{ color: 'black', fontSize: 10, fontWeight: '700', letterSpacing: 0.31 }}>
					المرونة في أوقات العمل
					<br />
				</span>
				<span style={{ color: 'black', fontSize: 10, fontWeight: '400', letterSpacing: 0.31 }}>
					{' '}
					في المكتب أو من أي مكان
				</span>
			</div>

			{/* Disclaimer */}
			<div className="font-8-sans" style={{ left: 309, top: 554, position: 'absolute', textAlign: 'right' }}>
				<span style={{ color: '#FF0000', fontSize: 8, fontWeight: '300', lineHeight: '21px', letterSpacing: 0.25 }}>
					*
				</span>
				<span style={{ color: 'black', fontSize: 8, fontWeight: '300', lineHeight: '21px', letterSpacing: 0.25 }}>
					{' '}
					بالإضافة لجميع مزايا «ثمانية» حسب الدستور الرسمي وهي قابلة للتغيير.
				</span>
			</div>

			{/* Closing message */}
			<div className="font-8-display" style={{ left: 171, top: 615, position: 'absolute', textAlign: 'right' }}>
				<span style={{ color: 'black', fontSize: 16, fontWeight: '400' }}>
					يسعدنا أن تكون جزءًا مؤثرًا معنا في إنتاج{' '}
				</span>
				<span style={{ color: 'black', fontSize: 20, fontWeight: '700' }}>أفضل محتوى عربي.</span>
			</div>

			{/* Signature - Right (Employee) */}
			<div
				className="font-8-display"
				style={{
					width: 117,
					left: 407,
					top: 689,
					position: 'absolute',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					gap: 6,
					display: 'inline-flex'
				}}
			>
				<div
					style={{
						alignSelf: 'stretch',
						textAlign: 'center',
						color: 'black',
						fontSize: 18,
						fontWeight: '700',
						lineHeight: '21px',
						letterSpacing: 0.56
					}}
				>
					{formData.name}
				</div>
				<div
					style={{
						alignSelf: 'stretch',
						color: 'black',
						fontSize: 14,
						fontWeight: '400',
						lineHeight: '21px',
						letterSpacing: 0.44
					}}
				>
					{formData.jobTitle.split("|")[0].trim()}
				</div>
			</div>

			{/* Signature - Left (Manager) */}
			<div
				className="font-8-display"
				style={{
					width: 178,
					left: 73,
					top: 689,
					position: 'absolute',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					gap: 6,
					display: 'inline-flex'
				}}
			>
				<div
					style={{
						alignSelf: 'stretch',
						color: 'black',
						fontSize: 18,
						fontWeight: '700',
						lineHeight: '21px',
						letterSpacing: 0.56
					}}
				>
					{selectedManager ? selectedManager.value : formData.directManager}
				</div>
				<div
					style={{
						alignSelf: 'stretch',
						textAlign: 'center',
						color: 'black',
						fontSize: 14,
						fontWeight: '400',
						lineHeight: '21px',
						letterSpacing: 0.44
					}}
				>
					{selectedManager
						? selectedManager.jobTitle.split("|")[0].trim()
						: formData.directManagerJobTitle.split("|")[0].trim()}
				</div>
			</div>

			{/* "تفاصيل الراتب" text/logo at top - keeping as-is from Figma */}
			<div
				style={{
					width: 224.67,
					height: 34.33,
					left: 322,
					top: 80,
					position: 'absolute',
					overflow: 'hidden'
				}}
			>
				<div style={{ width: 46.01, height: 18.19, left: 0, top: 6.89, position: 'absolute', background: 'black' }} />
				<div style={{ width: 17.07, height: 21.22, left: 47.18, top: 3.09, position: 'absolute', background: 'black' }} />
				<div style={{ width: 11.04, height: 19.42, left: 54.08, top: 0, position: 'absolute', background: 'black' }} />
				<div style={{ width: 16.71, height: 17.33, left: 66.62, top: 7.13, position: 'absolute', background: 'black' }} />
				<div style={{ width: 11.72, height: 20.35, left: 81.78, top: 12.99, position: 'absolute', background: 'black' }} />
				<div style={{ width: 7.72, height: 24.32, left: 91.96, top: 0, position: 'absolute', background: 'black' }} />
				<div style={{ width: 5.12, height: 24.83, left: 102.88, top: 0, position: 'absolute', background: 'black' }} />
				<div style={{ width: 12.74, height: 22.24, left: 109.22, top: 9.33, position: 'absolute', background: 'black' }} />
				<div style={{ width: 50.16, height: 21.34, left: 132.16, top: 12.99, position: 'absolute', background: 'black' }} />
				<div style={{ width: 10.22, height: 23.28, left: 179.87, top: 1.05, position: 'absolute', background: 'black' }} />
				<div style={{ width: 5.12, height: 24.83, left: 192.73, top: 0, position: 'absolute', background: 'black' }} />
				<div style={{ width: 15.36, height: 19.59, left: 194.81, top: 13.02, position: 'absolute', background: 'black' }} />
				<div style={{ width: 7.72, height: 24.32, left: 208.63, top: 0, position: 'absolute', background: 'black' }} />
				<div style={{ width: 5.12, height: 24.83, left: 219.55, top: 0, position: 'absolute', background: 'black' }} />
			</div>

			{/* "الراتب الشهري شامل" text - keeping as-is from Figma */}
			<div
				style={{
					width: 131,
					height: 17,
					left: 391,
					top: 151,
					position: 'absolute',
					overflow: 'hidden'
				}}
			>
				<div style={{ width: 8.50, height: 13.63, left: 0, top: 0.07, position: 'absolute', background: 'black' }} />
				<div style={{ width: 14.13, height: 6.91, left: 7.63, top: 4.39, position: 'absolute', background: 'black' }} />
				<div style={{ width: 3.26, height: 10.96, left: 23.02, top: 0.07, position: 'absolute', background: 'black' }} />
				<div style={{ width: 10.61, height: 11.02, left: 25.57, top: 0.01, position: 'absolute', background: 'black' }} />
				<div style={{ width: 9.82, height: 14.56, left: 40.62, top: 2.44, position: 'absolute', background: 'black' }} />
				<div style={{ width: 6.14, height: 8.87, left: 49.06, top: 5.91, position: 'absolute', background: 'black' }} />
				<div style={{ width: 11.95, height: 10.59, left: 54.34, top: 3.29, position: 'absolute', background: 'black' }} />
				<div style={{ width: 11.85, height: 11.03, left: 65.58, top: 0, position: 'absolute', background: 'black' }} />
				<div style={{ width: 3.53, height: 11.02, left: 76.73, top: 0.01, position: 'absolute', background: 'black' }} />
				<div style={{ width: 2.34, height: 11.25, left: 81.71, top: 0.01, position: 'absolute', background: 'black' }} />
				<div style={{ width: 22.92, height: 9.67, left: 88.72, top: 5.90, position: 'absolute', background: 'black' }} />
				<div style={{ width: 4.67, height: 10.55, left: 110.53, top: 0.49, position: 'absolute', background: 'black' }} />
				<div style={{ width: 2.34, height: 11.25, left: 116.40, top: 0.01, position: 'absolute', background: 'black' }} />
				<div style={{ width: 7.02, height: 8.87, left: 117.35, top: 5.91, position: 'absolute', background: 'black' }} />
				<div style={{ width: 3.53, height: 11.02, left: 123.67, top: 0.01, position: 'absolute', background: 'black' }} />
				<div style={{ width: 2.34, height: 11.25, left: 128.66, top: 0.01, position: 'absolute', background: 'black' }} />
			</div>

			<PageFooter />
		</div>
	)
}
