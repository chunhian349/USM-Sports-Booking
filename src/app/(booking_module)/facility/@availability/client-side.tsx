'use client'

import { Container, Heading, Flex, Box, Spacer, Text, Input, Center, TableContainer, Table, TableCaption, Thead, Tr, Th, Button, Tbody, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Switch, Link, background, chakra, ChakraProvider } from "@chakra-ui/react"
import { useState, useEffect, use } from 'react'
import { useDisclosure } from "@chakra-ui/react"

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

export default function FacilityAvailability(
	{facility_id, facility_data}
	: {facility_id: string, facility_data: {first_timeslot: any, last_timeslot: any, timeslot_interval: any, booking_rates: any}}
) {	
	// Time in hh:mm (24 hour format)
	const timeslots = GenerateTimeslots(facility_data.first_timeslot, facility_data.last_timeslot, facility_data.timeslot_interval)

	const booking_rates: {normal:{student:number}, rush:{student:number}} = JSON.parse(JSON.stringify(facility_data.booking_rates))
	//console.log(facility_data)

	// Data from Court table
	const [ courtData, setCourtData ] = useState([])
	// Fetch signal to re-fetch court data
	const [ fetchSignal, setFetchSignal ] = useState(false)
	// Selected timeslot for booking
	type Timeslot = {
		row: number,
		column: number,
		// court_id: string,
		// timeslot_start: string,
		// timeslot_end: string,
		timeslot_rate: number,
	}
	const [ selectedTimeslot, setSelectedTimeslot ] = useState<Timeslot[]>([])

	// Fetch court data when signal value changes
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
					setCourtData(courtData)
				}
			} catch (error) {
				console.error(error)
			}
		}
		fetchData()
	}, [fetchSignal])

	// 2d array of court availability, initialized to false, then set to true if timeslot is booked
	const [ timeSlotBooked, setTimeSlotBooked ] = useState<boolean[][]>([])

	const [ date, setDate ] = useState(new Date().toISOString().slice(0, 10))
	//console.log(timeSlotBooked)
	
	// courtData should be the latest update
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
					// Set timeSlotBooked to true if timeslot is booked (check by timeslot_index)
					for (let j = 0; j < (timeslotData != undefined ? timeslotData[i].length : 0); j++) {
						//console.log(i + " " + j + ": " + timeslotData[i][j].timeslot_index)
						localArrayCopy[i][timeslotData[i][j].timeslot_index] = true
					}
				}
				
				setTimeSlotBooked(localArrayCopy)
				//console.log(timeSlotBooked)
			}
		} catch (error) {
			console.error(error)
		}
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
			const timeslot_rate = timeslots[column] >= RUSH_HOUR ? booking_rates.rush.student : booking_rates.normal.student
			//console.log(timeslot_rate)
			const timeslot_start = timeslots.at(column)
			const timeslot_end = timeslots.at(column + 1) ? timeslots.at(column + 1) : "00:00"
			newSelectedTimeslot.push({row, column, timeslot_rate})
		}

		setSelectedTimeslot(newSelectedTimeslot)
		//console.log(selectedTimeslot)
	}
	
	if (!facility_id || facility_id === 'undefined')
	{
		return (
			<Container>
				<Heading>Facility details not found</Heading>
			</Container>
		)
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
					Date: <Input type="date" maxW="200px" defaultValue={date} onChange={(event: any) => {setFetchSignal(!fetchSignal); setDate(event.target.value)}}></Input>
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
				<Button colorScheme="purple" rounded={20} mr={4}>Make Booking<Link></Link></Button>
			</Center>
		</Container>
		</Container>
	)
}