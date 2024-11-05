// WasteManager.js
import React, { useState } from 'react';
import { uploadData } from 'aws-amplify/storage';
import { withAuthenticator } from '@aws-amplify/ui-react';
import './WasteManager.css';
import axios from 'axios';

function WasteManager({ user }) {
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
        if (!selectedImage) return;

        const fileName = `${Date.now()}_${selectedImage.name}`;

        try {
            await uploadData({
                path: fileName,
                data: selectedImage,
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

            const apiResponse = await checkRecyclability(fileName);
            if (apiResponse) {
                setResponseMessage(`Recyclability: ${apiResponse.RecyclabilityStatement}`);
            } else {
                setResponseMessage("Could not determine recyclability.");
            }

            setSelectedImage(null);
        } catch (err) {
            console.error("Error uploading file: ", err);
            setError("Failed to upload image. Please try again.");
            setUploadSuccess(false);
        }
    };

    const checkRecyclability = async (fileName) => {
        const apiUrl = 'https://gy9oxroiz7.execute-api.eu-west-2.amazonaws.com/main/waste';

        const data = {
            fileName: fileName,
        };

        try {
            const response = await axios.post(apiUrl, data, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            console.log('API Response:', response.data);
            return response.data;
        } catch (error) {
            console.error("Error calling API:", error);
            setResponseMessage("Error contacting the API.");
            return null;
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
                    <div className="image-container">
                        <img src={URL.createObjectURL(selectedImage)} alt="Preview" className="image-thumbnail" />
                    </div>
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

export default withAuthenticator(WasteManager);
