'use client'

import { Container, Heading, Flex, Box, Spacer, Text, Input, Center, TableContainer, Table, Thead, Tr, Th, Button, Tbody, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Switch, Link, useToast } from "@chakra-ui/react"
import { CloseIcon } from "@chakra-ui/icons"
import { useState, useEffect } from 'react'
import { useRouter } from "next/navigation"
import { useDisclosure } from '@chakra-ui/react'
import { AddCourt, DeleteCourt } from './actions'

function GetDateInUTC8(date: Date) {
	const UTC8_OFFSET = 8
	date.setUTCHours(date.getUTCHours() + UTC8_OFFSET)
	return date
}

// Generate time slots, expect hh:mm format from facilityStartTime and facilityEndTime
function GenerateTimeslots(facilityStartTime: string, facilityEndTime: string, timeslotInterval: number) {
	// Year, month, day for both timeslot set to be same, focus only on time
	const defaultYear = 2024;
	const defaultMonthIndex = 0;
	const defaultDay = 1;
	const startTimeHour = parseInt(facilityStartTime.slice(0, 2))
	const startTimeMinute = parseInt(facilityStartTime.slice(3, 5))
	const endTimeHour = parseInt(facilityEndTime.slice(0, 2))
	const endTimeMinute = parseInt(facilityEndTime.slice(3, 5))
	// Use UTC Date to avoid timezone issue
	const currentTimeslotStart = new Date(Date.UTC(defaultYear, defaultMonthIndex, defaultDay, startTimeHour, startTimeMinute))
	const currentTimeslotEnd = new Date(Date.UTC(defaultYear, defaultMonthIndex, defaultDay, startTimeHour, startTimeMinute))
	currentTimeslotEnd.setUTCMinutes(currentTimeslotEnd.getUTCMinutes() + timeslotInterval)
	const facilityEnd = new Date(Date.UTC(defaultYear, defaultMonthIndex, defaultDay, endTimeHour, endTimeMinute))

	const timeslots: string[] = []

	// Include current timeslot while current timeslot end time is not over facility end time
	// If hours over 24 will be converted to next day, the date comparison is still valid
	while (currentTimeslotEnd <= facilityEnd) {
		timeslots.push(currentTimeslotStart.toUTCString().slice(17, 22))

		// Increment by timeslotInterval
		currentTimeslotStart.setUTCMinutes(currentTimeslotStart.getUTCMinutes() + timeslotInterval)
		currentTimeslotEnd.setUTCMinutes(currentTimeslotEnd.getUTCMinutes() + timeslotInterval)
	}
	
	return timeslots
}

