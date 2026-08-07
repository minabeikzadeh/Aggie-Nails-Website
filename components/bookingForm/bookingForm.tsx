"use client";
import { useState } from "react"
import styles from "./bookingForm.module.css"
import Image from "next/image";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";


const bookingStartDate = new Date(2026, 8, 1);
const bookingEndDate = new Date(2026, 8, 30);
const availableTimes= {
    0: ["11:30 am", "2:00 pm"],
    1: ["10:00 am", "1:00 pm"],
    2: [],
    3: ["10:00 am", "1:00 pm"],
    4: [],
    5: ["9:30 am"],
    6: ["11:30 am", "2:00 pm"]
};


export default function BookingForm(){

    
    const [currentStep, setCurrentStep] = useState(1);
    const[selectedService, setSelectedService] = useState("");
    const[appointmentType, setAppointmentType] = useState("");
    const[removalType, setRemovalType] = useState("");
    const[selectedDate, setSelectedDate] = useState<Date | undefined>();
    const[selectedTime, setSelectedTime] = useState("");

    const timesForSelectedDate = selectedDate ? availableTimes[selectedDate.getDay() as keyof typeof availableTimes] : [];

    return(
        <>
        <section className={styles.bookingPage}>
        <div className={styles.bookingContainer}>


            <h1 className= {styles.title}>Select a Service</h1>


            {currentStep === 1 && (
                <section className={styles.serviceGrid}>

                    
                    <div 
                        className={styles.serviceCard}
                        onClick={() => {
                            setSelectedService("Essential");
                            setCurrentStep((prevStep) => prevStep+1);
                        }}
                    >
                        <Image className={styles.essential_img}
                            src= "/images/IMG_4933.jpg"
                            alt= "Essential Nails"
                            width={300}
                            height={400}
                        /> 

                        <div className={styles.serviceInfo}>
                            <h2>Essential</h2>
                            <ul><li>Solid color</li><li>French tip</li><li>Chrome</li></ul>
                            <h3 className={styles.price}>$75</h3>
                        </div>
                    </div>


                    <div 
                        className={styles.serviceCard}
                        onClick={() => {
                            setSelectedService("Signature");
                            setCurrentStep((prevStep) => prevStep+1);
                        }}
                    >
                        <Image className={styles.signature_img}
                            src= "/images/fairy_green_nails_edited.png"
                            alt= "Signature Nails"
                            width={300}
                            height={400}
                        /> 

                        <div className={styles.serviceInfo}>
                            <h2>Signature</h2>
                            <ul><li>3D Art</li><li>Charms and Gems</li><li>Simple Nail Art</li></ul>
                            <h3 className={styles.price}>$95</h3>
                        </div>
                    </div>


                    <div 
                        className={styles.serviceCard}
                        onClick={() => {
                            setSelectedService("Statement");
                            setCurrentStep((prevStep) => prevStep+1);
                        }}
                    >
                        <Image className={styles.statement_img}
                            src= "/images/IMG_6679.jpg"
                            alt= "Statement Nails"
                            width={300}
                            height={400}
                        /> 

                        <div className={styles.serviceInfo}>
                            <h2>Statement</h2>
                            <ul><li>Advanced Nail Art</li><li>Complex 3D Sculpting </li><li>Fully Customized Designs</li></ul>
                            <p>Custom quote through DM</p>
                        </div>
                    </div>

                </section>
            )}

            {currentStep === 2 && (
                <div className={styles.additionalQuestion}
                    
                >
                    <p>What type of appointment is this?</p>

                    <button
                        className={styles.backButton}
                        onClick={() => setCurrentStep((prevStep)=> prevStep-1)}
                    >Back
                    </button>

                    <label 
                        onClick={() => {
                            setAppointmentType("New");
                            setCurrentStep((prevStep) => prevStep+1);
                        }}
                    >
                        <input type = "radio" name= "appointmentType" />
                        New Gel-X Set
                    </label>

                    <label
                        onClick={() => {
                            setAppointmentType("Fill");
                            setCurrentStep((prevStep) => prevStep+1);
                        }}
                    >
                        <input type = "radio" name= "appointmentType" />
                        Gel-X Fill
                    </label>

                    <label
                        onClick={() => {
                            setAppointmentType("Natural");
                            setCurrentStep((prevStep) => prevStep+1);
                        }}
                    >
                        <input type = "radio" name= "appointmentType" />
                        On Natural Nails
                    </label>

                </div>
            )}

            {currentStep === 3 && (
                <div className={styles.additionalQuestion}>
                    <p>Do you need a removal?</p>

                    <button
                        className={styles.backButton}
                        onClick={() => setCurrentStep((prevStep)=> prevStep-1)}
                    >Back
                    </button>

                    <label
                        onClick={() => {
                            setRemovalType("LocalRemoval");
                            setCurrentStep((prevStep) => prevStep+1);
                        }}
                    >
                        <input type = "radio" name= "removalNeeded" />
                        Remove my previous Aggie Nails set
                    </label>

                    <label
                        onClick={() => {
                            setRemovalType("foreignRemoval");
                            setCurrentStep((prevStep) => prevStep+1);
                        }}
                    >
                        <input type = "radio" name= "removalNeeded" />
                        Remove another nail tech's work
                    </label>

                    <label
                        onClick={() => {
                            setRemovalType("noRemoval");
                            setCurrentStep((prevStep) => prevStep+1);
                        }}
                    >
                        <input type = "radio" name= "removalNeeded" />
                        No, my nails are bare or I'm doing a fill
                    </label>
                </div>
            )}

    
            {currentStep === 4 && (
                <div className={styles.additionalQuestion}>
                    <p> Select your appointment date</p>
                    <button
                        className={styles.backButton}
                        onClick={() => setCurrentStep((prevStep)=> prevStep-1)}
                    >Back
                    </button>
                    <div className={styles.calendar}>
                        <DayPicker 
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => {
                                    if (!date) return;
                                    setSelectedDate(date);
                                    setCurrentStep((prevStep) => prevStep+1);
                            }}
                            disabled={{
                                before: bookingStartDate,
                                after: bookingEndDate,
                            }}
                            numberOfMonths={1}
                        />
                    </div>
                </div>
            )}

            {currentStep === 5 && (
                <div className={styles.additionalQuestion}>
                    <p> Select a time </p>

                    <button
                        className={styles.backButton}
                        onClick={() => setCurrentStep((prevStep)=> prevStep-1)}
                    >Back
                    </button>
                
                    <div className={styles.additionalQuestionAnswers}>
                        {timesForSelectedDate.map((time) => (
                            <label key={time}>
                                <input 
                                    type = "radio"
                                    name = "appointmentTime"
                                    value = {time}
                                    onChange = {() => {
                                        setSelectedTime(time);
                                        setCurrentStep((prevStep) => prevStep+1);
                                    }}
                                />
                                {time}

                            </label>
                    
                    ))}
                    </div>
                </div>
            )}

            {currentStep === 6 && (
                <div className={styles.additionalQuestion}>
                    <p> Appointment Details</p>
                    <button
                        className={styles.backButton}
                        onClick={() => setCurrentStep((prevStep)=> prevStep-1)}
                    >Back
                    </button>
                    <ul>
                        <li>Service: {selectedService}</li>
                        <li>Appointment Type: {appointmentType}</li>
                        <li>Removal: {removalType}</li>
                        <li>Date: {selectedDate?.toLocaleDateString()}</li>
                        <li>Time: {selectedTime}</li>
                    </ul>
                <button className={styles.confirmButton}>Book Appointment</button>

                </div>
            )}
            



            


        </div>
        </section>
        </>
    );
}