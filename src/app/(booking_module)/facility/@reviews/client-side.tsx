'use client'

import { Center, Container, Flex, Heading, Spacer, Text, VStack, Box } from "@chakra-ui/react"

export default function FacilityReviews({facility_id}: {facility_id: string}) {
    const reviews = Array.from({length: 10})

    return (
        <Container maxWidth="90lvw" mt={3}>
            <Flex mb={3}>
                <Heading>Reviews</Heading>
                <Spacer />
                <Center>
                    <Text>Overall Rating: n/a</Text>
                </Center>
            </Flex>
            <VStack align="start" h="50lvh" overflow="scroll">
            {
                reviews.map((review, index) => {
                    return (
                        <Box key={index} borderColor={"grey"} borderWidth={1} boxShadow={"lg"} p={3} w="100%" rounded="10">
                            <Text>Review {index + 1}</Text>
                            <Text>Rating: n/a</Text>
                            <Text>Comment: n/a</Text>
                        </Box>
                    )
                })
            }
            </VStack>
            
        </Container>
    )
}