export default function FacilityAvailability({facility_id, facilityData}: {facility_id: string, facilityData: { facility_start_time: string, facility_end_time: string, timeslot_interval: number}}) {	
	// Time in hh:mm (24 hour format)
	const timeslots = GenerateTimeslots(facilityData.facility_start_time, facilityData.facility_end_time, facilityData.timeslot_interval) 
	const [ courtDataState, setCourtDataState ] = useState([])
	const [ fetchSignal, setFetchSignal ] = useState(false)
	const [ isLoading, setIsLoading ] = useState(false)
	const toast = useToast()
	const router = useRouter()

	// Fetch court data
	useEffect(() => {
		//console.log("Court data use effect")
		async function fetchData() {
			try {
				const response = await fetch(`/api/getcourt?`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({facility_id})
				})
				
				if (response) {
					const courtData = await response.json()
					//console.log(courtData)
					setCourtDataState(courtData)
				}
			} catch (error) {
				const errorMessage = "Fetch court data failed (in edit-facility/availability)"
				router.push('/error/?error=' + errorMessage)
			}
		}
		fetchData()
	}, [fetchSignal, facility_id, router])

	// 2d array of court availability, initialized to false, then set to true if timeslot is booked
	const [ timeSlotBooked, setTimeSlotBooked ] = useState<boolean[][]>([])
	
	const todayDate = GetDateInUTC8(new Date())
	const [ date, setDate ] = useState(todayDate.toISOString().slice(0, 10))
	//console.log(timeSlotBooked)
	
	const addCourtModal = useDisclosure()

	const handleAddCourt = async () => {
		setIsLoading(true)
		const court_name = document.getElementById("courtname") as HTMLInputElement
		const court_status = document.getElementById("courtstatus") as HTMLInputElement

		await AddCourt(court_name ? court_name.value : '', court_status ? court_status.checked : false, facility_id)

		toast({
			title: "Court added",
			description: "Court has been added successfully",
			status: "success",
			duration: 3000,
			isClosable: true,
		})
		setIsLoading(false)
		setFetchSignal(!fetchSignal)
	}

	const handleDelCourt = async (court_id : string) => {
		try {
			await DeleteCourt(court_id)
		} catch (error) {
			console.error(error)
		}

		setFetchSignal(!fetchSignal)
	}
	
	// Fetch timeslot data when court data or date changes
	useEffect(() => {
		//console.log("Use effect called")
		async function fetchTimeslotData (courtData: any[], date: string) {
			try{
				const response = await fetch(`/api/timeslot`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({courtData, date})
				})
				
				if (response) {
					const timeslotData = await response.json()			
					
					// Reset timeSlotBooked to false
					const localArrayCopy = Array.from({length: courtData.length}, () => new Array(timeslots.length).fill(false))
	
					// For each court
					for (let i = 0; i < localArrayCopy.length; i++) {
						// Set timeSlotBooked to true if timeslot is booked
						for (let j = 0; j < (timeslotData != undefined ? timeslotData[i].length : 0); j++) {
							//console.log(i + " " + j + ": " + timeslotData[i][j].timeslot_index)
							localArrayCopy[i][timeslotData[i][j].timeslot_index] = true
						}
					}
					
					setTimeSlotBooked(localArrayCopy)
					//console.log(timeSlotBooked)
				}
			} catch (error) {
				const errorMessage = "Fetch timeslot data failed (in edit-facility/availability)"
				router.push('/error/?error=' + errorMessage)
			}
		}

		async function fetchData() {
			await fetchTimeslotData(courtDataState, date)
		}
		fetchData()
	}, [courtDataState, date, router, timeslots.length])	

	return (
		<Container mt={5} maxW="100lvw" borderColor={"purple.300"} borderWidth={2} boxShadow={"lg"}>
		<Container mt={5} maxW="90lvw">
			<Flex mb={3}>
				<Heading>Facility Availability</Heading>
				<Spacer />
				<Center>
					{/* <Box bg={"blue"} boxSize={25} mr={2}></Box>
					<Text mr={4}>Selected</Text> */}
					<Box bg={"red"} boxSize={25} mr={2}></Box>
					<Text mr={4}>Not Available</Text>
					<Box bg={"lightgreen"} boxSize={25} mr={2}></Box>
					<Text>Available</Text>
				</Center>
			</Flex>

			<Text mb={2}>
				Date: <Input type="date" maxW="200px" defaultValue={date} onChange={(event: any) => {setDate(event.target.value)}} borderColor="purple.200" borderWidth="2px" focusBorderColor="purple.300" _hover={{borderColor:"purple.300"}} />
			</Text>

			<TableContainer borderColor='black' borderWidth={1} mb={4}>
				<Table variant='simple' size='sm'>
					{/* Table header */}
					<Thead>
						<Tr>
							<Th>Court</Th>
							{
								timeslots.map((timeslot, index) => {
									return <Th key={index}>{timeslot}</Th>
								})
							}
						</Tr>
					</Thead>

					<Tbody>
						{
							courtDataState.map((court: any, index: number) => {
								return (
									<Tr key={index}>
										<Th pr={0}>
											<Text>
												{court.court_name}
												<Link onClick={()=>{handleDelCourt(court.court_id)}}><CloseIcon mx={2} color="red"/></Link>
											</Text>
										</Th>
										{
											timeSlotBooked[index] ? (
												timeSlotBooked[index].map((isBooked: boolean, index2: number) => {
													return <Th key={index2} bg={isBooked ? "red" : "lightgreen"}><Link></Link></Th>
												})
											): null																																			
										}
									</Tr>
								)
							})
						}
					</Tbody>
				</Table>
			</TableContainer>

			<Center mb={4}>
				<Button colorScheme="purple" rounded={20} mr={4} onClick={addCourtModal.onOpen}>Add Court</Button>
				{/* <Button colorScheme="purple" rounded={20}>Change Status</Button> */}
				<Modal isOpen={addCourtModal.isOpen} onClose={addCourtModal.onClose} isCentered>
					<ModalOverlay />
					<ModalContent>
					<ModalHeader>Add Court</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						{/* <form onSubmit={handleAddCourt} action={addCourtWithId}> */}
							<FormControl isRequired mb={5}>
								<FormLabel htmlFor='courtname'>Court Name:</FormLabel>
								<Input id='courtname' name="courtname" type='text' defaultValue="Court" borderColor="purple.200" borderWidth="2px" focusBorderColor="purple.500" _hover={{borderColor:"purple.500"}}></Input>
							</FormControl>
							<FormControl mb={5} w={{md:"20rem", lg: "20rem"}}>
								<FormLabel htmlFor="courtstatus">Court Status:</FormLabel>
								<Switch id="courtstatus" name="courtstatus" size="lg" colorScheme="purple" defaultChecked/>
							</FormControl>
							<Input type="hidden" name="facility_id" value={facility_id}></Input>
							<Center>
								<Button onClick={handleAddCourt} rounded={20} colorScheme='purple' isLoading={isLoading}>
									Submit
								</Button>
							</Center>
						{/* </form> */}
					</ModalBody>
					<ModalFooter>
					</ModalFooter>
					</ModalContent>
				</Modal>
			</Center>
		</Container>
		</Container>
	)
}