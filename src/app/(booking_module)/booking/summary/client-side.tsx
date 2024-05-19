'use client'

import { Container, Heading, Flex, Image, Spacer, VStack, Text, Divider, Link, Center, Box, Button } from "@chakra-ui/react"
import { type BookingSummaryData } from "./page"

export default function BookingSummary({ 
    bookingSummaryData, facilityData
} : { 
    bookingSummaryData: BookingSummaryData[], facilityData: {facility_name: string, image_url: string}
}) {
    return (
        <Container my={10} px={8} py={5} maxH="90lvw" borderWidth={2} borderColor="#970bf5" rounded={10}>
            <Heading mb={5}>Booking Summary</Heading>
            {
                bookingSummaryData.map((data : BookingSummaryData, index: number) => {
                    return (
                        <>
                            <Divider mb={5} />                  
                            <Flex key={index} mb={5}>
                                <Image src={facilityData.image_url} alt="Facility Image" mt={1} aspectRatio={2} w="200px" h="125px" rounded={15}></Image>
                                <Spacer />
                                <VStack maxW="250px">
                                    <Heading size={"sm"} alignSelf="end" textAlign="right">{facilityData.facility_name} </Heading>
                                    <VStack spacing="0" alignSelf="end" alignItems="end">
                                        <Text fontSize={"xs"} textAlign="right">Date: {data.timeslot_date}</Text>
                                        <Text fontSize={"xs"} textAlign="right">Time: {data.timeslot_start.slice(0, 5)} - {data.timeslot_end.slice(0, 5)}</Text>
                                        <Text fontSize={"xs"} textAlign="right">{data.court_name}</Text>
                                    </VStack>
                                    <Heading size={"sm"} alignSelf="end" textAlign="right">RM{(data.timeslot_rate).toFixed(2)}</Heading>                                
                                    <Link textColor="red" fontSize={"sm"} alignSelf="end" textAlign="right">Delete</Link>
                                </VStack>
                            </Flex>
                        </>
                    )
                })
            }

            <Divider mb={3} />
            <Flex mb={3} >
                <Spacer />
                <Text as="b" size={"sm"} alignSelf="right" textAlign="right" mr={10}>Total:</Text>
                <Text size={"sm"} alignSelf="right" textAlign="right">{bookingSummaryData.reduce((accumulator, data) => {return accumulator + data.timeslot_rate}, 0).toFixed(2)}</Text>
            </Flex>
            <Divider mb={5} />

            <Heading fontSize={"2xl"} mb={3}>Select Payment Method</Heading>
            <Flex mb={5}>
                <Box as="button" borderWidth={1} borderColor="black" p={5} rounded={10}>
                    <Image src="/online-booking-logo.png" alt="Online Banking" aspectRatio={3} maxW="200px" maxH="80px" borderWidth={1} borderColor="black"></Image>
                </Box>  
                <Spacer />
                <Box as="button" borderWidth={1} borderColor="black" p={5} rounded={10}>
                    <Image src="/credit-card-logo.png" alt="Credit Card" aspectRatio={3} maxW="200px" maxH="80px" borderWidth={1} borderColor="black"></Image>
                </Box>
            </Flex>

            <Center>
                <Button rounded={20} bg="#970bf5" color="white" _hover={{ bg: "#7a00cc"}}>Proceed to Payment</Button>
            </Center>
        </Container>
    )
}