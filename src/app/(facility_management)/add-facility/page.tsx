'use client'
import { useState, FormEvent } from 'react'
import { Container, Heading, FormControl, FormLabel, Input, Button, Flex, Spacer, Switch, Text, Center, TableContainer, Table, Thead, Tr, Th, Td, Tbody, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper } from "@chakra-ui/react"; 
import { SubmitFacilityForm } from './actions';

export default function AddFacility() {
    // Note: It seems that the code works without value and onChange props for the Input components, useState and handle functions might be unnecessary
    const [ isLoading, setIsLoading ] = useState(false);

    // Inside your component
    async function handleFormSubmit (event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);

        //console.log(event.currentTarget)
        const formData = new FormData(event.currentTarget);

        // Validate start time and end time
        const startTime = formData.get('startTime') as string;
        const endTime = formData.get('endTime') as string;
        if (startTime >= endTime) {
            alert("Invalid operating hours! Start time must be earlier than end time.");
            setIsLoading(false);
            return;
        }

        // Validate timeslot interval, cannot both 0
        const intervalHour = Number(formData.get('intervalHour')) ?? 0;
        const intervalMin = Number(formData.get('intervalMin')) ?? 0;
        if (intervalHour === 0 && intervalMin === 0) {
            alert("Invalid timeslot interval! Please set at least 1 minute.");
            setIsLoading(false);
            return;
        }

        const error = await SubmitFacilityForm(formData);
        setIsLoading(false);
    
        if (!error) {
            alert("Facility added successfully!");

        } else {
            alert(error.message);
        }
    }

    return (
        <Container w={["90lvw", "26.5rem", "40rem"]} centerContent py={10} mt="3lvh" borderColor={"grey.300"} borderWidth={1} boxShadow={"lg"} rounded={20}>
            <Heading mb={10}>Add Facility</Heading>

            <form onSubmit={handleFormSubmit}>
                <FormControl isRequired mb={5} w={{md:"20rem", lg: "20rem"}}>
                    <FormLabel htmlFor="image">Facility Photo:</FormLabel>
                    {/* <Container borderWidth={1} borderColor="grey.100" rounded={5}> */}
                        <Input id="image" name="image" type="file" accept='image/*' opacity={1} borderColor="#970bf5" borderWidth={2} pt={1} required /> 
                    {/* </Container> */}
                </FormControl>

                <FormControl isRequired mb={5} w={{md:"20rem", lg: "20rem"}}>
                    <FormLabel htmlFor="name">Facility Name:</FormLabel>
                    <Input id="name" name="name" type="text" required defaultValue="Facility A" borderColor="#970bf5" borderWidth={2}/>
                </FormControl>

                <FormControl isRequired mb={5} w={{md:"20rem", lg: "20rem"}}>
                    <FormLabel htmlFor="location">Location:</FormLabel>
                    <Input id="location" name="location" type="text" required defaultValue="Minden, Main Campus" borderColor="#970bf5" borderWidth={2}/>
                </FormControl>

                <FormControl isRequired mb={5} w={{md:"20rem", lg: "20rem"}}>
                    <FormLabel htmlFor="phone">Phone Number:</FormLabel>
                    <Input id="phone" name="phone" type="tel" required defaultValue="+04-1234567" borderColor="#970bf5" borderWidth={2}/>
                </FormControl>

                <FormControl isRequired mb={5} w={{md:"20rem", lg: "20rem"}}>
                    <FormLabel htmlFor="sports">Sports Category:</FormLabel>
                    <Input id="sports" name="sports" type="text" required defaultValue="Badminton" borderColor="#970bf5" borderWidth={2}/>
                </FormControl>

                <FormControl isRequired mb={5} w={{md:"20rem", lg: "20rem"}}>
                    <FormLabel htmlFor="times">Operating hours:</FormLabel>
                    <Flex>
                        <Input id="startTime" name="startTime" type="time" required defaultValue='08:00' borderColor="#970bf5" borderWidth={2}/> 
                        <Center mx='0.25rem'><Text>to</Text></Center>
                        <Input id="endTime" name="endTime" type="time" required defaultValue='22:00' borderColor="#970bf5" borderWidth={2}></Input>
                    </Flex>
                </FormControl>

                <FormControl isRequired mb={5} w={{md:"20rem", lg: "20rem"}}>
                    <FormLabel htmlFor="interval">Timeslot interval:</FormLabel>
                    <Flex>
                        <NumberInput id="intervalHour" name="intervalHour" defaultValue={1} min={0} max={23} step={1}>
                            <NumberInputField borderColor="#970bf5" borderWidth={2} />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                        <Center mx='0.25rem'><Text>hour(s)</Text></Center>
                        <NumberInput id="intervalMin" name="intervalMin" defaultValue={0} min={0} max={59} step={15}>
                            <NumberInputField borderColor="#970bf5" borderWidth={2} />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                        <Center mx='0.25rem'><Text>minute(s)</Text></Center>
                    </Flex>
                </FormControl>

                <FormControl isRequired mb={5} w={{md:"20rem", lg: "28rem"}}>
                    <FormLabel htmlFor="rates">Booking Rates (RM):</FormLabel>
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
                                        <NumberInput id="normStudentRate" name="normStudentRate" defaultValue={2} min={0} step={1} precision={2}>
                                            <NumberInputField />
                                            <NumberInputStepper>
                                                <NumberIncrementStepper />
                                                <NumberDecrementStepper />
                                            </NumberInputStepper>
                                        </NumberInput>
                                    </Td>
                                    <Td>
                                        <NumberInput id="rushStudentRate" name="rushStudentRate" defaultValue={5} min={0} step={1} precision={2}>
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
                                        <NumberInput id="normStaffRate" name="normStaffRate" defaultValue={5} min={0} step={1} precision={2}>
                                            <NumberInputField />
                                            <NumberInputStepper>
                                                <NumberIncrementStepper />
                                                <NumberDecrementStepper />
                                            </NumberInputStepper>
                                        </NumberInput>
                                    </Td>
                                    <Td>
                                        <NumberInput id="rushStaffRate" name="rushStaffRate" defaultValue={7} min={0} step={1} precision={2}>
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
                                        <NumberInput id="normPrivateRate" name="normPrivateRate" defaultValue={12} min={0} step={1} precision={2}>
                                            <NumberInputField />
                                            <NumberInputStepper>
                                                <NumberIncrementStepper />
                                                <NumberDecrementStepper />
                                            </NumberInputStepper>
                                        </NumberInput>
                                    </Td>
                                    <Td>
                                        <NumberInput id="rushPrivateRate" name="rushPrivateRate" defaultValue={18} min={0} step={1} precision={2}>
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
                </FormControl>

                <FormControl isRequired mb={5} w={{md:"20rem", lg: "28rem"}}>
                    <FormLabel htmlFor="description">Description:</FormLabel>
                    <Input id="description" name="description" h='5rem' as='textarea' type="text" required defaultValue="6 badminton courts" borderColor="#970bf5" borderWidth={2}/>
                </FormControl>

                <FormControl mb={5}>
                    <FormLabel htmlFor="status">Facility Status:</FormLabel>
                    <Switch id="status" name="status" size="lg" colorScheme="purple" defaultChecked/>
                </FormControl>
                
                <Flex>
                    <Spacer></Spacer>
                        <Button type="submit" w="6rem" mr={5} bg="#970bf5" color="white" rounded="50" _hover={{ bg: "#7a00cc" }} isLoading={isLoading}>Submit</Button>
                    <Spacer></Spacer>
                </Flex>
            </form>
        </Container>
    )
}