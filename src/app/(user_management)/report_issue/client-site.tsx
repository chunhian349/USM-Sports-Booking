'use client'

import { ArrowBackIcon } from "@chakra-ui/icons"
import { Container, Heading, Link, VStack, Text, Flex, Button, Image, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Input, Center, Spacer, Textarea, Tabs, Tab, TabList, TabPanels, TabPanel, Alert, AlertIcon } from "@chakra-ui/react"
import { useDisclosure } from "@chakra-ui/react"
import { useFormStatus, useFormState } from "react-dom"
import { SubmitReport } from "./actions"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

const initialState = { isActionSuccess: false, message: '' }

function SubmitReportButton({formAction}: {formAction: (payload: FormData) => void}) {
    const { pending } = useFormStatus()
    return <Button type="submit" formAction={formAction} colorScheme='red' rounded={20} isLoading={pending}>Submit</Button>
}

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
    const router = useRouter()
    const [formState, formAction] = useFormState(SubmitReport, initialState)
    const [selectedReport, setSelectedReport] = useState<typeof reportData[number]>({
        report_id: '',
        report_title: '',
        report_screenshot: '',
        report_desc: '',
        report_status: '',
        report_created_at: '',
        admin_feedback: ''
    })
    const [showDetails, setShowDetails] = useState(false)

    useEffect(() => {
        if (formState.isActionSuccess) {
            router.refresh();
        }

    }, [formState, router])

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
                        <VStack>
                            {reportData.map((report, index) => {
                                if (report.report_status) {
                                    return null
                                }

                                const reportCreatedAt = new Date(report.report_created_at)                    
                                return (
                                    <Flex key={index} w='100%' alignSelf='start' p={3} borderWidth={1} borderColor="#970bf5" rounded="md" _hover={{ boxShadow:'base', bgColor:"gray.50" }} >
                                        <VStack alignItems='start' spacing={0} w='45%'>
                                            <Heading fontSize={'md'}>{report.report_title}</Heading>
                                            <Text fontSize={"sm"}>Report ID: {report.report_id}</Text>
                                            <Text fontSize={"sm"}>Created on {reportCreatedAt.toLocaleDateString('en-MY')} {reportCreatedAt.toLocaleTimeString('en-MY')}</Text>
                                            <Text fontSize={"sm"}>Status: {report.report_status ? "Resolved" : "Unresolved"}</Text>                                           
                                            <Link as='button' fontSize='sm' textColor='blue' onClick={()=>{setSelectedReport(report); setShowDetails(true)}}>Details</Link>
                                        </VStack>
                                    </Flex>                                
                                )
                            })}
                        </VStack>
                    </TabPanel>

                    <TabPanel>
                        <VStack>
                            {reportData.map((report, index) => {
                                if (!report.report_status) {
                                    return null
                                }

                                const reportCreatedAt = new Date(report.report_created_at)                    
                                return (
                                    <Flex key={index} w='100%' alignSelf='start' p={3} borderWidth={1} borderColor="#970bf5" rounded="md" _hover={{ boxShadow:'base', bgColor:"gray.50" }} >
                                        <VStack alignItems='start' spacing={0} w='45%'>
                                            <Heading fontSize={'md'}>{report.report_title}</Heading>
                                            <Text fontSize={"sm"}>Report ID: {report.report_id}</Text>
                                            <Text fontSize={"sm"}>Created on {reportCreatedAt.toLocaleDateString('en-MY')} {reportCreatedAt.toLocaleTimeString('en-MY')}</Text>
                                            <Text fontSize={"sm"}>Status: {report.report_status ? "Resolved" : "Unresolved"}</Text>                                           
                                            <Link as='button' fontSize='sm' textColor='blue' onClick={()=>{setSelectedReport(report); setShowDetails(true)}}>Details</Link>
                                        </VStack>
                                    </Flex>                                
                                )
                            })}
                        </VStack>
                    </TabPanel>
                </TabPanels>
            </Tabs>

            {/* Report Details Modal */}
            <Modal size='xl' isOpen={showDetails} scrollBehavior="inside" onClose={()=>setShowDetails(false)}>
                <ModalOverlay bg='blackAlpha.300' />
                {selectedReport.report_id == '' ? (
                    <ModalContent>
                        <ModalHeader>Error</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Text>Unable to load report details. Please try again later.</Text>
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={()=>setShowDetails(false)}>Close</Button>
                        </ModalFooter>
                    </ModalContent>
                ) : (
                    <ModalContent>
                    <ModalHeader>Report Details</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack alignItems='start' spacing={0}>
                            <Image src={selectedReport.report_screenshot} alt="Facility Image" mb={3}></Image>
                            <Heading size={"md"} mb={3}>{selectedReport.report_title} </Heading>
                            <Text fontSize={"sm"}>Report ID: {selectedReport.report_id}</Text>
                            <Text fontSize={"sm"}>Report on {(new Date(selectedReport.report_created_at).toLocaleString('en-MY'))}</Text>
                            <Text fontSize={"sm"}>Status: {selectedReport.report_status ? "Resolved" : "Unresolved"}</Text>
                            <Text fontSize={"sm"} mb={1}>Description:</Text>
                            <Textarea id="reportDesc" name="reportDesc" fontSize={'sm'} overflowWrap='break-word' defaultValue={selectedReport.report_desc} mb={2} readOnly></Textarea>
                            <FormLabel htmlFor="feedback" fontSize={"sm"} mb={1}>Admin Feedback:</FormLabel>
                            <Textarea id="feedback" name="feedback" fontSize='sm' defaultValue={selectedReport.admin_feedback}></Textarea>
                        </VStack>
                    </ModalBody>
                    <ModalFooter justifyContent='center'>
                        <Button colorScheme='purple' rounded={20} onClick={()=>setShowDetails(false)}>Close</Button>
                    </ModalFooter>
                    </ModalContent>
                )}
            </Modal>

            {/* Make Report Modal */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                <ModalHeader>Make Report</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form>
                        <FormControl>
                            <FormLabel hidden htmlFor='userid'>User Id:</FormLabel>
                            <Input hidden id="userid" name="userid" type='text' defaultValue={user_id}></Input>
                        </FormControl>
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

                        <VStack mb={3}>
                            {/* formState changed after submit, show result of form submission (success/failed) */}
                            {(formState == initialState) ? null : formState.isActionSuccess ? (
                                <Alert status='success'>
                                <AlertIcon />
                                <Text color='green' fontSize='sm'>{formState.message}</Text>
                                </Alert>
                            ) : (
                                <Alert status='error'>
                                <AlertIcon />
                                <Text color='red' fontSize='sm'>{formState.message}</Text>
                                </Alert>
                            )}
                        </VStack>

                        <Center>
                            <SubmitReportButton formAction={formAction} />
                        </Center>
                    </form>
                </ModalBody>
                </ModalContent>
            </Modal>
        </Container>
    )
}