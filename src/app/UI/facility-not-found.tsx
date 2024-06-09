'use client'
import { Container, Heading, Text } from '@chakra-ui/react'

export default function FacilityNotFound() {
	return (
		<Container mt={5} maxW="100lvw" borderColor={"gray.300"} borderWidth={1} boxShadow={"lg"}>
			<Container mt={5} maxW="90lvw">
				<Heading>Facility Availability</Heading>
				<Text h="10lvh" fontStyle='italic' fontSize='lg' textColor='gray'>(Facility not found, unable to show availability)</Text>
			</Container>
		</Container>
	)
}