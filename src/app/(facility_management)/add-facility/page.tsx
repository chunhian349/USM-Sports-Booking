'use client'
import { useState, FormEvent } from 'react'
import { Container, Heading, FormControl, FormLabel, Input, Button, Flex, Spacer, Switch } from "@chakra-ui/react"; 
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
                    <FormLabel htmlFor="image">Facility Image:</FormLabel>
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
                    <Input id="phone" name="phone" type="text" required defaultValue="+04-1234567" borderColor="#970bf5" borderWidth={2}/>
                </FormControl>

                <FormControl isRequired mb={5} w={{md:"20rem", lg: "20rem"}}>
                    <FormLabel htmlFor="sports">Sports Category:</FormLabel>
                    <Input id="sports" name="sports" type="text" required defaultValue="Badminton" borderColor="#970bf5" borderWidth={2}/>
                </FormControl>

                <FormControl isRequired mb={5} w={{md:"20rem", lg: "20rem"}}>
                    <FormLabel htmlFor="hours">Operating hours:</FormLabel>
                    <Input id="hours" name="hours" type="text" required defaultValue="8am - 10pm" borderColor="#970bf5" borderWidth={2}/>
                </FormControl>

                {/* <FormControl isRequired mb={5} w={{md:"20rem", lg: "20rem"}}>
                    <FormLabel htmlFor="rate">Booking Rate:</FormLabel>
                    <Input id="rate" name="rate" type="text" value={bookingRate} onChange={handleBookingRateChange} required />
                </FormControl> */}

                <FormControl isRequired mb={5} w={{md:"20rem", lg: "20rem"}}>
                    <FormLabel htmlFor="description">Description:</FormLabel>
                    <Input id="description" name="description" type="text" required defaultValue="6 badminton courts" borderColor="#970bf5" borderWidth={2}/>
                </FormControl>

                <FormControl mb={5} w={{md:"20rem", lg: "20rem"}}>
                    <FormLabel htmlFor="status">Facility Status:</FormLabel>
                    <Switch id="status" name="status" size="lg" colorScheme="purple" defaultChecked/>
                </FormControl>
                
                <Flex>
                    <Spacer></Spacer>
                        <Button type="submit" /*formAction={SubmitFacilityForm}*/ w="6rem" mr={5} bg="#970bf5" color="white" rounded="50" _hover={{ bg: "#7a00cc" }} isLoading={isLoading}>Submit</Button>
                    <Spacer></Spacer>
                </Flex>
            </form>
        </Container>
    )
}