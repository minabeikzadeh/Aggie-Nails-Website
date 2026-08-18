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

    //state
    const [currentStep, setCurrentStep] = useState(1);
    const[selectedService, setSelectedService] = useState("");
    const[appointmentType, setAppointmentType] = useState("");
    const[removalType, setRemovalType] = useState("");
    const[selectedDate, setSelectedDate] = useState<Date | undefined>();
    const[selectedTime, setSelectedTime] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [customerTel, setCustomerTel] = useState("");

    const timesForSelectedDate = selectedDate ? availableTimes[selectedDate.getDay() as keyof typeof availableTimes] : [];

    const handleContinue = () => {
        
        if (currentStep === 2 && !appointmentType){
            return
        }
        if (currentStep === 3 && !removalType){
            return
        }
        if (currentStep === 4 && !selectedDate){
            return
        }
        if (currentStep === 5 && !selectedTime){
            return
        }
        if (currentStep === 6 && (!customerName || !customerEmail || !customerTel)){
            return
        }
        setCurrentStep((prevStep) => prevStep + 1);};


        const handleBooking = async () => {
            const response = await fetch("/api/create-checkout-session", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                customerName,
                customerEmail,
                customerTel,
                selectedService,
                appointmentType,
                removalType,
                selectedDate,
                selectedTime,
              }),
            });
          
            const data = await response.json();
          
            if (data.url) {
              window.location.href = data.url;
            } else {
              console.error(data.error);
            }
          };
          
    return(

        
        <>
        <section className={styles.bookingPage}>
        <div className={styles.bookingContainer}>


            <h1 className= {styles.title}>Select a Service</h1>

            {currentStep > 1 && (
                <button 
                    className={styles.backButton}
                    onClick={() => setCurrentStep((prevStep) => prevStep - 1)}>
                    Back
                </button>
            )}



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

            
            <div className={styles.stepContainer}>
                
                
                {currentStep === 2 && (
                    <div className={styles.additionalQuestion}
                        
                    >
                        <p>What type of appointment is this?</p>


                        <label 
                            onClick={() => {
                                setAppointmentType("New");
                            }}
                        >
                            <input type = "radio" name= "appointmentType" />
                            New Gel-X Set
                        </label>

                        <label
                            onClick={() => {
                                setAppointmentType("Fill");
                            }}
                        >
                            <input type = "radio" name= "appointmentType" />
                            Gel-X Fill
                        </label>

                        <label
                            onClick={() => {
                                setAppointmentType("Natural");
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


                        <label
                            onClick={() => {
                                setRemovalType("LocalRemoval");
                            }}
                        >
                            <input type = "radio" name= "removalNeeded" />
                            Remove my previous Aggie Nails set
                        </label>

                        <label
                            onClick={() => {
                                setRemovalType("foreignRemoval");
                            }}
                        >
                            <input type = "radio" name= "removalNeeded" />
                            Remove another nail tech's work
                        </label>

                        <label
                            onClick={() => {
                                setRemovalType("noRemoval");
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
    
                        <div className={styles.calendar}>
                            <DayPicker 
                                mode="single"
                                selected={selectedDate}
                                onSelect={(date) => {
                                        if (!date) return;
                                        setSelectedDate(date);
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

                    
                        <div className={styles.additionalQuestionAnswers}>
                            {timesForSelectedDate.map((time) => (
                                <label key={time}>
                                    <input 
                                        type = "radio"
                                        name = "appointmentTime"
                                        value = {time}
                                        onChange = {() => {
                                            setSelectedTime(time);
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
                        <p>Your Information</p>


                        <input 
                            type = "text"
                            value = {customerName}
                            onChange = {(event) => setCustomerName(event.target.value)}  
                            placeholder="Your name"                             
                        />
                        <input 
                            type = "tel"
                            value = {customerTel}
                            onChange = {(event) => setCustomerTel(event.target.value)}  
                            placeholder="Your cellphone number"                             
                        />
                        <input 
                            type = "email"
                            value = {customerEmail}
                            onChange = {(event) => setCustomerEmail(event.target.value)}  
                            placeholder="Your email"                             
                        />
                    </div>
                )}

               
                {currentStep === 7 && (
                    <div className={styles.additionalQuestion}>
                        <p> Appointment Details</p>

                        <ul>
                            <li>Service: {selectedService}</li>
                            <li>Appointment Type: {appointmentType}</li>
                            <li>Removal: {removalType}</li>
                            <li>Date: {selectedDate?.toLocaleDateString()}</li>
                            <li>Time: {selectedTime}</li>
                            <li>Name: {customerName}</li>
                            <li>Cel: {customerTel}</li>
                            <li>Email: {customerEmail}</li>
                        </ul>
                    <button 
                        className={styles.continueButton}
                        onClick={handleBooking}
                    >
                        Book Appointment</button>

                    </div>
                )}


                {currentStep > 1 && currentStep < 7 &&(
                    <button
                        className={styles.continueButton}
                        onClick={handleContinue}
                    >
                    Continue
                    </button>
                )}

            </div>


        </div>
        </section>
        </>
    );
}