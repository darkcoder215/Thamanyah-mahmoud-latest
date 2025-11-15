import ProtectedComponent from "@/components/ProtectedComponent"

// Force dynamic rendering for this page
export const dynamic = "force-dynamic"

export default function DashboardPage() {
	return (
		<div className="container mx-auto p-4">
			<ProtectedComponent />
		</div>
	)
}
