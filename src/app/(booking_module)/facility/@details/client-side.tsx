'use client'

import { Container, Heading, Text, Image, Divider, AspectRatio, Icon, TableContainer, Table, Thead, Tr, Th, Td, Tbody } from "@chakra-ui/react"
import { InfoIcon, PhoneIcon } from "@chakra-ui/icons"
import { FaMapLocationDot } from "react-icons/fa6";
import { MdCategory } from "react-icons/md";
import { FacilityData } from "@/app/(facility_management)/edit-facility/@details/default";

export default function FacilityDetails({facilityData, user_type}: {facilityData: FacilityData, user_type: string}) {
    
    if (!facilityData)
    {
        return (
            <Container>
                <Heading>Facility details not found</Heading>
            </Container>
        )
    }

    return (
        <Container maxWidth="90lvw" mt={5}>
            <AspectRatio maxW="37.5rem" ratio={6/3} mb={4}>
                <Image src={facilityData ? facilityData.facility_photo : ""} fallbackSrc="no-image.png" alt="facility_image" objectFit="cover" borderRadius={15}></Image>
            </AspectRatio>
            <Heading mb={2} fontSize={{sm:"large", lg: "x-large"}}>
                {facilityData.facility_name}
            </Heading>
            <Text fontWeight='bold' mb={1}><Icon as={FaMapLocationDot} mr='0.25rem'/>{facilityData.facility_location}</Text>
            <Text mb={1}><Icon as={MdCategory} mr='0.25rem'/>{facilityData.sports_category}</Text>
            <Text mb={1}><PhoneIcon mr='0.25rem' />{facilityData.phone_num}</Text>
            <Text mb={1} textColor={(facilityData.facility_status? "green": "red")}><InfoIcon color="black" mr='0.3rem' />{(facilityData.facility_status? "Active": "Inactive")}</Text>
            
            <Divider my={3} borderColor="#970bf5" />

            <Text fontWeight='bold'>
                Facility Description
            </Text>
            <Text whiteSpace='pre'>{facilityData.facility_desc}</Text>

            <Divider my={3} borderColor="#970bf5"/>

            <Text fontWeight='bold' mb='0.5rem'>
                Booking Rates (RM)
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
                        <Tr bg={user_type == 'student' ? '#f4e6fe' : 'white'} textColor={user_type == 'student' ? 'black' : 'gray'}>
                            <Td fontWeight='bold'>Student</Td>
                            <Td>
                                {facilityData.booking_rates.normal.student.toFixed(2)}
                            </Td>
                            <Td>
                                {facilityData.booking_rates.rush.student.toFixed(2)}
                            </Td>
                        </Tr>
                        <Tr bg={user_type == 'staff' ? '#f4e6fe' : 'white'} textColor={user_type == 'staff' ? 'black' : 'gray'}>
                            <Td fontWeight='bold'>Staff</Td>
                            <Td>
                                {facilityData.booking_rates.normal.staff.toFixed(2)}
                            </Td>
                            <Td>
                                {facilityData.booking_rates.rush.staff.toFixed(2)}
                            </Td>
                        </Tr>
                        <Tr bg={user_type == 'private' ? '#f4e6fe' : 'white'} textColor={user_type == 'private' ? 'black' : 'gray'}>
                            <Td fontWeight='bold'>Private</Td>
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
        </Container>
    )
}