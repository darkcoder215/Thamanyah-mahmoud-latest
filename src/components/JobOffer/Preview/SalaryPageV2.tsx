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
		<div className="page font-8-sans" style={{width: '100%', height: '100%', position: 'relative', background: '#F2EEE4', overflow: 'hidden'}}>
			{/* Benefits heading */}
			<div style={{left: 286, top: 313, position: 'absolute', textAlign: 'right', color: 'black', fontSize: 24, fontFamily: 'Thmanyah serif display 1.2', fontWeight: '900', letterSpacing: 0.79, wordWrap: 'break-word'}}>
				المزايـا الوظيفيـة الإضافيـة
			</div>

			{/* Small black rectangle */}
			<div style={{width: 32, height: 36, left: 40, top: 766, position: 'absolute', background: 'black'}} />

			{/* Monthly salary box */}
			<div style={{width: 499, height: 56, left: 48, top: 131, position: 'absolute', background: '#3BC17B', borderRadius: 16}} />

			{/* Salary amount with icon */}
			<div style={{left: 73, top: 147, position: 'absolute', justifyContent: 'center', alignItems: 'center', gap: 10, display: 'inline-flex'}}>
				{/* Thmanyah SAR icon */}
				<div style={{width: 15, height: 17, position: 'relative', overflow: 'hidden'}}>
					<div style={{width: 6.18, height: 3.16, left: 8.82, top: 13.84, position: 'absolute', background: '#231F20'}} />
					<div style={{width: 15, height: 15.72, left: 0, top: 0, position: 'absolute', background: '#231F20'}} />
				</div>
				<div style={{textAlign: 'right', color: 'black', fontSize: 16, fontFamily: 'Thmanyah serif display 1.2', fontWeight: '700', wordWrap: 'break-word'}}>
					({formatNumbers(formData.monthlySalary)})
				</div>
			</div>

			{/* Green bar at top */}
			<div style={{width: 661.48, height: 27.65, left: -18.28, top: -13.11, position: 'absolute', opacity: 0.89, background: '#03BB6E'}} />

			{/* Salary breakdown box */}
			<div style={{width: 323, height: 76, left: 224, top: 195, position: 'absolute', background: '#ABD9AB', borderRadius: 16}} />

			{/* Net salary box */}
			<div style={{width: 169, height: 76, left: 48, top: 195, position: 'absolute', background: '#ABD9AB', borderRadius: 16}} />

			{/* Salary breakdown items */}
			<div style={{left: 241, top: 212, position: 'absolute', justifyContent: 'flex-start', alignItems: 'center', gap: 14, display: 'inline-flex'}}>
				<div style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'inline-flex'}}>
					<div style={{textAlign: 'right', color: 'black', fontSize: 12, fontFamily: 'Thmanyah sans 1.2', fontWeight: '300', lineHeight: 21, letterSpacing: 0.38, wordWrap: 'break-word'}}>بدلات إضافية</div>
					<div style={{textAlign: 'center', color: 'black', fontSize: 12, fontFamily: 'Thmanyah sans 1.2', fontWeight: '700', lineHeight: 21, letterSpacing: 0.38, wordWrap: 'break-word'}}>
						{formatNumbers(formData.additionalAllowances)}
					</div>
				</div>
				<div style={{width: 42, height: 0, transform: 'rotate(90deg)', transformOrigin: 'top left', outline: '1px black solid', outlineOffset: '-0.50px'}}></div>
				<div style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'inline-flex'}}>
					<div style={{textAlign: 'right', color: 'black', fontSize: 12, fontFamily: 'Thmanyah sans 1.2', fontWeight: '300', lineHeight: 21, letterSpacing: 0.38, wordWrap: 'break-word'}}>بدل نقل</div>
					<div style={{textAlign: 'center', color: 'black', fontSize: 12, fontFamily: 'Thmanyah sans 1.2', fontWeight: '700', lineHeight: 21, letterSpacing: 0.38, wordWrap: 'break-word'}}>
						{formatNumbers(formData.transportAllowance)}
					</div>
				</div>
				<div style={{width: 42, height: 0, transform: 'rotate(90deg)', transformOrigin: 'top left', outline: '1px black solid', outlineOffset: '-0.50px'}}></div>
				<div style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'inline-flex'}}>
					<div style={{textAlign: 'right', color: 'black', fontSize: 12, fontFamily: 'Thmanyah sans 1.2', fontWeight: '300', lineHeight: 21, letterSpacing: 0.38, wordWrap: 'break-word'}}>بدل سكن</div>
					<div style={{textAlign: 'center', color: 'black', fontSize: 12, fontFamily: 'Thmanyah sans 1.2', fontWeight: '700', lineHeight: 21, letterSpacing: 0.38, wordWrap: 'break-word'}}>
						{formatNumbers(formData.housingAllowance)}
					</div>
				</div>
				<div style={{width: 42, height: 0, transform: 'rotate(90deg)', transformOrigin: 'top left', outline: '1px black solid', outlineOffset: '-0.50px'}}></div>
				<div style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'inline-flex'}}>
					<div style={{alignSelf: 'stretch', textAlign: 'right', color: 'black', fontSize: 12, fontFamily: 'Thmanyah sans 1.2', fontWeight: '300', lineHeight: 21, letterSpacing: 0.38, wordWrap: 'break-word'}}>أجر أساسي</div>
					<div style={{alignSelf: 'stretch', textAlign: 'center', color: 'black', fontSize: 12, fontFamily: 'Thmanyah sans 1.2', fontWeight: '700', lineHeight: 21, letterSpacing: 0.38, wordWrap: 'break-word'}}>
						{formatNumbers(formData.basicSalary)}
					</div>
				</div>
			</div>

			{/* Net salary after deductions */}
			<div style={{left: 73, top: 212, position: 'absolute', justifyContent: 'center', alignItems: 'center', gap: 12, display: 'inline-flex'}}>
				<div style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center', display: 'inline-flex'}}>
					<div style={{textAlign: 'right'}}>
						<span style={{color: 'black', fontSize: 12, fontFamily: 'Thmanyah sans 1.2', fontWeight: '300', lineHeight: 21, letterSpacing: 0.38, wordWrap: 'break-word'}}>الراتب </span>
						<span style={{color: 'black', fontSize: 10, fontFamily: 'Thmanyah sans 1.2', fontWeight: '300', lineHeight: 21, letterSpacing: 0.31, wordWrap: 'break-word'}}>(بعد خصم التأمينات)</span>
					</div>
					<div style={{textAlign: 'right', color: 'black', fontSize: 12, fontFamily: 'Thmanyah sans 1.2', fontWeight: '700', lineHeight: 21, letterSpacing: 0.38, wordWrap: 'break-word'}}>
						{formatNumbers(formData.netSalary)}
					</div>
				</div>
			</div>

			{/* Benefits - Row 1 */}
			<div style={{width: 245.50, height: 40, left: 301, top: 359, position: 'absolute', background: '#AFE4B6'}} />
			<div style={{left: 367, top: 364, position: 'absolute', textAlign: 'right'}}>
				<span style={{color: 'black', fontSize: 10, fontFamily: 'Thmanyah sans 1.2', fontWeight: '700', letterSpacing: 0.31, wordWrap: 'break-word'}}>5,000 ريال سنويًا  <br/></span>
				<span style={{color: 'black', fontSize: 10, fontFamily: 'Thmanyah sans 1.2', fontWeight: '400', letterSpacing: 0.31, wordWrap: 'break-word'}}>بدل السفر لإجازتك السنوية</span>
			</div>

			<div style={{width: 245.50, height: 40, left: 48, top: 359, position: 'absolute', background: '#AFE4B6'}} />
			<div style={{left: 144, top: 364, position: 'absolute', textAlign: 'right'}}>
				<span style={{color: 'black', fontSize: 10, fontFamily: 'Thmanyah sans 1.2', fontWeight: '700', letterSpacing: 0.31, wordWrap: 'break-word'}}>1,000 ريال سنويًا <br/></span>
				<span style={{color: 'black', fontSize: 10, fontFamily: 'Thmanyah sans 1.2', fontWeight: '400', letterSpacing: 0.31, wordWrap: 'break-word'}}>بدل تدريب وتعليم</span>
			</div>

			{/* Benefits - Row 2 */}
			<div style={{width: 245.50, height: 40, left: 301, top: 407, position: 'absolute', background: '#AFE4B6'}} />
			<div style={{width: 167, left: 310, top: 412, position: 'absolute', textAlign: 'right'}}>
				<span style={{color: 'black', fontSize: 10, fontFamily: 'Thmanyah sans 1.2', fontWeight: '700', letterSpacing: 0.31, wordWrap: 'break-word'}}>التأمين الطبي</span>
				<span style={{color: 'black', fontSize: 10, fontFamily: 'Thmanyah sans 1.2', fontWeight: '400', letterSpacing: 0.31, wordWrap: 'break-word'}}> (بوبا فئة: تميّز 3.0) بالإضافة إلى الأهل أو أحد الوالدين</span>
			</div>

			<div style={{width: 245.50, height: 40, left: 48, top: 407, position: 'absolute', background: '#AFE4B6'}} />
			<div style={{width: 167, left: 57, top: 412, position: 'absolute', textAlign: 'right'}}>
				<span style={{color: 'black', fontSize: 10, fontFamily: 'Thmanyah sans 1.2', fontWeight: '700', letterSpacing: 0.31, wordWrap: 'break-word'}}>تذكرة سفر<br/></span>
				<span style={{color: 'black', fontSize: 10, fontFamily: 'Thmanyah sans 1.2', fontWeight: '400', letterSpacing: 0.31, wordWrap: 'break-word'}}>في حال انتقالك للرياض </span>
			</div>

			{/* Benefits - Row 3 */}
			<div style={{width: 245.50, height: 40, left: 301, top: 455, position: 'absolute', background: '#AFE4B6'}} />
			<div style={{width: 167, left: 310, top: 460, position: 'absolute', textAlign: 'right'}}>
				<span style={{color: 'black', fontSize: 10, fontFamily: 'Thmanyah sans 1.2', fontWeight: '700', letterSpacing: 0.31, wordWrap: 'break-word'}}>التكفّل برسوم الإقامة<br/></span>
				<span style={{color: 'black', fontSize: 10, fontFamily: 'Thmanyah sans 1.2', fontWeight: '400', letterSpacing: 0.31, wordWrap: 'break-word'}}>للموظّف والتابعين طوال مدة التعاقد</span>
			</div>

			<div style={{width: 245.50, height: 40, left: 301, top: 503, position: 'absolute', background: '#AFE4B6'}} />
			<div style={{width: 167, left: 310, top: 508, position: 'absolute', textAlign: 'right'}}>
				<span style={{color: 'black', fontSize: 10, fontFamily: 'Thmanyah sans 1.2', fontWeight: '700', letterSpacing: 0.31, wordWrap: 'break-word'}}>عدد أيام إجازات مفتوحة<br/></span>
				<span style={{color: 'black', fontSize: 10, fontFamily: 'Thmanyah sans 1.2', fontWeight: '400', textDecoration: 'underline', letterSpacing: 0.31, wordWrap: 'break-word'}}> 365 يومًا في السنة</span>
			</div>

			<div style={{width: 245.50, height: 40, left: 48, top: 455, position: 'absolute', background: '#AFE4B6'}} />
			<div style={{width: 167, left: 57, top: 460, position: 'absolute', textAlign: 'right'}}>
				<span style={{color: 'black', fontSize: 10, fontFamily: 'Thmanyah sans 1.2', fontWeight: '700', letterSpacing: 0.31, wordWrap: 'break-word'}}>سكن مؤقت<br/></span>
				<span style={{color: 'black', fontSize: 10, fontFamily: 'Thmanyah sans 1.2', fontWeight: '400', letterSpacing: 0.31, wordWrap: 'break-word'}}>عند إقامتك في الرياض لمدة أسبوع</span>
			</div>

			<div style={{width: 245.50, height: 40, left: 48, top: 503, position: 'absolute', background: '#AFE4B6'}} />
			<div style={{width: 167, left: 57, top: 508, position: 'absolute', textAlign: 'right'}}>
				<span style={{color: 'black', fontSize: 10, fontFamily: 'Thmanyah sans 1.2', fontWeight: '700', letterSpacing: 0.31, wordWrap: 'break-word'}}>المرونة في أوقات العمل<br/></span>
				<span style={{color: 'black', fontSize: 10, fontFamily: 'Thmanyah sans 1.2', fontWeight: '400', letterSpacing: 0.31, wordWrap: 'break-word'}}> في المكتب أو من أي مكان</span>
			</div>

			{/* Disclaimer */}
			<div style={{left: 309, top: 554, position: 'absolute', textAlign: 'right'}}>
				<span style={{color: '#FF0000', fontSize: 8, fontFamily: 'Thmanyah sans 1.2', fontWeight: '300', lineHeight: 21, letterSpacing: 0.25, wordWrap: 'break-word'}}>*</span>
				<span style={{color: 'black', fontSize: 8, fontFamily: 'Thmanyah sans 1.2', fontWeight: '300', lineHeight: 21, letterSpacing: 0.25, wordWrap: 'break-word'}}> بالإضافة لجميع مزايا «ثمانية» حسب الدستور الرسمي وهي قابلة للتغيير.</span>
			</div>

			{/* Closing message */}
			<div style={{left: 171, top: 615, position: 'absolute', textAlign: 'right'}}>
				<span style={{color: 'black', fontSize: 16, fontFamily: 'Thmanyah serif display 1.2', fontWeight: '400', wordWrap: 'break-word'}}>يسعدنا أن تكون جزءًا مؤثرًا معنا في إنتاج </span>
				<span style={{color: 'black', fontSize: 20, fontFamily: 'Thmanyah serif display 1.2', fontWeight: '700', wordWrap: 'break-word'}}>أفضل محتوى عربي.</span>
			</div>

			{/* Signature - Right (Employee) */}
			<div style={{width: 117, left: 407, top: 689, position: 'absolute', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 6, display: 'inline-flex'}}>
				<div style={{alignSelf: 'stretch', textAlign: 'center', color: 'black', fontSize: 18, fontFamily: 'Thmanyah serif display 1.2', fontWeight: '700', lineHeight: 21, letterSpacing: 0.56, wordWrap: 'break-word'}}>
					{formData.name}
				</div>
				<div style={{alignSelf: 'stretch', color: 'black', fontSize: 14, fontFamily: 'Thmanyah serif display 1.2', fontWeight: '400', lineHeight: 21, letterSpacing: 0.44, wordWrap: 'break-word'}}>
					{formData.jobTitle.split("|")[0].trim()}
				</div>
			</div>

			{/* Signature - Left (Manager) */}
			<div style={{width: 178, left: 73, top: 689, position: 'absolute', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 6, display: 'inline-flex'}}>
				<div style={{alignSelf: 'stretch', color: 'black', fontSize: 18, fontFamily: 'Thmanyah serif display 1.2', fontWeight: '700', lineHeight: 21, letterSpacing: 0.56, wordWrap: 'break-word'}}>
					{selectedManager ? selectedManager.value : formData.directManager}
				</div>
				<div style={{alignSelf: 'stretch', textAlign: 'center', color: 'black', fontSize: 14, fontFamily: 'Thmanyah serif display 1.2', fontWeight: '400', lineHeight: 21, letterSpacing: 0.44, wordWrap: 'break-word'}}>
					{selectedManager ? selectedManager.jobTitle.split("|")[0].trim() : formData.directManagerJobTitle.split("|")[0].trim()}
				</div>
			</div>

			{/* "تفاصيل الراتب" text/logo at top */}
			<div style={{width: 224.67, height: 34.33, left: 322, top: 80, position: 'absolute', overflow: 'hidden'}}>
				<div style={{width: 46.01, height: 18.19, left: 0, top: 6.89, position: 'absolute', background: 'black'}} />
				<div style={{width: 17.07, height: 21.22, left: 47.18, top: 3.09, position: 'absolute', background: 'black'}} />
				<div style={{width: 11.04, height: 19.42, left: 54.08, top: 0, position: 'absolute', background: 'black'}} />
				<div style={{width: 16.71, height: 17.33, left: 66.62, top: 7.13, position: 'absolute', background: 'black'}} />
				<div style={{width: 11.72, height: 20.35, left: 81.78, top: 12.99, position: 'absolute', background: 'black'}} />
				<div style={{width: 7.72, height: 24.32, left: 91.96, top: 0, position: 'absolute', background: 'black'}} />
				<div style={{width: 5.12, height: 24.83, left: 102.88, top: 0, position: 'absolute', background: 'black'}} />
				<div style={{width: 12.74, height: 22.24, left: 109.22, top: 9.33, position: 'absolute', background: 'black'}} />
				<div style={{width: 50.16, height: 21.34, left: 132.16, top: 12.99, position: 'absolute', background: 'black'}} />
				<div style={{width: 10.22, height: 23.28, left: 179.87, top: 1.05, position: 'absolute', background: 'black'}} />
				<div style={{width: 5.12, height: 24.83, left: 192.73, top: 0, position: 'absolute', background: 'black'}} />
				<div style={{width: 15.36, height: 19.59, left: 194.81, top: 13.02, position: 'absolute', background: 'black'}} />
				<div style={{width: 7.72, height: 24.32, left: 208.63, top: 0, position: 'absolute', background: 'black'}} />
				<div style={{width: 5.12, height: 24.83, left: 219.55, top: 0, position: 'absolute', background: 'black'}} />
			</div>

			{/* "الراتب الشهري شامل" text */}
			<div style={{width: 131, height: 17, left: 391, top: 151, position: 'absolute', overflow: 'hidden'}}>
				<div style={{width: 8.50, height: 13.63, left: 0, top: 0.07, position: 'absolute', background: 'black'}} />
				<div style={{width: 14.13, height: 6.91, left: 7.63, top: 4.39, position: 'absolute', background: 'black'}} />
				<div style={{width: 3.26, height: 10.96, left: 23.02, top: 0.07, position: 'absolute', background: 'black'}} />
				<div style={{width: 10.61, height: 11.02, left: 25.57, top: 0.01, position: 'absolute', background: 'black'}} />
				<div style={{width: 9.82, height: 14.56, left: 40.62, top: 2.44, position: 'absolute', background: 'black'}} />
				<div style={{width: 6.14, height: 8.87, left: 49.06, top: 5.91, position: 'absolute', background: 'black'}} />
				<div style={{width: 11.95, height: 10.59, left: 54.34, top: 3.29, position: 'absolute', background: 'black'}} />
				<div style={{width: 11.85, height: 11.03, left: 65.58, top: 0, position: 'absolute', background: 'black'}} />
				<div style={{width: 3.53, height: 11.02, left: 76.73, top: 0.01, position: 'absolute', background: 'black'}} />
				<div style={{width: 2.34, height: 11.25, left: 81.71, top: 0.01, position: 'absolute', background: 'black'}} />
				<div style={{width: 22.92, height: 9.67, left: 88.72, top: 5.90, position: 'absolute', background: 'black'}} />
				<div style={{width: 4.67, height: 10.55, left: 110.53, top: 0.49, position: 'absolute', background: 'black'}} />
				<div style={{width: 2.34, height: 11.25, left: 116.40, top: 0.01, position: 'absolute', background: 'black'}} />
				<div style={{width: 7.02, height: 8.87, left: 117.35, top: 5.91, position: 'absolute', background: 'black'}} />
				<div style={{width: 3.53, height: 11.02, left: 123.67, top: 0.01, position: 'absolute', background: 'black'}} />
				<div style={{width: 2.34, height: 11.25, left: 128.66, top: 0.01, position: 'absolute', background: 'black'}} />
			</div>

			<PageFooter />
		</div>
	)
}
