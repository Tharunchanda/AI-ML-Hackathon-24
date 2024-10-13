"use client"
import { useState } from 'react';
import axios from 'axios';
import styles from './ps1.module.css';  

export default function Ps1() {
  const [formData, setFormData] = useState({
    userQuery: '',
    ImageLink: '',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // New state for error handling

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Reset error state before making the request

    try {
      const response = await axios.post('http://<NGROK_PUBLIC_URL>/predict', {
        userQuery: formData.userQuery,
        ImageLink: formData.ImageLink,
      });

      // Set the result with the response from the model
      setResult(response.data);  // Assuming response.data contains the organic_results

    } catch (error) {
      console.error('Error while predicting emissions:', error);
      setError('An error occurred while fetching predictions. Please try again.');
    } finally {
      setLoading(false);  // Stop loading once the API call is finished
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.h1}>Problem Statement 1</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text" 
          name="userQuery"
          placeholder="User query"
          onChange={handleChange}
          required
          className={styles.input}
        />
        <input
          type="text" 
          name="ImageLink"
          placeholder="Drive link to image"
          onChange={handleChange}
          required
          className={styles.input}
        />

        <button
          type="submit"
          disabled={loading}
          className={styles.button}
        >
          {loading ? "Loading..." : "Predict Emissions"}
        </button>
      </form>

      {error && <p className={styles.error}>{error}</p>} {/* Display error message if any */}

      {result && (
        <div className={styles.result}>
          {result.organic_results?.map((res, index) => (
            <div key={index} className={styles.resultItem}>
              <h2 className={styles.h2}>{res.title}</h2>
              <p>
                <a href={res.link} target="_blank" rel="noopener noreferrer">
                  {res.link}
                </a>
              </p>
              <p>{res.snippet}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
