'use client'

import { Container, Heading, Box, Text, Image, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Divider, Input, Link, AspectRatio, FormLabel, FormControl, Icon, Switch, Center, Textarea } from "@chakra-ui/react"
import { EditIcon, InfoIcon, PhoneIcon, TimeIcon } from "@chakra-ui/icons"
import { useState } from 'react'
import { UpdateFacilityImage, UpdateFacilityDetails, UpdateFacilityDesc } from './default'
import { FaMapLocationDot } from "react-icons/fa6";
import { MdAttachMoney, MdCategory } from "react-icons/md";

export default function EditFacility({facility, user_id}: any) {
    
    const [ showUploadImg, setShowUploadImg ] = useState(false)
    const [ editDetails, setEditDetails ] = useState(false)
    const [ editDesc, setEditDesc ] = useState(false)
    const [ showHours, setShowHours ] = useState(false)
    const [ showRate, setShowRate ] = useState(false)
    
    if (!facility)
    {
        return (
            <Container>
                <Heading>Facility details not found</Heading>
            </Container>
        )
    }

    const updateFacilityImageWithId = UpdateFacilityImage.bind(null, facility.facility_id, user_id)
    const updateFacilityDetailsWithId = UpdateFacilityDetails.bind(null, facility.facility_id)
    const updateFacilityDescWithId = UpdateFacilityDesc.bind(null, facility.facility_id)
    return (
        <Container maxWidth="90lvw" mt={5}>
            <Link onClick={()=>setShowUploadImg(true)}>
                <AspectRatio maxW="600" ratio={6/3} mb={4}>
                    <Image src={facility ? facility.image_url : ""} fallbackSrc="no-image.png" alt="facility_image" objectFit="cover" borderRadius={15}></Image>
                </AspectRatio>
            </Link>
            <Modal isOpen={showUploadImg} onClose={()=>setShowUploadImg(false)}>
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
                            <Button type="submit" colorScheme='blue'>
                                Update Image
                            </Button>
                        </Center>
                    </form>
                </ModalBody>
                <ModalFooter>
                </ModalFooter>
                </ModalContent>
            </Modal>
            {/* <AspectRatio maxW="400" ratio={4/3} mb={4}>
                <Image fallbackSrc="no-image.png" alt="facility_image" objectFit="cover" borderRadius={15}></Image>
            </AspectRatio> */}
            <Heading mb={2} fontSize={{sm:"large", lg: "x-large"}}>
                {facility.facility_name}
                <Link ml={3} onClick={()=>setEditDetails(true)}><EditIcon></EditIcon></Link>
                <Modal isOpen={editDetails} onClose={()=>setEditDetails(false)}>
                    <ModalOverlay />
                    <ModalContent>
                    <ModalHeader>Edit Facility Details</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <form action={updateFacilityDetailsWithId}>
                            <FormControl isRequired mb={5} >
                                <FormLabel htmlFor="name">Facility Name:</FormLabel>
                                <Input id="name" name="name" type="text" required defaultValue={facility.facility_name} _hover={{borderColor:"#970bf5", borderWidth:"2"}} _focus={{borderColor:"#970bf5", borderWidth:"3"}}/>
                            </FormControl>

                            <FormControl isRequired mb={5}>
                                <FormLabel htmlFor="location">Location:</FormLabel>
                                <Input id="location" name="location" type="text" required defaultValue={facility.facility_location} _hover={{borderColor:"#970bf5", borderWidth:"2"}} _focus={{borderColor:"#970bf5", borderWidth:"3"}}/>
                            </FormControl>

                            <FormControl isRequired mb={5}>
                                <FormLabel htmlFor="sports">Sports Category:</FormLabel>
                                <Input id="sports" name="sports" type="text" required defaultValue={facility.sports_category} _hover={{borderColor:"#970bf5", borderWidth:"2"}} _focus={{borderColor:"#970bf5", borderWidth:"3"}}/>
                            </FormControl>

                            <FormControl isRequired mb={5}>
                                <FormLabel htmlFor="phone">Phone Number:</FormLabel>
                                <Input id="phone" name="phone" type="text" required defaultValue={facility.phone_num} _hover={{borderColor:"#970bf5", borderWidth:"2"}} _focus={{borderColor:"#970bf5", borderWidth:"3"}}/>
                            </FormControl>

                            <FormControl mb={5}>
                                <FormLabel htmlFor="status">Facility Status:</FormLabel>
                                <Switch id="status" name="status" defaultValue={facility.status} size="lg" colorScheme="purple"/>
                            </FormControl>

                            <Center>
                                <Button type="submit" colorScheme="blue" rounded="20">
                                    Update Facility Details
                                </Button>
                            </Center>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                    </ModalFooter>
                    </ModalContent>
                </Modal>
            </Heading>
            <Text as="b" mb={1}><Icon as={FaMapLocationDot} mr={1}/>{facility.facility_location}</Text>
            <Text mb={1}><Icon as={MdCategory} mr={1}/>{facility.sports_category}</Text>
            <Text mb={1}><PhoneIcon mr={1} />{facility.phone_num}</Text>
            <Text mb={1} textColor={(facility.facility_status? "green": "red")}><InfoIcon color="black" mr={1.5} />{(facility.facility_status? "Active": "Inactive")}</Text>
            
            <Divider my={3}/>

            <Text as='b'>
                Facility Description
                <Link ml={3} onClick={()=>setEditDesc(true)}><EditIcon></EditIcon></Link>
                <Modal isOpen={editDesc} onClose={()=>setEditDesc(false)}>
                    <ModalOverlay />
                    <ModalContent>
                    <ModalHeader>Edit Description</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <form action={updateFacilityDescWithId}>
                            <FormControl isRequired mb={3}>
                                <FormLabel htmlFor='description'>Description</FormLabel>
                                <Input h="15lvh" as="textarea" id='description' name="description" type='text' defaultValue={facility.facility_desc}></Input>
                            </FormControl>
                            <Center>
                                <Button type="submit" colorScheme='blue'>
                                    Update Description
                                </Button>
                            </Center>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                    </ModalFooter>
                    </ModalContent>
                </Modal>
            </Text>
            <Text>{facility.facility_desc}</Text>

            <Divider my={3}/>

            <Box mb={1}>
                <Link onClick={()=>setShowHours(true)}>
                    <TimeIcon mr={1}/>
                    Show Operating Hours
                </Link>
                <Modal isOpen={showHours} onClose={()=>setShowHours(false)}>
                    <ModalOverlay />
                    <ModalContent>
                    <ModalHeader>Operating Hours</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>{facility.operating_hours}</Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={()=>setShowHours(false)}>
                        Close
                        </Button>
                    </ModalFooter>
                    </ModalContent>
                </Modal>
            </Box>

            <Box>
                <Link onClick={()=>setShowRate(true)}>
                    <Icon as={MdAttachMoney} boxSize={5}/>
                    Show Booking Rate
                </Link>
                <Modal isOpen={showRate} onClose={()=>setShowRate(false)}>
                    <ModalOverlay />
                    <ModalContent>
                    <ModalHeader>Booking Rate</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>{"booking rate"}</Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={()=>setShowRate(false)}>
                            Close
                        </Button>
                    </ModalFooter>
                    </ModalContent>
                </Modal>
            </Box>
        </Container>
    )
}