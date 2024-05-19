'use client'

import { Container, Heading, Flex, Box, Spacer, Text, Input, Center, TableContainer, Table, TableCaption, Thead, Tr, Th, Button, Tbody, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Switch, Link, background, chakra, ChakraProvider } from "@chakra-ui/react"
import { useState, useEffect } from 'react'
import { MakeBooking, type CourtData, Timeslot } from "./default"
import { useRouter } from 'next/navigation'

// Change time zone to UTC+8
function getDateInUTC8(date: Date) {
	const UTC8_OFFSET = 8
	//console.log(date.getDate() + 'T' + date.getHours() + ':' + date.getMinutes())
	date.setUTCHours(date.getUTCHours() + UTC8_OFFSET)
	//console.log(date)
	return date
}

// Generate time slots, expect hh:mm format from first_timeslot and last_timeslot
function GenerateTimeslots(first_timeslot: string, last_timeslot: string, timeslot_interval: number) {
	const defaultYear = 2024;
	const defaultMonthIndex = 0;
	const defaultDay = 1;
	const firstTimeslotHour = parseInt(first_timeslot.slice(0, 2))
	const firstTimeslotMinute = parseInt(first_timeslot.slice(3, 5))
	const lastTimeslotHour = parseInt(last_timeslot.slice(0, 2))
	const lastTimeslotMinute = parseInt(last_timeslot.slice(3, 5))
	let currentTimeslot = new Date(defaultYear, defaultMonthIndex, defaultDay, firstTimeslotHour, firstTimeslotMinute)
	const lastTimeslot = new Date(defaultYear, defaultMonthIndex, defaultDay, lastTimeslotHour, lastTimeslotMinute)

	const timeslots: string[] = []

	// If hours over 24 will be converted to next day, the condition still apply
	while (currentTimeslot <= lastTimeslot) {
		timeslots.push(currentTimeslot.toTimeString().slice(0, 5))
		// Increment currentTimeslot by timeslot_interval
		currentTimeslot.setUTCMinutes(currentTimeslot.getUTCMinutes() + timeslot_interval)
	}
	
	return timeslots
}

function GetBookingRates(booking_rates: any, user_type: string) {
	const bookingRates: {normal:{student:number, private: number}, rush:{student:number, private: number}} 
		= JSON.parse(JSON.stringify(booking_rates))

	// Default booking rates set as private user_type
	let userBookingRates: {normal: number, rush: number} = {normal: bookingRates.normal.private, rush: bookingRates.rush.private};

	switch (user_type) {
		case 'Student':
			userBookingRates.normal = bookingRates.normal.student
			userBookingRates.rush = bookingRates.rush.student
			break
		default:
			//console.error("Invalid user type")
			break
	}
	
	return userBookingRates
}

export default function FacilityAvailability(
	{facility_id, facility_data, user_type}
	: {facility_id: string, facility_data: {first_timeslot: any, last_timeslot: any, timeslot_interval: any, booking_rates: any}, user_type: string}
) {	
	// Time in hh:mm (24 hour format)
	const timeslots = GenerateTimeslots(facility_data.first_timeslot, facility_data.last_timeslot, facility_data.timeslot_interval)

	const userBookingRates: {normal: number, rush: number} = GetBookingRates(facility_data.booking_rates, user_type)
	//console.log(facility_data)

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
					console.error(error)
					alert("Failed to fetch court data")
					router.push('/')
				}) 			
		}
		fetchData()
	}, [fetchSignal])

	// 2d array of court availability, initialized to false, then set to true if timeslot is booked
	const [ timeSlotBooked, setTimeSlotBooked ] = useState<boolean[][]>([])

	const todayDate = getDateInUTC8(new Date())
	const maxBookingDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() + 6)
	//console.log(maxBookingDate)
	const [ date, setDate ] = useState(todayDate.toISOString().slice(0, 10))
	//console.log(timeSlotBooked)
	
	// courtData should be the latest update
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
				console.error(error)
				alert("Failed to fetch timeslot data")
				router.push('/')
			})
	}

	useEffect(() => {
		//console.log("Use effect called")

		async function fetchData() {
			await fetchTimeslotData(courtData, date)
		}
		fetchData()
	}, [courtData, date])	
	
	function handleElementClicked(row: number, column: number) {
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
		console.log(selectedTimeslot)
	}

	async function handleMakeBooking(selectedTimeslot: Timeslot[]) {
		const makeBookingResult : string = await MakeBooking(selectedTimeslot)

		// Redirect to other page if negative result
		switch (makeBookingResult) {
			case "user_null":
				alert("Please login to make booking")
				router.push('/login')
				break

			case "booking_null":
				alert("Database error when make booking, please try again")
				router.push('/')
				break
			
			case "bookedTimeslot_null":
				alert("Selected timeslot might be locked by other users, please select other timeslot to make booking")
				router.push('/')
				break
			
			default:
				alert("Successfully locked selected timeslot")
				router.push('/booking/summary/?booking_id=' + makeBookingResult)
				break
		}
	}

	return (
		<Container mt={5} maxW="100lvw" borderColor={"grey.300"} borderWidth={1} boxShadow={"lg"}>
		<Container mt={5} maxW="90lvw">
			<Flex mb={1}>
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
					Date: <Input type="date" maxW="200px" defaultValue={date} min={todayDate.toISOString().slice(0, 10)} max={maxBookingDate.toISOString().slice(0, 10)} onChange={(event: any) => {setFetchSignal(!fetchSignal); setDate(event.target.value)}}></Input>
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
															onClick={() => handleElementClicked(row, column)}
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
				<Button bg="#970bf5" color="white" _hover={{ bg: "#7a00cc"}} rounded={20} mr={4} onClick={() => {handleMakeBooking(selectedTimeslot)}}>Make Booking<Link></Link></Button>
			</Center>
		</Container>
		</Container>
	)
}