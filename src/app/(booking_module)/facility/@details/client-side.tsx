'use client'

import { Container, Heading, Box, Text, Image, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Divider, Input, Link, AspectRatio, FormLabel, FormControl, Icon, Switch, Center, Textarea } from "@chakra-ui/react"
import { InfoIcon, PhoneIcon, TimeIcon } from "@chakra-ui/icons"
import { useState } from 'react'
import { FaMapLocationDot } from "react-icons/fa6";
import { MdAttachMoney, MdCategory } from "react-icons/md";

export default function FacilityDetails({facility, user_id}: any) {
    
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

    return (
        <Container maxWidth="90lvw" mt={5}>
            <AspectRatio maxW="600" ratio={6/3} mb={4}>
                <Image src={facility ? facility.facility_photo : ""} fallbackSrc="no-image.png" alt="facility_image" objectFit="cover" borderRadius={15}></Image>
            </AspectRatio>
            <Heading mb={2} fontSize={{sm:"large", lg: "x-large"}}>
                {facility.facility_name}
            </Heading>
            <Text as="b" mb={1}><Icon as={FaMapLocationDot} mr={1}/>{facility.facility_location}</Text>
            <Text mb={1}><Icon as={MdCategory} mr={1}/>{facility.sports_category}</Text>
            <Text mb={1}><PhoneIcon mr={1} />{facility.phone_num}</Text>
            <Text mb={1} textColor={(facility.facility_status? "green": "red")}><InfoIcon color="black" mr={1.5} />{(facility.facility_status? "Active": "Inactive")}</Text>
            
            <Divider my={3}/>

            <Text as='b'>
                Facility Description
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