export default function ViewFacilityLayout({
    children,
    details,
    availability,
    reviews,
}:{
    children: React.ReactNode,
    details: React.ReactNode,
    availability: React.ReactNode,
    reviews: React.ReactNode,
}) {
    return (
        <>           
            {children}                       
            {details}                       
            {availability}               
            {reviews}
        </>
    )
}