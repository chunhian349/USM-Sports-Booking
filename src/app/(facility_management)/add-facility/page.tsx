'use client'
import { useState } from 'react'
import { Container, Heading, FormControl, FormLabel, Input, Button, Flex, Spacer, Switch} from "@chakra-ui/react"; 
import { SubmitFacilityForm } from './actions';

export default function AddFacility() {
    // Note: It seems that the code works without value and onChange props for the Input components, useState and handle functions might be unnecessary
    const [ facilityName, setFacilityName ] = useState('')
    const [ location, setLocation ] = useState('')
    const [ phoneNumber, setPhoneNumber ] = useState('')
    const [ sportsCategory, setSportsCategory ] = useState('')
    const [ operatingHours, setOperatingHours ] = useState('')
    const [ bookingRate, setBookingRate ] = useState('')
    const [ description, setDescription ] = useState('')

    const handleFacilityNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setFacilityName(e.target.value);
    const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value);
    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value);
    const handleSportsCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => setSportsCategory(e.target.value);
    const handleOperatingHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => setOperatingHours(e.target.value);
    const handleBookingRateChange = (e: React.ChangeEvent<HTMLInputElement>) => setBookingRate(e.target.value);
    const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value);

    return (
        <Container w={["90lvw", "26.5rem", "40rem"]} centerContent py={10} mt="3lvh" borderWidth={2} borderColor="grey.300" rounded={20}>
            <Heading mb={10}>Add Facility</Heading>

            <form>
                <FormControl isRequired mb={5} w={{md:"20rem", lg: "20rem"}}>
                    <FormLabel htmlFor="image">Facility Image:</FormLabel>
                    <Input id="image" name="image" type="file" accept='image/*' required />   
                </FormControl>

                <FormControl isRequired mb={5} w={{md:"20rem", lg: "20rem"}}>
                    <FormLabel htmlFor="name">Facility Name:</FormLabel>
                    <Input id="name" name="name" type="text" value={facilityName} onChange={handleFacilityNameChange} required />
                </FormControl>

                <FormControl isRequired mb={5} w={{md:"20rem", lg: "20rem"}}>
                    <FormLabel htmlFor="location">Location:</FormLabel>
                    <Input id="location" name="location" type="text" value={location} onChange={handleLocationChange} required />
                </FormControl>

                <FormControl isRequired mb={5} w={{md:"20rem", lg: "20rem"}}>
                    <FormLabel htmlFor="phone">Phone Number:</FormLabel>
                    <Input id="phone" name="phone" type="text" value={phoneNumber} onChange={handlePhoneNumberChange} required />
                </FormControl>

                <FormControl isRequired mb={5} w={{md:"20rem", lg: "20rem"}}>
                    <FormLabel htmlFor="sports">Sports Category:</FormLabel>
                    <Input id="sports" name="sports" type="text" value={sportsCategory} onChange={handleSportsCategoryChange} required />
                </FormControl>

                <FormControl isRequired mb={5} w={{md:"20rem", lg: "20rem"}}>
                    <FormLabel htmlFor="hours">Operating hours:</FormLabel>
                    <Input id="hours" name="hours" type="text" value={operatingHours} onChange={handleOperatingHoursChange} required />
                </FormControl>

                <FormControl isRequired mb={5} w={{md:"20rem", lg: "20rem"}}>
                    <FormLabel htmlFor="rate">Booking Rate:</FormLabel>
                    <Input id="rate" name="rate" type="text" value={bookingRate} onChange={handleBookingRateChange} required />
                </FormControl>

                <FormControl isRequired mb={5} w={{md:"20rem", lg: "20rem"}}>
                    <FormLabel htmlFor="description">Description:</FormLabel>
                    <Input id="description" name="description" type="text" value={description} onChange={handleDescriptionChange} required />
                </FormControl>

                <FormControl mb={5} w={{md:"20rem", lg: "20rem"}}>
                    <FormLabel htmlFor="status">Facility Status:</FormLabel>
                    <Switch id="status" name="status" size="lg" colorScheme="purple" />
                </FormControl>
                
                <Flex>
                    <Spacer></Spacer>
                        <Button type="submit" formAction={SubmitFacilityForm} w="6rem" mr={5} bg="#970bf5" color="white" rounded="50" _hover={{ bg: "#7a00cc"}}>Submit</Button>
                    <Spacer></Spacer>
                </Flex>
            </form>
        </Container>
    )
}