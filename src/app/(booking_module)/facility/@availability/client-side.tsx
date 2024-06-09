'use client'

import { Container, Heading, Flex, Box, Spacer, Text, Input, Center, TableContainer, Table, Thead, Tr, Th, Button, Tbody, useToast } from "@chakra-ui/react"
import { useState, useEffect } from 'react'
import { MakeBooking, type CourtData, Timeslot } from "./actions"
import { useRouter } from 'next/navigation'

// Change time zone to UTC+8
function GetDateInUTC8(date: Date) {
	const UTC8_OFFSET = 8
	date.setUTCHours(date.getUTCHours() + UTC8_OFFSET)
	//console.log(date)
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

function GetBookingRates(
	bookingRates: {
		normal : {
			student: number,
			staff: number,
			private: number
		},
		rush : {
			student: number,
			staff: number,
			private: number
		}
	}, 
	userType: string
) {
	// Default booking rates set as private user type
	let userBookingRates: {normal: number, rush: number} = {normal: bookingRates.normal.private, rush: bookingRates.rush.private};

	switch (userType) {
		case 'student': {
			userBookingRates.normal = bookingRates.normal.student
			userBookingRates.rush = bookingRates.rush.student
			break;
		}
		case 'staff': {
			userBookingRates.normal = bookingRates.normal.staff
			userBookingRates.rush = bookingRates.rush.staff
			break;
		}
		default: {
			break;
		}
	}
	
	return userBookingRates
}

export default function FacilityAvailability({ facility_id, facilityData, user_type } : {
	facility_id: string, 
	facilityData: {
		facility_start_time: string, 
		facility_end_time: string, 
		timeslot_interval: number, 
		booking_rates: {
			normal : {
				student: number,
				staff: number,
				private: number
			},
			rush : {
				student: number,
				staff: number,
				private: number
			}
		}
	}, 
	user_type: string
}) {	
	// Time in hh:mm (24 hour format)
	const timeslots = GenerateTimeslots(facilityData.facility_start_time, facilityData.facility_end_time, facilityData.timeslot_interval)

	const userBookingRates: {normal: number, rush: number} = GetBookingRates(facilityData.booking_rates, user_type.toLowerCase())
	//console.log(facilityData)

	// Data from Court table
	const [ courtData, setCourtData ] = useState<CourtData[]>([])
	// Fetch signal to re-fetch court data
	const [ fetchSignal, setFetchSignal ] = useState(false)
	// Selected timeslot for booking
	const [ selectedTimeslot, setSelectedTimeslot ] = useState<Timeslot[]>([])

	const router = useRouter()

	// Fetch court data when signal value changes
	useEffect(() => {
		//console.log("Court data use effect")
		async function fetchData() {
			const response = await fetch(`/api/getcourt?`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({facility_id})
				})
				.then((response) => response.json())
				.then((courtData) => {
					setCourtData(courtData)
				})
				.catch((error) => {
					// Unnecessary alert when refresh the page too fast
					const errorMessage = "Fetch court data failed (in facility/availability)"
					router.push('/error/?error=' + errorMessage)
				}) 			
		}
		fetchData()
	}, [fetchSignal, facility_id, router])

	// 2d array of court availability, initialized to false, then set to true if timeslot is booked
	const [ timeSlotBooked, setTimeSlotBooked ] = useState<boolean[][]>([])

	// Limit user to select date from today to max 6 days later
	const todayDate = GetDateInUTC8(new Date())
	const maxBookingDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() + 6)
	//console.log(maxBookingDate)
	const [ date, setDate ] = useState(todayDate.toISOString().slice(0, 10))
	//console.log(timeSlotBooked)
	const [ isLoading, setIsLoading ] = useState(false)
	const toast = useToast()
	
	useEffect(() => {
		//console.log("Use effect called")
		// courtData should be the latest update before fetching timeslot data
		async function fetchTimeslotData (courtData: CourtData[], date: string) {
			const response = await fetch(`/api/timeslot`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({courtData, date})
				})
				.then((response) => response.json())
				.then((timeslotData) => {
					// Reset timeSlotBooked to false
					const localArrayCopy = Array.from({length: courtData.length}, () => new Array(timeslots.length).fill(false))

					// For each court
					for (let i = 0; i < localArrayCopy.length; i++) {
						// Set timeSlotBooked to true if timeslot is booked (check by timeslot_index)
						for (let j = 0; j < (timeslotData != undefined ? timeslotData[i].length : 0); j++) {
							//console.log(i + " " + j + ": " + timeslotData[i][j].timeslot_index)
							localArrayCopy[i][timeslotData[i][j].timeslot_index] = true
						}	
					}
					
					// Check if timeslot is already passed, if yes, set to true (make the timeslot unavailable)
					const currentTime = (new Date()).toTimeString().slice(0, 5)
					if (date == todayDate.toISOString().slice(0, 10))
					{
						for (let i = 0; i < timeslots.length; i++)
						{
							if (timeslots[i] < currentTime)
							{
								// Apply to all courts
								for (let j = 0; j < localArrayCopy.length; j++)
								{
									localArrayCopy[j][i] = true
								}
							}
						}
					}
					
					setTimeSlotBooked(localArrayCopy)
					//console.log(timeSlotBooked)
				})
				.catch((error) => {
					const errorMessage = "Fetch timeslot data failed (in facility/availability)"
					router.push('/error/?error=' + errorMessage)
				})
		}

		async function fetchData() {
			await fetchTimeslotData(courtData, date)
		}
		fetchData()
	}, [courtData, date, router, timeslots, todayDate])	
	
	function handleTimeslotClicked(row: number, column: number) {
		let newSelectedTimeslot = [...selectedTimeslot]

		// If timeslot is already selected, remove it
		const indexFound = newSelectedTimeslot.findIndex(
			(timeslot: Timeslot) => timeslot.row === row && timeslot.column === column
		)

		if (indexFound !== -1) {
			newSelectedTimeslot.splice(indexFound, 1)
		} else {
			const RUSH_HOUR = "18:00"
			const timeslot_rate = timeslots[column] >= RUSH_HOUR ? userBookingRates.rush : userBookingRates.normal
			//console.log(timeslot_rate)
			const timeslot_start = timeslots.at(column) as string
			const timeslot_end = (timeslots.at(column + 1) ? timeslots.at(column + 1) : "00:00") as string
			newSelectedTimeslot.push({row, column, court_id: courtData[row].court_id, timeslot_date: date, timeslot_start, timeslot_end, timeslot_rate, timeslot_index: column})
		}

		setSelectedTimeslot(newSelectedTimeslot)
		//console.log(selectedTimeslot)
	}

	async function handleMakeBooking(facility_id: string, selectedTimeslot: Timeslot[]) {
		setIsLoading(true)
		
		const makeBookingResult = await MakeBooking(facility_id, selectedTimeslot)
		
		// Redirect to other page if negative result
		switch (makeBookingResult) {
			case "selectedTimeslot_null": {
				toast({
					title: "Failed to Make Booking",
					description: "Please select at least one timeslot to make booking",
					status: "error",
					duration: 5000,
					position: "top",
					isClosable: true,
				})
				break;
			}

			case "user_null": {
				toast({
					title: "Failed to Make Booking",
					description: "Please login to make booking",
					status: "error",
					duration: 5000,
					position: "top",
					isClosable: true,
				})
				router.push('/login')
				break;
			}

			case "booking_null": {
				toast({
					title: "Failed to Make Booking",
					description: "Database error when make booking, please try again",
					status: "error",
					duration: 5000,
					position: "top",
					isClosable: true,
				})
				break;
			}
			
			case "bookedTimeslot_null": {
				toast({
					title: "Failed to Make Booking",
					description: "Selected timeslot might be locked by other users, please select other timeslot to make booking",
					status: "error",
					duration: 5000,
					position: "top",
					isClosable: true,
				})
				break;
			}
			
			default: {
				toast({
					title: "Make Booking Successfully",
					description: "Directing to booking summary page...",
					status: "success",
					duration: 3000,
					position: "top",
					isClosable: true,
				})
				router.push('/booking/summary/?booking_id=' + makeBookingResult)
				break;
			}
		}
		setIsLoading(false)
	}

	return (
		<Container mt={5} maxW="100lvw" borderColor={"gray.300"} borderWidth={1} boxShadow={"lg"}>
		<Container mt={5} maxW="90lvw">
			<Flex mb={3}>
				<Heading>Facility Availability</Heading>
				<Spacer />
				<Center>
					<Box bg={"blue"} boxSize={25} mr={2}></Box>
					<Text mr={4}>Selected</Text>
					<Box bg={"red"} boxSize={25} mr={2}></Box>
					<Text mr={4}>Not Available</Text>
					<Box bg={"lightgreen"} boxSize={25} mr={2}></Box>
					<Text>Available</Text>
				</Center>
			</Flex>

			<Flex>
				<Text mb={2}>
					Date: 
					<Input type="date" defaultValue={date} min={todayDate.toISOString().slice(0, 10)} max={maxBookingDate.toISOString().slice(0, 10)} 
					onChange={(e) => {setFetchSignal(!fetchSignal); setDate(e.target.value)}} borderColor={"black"} borderWidth={1} />
				</Text>
				<Spacer />
				<Text as='b' fontSize='large'>
					{/* Reduce function to calculate total booking rate, then round off to 2 dp */}
					Booking Rate: RM{(selectedTimeslot.reduce((accumulator, timeslot) => {return accumulator + timeslot.timeslot_rate}, 0)).toFixed(2)}
				</Text>
			</Flex>

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
							courtData.map((court: any, row: number) => {
								return (
									<Tr key={row}>
										<Th pr={0}>
											<Text mr={2}>
												{court.court_name}
											</Text>
										</Th>
										{
											timeSlotBooked[row] ? (
												timeSlotBooked[row].map((isBooked: boolean, column: number) => {													
													return (
														(!isBooked) ?
														<Th key={column}
															bg={selectedTimeslot.find((timeslot: Timeslot) => timeslot.row == row && timeslot.column == column) ? "blue" : "lightgreen"} 
															onClick={() => handleTimeslotClicked(row, column)}
														/>
														: 
														<Th key={column} bg={"red"} />													
													)
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

			<Center mb={5}>
				<Button bg="#970bf5" color="white" _hover={{ bg: "#7a00cc"}} rounded={20} mr={4} isDisabled={selectedTimeslot.length == 0}
				onClick={() => {handleMakeBooking(facility_id, selectedTimeslot)}} isLoading={isLoading}>Make Booking</Button>
			</Center>
		</Container>
		</Container>
	)
}