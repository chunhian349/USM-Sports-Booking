'use client'

import { Container, Heading, Flex, Image, Spacer, VStack, Text, Divider, Center, Box, Button, useToast  } from "@chakra-ui/react"
import { MakePayment, type BookingSummaryData } from "./actions"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function BookingSummary({ 
    bookingData, bookingSummaryData, facilityData
} : { 
    bookingData: {booking_id: string, booking_expiry_time: Date}, 
    bookingSummaryData: BookingSummaryData[], 
    facilityData: {facility_name: string, facility_photo: string}
}) {
    const [paymentMethod, setPaymentMethod] = useState("Online Banking")
    const [ isLoading, setIsLoading ] = useState(false)
    const toast = useToast()
    const router = useRouter()
    const isExpired = new Date() > bookingData.booking_expiry_time;
    let paymentAmount = 0

    // Countdown timer to show booking expiry time
    var bookingExpiryTimer = setInterval(function() {
        var now = new Date().getTime();
        var distance = bookingData.booking_expiry_time.getTime() - now;
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        var expiryTimeElement = document.getElementById("expirytime");
        if (expiryTimeElement !== null) {
            expiryTimeElement.innerHTML = minutes + "m " + seconds + "s ";
            if (distance < 0) {
                clearInterval(bookingExpiryTimer);
                expiryTimeElement.innerHTML = "EXPIRED";
            }
        }
    }, 1000);

    async function HandlePaymentButton(booking_id:string, paymentMethod: string, paymentAmount: number) {
        setIsLoading(true)
        const paymentResult = await MakePayment(booking_id, paymentMethod, paymentAmount)

        // wait for 2 seconds to simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000))

        if (paymentResult == "Payment successful") {
            toast({
                title: "Payment Successful",
                description: "You have successfully made payment for your booking.",
                status: "success",
                duration: 9000,
                position: "top",
                isClosable: true,
            })

            router.push('/booking/successful/?booking_id=' + booking_id)

        } else {
            toast({
                title: "Failed to Make Payment",
                description: paymentResult,
                status: "error",
                duration: 5000,
                position: "top",
                isClosable: true,
            })
        }

        setIsLoading(false)
    }

    return (
        <Container my={10} px={8} py={5} maxH="90lvw" borderWidth={2} borderColor="#970bf5" rounded={10}>
            <Flex>
                <Heading mb={5}>Booking Summary</Heading>
                <Spacer />
                <VStack spacing={0} alignItems="end">
                    <Text textColor='red' textAlign="end">{"Complete booking in "}</Text>
                    <Text id="expirytime" textColor='red' textAlign="end"></Text>
                </VStack>
            </Flex>
            {
                bookingSummaryData.map((data : BookingSummaryData, index: number) => {
                    paymentAmount += data.timeslot_rate
                    return (
                        <div key={index}>
                            <Divider  borderColor="#970bf5" mb={5} />                  
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
                                    {/* <Link textColor="red" fontSize={"sm"} alignSelf="end" textAlign="right" onClick={onOpen}>Delete</Link> */}
                                </VStack>
                            </Flex>
                        </div>
                    )
                })
            }

            <Divider mb={3} borderColor="#970bf5" />
            <Flex mb={3} >
                <Spacer />
                <Text as="b" size={"sm"} alignSelf="right" textAlign="right" mr={10}>Total:</Text>
                <Text as="b" size={"sm"} alignSelf="right" textAlign="right">RM{paymentAmount.toFixed(2)}</Text>
            </Flex>
            <Divider mb={5} borderColor="#970bf5" />

            {!isExpired ? (
                <Box>
                    <Heading fontSize={"2xl"} mb={3}>Select Payment Method: {paymentMethod}</Heading>
                    <Flex mb={5}>
                        <Box as="button" borderWidth={1} borderColor="black" p={5} rounded={10} _hover={{bg:"gray.50"}} _active={{bg:"gray.100"}} 
                            bg={paymentMethod ==  "Online Banking" ? "gray.50" : "white"} onClick={() => setPaymentMethod("Online Banking")} 
                        >
                            <Image src="/online-booking-logo.png" alt="Online Banking" aspectRatio={3} maxW="200px" maxH="80px" borderWidth={1} borderColor="black"></Image>
                        </Box>  
                        <Spacer />
                        <Box as="button" borderWidth={1} borderColor="black" p={5} rounded={10} _hover={{bg:"gray.50"}} _active={{bg:"gray.100"}} 
                            bg={paymentMethod == "Credit Card" ? "gray.50" : "white"} onClick={() => setPaymentMethod("Credit Card")} 
                        >
                            <Image src="/credit-card-logo.png" alt="Credit Card" aspectRatio={3} maxW="200px" maxH="80px" borderWidth={1} borderColor="black"></Image>
                        </Box>
                    </Flex>
                </Box>
                ) : null
            }

            <Center>
                {
                    isExpired ? 
                    (<Button rounded={20} isDisabled >Booking Expired</Button>) :
                    (<Button rounded={20} bg="#970bf5" color="white" _hover={{ bg: "#7a00cc"}} isLoading={isLoading}
                        onClick={() => HandlePaymentButton(bookingData.booking_id, paymentMethod, paymentAmount)} >Proceed to Payment</Button>)
                }
            </Center>
        </Container>
    )
}