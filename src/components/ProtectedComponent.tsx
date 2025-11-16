"use client"

import Link from "next/link"
import {
	FileTextOutlined,
	UserOutlined,
	CalculatorOutlined,
	TeamOutlined,
	FormatPainterOutlined,
	SolutionOutlined,
} from "@ant-design/icons"
import { Card, Row, Col, Typography } from "antd"
import { useAuth } from "@/lib/context/AuthContext"

const { Title, Text } = Typography

const ProtectedComponent = () => {
	const { user, isGuestMode } = useAuth()

	const tools = [
		{
			title: "عرض وظيفة",
			description: "إنشاء عرض وظيفة احترافي للموظفين",
			icon: <FileTextOutlined style={{ fontSize: "32px" }} />,
			href: "/job-offer",
			color: "#1890ff",
		},
		{
			title: "عرض وظيفة - تصميم جديد",
			description: "إنشاء عرض وظيفة بالتصميم الجديد",
			icon: <FileTextOutlined style={{ fontSize: "32px" }} />,
			href: "/new-job-offer",
			color: "#03BB6E",
		},
		{
			title: "عرض مستقل",
			description: "إنشاء عقد عمل حر للمستقلين",
			icon: <UserOutlined style={{ fontSize: "32px" }} />,
			href: "/freelancer-offer",
			color: "#52c41a",
		},
		{
			title: "عرض مؤقت",
			description: "إنشاء عرض عمل مؤقت",
			icon: <SolutionOutlined style={{ fontSize: "32px" }} />,
			href: "/temp-offer",
			color: "#faad14",
		},
		{
			title: "حاسبة الرواتب",
			description: "حساب الرواتب والبدلات",
			icon: <CalculatorOutlined style={{ fontSize: "32px" }} />,
			href: "/salary-calculator",
			color: "#722ed1",
		},
		{
			title: "القوالب المخصصة",
			description: "إنشاء وإدارة قوالب العروض",
			icon: <FormatPainterOutlined style={{ fontSize: "32px" }} />,
			href: "/custom-templates",
			color: "#eb2f96",
		},
		{
			title: "إدارة المعلنين",
			description: "إدارة المعلنين والمنشورات",
			icon: <TeamOutlined style={{ fontSize: "32px" }} />,
			href: "/manage-advertisers",
			color: "#13c2c2",
		},
	]

	return (
		<div className="mx-auto max-w-6xl p-4">
			<div className="mb-8 text-center">
				<Title level={2}>مرحباً {user?.displayName?.split(" ")[0]} 👋</Title>
				<Text type="secondary">
					{isGuestMode ? "أنت في وضع الضيف" : `${user?.email}`}
				</Text>
			</div>

			<Row gutter={[24, 24]}>
				{tools.map((tool) => (
					<Col xs={24} sm={12} lg={8} key={tool.href}>
						<Link href={tool.href} style={{ textDecoration: "none" }}>
							<Card
								hoverable
								className="h-full transition-shadow duration-300 hover:shadow-lg"
								style={{ borderTop: `4px solid ${tool.color}` }}
							>
								<div className="text-center">
									<div className="mb-4" style={{ color: tool.color }}>
										{tool.icon}
									</div>
									<Title level={4} className="mb-2">
										{tool.title}
									</Title>
									<Text type="secondary">{tool.description}</Text>
								</div>
							</Card>
						</Link>
					</Col>
				))}
			</Row>
		</div>
	)
}

export default ProtectedComponent
