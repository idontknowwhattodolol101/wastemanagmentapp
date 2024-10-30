import React, { useState } from 'react';
import { uploadData } from 'aws-amplify/storage';
import { post } from 'aws-amplify/api';
import './WasteManager.css'; // Import the CSS file for styling

function WasteManager() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [responseMessage, setResponseMessage] = useState("");

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedImage) {
            return;
        }

        // Generate a unique file name
        const fileName = `${Date.now()}_${selectedImage.name}`;

        try {
            // Upload the image directly to the S3 bucket
            await uploadData({
                path: fileName, // The file path in S3
                data: selectedImage, // The image file to upload
                options: {
                    contentType: selectedImage.type,
                    onProgress: ({ transferredBytes, totalBytes }) => {
                        if (totalBytes) {
                            console.log(`Upload progress: ${Math.round((transferredBytes / totalBytes) * 100)} %`);
                        }
                    },
                },
            });

            setUploadSuccess(true);
            setError(null);
            console.log('Image uploaded successfully!');

            // Call the API after successful upload
            const apiResponse = await checkRecyclability(fileName);
            setResponseMessage(apiResponse.message); // Display Lambda response message
            setSelectedImage(null); // Clear the selected image after upload
        } catch (err) {
            console.error("Error uploading file: ", err);
            setError("Failed to upload image. Please try again.");
            setUploadSuccess(false);
        }
    };

    // Function to call the API and check recyclability
    const checkRecyclability = async (fileName) => {
        const apiName = 'wastemanagementapiyoutube'; // API name from Amplify config
        const path = '/post'; // API Gateway resource path


        const init = {
            body: {
                fileName: fileName // Send the file name to the Lambda function
            },
            headers: {
                "Content-Type": "application/json",
            },
        };

        try {
            const response = await post(apiName, path, init);
            console.log('API Response:', response); // Debugging
            return response; // Return the response for further use
        } catch (error) {
            console.error("Error calling API:", error);
            return { message: "Error checking recyclability." }; // Default error message
        }
    };

    return (
        <div className="waste-manager">
            <h2>Upload Your Waste Item</h2>
            <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                className="file-input"
            />
            {selectedImage && (
                <div className="image-preview">
                    <img src={URL.createObjectURL(selectedImage)} alt="Preview" className="image-thumbnail" />
                    <button onClick={handleUpload} className="upload-button">
                        Upload Image
                    </button>
                </div>
            )}
            {uploadSuccess && (
                <div className="success-message">
                    Image uploaded successfully!
                </div>
            )}
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}
            {responseMessage && (
                <div className="response-message">
                    {responseMessage}
                </div>
            )}
        </div>
    );
}

export default WasteManager;
