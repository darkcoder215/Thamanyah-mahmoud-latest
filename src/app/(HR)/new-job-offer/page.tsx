import JobOfferForm from "@/components/JobOffer/JobOfferForm"

const NewJobOffer: React.FC = () => {
	return (
		<div className="p-10">
			<JobOfferForm defaultTheme="latest" />
		</div>
	)
}

export default NewJobOffer
