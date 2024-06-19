'use client'

import { useToast, Container, Heading, Box, Text, Image, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Divider, Input, Link, AspectRatio, FormLabel, FormControl, Icon, Switch, Center, TableContainer, Table, Thead, Tr, Th, Td, Tbody, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Checkbox } from "@chakra-ui/react"
import { EditIcon, InfoIcon, PhoneIcon } from "@chakra-ui/icons"
import { useEffect, useState } from 'react'
import { UpdateFacilityImage, UpdateFacilityDetails, UpdateFacilityDesc, UpdateFacilityRates, DeleteSportsFacility, type FacilityData } from './actions'
import { FaMapLocationDot } from "react-icons/fa6";
import { MdCategory } from "react-icons/md";
import { useFormState, useFormStatus } from "react-dom"
import { useRouter } from 'next/navigation'
const initialState = { isActionSuccess: false, message: ''} 

function FormButton({colorScheme, text}: {colorScheme: string, text: string}) {
    const { pending } = useFormStatus()

    return (
        <Button type="submit" colorScheme={colorScheme} rounded={20} isLoading={pending}>
            {text}
        </Button>
    )
}



export default function EditFacility({facilityData, user_id}: {facilityData: FacilityData, user_id: string}) {
    const [ showUploadImg, setShowUploadImg ] = useState(false)
    const [ editDetails, setEditDetails ] = useState(false)
    const [ editDesc, setEditDesc ] = useState(false)
    const [ editRates, setEditRates ] = useState(false)
    const [ showDelete, setShowDelete ] = useState(false)

    const router = useRouter()
    const toast = useToast()
    const [updateImgFormState, updateImgFormAction] =  useFormState(UpdateFacilityImage, initialState)
    const [updateDetailsFormState, updateDetailsFormAction] =  useFormState(UpdateFacilityDetails, initialState)
    const [updateDescFormState, updateDescFormAction] =  useFormState(UpdateFacilityDesc, initialState)
    const [updateRatesFormState, updateRatesFormAction] =  useFormState(UpdateFacilityRates, initialState)
    const [deleteFacilityFormState, deleteFacilityFormAction] =  useFormState(DeleteSportsFacility, initialState)

    // Show toast message when result of form action is updated
    // Update image form
    useEffect(() => {
        if (updateImgFormState == initialState) {
            return
        }
        
        if (updateImgFormState.isActionSuccess) {
            toast({
                title: "Update Successful",
                description: updateImgFormState.message,
                status: "success",
                duration: 3000,
                position: "top",
                isClosable: true,
            })

            router.refresh()
        } else {
            toast({
                title: "Update Failed",
                description: updateImgFormState.message,
                status: "error",
                duration: 5000,
                position: "top",
                isClosable: true,
            })
        }
    }, [updateImgFormState, toast, router])

    // Update details form
    useEffect(() => {
        if (updateDetailsFormState == initialState) {
            return
        }
        
        if (updateDetailsFormState.isActionSuccess) {
            toast({
                title: "Update Successful",
                description: updateDetailsFormState.message,
                status: "success",
                duration: 3000,
                position: "top",
                isClosable: true,
            })

            router.refresh()

        } else {
            toast({
                title: "Update Failed",
                description: updateDetailsFormState.message,
                status: "error",
                duration: 5000,
                position: "top",
                isClosable: true,
            })
        }
    }, [updateDetailsFormState, toast, router])

    // Update description form
    useEffect(() => {
        if (updateDescFormState == initialState) {
            return
        }
        
        if (updateDescFormState.isActionSuccess) {
            toast({
                title: "Update Successful",
                description: updateDescFormState.message,
                status: "success",
                duration: 3000,
                position: "top",
                isClosable: true,
            })

            router.refresh()

        } else {
            toast({
                title: "Update Failed",
                description: updateDescFormState.message,
                status: "error",
                duration: 5000,
                position: "top",
                isClosable: true,
            })
        }
    }, [updateDescFormState, toast, router])

    // Update rates form
    useEffect(() => {
        if (updateRatesFormState == initialState) {
            return
        }
        
        if (updateRatesFormState.isActionSuccess) {
            toast({
                title: "Update Successful",
                description: updateRatesFormState.message,
                status: "success",
                duration: 3000,
                position: "top",
                isClosable: true,
            })

            router.refresh()

        } else {
            toast({
                title: "Update Failed",
                description: updateRatesFormState.message,
                status: "error",
                duration: 5000,
                position: "top",
                isClosable: true,
            })
        }
    }, [updateRatesFormState, toast, router])

    // Delete facility form
    useEffect(() => {
        if (deleteFacilityFormState == initialState) {
            return
        }
        
        if (deleteFacilityFormState.isActionSuccess) {
            toast({
                title: "Delete Successful",
                description: deleteFacilityFormState.message,
                status: "success",
                duration: 9000,
                position: "top",
                isClosable: true,
            })

            router.push('/')

        } else {
            toast({
                title: "Delete Failed",
                description: deleteFacilityFormState.message,
                status: "error",
                duration: 5000,
                position: "top",
                isClosable: true,
            })
        }
    }, [deleteFacilityFormState, toast, router])

    if (!facilityData)
    {
        return (
            <Container>
                <Heading as='i'>(Facility details not found)</Heading>
            </Container>
        )
    }

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
                    <form action={updateImgFormAction}>
                        <FormControl hidden>
                            <Input id='facilityid' name="facilityid" type='text' defaultValue={facilityData.facility_id} />
                        </FormControl>
                        <FormControl hidden>
                            <Input id='userid' name="userid" type='text' defaultValue={user_id} />
                        </FormControl>
                        <FormControl isRequired mb={5}>
                            <FormLabel htmlFor='image'>Upload a new image</FormLabel>
                            <Input id='image' name="image" type='file' accept='image/*' pt={1} variant="filled" borderColor="purple.200" borderWidth="2px" focusBorderColor="purple.500" _hover={{borderColor:"purple.500"}} />
                        </FormControl>
                        <Center>
                            <FormButton colorScheme='purple' text='Update' />
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
                        <form action={updateDetailsFormAction}>
                            <FormControl hidden>
                                <Input id="facilityid" name="facilityid" type="text" defaultValue={facilityData.facility_id} />
                            </FormControl>

                            <FormControl isRequired mb={5} >
                                <FormLabel htmlFor="name">Facility Name:</FormLabel>
                                <Input id="name" name="name" type="text" required defaultValue={facilityData.facility_name} variant="filled" borderColor="purple.200" borderWidth="2px" focusBorderColor="purple.500" _hover={{borderColor:"purple.500"}}/>
                            </FormControl>

                            <FormControl isRequired mb={5}>
                                <FormLabel htmlFor="location">Location:</FormLabel>
                                <Input id="location" name="location" type="text" required defaultValue={facilityData.facility_location} variant="filled" borderColor="purple.200" borderWidth="2px" focusBorderColor="purple.500" _hover={{borderColor:"purple.500"}} />
                            </FormControl>

                            <FormControl isRequired mb={5}>
                                <FormLabel htmlFor="sports">Sports Category:</FormLabel>
                                <Input id="sports" name="sports" type="text" required defaultValue={facilityData.sports_category} variant="filled" borderColor="purple.200" borderWidth="2px" focusBorderColor="purple.500" _hover={{borderColor:"purple.500"}}/>
                            </FormControl>

                            <FormControl isRequired mb={5}>
                                <FormLabel htmlFor="phone">Phone Number:</FormLabel>
                                <Input id="phone" name="phone" type="text" required defaultValue={facilityData.phone_num} variant="filled" borderColor="purple.200" borderWidth="2px" focusBorderColor="purple.500" _hover={{borderColor:"purple.500"}}/>
                            </FormControl>

                            <FormControl mb={5}>
                                <FormLabel htmlFor="status">Facility Status:</FormLabel>
                                <Switch id="status" name="status" defaultChecked={facilityData.facility_status} size="lg" colorScheme="purple" />
                            </FormControl>

                            <Center>
                                <FormButton colorScheme='purple' text='Update' />
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
                        <form action={updateDescFormAction}>
                            <FormControl hidden>
                                <Input id="facilityid" name="facilityid" type="text" defaultValue={facilityData.facility_id} />
                            </FormControl>

                            <FormControl isRequired mb={3}>
                                <FormLabel htmlFor='description'>Description</FormLabel>
                                <Input h="15lvh" as="textarea" id='description' name="description" type='text' defaultValue={facilityData.facility_desc} variant="filled" borderColor="purple.200" borderWidth="2px" focusBorderColor="purple.500" _hover={{borderColor:"purple.500"}}></Input>
                            </FormControl>

                            <Center>
                                <FormButton colorScheme='purple' text='Update' />
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
                    <form action={updateRatesFormAction}>
                    <ModalBody>
                        <FormControl hidden>
                            <Input id="facilityid" name="facilityid" type="text" defaultValue={facilityData.facility_id} />
                        </FormControl>
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
                                        <Th>USM Student</Th>
                                        <Td>
                                            <NumberInput id="normStudentRate" name="normStudentRate" defaultValue={facilityData.booking_rates.normal.student} min={0} step={1} precision={2} focusBorderColor="purple.500" variant="filled">
                                                <NumberInputField borderColor="purple.200" borderWidth="2px" _hover={{borderColor:"purple.500"}} />
                                                <NumberInputStepper>
                                                    <NumberIncrementStepper />
                                                    <NumberDecrementStepper />
                                                </NumberInputStepper>
                                            </NumberInput>
                                        </Td>
                                        <Td>
                                            <NumberInput id="rushStudentRate" name="rushStudentRate" defaultValue={facilityData.booking_rates.rush.student} min={0} step={1} precision={2} focusBorderColor="purple.500" variant="filled">
                                                <NumberInputField borderColor="purple.200" borderWidth="2px" _hover={{borderColor:"purple.500"}} />
                                                <NumberInputStepper>
                                                    <NumberIncrementStepper />
                                                    <NumberDecrementStepper />
                                                </NumberInputStepper>
                                            </NumberInput>
                                        </Td>
                                    </Tr>
                                    <Tr>
                                        <Th>USM Staff</Th>
                                        <Td>
                                            <NumberInput id="normStaffRate" name="normStaffRate" defaultValue={facilityData.booking_rates.normal.staff} min={0} step={1} precision={2} focusBorderColor="purple.500" variant="filled">
                                                <NumberInputField borderColor="purple.200" borderWidth="2px" _hover={{borderColor:"purple.500"}} />
                                                <NumberInputStepper>
                                                    <NumberIncrementStepper />
                                                    <NumberDecrementStepper />
                                                </NumberInputStepper>
                                            </NumberInput>
                                        </Td>
                                        <Td>
                                            <NumberInput id="rushStaffRate" name="rushStaffRate" defaultValue={facilityData.booking_rates.rush.staff} min={0} step={1} precision={2} focusBorderColor="purple.500" variant="filled">
                                                <NumberInputField borderColor="purple.200" borderWidth="2px" _hover={{borderColor:"purple.500"}} />
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
                                            <NumberInput id="normPrivateRate" name="normPrivateRate" defaultValue={facilityData.booking_rates.normal.private} min={0} step={1} precision={2} focusBorderColor="purple.500" variant="filled">
                                                <NumberInputField borderColor="purple.200" borderWidth="2px" _hover={{borderColor:"purple.500"}} />
                                                <NumberInputStepper>
                                                    <NumberIncrementStepper />
                                                    <NumberDecrementStepper />
                                                </NumberInputStepper>
                                            </NumberInput>
                                        </Td>
                                        <Td>
                                            <NumberInput id="rushPrivateRate" name="rushPrivateRate" defaultValue={facilityData.booking_rates.rush.private} min={0} step={1} precision={2} focusBorderColor="purple.500" variant="filled">
                                                <NumberInputField borderColor="purple.200" borderWidth="2px" _hover={{borderColor:"purple.500"}} />
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
                            <FormButton colorScheme='purple' text='Update' />
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
                            <Th>USM Student</Th>
                            <Td>
                                {facilityData.booking_rates.normal.student.toFixed(2)}
                            </Td>
                            <Td>
                                {facilityData.booking_rates.rush.student.toFixed(2)}
                            </Td>
                        </Tr>
                        <Tr>
                            <Th>USM Staff</Th>
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
                <Button colorScheme='red'>
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
                    <form action={deleteFacilityFormAction}>
                        <Text mb={5} fontWeight='bold'>Are you sure you want to delete this facility?</Text>
                        <FormControl hidden>
                            <Input id="facilityid" name="facilityid" type="text" defaultValue={facilityData.facility_id} />
                        </FormControl>
                        <FormControl isRequired mb={3}>
                            <FormLabel >Confirmation</FormLabel>
                            <Checkbox colorScheme="red" size='lg' isRequired><Text fontSize='md'>I have acknowledged that the delete action cannot be undone.</Text></Checkbox>
                        </FormControl>
                        <Center>
                            <FormButton colorScheme='red' text='Confirm Delete' />
                        </Center>
                    </form>
                </ModalBody>
                </ModalContent>
            </Modal>
        </Container>
    )
}