'use client'

import { Container, Heading, Flex, Box, Spacer, Text, Input, Center, TableContainer, Table, TableCaption, Thead, Tr, Th, Button, Tbody, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Switch, Link } from "@chakra-ui/react"
import { CloseIcon } from "@chakra-ui/icons"
import { useState, useEffect } from 'react'
import { useDisclosure } from '@chakra-ui/react'
import { AddCourt, DeleteCourt } from './default'

// Time in hh:mm (24 hour format)
const timeSlots = Array.from({length: 16}, (v, i) => i + 8).map((v) => v + ":00").flat().slice(0, -1)
//const timeSlots = ['8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm']

export default function FacilityAvailability({/*courtData, timeslotData, */facility_id}: {/*courtData: any[], timeslotData: any[][], */facility_id: string}) {	
	//console.log("Component render")
	//console.log(courtData)

	const [ courtDataState, setCourtDataState ] = useState([])
	const [ fetchSignal, setFetchSignal ] = useState(false)

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
				console.error(error)
			}
		}
		fetchData()
	}, [fetchSignal])

	// 2d array of court availability, initialized to false, then set to true if timeslot is booked
	const [ timeSlotBooked, setTimeSlotBooked ] = useState<boolean[][]>([])

	const [ date, setDate ] = useState(new Date().toISOString().slice(0, 10))
	//console.log(timeSlotBooked)
	
	const addCourtModal = useDisclosure()
	//const addCourtWithId = AddCourt.bind(null, facility_id)

	const handleAddCourt = async () => {
		const court_name = document.getElementById("courtname") as HTMLInputElement
		const court_status = document.getElementById("courtstatus") as HTMLInputElement

		try{
			await AddCourt(court_name.value, court_status.checked, facility_id)
		} catch (error) {
			console.error(error)
		}
		//console.log("Add court")

		setFetchSignal(!fetchSignal)
	}

	const handleDelCourt = async (court_id : string) => {
		//console.log("Delete court")
		try {
			await DeleteCourt(court_id)
		} catch (error) {
			console.error(error)
		}

		setFetchSignal(!fetchSignal)
	}
	
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
				const localArrayCopy = Array.from({length: courtData.length}, () => new Array(timeSlots.length).fill(false))

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
			console.error(error)
		}
	}

	useEffect(() => {
		//console.log("Use effect called")

		async function fetchData() {
			await fetchTimeslotData(courtDataState, date)
		}
		fetchData()
	}, [courtDataState, date])	
		
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
		<Container maxW="90lvw">
			<Flex mb={1}>
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

			<Text mb={2}>Date: <Input type="date" maxW="200px" defaultValue={date} onChange={(event: any) => {setDate(event.target.value)}}></Input></Text>

			<TableContainer borderColor='black' borderWidth={1} mb={4}>
				<Table variant='simple' size='sm'>
					{/* Table header */}
					<Thead>
						<Tr>
							<Th>Court</Th>
							{
								timeSlots.map((timeSlot, index) => {
									return <Th key={index}>{timeSlot}</Th>
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
													return <Th key={index2} bg={isBooked ? "red" : "lightgreen"} _active={{bg:"blue"}}><Link></Link></Th>
												})
											): null																																			
										}
										{/* <Th bg={"lightgreen"} _active={{bg:"blue"}}><Link></Link></Th> */}
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
				<Modal isOpen={addCourtModal.isOpen} onClose={addCourtModal.onClose}>
					<ModalOverlay />
					<ModalContent>
					<ModalHeader>Add Court</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						{/* <form onSubmit={handleAddCourt} action={addCourtWithId}> */}
							<FormControl isRequired mb={5}>
								<FormLabel htmlFor='courtname'>Court Name:</FormLabel>
								<Input id='courtname' name="courtname" type='text' defaultValue="Court"></Input>
							</FormControl>
							<FormControl mb={5} w={{md:"20rem", lg: "20rem"}}>
								<FormLabel htmlFor="courtstatus">Facility Status:</FormLabel>
								<Switch id="courtstatus" name="courtstatus" size="lg" colorScheme="purple" defaultChecked/>
							</FormControl>
							<Input type="hidden" name="facility_id" value={facility_id}></Input>
							<Button onClick={handleAddCourt} colorScheme='purple'>
								Submit
							</Button>
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