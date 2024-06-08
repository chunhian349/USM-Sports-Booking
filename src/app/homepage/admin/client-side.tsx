'use client'

import { Container, Flex, Heading, Box, Button, Spacer, Image, Center, Text, Tabs, Tab, TabList, TabPanels, TabPanel, Table, Thead, Tr, Th, Tbody, TableContainer, Td, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, VStack, Textarea, FormLabel, Divider, FormControl, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { useState } from "react";
import { UpdateReport, AddFacilityManager } from "./page";
import { useRouter } from 'next/navigation';

export default function AdminClient({
    facilityManagerData, reportData
} : {
    facilityManagerData: {
        user_id: string;
        email: string;
        full_name: string;
        phone_num: string;
        user_created_at: string;
    }[],
    reportData: {
        report_id: string;
        report_title: string;
        report_screenshot: string;
        report_desc: string;
        report_status: boolean;
        report_created_at: string;
        admin_feedback: string;
        User: {
            email: string;
            user_type: string;
        };
    }[]
}){
    const router = useRouter();

    const [selectedReport, setSelectedReport] = useState<typeof reportData[number] | null>(null);
    const [selectedManager, setSelectedManager] = useState<typeof facilityManagerData[number]>();
    const [showReportDetails, setShowReportDetails] = useState(false);
    const [showManagerDetails, setShowManagerDetails] = useState(false);
    const [showAddManager, setShowAddManager] = useState(false);
    const [show, setShow] = useState(false);
    
    async function handleReportUpdate(e: React.FormEvent<HTMLFormElement>) {
        if (!selectedReport) {
            alert('Error: Report state is not set, unable to identify the report to update.')
            return;
        }

        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const feedback = formData.get('feedback') as string;

        try {
            await UpdateReport(selectedReport.report_id, !selectedReport.report_status, feedback);
        } catch (error) {
            alert('Failed to update report');
            return;
        }

        setShowReportDetails(false)
        router.refresh();
    }

    async function handleAddManager(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        try {
            await AddFacilityManager(formData);
        } catch (error) {
            alert('Failed to add facility manager');
            return;
        } 

        alert('Facility manager added successfully');
        setShowAddManager(false);
        // router.refresh('/');
    }
    
    return (
        <Container maxW='90lvw' flexDir='row' px={0}>
            <Box position="relative" overflow="hidden" w="100%" maxH="50lvh" rounded={10} mt={3}>
                <Image
                    src={'/userpage-image.jpg'}
                    alt="Homepage Image"
                    objectFit="cover"
                    zIndex="-1"
                    w="100%" 
                    h="130%"
                    // position="absolute"
                    // top="50%"
                    // left="50%"
                    transform="translate(0, -20%)"
                    aspectRatio={16 / 9}
                />
                <Box position="absolute" top="0" left="0" w="full" h="full" bg="rgba(0, 0, 0, 0.5)" zIndex="0">  
                {/* Semi-transparent overlay, adjust z to cover the image but avoid to cover the menu in nav */}
                </Box>
                <Box position="absolute" top="50%" left="50%" w="80%" transform="translate(-50%, -50%)">
                    <Center>
                    <Heading size="2xl" color="White" mb={8}>
                        USM Sports Booking Admin Page
                    </Heading>
                    </Center>
                    <Center>
                        <Text color="White" fontSize="large">
                            You have logged in as an admin.
                        </Text>
                    </Center>
                </Box>
            </Box>

            <Flex mt={5}>
                <Box w='50lvw' borderWidth={2} borderColor='gray.400' p={3} rounded={5}>
                    <Heading fontSize='3xl'>Reports</Heading>
                    <Tabs variant="enclosed" borderColor='gray' mt={3}>
                        <TabList>
                            <Tab>Unresolved</Tab>
                            <Tab>Resolved</Tab>
                        </TabList>

                        <TabPanels>
                            <TabPanel>
                                <TableContainer borderWidth={1} borderColor="#970bf5">
                                    <Table size='sm'>
                                        <Thead bg='#d59dfb'>
                                            <Tr>
                                                <Th>Title</Th>
                                                <Th>User Type</Th>
                                                <Th>Date</Th>
                                            </Tr>
                                        </Thead>

                                        <Tbody>
                                        {
                                            reportData.map((report, index) => {
                                                // This tab shows unresolved reports
                                                if (report.report_status) {
                                                    return;
                                                }

                                                const reportDate = new Date(report.report_created_at)
                                                return (
                                                    <Tr key={index} _hover={{bg: '#f4e6fe', cursor:'pointer'}} _active={{bg: '#eacefd'}} onClick={()=>{setSelectedReport(report); setShowReportDetails(true)}}>
                                                        <Td>{report.report_title}</Td>
                                                        <Td>{report.User.user_type}</Td>
                                                        <Td>{reportDate.toLocaleDateString('en-MY')} {reportDate.toLocaleTimeString('en-MY')}</Td>
                                                    </Tr>
                                                )
                                            })
                                        }
                                        </Tbody>
                                    </Table>
                                </TableContainer>
                            </TabPanel>

                            <TabPanel>
                                <TableContainer borderWidth={1} borderColor="#970bf5">
                                    <Table size='sm'>
                                        <Thead bg='#d59dfb'>
                                            <Tr>
                                                <Th>Title</Th>
                                                <Th>User Type</Th>
                                                <Th>Date</Th>
                                            </Tr>
                                        </Thead>

                                        <Tbody>
                                        {
                                            // This tab shows resolved reports
                                            reportData.map((report, index) => {
                                                if (!report.report_status) {
                                                    return;
                                                }

                                                const reportDate = new Date(report.report_created_at)
                                                return (
                                                    <Tr key={index} _hover={{bg: '#f4e6fe', cursor:'pointer'}} _active={{bg: '#eacefd'}} onClick={()=>{setSelectedReport(report); setShowReportDetails(true)}}>
                                                        <Td>{report.report_title}</Td>
                                                        <Td>{report.User.user_type}</Td>
                                                        <Td>{reportDate.toLocaleDateString('en-MY')} {reportDate.toLocaleTimeString('en-MY')}</Td>
                                                    </Tr>
                                                )
                                            })
                                        }
                                        </Tbody>
                                    </Table>
                                </TableContainer>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Box>

                <Modal size='lg' isOpen={showReportDetails} scrollBehavior="inside" onClose={()=>setShowReportDetails(false)}>
                    <ModalOverlay bg='blackAlpha.300' />
                    {!selectedReport ? (
                        <ModalContent>
                            <ModalHeader>Error</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <Text>Unable to load report details. Please try again later.</Text>
                            </ModalBody>
                            <ModalFooter>
                                <Button onClick={()=>setShowReportDetails(false)}>Close</Button>
                            </ModalFooter>
                        </ModalContent>
                    ) : (
                        <form onSubmit={handleReportUpdate}>
                        <ModalContent>
                        <ModalHeader>Report Details</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <VStack alignItems='start' spacing={0}>
                                <Image src={selectedReport.report_screenshot} alt="Facility Image" mb={3}></Image>
                                <Heading size={"md"} mb={3}>{selectedReport.report_title} </Heading>
                                <Text fontSize={"sm"}>Report ID: {selectedReport.report_id}</Text>
                                <Text fontSize={"sm"}>User email: {selectedReport.User.email}</Text>
                                <Text fontSize={"sm"}>User type: {selectedReport.User.user_type}</Text>
                                <Text fontSize={"sm"}>Report on {(new Date(selectedReport.report_created_at).toLocaleString('en-MY'))}</Text>
                                <Text fontSize={"sm"}>Status: {selectedReport.report_status ? "Resolved" : "Unresolved"}</Text>
                                <Text fontSize={"sm"} mb={1}>Description:</Text>
                                <Textarea id="reportDesc" name="reportDesc" fontSize={'sm'} overflowWrap='break-word' defaultValue={selectedReport.report_desc} mb={2} readOnly></Textarea>
                                <FormLabel htmlFor="feedback" fontSize={"sm"} mb={1}>Admin Feedback:</FormLabel>
                                <Textarea id="feedback" name="feedback" fontSize='sm' defaultValue={selectedReport.admin_feedback}></Textarea>
                            </VStack>
                        </ModalBody>
                        <ModalFooter justifyContent='center'>
                            <Button type="submit" colorScheme={selectedReport.report_status? 'red' : 'green'} rounded={20}>{selectedReport.report_status? 'Mark Unresolved' : 'Mark Resolved'}</Button>
                        </ModalFooter>
                        </ModalContent>
                        </form>
                    )}
                </Modal>

                <Spacer />

                <Box w='37lvw' borderWidth={2} borderColor='gray.400' p={3} rounded={5}>
                    <Flex>
                        <Heading fontSize='3xl'>Facility Managers</Heading>
                        <Spacer />
                        <Button colorScheme='green' onClick={()=>setShowAddManager(true)}>Add</Button>
                    </Flex>

                    <Divider mt={3} borderColor='black' />
                    
                    <VStack spacing={0}>
                        {
                            facilityManagerData.map((manager, index) => {
                                return (
                                    <Box key={index} w='full' borderBottomColor='gray.300' borderBottomWidth={1} p={1} _hover={{bg:'gray.100', cursor:'pointer'}} _active={{bg:'gray.300'}} onClick={()=>{setSelectedManager(manager); setShowManagerDetails(true);}}>
                                        <Heading fontSize='md'>{manager.full_name}</Heading>
                                        <Text fontSize='sm'>{manager.email}</Text>
                                        <Text fontSize='sm'>Joined on {(new Date(manager.user_created_at).toLocaleDateString('en-MY'))}</Text>
                                    </Box>
                                )
                            })
                        }
                    </VStack>
                </Box>

                <Modal size='lg' isCentered isOpen={showAddManager} scrollBehavior="inside" onClose={()=>setShowAddManager(false)}>
                    <ModalOverlay bg='blackAlpha.300' />
                    <ModalContent>
                        <ModalHeader>Add Facility Manager</ModalHeader>
                        <ModalCloseButton />
                        <form onSubmit={handleAddManager}>
                        <ModalBody>
                            <FormControl isRequired mb={3}>
                                <FormLabel htmlFor="email">Email:</FormLabel>
                                <Input id="email" name="email" type="email" />   
                            </FormControl>
                            <FormControl isRequired mb={3}>
                                <FormLabel htmlFor="password">Password:</FormLabel>
                                <InputGroup>
                                <Input id="password" name="password" type={show ? "text" : "password"}/>
                                    <InputRightElement width='4.5rem'>
                                        <Button h='1.75rem' size='sm' onClick={() => setShow(!show)}>{show ? 'Hide' : 'Show'}</Button>
                                    </InputRightElement>
                                </InputGroup>
                            </FormControl>
                            <FormControl mb={3}>
                                <FormLabel htmlFor="full_name">Full Name:</FormLabel>
                                <Input id="full_name" name="full_name" type="text"/>
                            </FormControl>
                            <FormControl mb={3}>
                                <FormLabel htmlFor="phone_num">Phone Number:</FormLabel>
                                <Input id="phone_num" name="phone_num" type="tel"/>
                            </FormControl>
                        </ModalBody>
                        <ModalFooter justifyContent='center'>
                            <Button type="submit" colorScheme='purple' rounded={20}>Submit</Button>
                        </ModalFooter>
                        </form>
                    </ModalContent>
                </Modal>

                <Modal size='lg' isCentered isOpen={showManagerDetails} scrollBehavior="inside" onClose={()=>setShowManagerDetails(false)}>
                    <ModalOverlay bg='blackAlpha.300' />
                    {!selectedManager ? (
                        <ModalHeader>Error</ModalHeader>
                    ) : (
                        <ModalContent>
                            <ModalHeader fontSize='2xl'>Facility Manager Details</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <VStack alignItems='start' spacing={0}>
                                    <Heading size={"md"} mb={3}>{selectedManager.email} </Heading>
                                    <Text fontSize={"md"}>User ID: {selectedManager.user_id}</Text>
                                    <Text fontSize={"md"}>Name: {selectedManager.full_name}</Text>
                                    <Text fontSize={"md"}>Phone Number: {selectedManager.phone_num}</Text>
                                    <Text fontSize={"md"}>Created on {(new Date(selectedManager.user_created_at).toLocaleString('en-MY'))}</Text>
                                </VStack>
                            </ModalBody>
                            <ModalFooter justifyContent='center'>
                                <Button colorScheme='purple' rounded={20} onClick={()=>setShowManagerDetails(false)}>Close</Button>
                            </ModalFooter>
                        </ModalContent>
                    )}
                </Modal>
            </Flex>
        </Container>
    );
  };