'use client'

import { ArrowBackIcon } from "@chakra-ui/icons"
import { Container, Heading, Link, VStack, Box, Text, Divider, Flex, Button, Image, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Input, Center, Spacer, Textarea, Tabs, Tab, TabList, TabPanels, TabPanel } from "@chakra-ui/react"
import { useDisclosure } from "@chakra-ui/react"
import { useState, useEffect } from "react"
import { SubmitReport } from "./page"

export default function ReportIssueClient({
    user_id,
    reportData
}: {
    user_id: string,
    reportData: {
        report_id: string,
        report_title: string,
        report_screenshot: string,
        report_desc: string,
        report_status: string,
        report_created_at: string,
        admin_feedback: string
    }[]
}) {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const submitReportWithId = SubmitReport.bind(null, user_id)
    return (
        <Container mt={5} borderColor='gray.300' maxW='90lvw' px={5} borderWidth={2} rounded={10}>
            <Flex my={3}>
                <Heading>Report Issue</Heading>
                <Spacer />
                <Button size='md' alignSelf='center' colorScheme='red' onClick={onOpen}>
                    Make Report
                </Button>
            </Flex>

            <Link href='/'>
                <ArrowBackIcon /> Back to homepage
            </Link>

            <Tabs variant="enclosed" borderColor='gray' mt={3}>
                <TabList>
                    <Tab>Unresolved</Tab>
                    <Tab>Resolved</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <VStack mt={3}>
                            {reportData.map((report, index) => {
                                if (report.report_status) {
                                    return null
                                }

                                const reportCreatedAt = new Date(report.report_created_at)                    
                                return (
                                    <Flex key={index} w='100%' alignSelf='start' p={4} mb={3} borderWidth={1} borderColor="#970bf5" rounded="md" >
                                        <VStack alignItems='start' spacing={1} w='45%'>
                                            <Heading fontSize={'md'}>{report.report_title}</Heading>
                                            <Text fontSize={"sm"}>Report ID: {report.report_id}</Text>
                                            <Text fontSize={"sm"}>Created on {reportCreatedAt.toLocaleDateString('en-MY')} {reportCreatedAt.toLocaleTimeString('en-MY')}</Text>
                                            <Text fontSize={"sm"}>Status: {report.report_status ? "Resolved" : "Unresolved"}</Text>
                                            <Text fontSize={"sm"}>Description:</Text>
                                            <Textarea borderWidth={2} fontSize='sm' resize='none' overflowWrap='break-word' defaultValue={report.report_desc} isReadOnly></Textarea>
                                            <Text fontSize={"sm"}>Admin Feedback:</Text>
                                            <Textarea borderWidth={2} fontSize='sm' resize='none' overflowWrap='break-word' defaultValue={report.admin_feedback} isReadOnly></Textarea>
                                        </VStack>
                                        <Spacer />
                                        <Image src={report.report_screenshot} alt="Facility Image" mt={1} aspectRatio={2} maxW="45%" minW="200px" minH="125px" rounded={15}></Image>
                                    </Flex>                                
                                )
                            })}
                        </VStack>
                    </TabPanel>

                    <TabPanel>
                    <VStack mt={3}>
                            {reportData.map((report, index) => {
                                if (!report.report_status) {
                                    return null
                                }

                                const reportCreatedAt = new Date(report.report_created_at)                    
                                return (
                                    <Flex key={index} w='100%' alignSelf='start' p={4} mb={3} borderWidth={1} borderColor="#970bf5" rounded="md" >
                                        <VStack alignItems='start' spacing={1} w='45%'>
                                            <Heading fontSize={'md'}>{report.report_title}</Heading>
                                            <Text fontSize={"sm"}>Report ID: {report.report_id}</Text>
                                            <Text fontSize={"sm"}>Created on {reportCreatedAt.toLocaleDateString('en-MY')} {reportCreatedAt.toLocaleTimeString('en-MY')}</Text>
                                            <Text fontSize={"sm"}>Status: {report.report_status ? "Resolved" : "Unresolved"}</Text>
                                            <Text fontSize={"sm"}>Description:</Text>
                                            <Textarea borderWidth={2} fontSize='sm' resize='none' overflowWrap='break-word' defaultValue={report.report_desc} isReadOnly></Textarea>
                                            <Text fontSize={"sm"}>Admin Feedback:</Text>
                                            <Textarea borderWidth={2} fontSize='sm' resize='none' overflowWrap='break-word' defaultValue={report.admin_feedback} isReadOnly></Textarea>
                                        </VStack>
                                        <Spacer />
                                        <Image src={report.report_screenshot} alt="Facility Image" mt={1} aspectRatio={2} maxW="45%" minW="200px" minH="125px" rounded={15}></Image>
                                    </Flex>                                
                                )
                            })}
                        </VStack>
                    </TabPanel>
                </TabPanels>
            </Tabs>


            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                <ModalHeader>Make Report</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form action={submitReportWithId}>
                        <FormControl isRequired mb={3}>
                            <FormLabel htmlFor='reportTitle'>Report Title:</FormLabel>
                            <Input id="reportTitle" name="reportTitle" type='text' placeholder="Enter Report Title"></Input>
                        </FormControl>
                        <FormControl isRequired mb={3}>
                            <FormLabel htmlFor='reportDesc'>Report Description:</FormLabel>                                        
                            <Input id='reportDesc' name='reportDesc' h="15lvh" as="textarea" type='text' placeholder="Enter Description"></Input>
                        </FormControl>
                        <FormControl isRequired mb={5}>
                            <FormLabel htmlFor="screenshot">Screenshot:</FormLabel>
                            <Input id="screenshot" name="screenshot" type="file" accept='image/*' borderWidth={2} pt={1} required /> 
                        </FormControl>

                        <Center>
                            <Button type='submit' colorScheme='red' rounded={20} mr={3} onClick={onClose}>
                                Submit
                            </Button>
                        </Center>
                    </form>
                </ModalBody>
                </ModalContent>
            </Modal>
        </Container>
    )
}