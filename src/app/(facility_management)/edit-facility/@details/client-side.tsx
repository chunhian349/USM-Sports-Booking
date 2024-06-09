'use client'

import { Container, Heading, Box, Text, Image, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Divider, Input, Link, AspectRatio, FormLabel, FormControl, Icon, Switch, Center, TableContainer, Table, Thead, Tr, Th, Td, Tbody, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Checkbox } from "@chakra-ui/react"
import { EditIcon, InfoIcon, PhoneIcon } from "@chakra-ui/icons"
import { useState } from 'react'
import { UpdateFacilityImage, UpdateFacilityDetails, UpdateFacilityDesc, UpdateFacilityRates, DeleteSportsFacility, type FacilityData } from './actions'
import { FaMapLocationDot } from "react-icons/fa6";
import { MdCategory } from "react-icons/md";

export default function EditFacility({facilityData, user_id}: {facilityData: FacilityData, user_id: string}) {
    
    const [ showUploadImg, setShowUploadImg ] = useState(false)
    const [ editDetails, setEditDetails ] = useState(false)
    const [ editDesc, setEditDesc ] = useState(false)
    const [ editRates, setEditRates ] = useState(false)
    const [ showDelete, setShowDelete ] = useState(false)
    
    if (!facilityData)
    {
        return (
            <Container>
                <Heading as='i'>(Facility details not found)</Heading>
            </Container>
        )
    }

    // Bind the functions with the facility_id and user_id
    const updateFacilityImageWithId = UpdateFacilityImage.bind(null, facilityData.facility_id, user_id)
    const updateFacilityDetailsWithId = UpdateFacilityDetails.bind(null, facilityData.facility_id)
    const updateFacilityDescWithId = UpdateFacilityDesc.bind(null, facilityData.facility_id)
    const updateFacilityRatesWithId = UpdateFacilityRates.bind(null, facilityData.facility_id)

    return (
        <Container maxWidth="90lvw" mt={5}>
            <Link onClick={()=>setShowUploadImg(true)}>
                <AspectRatio maxW="37.5rem" ratio={6/3} mb={4}>
                    <Image src={facilityData ? facilityData.facility_photo : ""} fallbackSrc="no-image.png" alt="facility_image" objectFit="cover" borderRadius={15}></Image>
                </AspectRatio>
            </Link>
            <Modal isOpen={showUploadImg} onClose={()=>setShowUploadImg(false)} isCentered>
                <ModalOverlay />
                <ModalContent>
                <ModalHeader>Edit Image</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form action={updateFacilityImageWithId}>
                        <FormControl isRequired mb={5}>
                            <FormLabel htmlFor='image'>Upload a new image</FormLabel>
                            <Input id='image' name="image" type='file' accept='image/*' pt={1}></Input>
                        </FormControl>
                        <Center>
                            <Button type="submit" colorScheme='purple' rounded={20}>
                                Update Image
                            </Button>
                        </Center>
                    </form>
                </ModalBody>
                <ModalFooter>
                </ModalFooter>
                </ModalContent>
            </Modal>

            <Heading mb={2} fontSize={{sm:"large", lg: "x-large"}}>
                {facilityData.facility_name}
                <Link ml={3} onClick={()=>setEditDetails(true)}><EditIcon></EditIcon></Link>
                <Modal isOpen={editDetails} onClose={()=>setEditDetails(false)} isCentered>
                    <ModalOverlay />
                    <ModalContent>
                    <ModalHeader>Edit Facility Details</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <form action={updateFacilityDetailsWithId}>
                            <FormControl isRequired mb={5} >
                                <FormLabel htmlFor="name">Facility Name:</FormLabel>
                                <Input id="name" name="name" type="text" required defaultValue={facilityData.facility_name} _hover={{borderColor:"#970bf5", borderWidth:"2"}} _focus={{borderColor:"#970bf5", borderWidth:"3"}}/>
                            </FormControl>

                            <FormControl isRequired mb={5}>
                                <FormLabel htmlFor="location">Location:</FormLabel>
                                <Input id="location" name="location" type="text" required defaultValue={facilityData.facility_location} _hover={{borderColor:"#970bf5", borderWidth:"2"}} _focus={{borderColor:"#970bf5", borderWidth:"3"}}/>
                            </FormControl>

                            <FormControl isRequired mb={5}>
                                <FormLabel htmlFor="sports">Sports Category:</FormLabel>
                                <Input id="sports" name="sports" type="text" required defaultValue={facilityData.sports_category} _hover={{borderColor:"#970bf5", borderWidth:"2"}} _focus={{borderColor:"#970bf5", borderWidth:"3"}}/>
                            </FormControl>

                            <FormControl isRequired mb={5}>
                                <FormLabel htmlFor="phone">Phone Number:</FormLabel>
                                <Input id="phone" name="phone" type="text" required defaultValue={facilityData.phone_num} _hover={{borderColor:"#970bf5", borderWidth:"2"}} _focus={{borderColor:"#970bf5", borderWidth:"3"}}/>
                            </FormControl>

                            <FormControl mb={5}>
                                <FormLabel htmlFor="status">Facility Status:</FormLabel>
                                <Switch id="status" name="status" defaultChecked={facilityData.facility_status} size="lg" colorScheme="purple"/>
                            </FormControl>

                            <Center>
                                <Button type="submit" colorScheme="purple" rounded="20">
                                    Submit
                                </Button>
                            </Center>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                    </ModalFooter>
                    </ModalContent>
                </Modal>
            </Heading>

            <Text fontWeight='bold' mb={1}><Icon as={FaMapLocationDot} mr='0.25rem'/>{facilityData.facility_location}</Text>
            <Text mb={1}><Icon as={MdCategory} mr='0.25rem'/>{facilityData.sports_category}</Text>
            <Text mb={1}><PhoneIcon mr='0.25rem' />{facilityData.phone_num}</Text>
            {/* <Text mb={1}><TimeIcon mr='0.3rem'/>{facilityData.first_timeslot.substring(0, 5)} to {facilityData.last_timeslot.substring(0, 5)}</Text> */}
            <Text mb={1} textColor={(facilityData.facility_status? "green": "red")}><InfoIcon color="black" mr='0.3rem' />{(facilityData.facility_status? "Active": "Inactive")}</Text>
            <Divider my={3} borderColor="#970bf5"/>

            <Text fontWeight='bold'>
                Facility Description
                <Link ml={3} onClick={()=>setEditDesc(true)}><EditIcon></EditIcon></Link>
                <Modal isOpen={editDesc} onClose={()=>setEditDesc(false)} isCentered>
                    <ModalOverlay />
                    <ModalContent>
                    <ModalHeader>Edit Description</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <form action={updateFacilityDescWithId}>
                            <FormControl isRequired mb={3}>
                                <FormLabel htmlFor='description'>Description</FormLabel>
                                <Input h="15lvh" as="textarea" id='description' name="description" type='text' defaultValue={facilityData.facility_desc}></Input>
                            </FormControl>
                            <Center>
                                <Button type="submit" colorScheme='purple' rounded='20'>
                                    Submit
                                </Button>
                            </Center>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                    </ModalFooter>
                    </ModalContent>
                </Modal>
            </Text>
            <Text whiteSpace='pre'>{facilityData.facility_desc}</Text>

            <Divider my={3} borderColor="#970bf5"/>

            <Text fontWeight='bold' mb='0.5rem'>
                Booking Rates (RM)
                <Link ml={3} onClick={()=>setEditRates(true)}><EditIcon></EditIcon></Link>
                <Modal isOpen={editRates} onClose={()=>setEditRates(false)} size='lg' isCentered>
                    <ModalOverlay />
                    <ModalContent>
                    <ModalHeader>Edit Booking Rates</ModalHeader>
                    <ModalCloseButton />
                    <form action={updateFacilityRatesWithId}>
                    <ModalBody>
                        <TableContainer borderColor="#970bf5" borderWidth={2} rounded={10}>
                            <Table size='sm' colorScheme='purple'>
                                <Thead>
                                    <Tr>
                                        <Th>User Type</Th>
                                        <Th>Normal Hour Rates</Th>
                                        <Th>Rush Hour Rates</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    <Tr>
                                        <Th>Student</Th>
                                        <Td>
                                            <NumberInput id="normStudentRate" name="normStudentRate" defaultValue={facilityData.booking_rates.normal.student} min={0} step={1} precision={2}>
                                                <NumberInputField />
                                                <NumberInputStepper>
                                                    <NumberIncrementStepper />
                                                    <NumberDecrementStepper />
                                                </NumberInputStepper>
                                            </NumberInput>
                                        </Td>
                                        <Td>
                                            <NumberInput id="rushStudentRate" name="rushStudentRate" defaultValue={facilityData.booking_rates.rush.student} min={0} step={1} precision={2}>
                                                <NumberInputField />
                                                <NumberInputStepper>
                                                    <NumberIncrementStepper />
                                                    <NumberDecrementStepper />
                                                </NumberInputStepper>
                                            </NumberInput>
                                        </Td>
                                    </Tr>
                                    <Tr>
                                        <Th>Staff</Th>
                                        <Td>
                                            <NumberInput id="normStaffRate" name="normStaffRate" defaultValue={facilityData.booking_rates.normal.staff} min={0} step={1} precision={2}>
                                                <NumberInputField />
                                                <NumberInputStepper>
                                                    <NumberIncrementStepper />
                                                    <NumberDecrementStepper />
                                                </NumberInputStepper>
                                            </NumberInput>
                                        </Td>
                                        <Td>
                                            <NumberInput id="rushStaffRate" name="rushStaffRate" defaultValue={facilityData.booking_rates.rush.staff} min={0} step={1} precision={2}>
                                                <NumberInputField />
                                                <NumberInputStepper>
                                                    <NumberIncrementStepper />
                                                    <NumberDecrementStepper />
                                                </NumberInputStepper>
                                            </NumberInput>
                                        </Td>
                                    </Tr>
                                    <Tr>
                                        <Th>Private</Th>
                                        <Td>
                                            <NumberInput id="normPrivateRate" name="normPrivateRate" defaultValue={facilityData.booking_rates.normal.private} min={0} step={1} precision={2}>
                                                <NumberInputField />
                                                <NumberInputStepper>
                                                    <NumberIncrementStepper />
                                                    <NumberDecrementStepper />
                                                </NumberInputStepper>
                                            </NumberInput>
                                        </Td>
                                        <Td>
                                            <NumberInput id="rushPrivateRate" name="rushPrivateRate" defaultValue={facilityData.booking_rates.normal.private} min={0} step={1} precision={2}>
                                                <NumberInputField />
                                                <NumberInputStepper>
                                                    <NumberIncrementStepper />
                                                    <NumberDecrementStepper />
                                                </NumberInputStepper>
                                            </NumberInput>
                                        </Td>
                                    </Tr>
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </ModalBody>

                    <ModalFooter>
                        <Center>
                            <Button type='submit' colorScheme='purple' rounded='20' /*onClick={()=>setEditRates(false)}*/>
                                Submit
                            </Button>
                        </Center>
                    </ModalFooter>
                    </form>
                    </ModalContent>
                </Modal>
            </Text>
            
            <TableContainer borderWidth={1} borderColor="#970bf5" rounded={10} maxW='37.5rem'>
                <Table size='sm' colorScheme='purple'>
                    <Thead>
                        <Tr bg='#d59dfb'>
                            <Th>User Type</Th>
                            <Th>Normal Hour Rates</Th>
                            <Th>Rush Hour Rates</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        <Tr>
                            <Th>Student</Th>
                            <Td>
                                {facilityData.booking_rates.normal.student.toFixed(2)}
                            </Td>
                            <Td>
                                {facilityData.booking_rates.rush.student.toFixed(2)}
                            </Td>
                        </Tr>
                        <Tr>
                            <Th>Staff</Th>
                            <Td>
                                {facilityData.booking_rates.normal.staff.toFixed(2)}
                            </Td>
                            <Td>
                                {facilityData.booking_rates.rush.staff.toFixed(2)}
                            </Td>
                        </Tr>
                        <Tr>
                            <Th>Private</Th>
                            <Td>
                                {facilityData.booking_rates.normal.private.toFixed(2)}
                            </Td>
                            <Td>
                                {facilityData.booking_rates.rush.private.toFixed(2)}
                            </Td>
                        </Tr>
                    </Tbody>
                </Table>
            </TableContainer>

            <Divider my={3} borderColor="#970bf5"/>

            <Box mt={3}>
                <Button variant='outline' colorScheme='red'>
                    <Text onClick={()=>setShowDelete(true)}>Delete Sports Facility</Text>
                </Button>
            </Box>
            <Modal isOpen={showDelete} onClose={()=>setShowDelete(false)} size='lg' isCentered>
                <ModalOverlay />
                <ModalContent>
                <ModalHeader>Delete Facility</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {/* preventDefault is important */}
                    <form onSubmit={(e)=>{e.preventDefault(); DeleteSportsFacility(facilityData.facility_id);}}>
                    <Text mb={5} fontWeight='bold'>Are you sure you want to delete this facility?</Text>
                    <FormControl isRequired mb={3}>
                        <FormLabel >Confirmation</FormLabel>
                        <Checkbox colorScheme="red" size='lg' isRequired><Text fontSize='md'>I have acknowledged that the delete action cannot be undone.</Text></Checkbox>
                    </FormControl>
                    <Center>
                        <Button type='submit' colorScheme='red' rounded={20} mr={3}>
                            Confirm Delete
                        </Button>
                    </Center>
                    </form>
                </ModalBody>
                </ModalContent>
            </Modal>
        </Container>
    )
}