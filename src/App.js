import logo from './logo.svg';
import Rectangle from './images/Rectangle-1.png';
import Export from './images/Export.png';
import image1_no_bg from './images/image-1-no-bg.png';
import image7 from './images/image7.png';
import image8 from './images/image8.png';
import image9 from './images/image9.png';
import search from './images/mdi_search.svg';
import vector from './images/Vector.svg';

import Webcam from 'react-webcam';

// import image8 from './images/image8.png';
import React, { useState, useRef } from 'react';

import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [medicineDetails, setMedicineDetails] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLiveCapture, setIsLiveCapture] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  const videoRef = useRef(null);
  const formData = new FormData();
formData.append('file', selectedFile); // 'selectedFile' is the File object

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUploadType = (type) => {
    setIsLiveCapture(type === 'liveCapture');
  };
  
  const handleTextSearch = async () => {
    try {
      const response = await fetch('http://localhost:5000/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchTerm }),
      });

      if (response.ok) {
        const data = await response.json();
        setMedicineDetails(data || []);
        setErrorMessage('');
      } else {
        setMedicineDetails([]);
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Failed to search medicine');
        alert("Details not found in the database.");
      }
    } catch (error) {
      console.error('Error occurred:', error);
      setMedicineDetails([]);
      setErrorMessage('Error occurred while searching');
      alert("Details not found in the database.");
    }
  };

  const handleImageSearch = async () => {
    try {
      let fileToSend = selectedFile;
  
      if (capturedImage) {
        fileToSend = capturedImage;
      }
  
      const formData = new FormData();
      formData.append('file', fileToSend);
  
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        const data = await response.json();
        setMedicineDetails(data || []);
        setErrorMessage('');
      } else {
        setMedicineDetails([]);
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Failed to search medicine');
        alert("Details not found in the database.");
      }
    } catch (error) {
      console.error('Error occurred:', error);
      setErrorMessage('Error occurred while uploading image');
      alert("Details not found in the database.");
    }
  };
  

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCapture = async () => {
    if (videoRef.current && videoRef.current.video) {
      const tracks = videoRef.current.video.srcObject.getTracks();
  
      if (tracks.length > 0) {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.video.videoWidth;
        canvas.height = videoRef.current.video.videoHeight;
        canvas.getContext('2d').drawImage(videoRef.current.video, 0, 0);
        canvas.toBlob(async (blob) => {
          const file = new File([blob], 'live_image.png', { type: 'image/png' });
          setCapturedImage(file);
          setSelectedFile(file);
          tracks.forEach((track) => track.stop());
          setIsLiveCapture(false);
  
          // Call function to search for details using the captured image
          await handleImageSearch();
        }, 'image/png');
      } else {
        console.error('No tracks available in the video source.');
      }
    } else {
      console.error('Video source object is null or empty.');
    }
  };
  const handleExit = () => {
    setIsLiveCapture(false);
  };

  return (
    <div className="landing-page">
    <div className="overlap-wrapper">
      <div className="overlap">
        <div className="overlap-group">
            <img className="rectangle" alt="Rectangle" src={Rectangle} />
            <p className="text-wrapper">Virtual Medical Advisor (AI Based)</p>
              <div className="search">
              
                  <div className='model'>
                  
      <input
        className='textbox'
        placeholder="Search Term"
        value={searchTerm}
        onChange={handleInputChange}
      />
      <button onClick={handleTextSearch}>Search Text</button>
      <input type="file" onChange={handleFileChange} />
        <button className='file' onClick={() => handleUploadType('file')}></button>
        <button onClick={() => handleUploadType('liveCapture')}>
          Live Capture
        </button>
        {isLiveCapture ? (
          <div className="camera-popup">
            <button className="exit-button" onClick={handleExit}>
              Exit
            </button>
            <Webcam
              audio={false}
              ref={(webcamRef) => {
                videoRef.current = webcamRef;
              }}
            />
            <button onClick={handleCapture}>Capture</button>
            
          </div>
        ) : (
          <button onClick={() => handleImageSearch('uploaded')}>
            Search Image
          </button>
        )}
        {medicineDetails.length > 0 && (
          <ul>
          {medicineDetails.map((detail, index) => (
            <li key={index}>
              <strong>Name:</strong> {detail.name}<br />
              <strong>Use:</strong> {detail.use}<br />
              <strong>Description:</strong> {detail.description}<br />
              <strong>Dosage:</strong> {detail.dosage}<br />
            </li>
          ))}
        </ul>
      )}
    </div>

                </div>
                
             
                  <div className="overlap-group-wrapper">
                     
                  </div>
                  
                  <p className="text-wrapper-2">Looking for medication details? Type the name or upload a picture.</p>
                  {/* <Export className="export-instance" /> */}
                  <img className="image-no-bg" alt="Image no bg" src={image1_no_bg} />
          </div>
          <img className="image" alt="Image" src={image7} />
          <img className="img" alt="Image" src={image8} />
          <img className="image-2" alt="Image" src={image9} />
            <div className="overlap-2">
              <div className="text-wrapper-3">Our Affiliations</div>
                  <div className="group">
                      <div className="rectangle-wrapper">
                          <img className="rectangle-2" alt="Rectangle" src="rectangle-36.svg" />
                      </div>
                    </div>
                </div>
            <div className="div-wrapper">
            <div className="overlap-3">
            <div className="rectangle-3" />
            <div className="rectangle-4" />
            <div className="element-medicines">
            200+
            <br />
            Medicines
  </div>
  <div className="element-doctors">
  10+
  <br />
  Doctors
  </div>
  <div className="element-companies">
  50+
  <br />
  Companies
  </div>
  </div>
  </div>
  </div>
  </div>
  </div>
  
    );
}
export default App;
// export LandingPage;
