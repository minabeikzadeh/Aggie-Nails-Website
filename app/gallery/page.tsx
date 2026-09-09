"use client";
import NavBar from "@/components/navbar/navbar";
import styles from "./page.module.css";
import { useState } from "react";

export default function Gallery(){


    const galleryImages = [
        {
          src: "/images/blue_gem_nails.jpg",
          alt: "Blue Gem Nails",
          category: "Signature",
        },
        {
          src: "/images/IMG_2032.jpg",
          alt: "Almond blue",
          category: "Signature",
        },
        {
            src: "/images/IMG_4933.jpg",
            alt: "Almond natural chrome",
            category: "Essential",
          },
          {
            src: "/images/IMG_6679.jpg",
            alt: "Almond rainbow japanese",
            category: "Statement",
          },
          
          {
            src: "/images/spiderman_nails.jpg",
            alt: "Spiderman nails",
            category: "Statement",
          },
          {
            src: "/images/green_fairy_nails.jpg",
            alt: "Green fairy nails",
            category: "Signature",
          },
      ];

      const [selectedCategory, setSelectedCategory] = useState("All");
    
      const filteredImages = 
          selectedCategory == "All"
              ? galleryImages
              : galleryImages.filter(
                (image) => image.category === selectedCategory
              );

    return(
        <>
        <NavBar />
        <main>
        <div className={styles.galleryContainer}>
        <div className={styles.galleryHeader}>

            <select
                className={styles.categoryFilter}
                value= {selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
            >
                <option value="All">All</option>
                <option value="Essential">Essential</option>
                <option value="Signature">Signature</option>
                <option value="Statement">Statement</option>
            </select>
        </div>

            <div className={styles.gallery}>
                {filteredImages.map((image) => (
                    <div className={styles.galleryItem} key={image.src}>
                    <img src={image.src} alt={image.alt} />
                    </div>
                ))}
            </div>
        </div>
        </main>
        </>
    );
}