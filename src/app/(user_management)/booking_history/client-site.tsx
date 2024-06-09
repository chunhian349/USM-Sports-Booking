'use client'

import { useToast, Container, Center, Heading, VStack, Link, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Button, Flex, Box, FormControl, FormLabel, Input, Image, Spacer, Divider, Slider, SliderMark, SliderTrack, SliderFilledTrack, SliderThumb, Tooltip, Tabs, TabList, Tab, TabPanels, TabPanel } from "@chakra-ui/react"
import { ArrowBackIcon } from "@chakra-ui/icons"
import { useState, useEffect } from "react"
import { SubmitReview, SelectReview, type BookingDetails } from "./actions"

export default function BookingHistory({
    completedBooking, incompleteBooking, bookingDetails
} : {
    completedBooking: { booking_id: string, transaction_time: string, transaction_method: string, transaction_amount: number }[], 
    incompleteBooking: { booking_id: string, booking_created_at: string }[], 
    bookingDetails: Map<string, BookingDetails[]>
}) {
    const [ fetchSignal, setFetchSignal ] = useState(false)
    const [ reviewData, setReviewData ] = useState<{fk_booking_id: string, review_rating: number, review_comment: string}[]>([])
    const [ showReviewForm, setShowReviewForm ] = useState(false)
    const [ showReview, setShowReview ] = useState(false)
    const [ showBookingDetails, setShowBookingDetails ] = useState(false)
    const [ selectedBookingId, setSelectedBookingId ] = useState('')
    const [ ratingValue, setRatingValue ] = useState(10)
    const [ comment, setComment ] = useState('')
    const [ showTooltip, setShowTooltip ] = useState(false)
    const [ loading, setLoading ] = useState(false)
    const toast = useToast()

    async function handleReviewSubmit() {
        setLoading(true)
        
        if (await SubmitReview(selectedBookingId, ratingValue, comment)) {
            toast({
                title: "Review submitted.",
                description: "Your review on this booking has been submitted successfully.",
                status: "success",
                duration: 3000,
                isClosable: true,
            })
            setShowReviewForm(false);
            setRatingValue(10)
            setComment('')
        }
        else {
            toast({
                title: "Report failed to submit.",
                description: "An error occurred while submitting your review. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            })
        }
        
        setLoading(false)
        setFetchSignal(!fetchSignal)
    }

    // Fetch review data initially, fetch again when user makes a review
    useEffect(() => {
        async function fetchReviewData() {
            const arr_booking_id = completedBooking.map((booking) => booking.booking_id)
            const reviewData = await SelectReview(arr_booking_id)
    
            setReviewData(reviewData)
        }
        fetchReviewData()

    }, [fetchSignal, completedBooking])
    
        // return (
        //     <Container maxW="90lvw" mt={5}>
        //         <Link href='/' mb={5}>
        //             <ArrowBackIcon /> Back to homepage
        //         </Link>
        //         <Heading mt={3} mb={5}>Booking History</Heading>
        //         <Heading size='lg' as='i' textColor='gray'>(Booking History is Empty)</Heading>
        //     </Container>
        // )
    return (
        <Container maxW="90lvw" mt={5} borderColor='gray.300' px={5} borderWidth={2} rounded={10}>
            <Heading my={5}>Booking History</Heading>
            
            <Link href='/'>
                <ArrowBackIcon /> Back to homepage
            </Link>
            <Tabs variant='enclosed' borderColor="black" mt={3} >
                <TabList>
                    <Tab>Completed</Tab>
                    <Tab>Incomplete</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <VStack spacing={3}>
                            {completedBooking.map((booking, index) => {
                                const transaction_date = new Date(booking.transaction_time)
                                
                                return (
                                    <Box key={index} w="full" p={4} borderWidth={1} borderColor="#970bf5" rounded="md" _hover={{ boxShadow:'base', bgColor:"gray.50" }}>
                                        <Text fontSize={"sm"} textAlign="left">Booking ID: {booking.booking_id}</Text>
                                        <Text fontSize={"sm"} textAlign="left">Paid on {transaction_date.toLocaleDateString('en-MY')} {transaction_date.toLocaleTimeString('en-MY')}</Text>
                                        <Text fontSize={"sm"} textAlign="left">Paid using {booking.transaction_method}</Text>
                                        <Text as="b" fontSize={"sm"} textAlign="left">Total Payment: RM {booking.transaction_amount?.toFixed(2)}</Text>
                                        <Divider my={3} borderColor="#970bf5" /> 
                                        <Flex mt={2}>
                                            <Button size={'sm'} colorScheme="green" mr={3} onClick={()=>{setShowBookingDetails(true); setSelectedBookingId(booking.booking_id)}}>Details</Button>
                                            {
                                                // Check if current booking has review
                                                reviewData.some((review) => review.fk_booking_id == booking.booking_id) ? (
                                                    <Button size={"sm"} colorScheme="gray" onClick={()=>{setShowReview(true); setSelectedBookingId(booking.booking_id)}}>Reviewed</Button>
                                                ) : (
                                                    <Button size={"sm"} colorScheme="purple" onClick={()=>{setShowReviewForm(true); setSelectedBookingId(booking.booking_id)}}>Review</Button>                                           
                                                )
                                            }
                                        </Flex>
                                    </Box>                                
                                )
                            })}
                        </VStack>
                    </TabPanel>

                    <TabPanel>
                    <VStack spacing={3}>
                            {incompleteBooking.map((booking, index) => {    
                                const lockTime = new Date(booking.booking_created_at)
                                const currentTime = new Date()
                                const timeDiff = currentTime.getTime() - lockTime.getTime()
                                const MAX_DIFF = 30 * 60 * 1000 // 30 minutes                                                 
                                return (
                                    <Box key={index} w="full" p={4} borderWidth={1} borderColor="#970bf5" rounded="md" _hover={{ boxShadow:'base', bgColor:"gray.50" }} >
                                        <Text fontSize={"sm"} textAlign="left">Booking ID: {booking.booking_id}</Text>
                                        <Text fontSize={"sm"} textAlign="left">Locked on {new Date(booking.booking_created_at).toLocaleDateString('en-MY')} {new Date(booking.booking_created_at).toLocaleTimeString('en-MY')}</Text>
                                        <Divider my={3} borderColor="#970bf5" /> 
                                        <Flex mt={2}>
                                            <Button size={"sm"} colorScheme="green" mr={3} onClick={()=>{setShowBookingDetails(true); setSelectedBookingId(booking.booking_id)}}>Details</Button>                               
                                            {
                                                timeDiff < MAX_DIFF ? (
                                                    <Link href={"/booking/summary/?booking_id="+booking.booking_id}><Button size={"sm"} colorScheme="purple" mr={3}>Checkout</Button></Link>
                                                ) : (
                                                    <Button size={"sm"} colorScheme="gray" mr={3} isDisabled>Expired</Button>
                                                )
                                            }
                                        </Flex>
                                    </Box>                                
                                )
                            })}
                        </VStack>
                    </TabPanel>
                </TabPanels> 

                {/* Booking Details Modal */}
                <Modal isOpen={showBookingDetails} onClose={()=>setShowBookingDetails(false)} scrollBehavior="inside">
                    <ModalOverlay bg='blackAlpha.300' />
                    <ModalContent>
                    <ModalHeader>Booking Details</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Divider mb={2} borderColor="#970bf5" /> 
                        {
                            bookingDetails.get(selectedBookingId)?.map((details, index) => (
                                <div key={index}>
                                    <Flex mb={5}>
                                        <Image src={details.facility_photo} alt="Facility Image" mt={1} aspectRatio={2} w="200px" h="125px" rounded={15}></Image>
                                        <Spacer />
                                        <VStack maxW="250px">
                                            <Heading size={"sm"} alignSelf="end" textAlign="right">{details.facility_name} </Heading>
                                            <VStack spacing="0" alignSelf="end" alignItems="end">
                                                <Text fontSize={"xs"} textAlign="right">Date: {details.timeslot_date}</Text>
                                                <Text fontSize={"xs"} textAlign="right">Time: {details.timeslot_start.slice(0, 5)} - {details.timeslot_end.slice(0, 5)}</Text>
                                                <Text fontSize={"xs"} textAlign="right">{details.court_name}</Text>
                                            </VStack>
                                            <Heading size={"sm"} alignSelf="end" textAlign="right">RM{(details.timeslot_rate).toFixed(2)}</Heading>
                                        </VStack>
                                    </Flex>
                                    <Divider mb={2} borderColor="#970bf5" />    
                                </div>
                            ))
                        }
                        <Center>
                            <Button onClick={()=>setShowBookingDetails(false)} bg="white" textColor="#970bf5" borderWidth={2} borderColor="#970bf5" w="6rem" rounded="20" 
                                _hover={{ bg: "#970bf5", color:"white"}} _active={{bg: 'white', color:"#970bf5"}}>
                                Close
                            </Button>
                        </Center>
                    </ModalBody>
                    </ModalContent>
                </Modal>

                {/* Review Modal */}
                <Modal isOpen={showReview} onClose={()=>setShowReview(false)} scrollBehavior="inside">
                    <ModalOverlay bg='blackAlpha.300' />
                    <ModalContent>
                    <ModalHeader fontSize={'2xl'}>Review</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {
                            reviewData && reviewData.some((review) => review.fk_booking_id == selectedBookingId) ? (
                                <FormControl mb={3}>
                                    <FormLabel mb={3}>
                                        Rating:
                                    </FormLabel>                                        
                                    <Slider
                                        value={reviewData.find((review) => review.fk_booking_id == selectedBookingId)?.review_rating} min={1} max={10} step={1} mb={5}
                                        onMouseEnter={()=>setShowTooltip(true)}
                                        onMouseLeave={()=>setShowTooltip(false)}
                                        isDisabled
                                    >
                                    <SliderMark value={1} mt={2}>1</SliderMark>
                                    <SliderMark value={10} mt={2}>10</SliderMark>
                                    <SliderTrack bg='purple.100'>
                                        <SliderFilledTrack bg='purple' />
                                    </SliderTrack>
                                    <Tooltip hasArrow bg='purple' color='white' placement="top" isOpen={showTooltip} label={ratingValue}>                                            
                                        <SliderThumb boxSize={5} borderColor='purple' borderWidth={3} />
                                    </Tooltip>
                                    </Slider>

                                    <FormLabel>Comment: </FormLabel>
                                    <Input h="15lvh" as="textarea" type='text' value={reviewData.find((review) => review.fk_booking_id == selectedBookingId)?.review_comment} 
                                        _disabled={{textColor:'black', borderWidth:"2", borderColor:"gray.400"}} disabled></Input>
                                </FormControl>
                            ) : (
                                <Heading size='lg' as='i' textColor='gray'>(Review is Empty)</Heading>
                            )
                        }
                        <Center>
                            <Button onClick={()=>setShowReview(false)} bg="white" textColor="#970bf5" borderWidth={2} borderColor="#970bf5" w="6rem" rounded="20" 
                                _hover={{ bg: "#970bf5", color:"white"}} _active={{bg: 'white', color:"#970bf5"}}>
                                Close
                            </Button>
                        </Center>
                    </ModalBody>
                    </ModalContent>
                </Modal>

                {/* Review Form Modal */}
                <Modal isOpen={showReviewForm} onClose={()=>setShowReviewForm(false)} scrollBehavior="inside">
                    <ModalOverlay bg='blackAlpha.300'/>
                    <ModalContent>
                    <ModalHeader>Make Review</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                            <FormControl mb={3}>
                                <FormLabel mb={3}>
                                    Rating:
                                </FormLabel>                                        
                                <Slider
                                    value={ratingValue} min={1} max={10} step={1} mb={5}
                                    onChange={(value)=>{setRatingValue(value)}}
                                    onMouseEnter={()=>setShowTooltip(true)}
                                    onMouseLeave={()=>setShowTooltip(false)}
                                >
                                <SliderMark value={1} mt={2}>1</SliderMark>
                                <SliderMark value={10} mt={2}>10</SliderMark>
                                <SliderTrack bg='purple.100'>
                                    <SliderFilledTrack bg='purple' />
                                </SliderTrack>
                                <Tooltip hasArrow bg='purple' color='white' placement="top" isOpen={showTooltip} label={ratingValue}>                                            
                                    <SliderThumb boxSize={5} borderColor='purple' borderWidth={3} />
                                </Tooltip>
                                </Slider>

                                <FormLabel>Comment:</FormLabel>
                                <Input h="15lvh" as="textarea" type='text' placeholder="Enter Your Comment Here" borderWidth={2} borderColor="gray.400"
                                    onChange={(e)=>setComment(e.target.value)}></Input>
                            </FormControl>

                            <Center>
                                <Button colorScheme='purple' rounded={20} onClick={()=>{handleReviewSubmit()}} isLoading={loading}>
                                    Submit
                                </Button>
                            </Center>
                    </ModalBody>
                    </ModalContent>
                </Modal>
            </Tabs>
        </Container>
    )
}