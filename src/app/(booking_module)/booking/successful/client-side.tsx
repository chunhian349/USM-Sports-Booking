'use client'
import { type BookingSummaryData } from "../summary/actions"
import { Container, Heading, Flex, Image, Spacer, VStack, Text, Divider, Center, Button, Link } from "@chakra-ui/react"

export default function BookingSuccess({
    userData, bookingSummaryData, facilityData, bookingData
} : {
    userData : { full_name: string, phone_num: string}, 
    bookingSummaryData: BookingSummaryData[], 
    facilityData: {facility_name: string, facility_photo: string}, 
    bookingData: {booking_id: string, transaction_time: string, transaction_amount: number, transaction_method: string}
}) {
    const date = new Date(bookingData.transaction_time)

    return (
        <div>
            <Container my={10} px={8} py={5} maxH="90lvw" borderWidth={2} borderColor="#970bf5" rounded={10}>
                <Heading mb={3}>Booking Successful</Heading>
                <Text mb={5}>Here is your receipt:</Text>
                <VStack mb={5} spacing="0" alignSelf="start" alignItems="start">
                    <Text fontSize={"sm"} textAlign="left">Booking ID: {bookingData.booking_id}</Text>
                    <Text fontSize={"sm"} textAlign="left">Paid on {date.toLocaleDateString('en-MY')} {date.toLocaleTimeString('en-MY')}</Text>
                    <Text fontSize={"sm"} textAlign="left">Payment Method: {bookingData.transaction_method}</Text>
                    <Text fontSize={"sm"} textAlign="left">Name: {userData.full_name}</Text>
                    <Text fontSize={"sm"} textAlign="left">Phone Number: {userData.phone_num}</Text>
                </VStack>
                <Divider mb={5} borderColor="#970bf5" />
                <Text mb={1} fontSize={"sm"} textAlign="left">Order(s):</Text>
                {
                    bookingSummaryData.map((data : BookingSummaryData, index: number) => {
                        return (
                            <div key={index}>
                                <Flex mb={5}>
                                    <Image src={facilityData.facility_photo} alt="Facility Image" mt={1} aspectRatio={2} w="200px" h="125px" rounded={15}></Image>
                                    <Spacer />
                                    <VStack maxW="250px">
                                        <Heading size={"sm"} alignSelf="end" textAlign="right">{facilityData.facility_name} </Heading>
                                        <VStack spacing="0" alignSelf="end" alignItems="end">
                                            <Text fontSize={"xs"} textAlign="right">Date: {data.timeslot_date}</Text>
                                            <Text fontSize={"xs"} textAlign="right">Time: {data.timeslot_start.slice(0, 5)} - {data.timeslot_end.slice(0, 5)}</Text>
                                            <Text fontSize={"xs"} textAlign="right">{data.court_name}</Text>
                                        </VStack>
                                        <Heading size={"sm"} alignSelf="end" textAlign="right">RM{(data.timeslot_rate).toFixed(2)}</Heading>
                                    </VStack>
                                </Flex>
                                <Divider mb={5} borderColor="#970bf5" />                  
                            </div>
                        )
                    })
                }
                <Flex mb={3} >
                    <Spacer />
                    <Text as="b" size={"sm"} alignSelf="right" textAlign="right" mr={10}>Total:</Text>
                    <Text as="b" size={"sm"} alignSelf="right" textAlign="right">RM {bookingData.transaction_amount.toFixed(2)}</Text>
                </Flex>
            </Container>
            <Center mb={10}>
                <Link href="/">
                    <Button rounded={20} bg="#970bf5" color="white" _hover={{ bg: "#7a00cc"}}>
                            Back to Main Page
                    </Button>
                </Link>
            </Center>
        </div>
    )
}