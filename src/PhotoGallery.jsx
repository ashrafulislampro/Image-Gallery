import React from "react";
import galleryList from "./assets/utilies/data";

const PhotoGallery = () => {
  const [images, setImages] = React.useState(galleryList);
  const [selectedImages, setSelectedImages] = React.useState([]);
  const [draggedImage, setDraggedImage] = React.useState(null);
  const [prevDragIndex, setDragIndex] = React.useState(null);
  const [toggleIndex, setToggleIndex] = React.useState(null);
  const [fixedId, setFixedId] = React.useState(null);

  /*---------------------------------------------*/
  /*         HandleDragStart Functionality       */
  /*---------------------------------------------*/
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("text/plain", index);
    setDraggedImage(index);
    setDragIndex(index);
    setToggleIndex(true);
    setFixedId(index);
  };
  /*---------------------------------------------*/
  /*         HandleDragOver Functionality        */
  /*---------------------------------------------*/
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  /*---------------------------------------------*/
  /*           HandleDrop Functionality          */
  /*---------------------------------------------*/
  const handleDrop = (e, index) => {
    e.preventDefault();
    setToggleIndex(false);
    const newImages = [...images];

    if (draggedImage) {
      const droppedImage = newImages[draggedImage];
      newImages.splice(draggedImage, 1);
      newImages.splice(index, 0, droppedImage);
      setImages(newImages);
    } else {
      const droppedImage = newImages[fixedId];
      newImages.splice(fixedId, 1);
      newImages.splice(index, 0, droppedImage);
      setImages(newImages);
    }
    setDraggedImage(null);
  };

  /*---------------------------------------------*/
  /*           State Update Functionality        */
  /*---------------------------------------------*/
  React.useEffect(() => {
    if (!draggedImage) {
      if (draggedImage !== 0) {
        setTimeout(() => {
          setDragIndex(null);
        }, 500);
      }
      // else if(draggedImage === 0){
      //   setDraggedImage(null);
      // }
    } else if (draggedImage && toggleIndex) {
      setTimeout(() => {
        setDraggedImage(null);
      }, 500);
    }
  }, [draggedImage, toggleIndex]);

  /*---------------------------------------------*/
  /*             Checkbox Functionality          */
  /*---------------------------------------------*/
  const handleCheckboxChange = (id) => {
    if (selectedImages.includes(id)) {
      setSelectedImages(selectedImages.filter((imageId) => imageId !== id));
    } else {
      setSelectedImages([...selectedImages, id]);
    }
  };

  /*---------------------------------------------*/
  /*           Image Delete Functionality        */
  /*---------------------------------------------*/
  const handleDeleteSelected = () => {
    const newImages = images.filter(
      (image) => !selectedImages.includes(image.id)
    );
    setImages(newImages);
    setSelectedImages([]);
  };

  /*---------------------------------------------*/
  /*           Image Upload Functionality        */
  /*---------------------------------------------*/
  const handleImageUpload = (e) => {
    const files = e.target.files;
    const newImages = [...images];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const id = (newImages.length + 1).toString(); // Generate a unique ID for the new image
      const img = URL.createObjectURL(file);
      newImages.push({ id, img });
    }
    setImages(newImages);
  };

  return (
    <main className="container mx-auto mt-10">
      {/* Gallery Header */}
      <div className="mb-20">
        <h1 className="header-content">
          Executed Projects and <br /> Realized Impact
        </h1>
        <p className="header-description">
          Successful Completion of Task: Project Executed in Accordance with
          Requirements, Timelines, and Quality Parameters.{" "}
        </p>
      </div>

      {/*Gallery Container */}
      <div className="gallery-container">
        <div className="gallery-container-child">
          <div className="gallery-content-header">
            <div>
              {selectedImages.length > 0 ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedImages.length > 0 ? true : false}
                    className="checkbox"
                    onChange={() => setSelectedImages([])}
                  />
                  <p>{selectedImages.length} Files Selected</p>
                </div>
              ) : (
                <p>Photo Gallery</p>
              )}
            </div>
            <div>
              <button className="delete-btn" onClick={handleDeleteSelected}>
                Delete Files
              </button>
            </div>
          </div>

          <div className="divider"></div>

          <div className="gallery-content">
            {images.map((image, index) => (
              <div
                key={image?.id}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                draggable
                loading="lazy"
                className={`
              drag-and-drop-content group                
              ${index === 0 ? "feature-content" : ""}              
              ${
                handleDragStart && draggedImage === index
                  ? "drag-start"
                  : "animation"
              }
              ${
                handleDragOver && draggedImage === index
                  ? "drag-over"
                  : "animation"
              }
              ${
                handleDrop && draggedImage === index ? "drag-drop" : "animation"
              }
              ${
                draggedImage
                  ? ""
                  : !draggedImage && prevDragIndex === index
                  ? "drag-drop"
                  : "animation"
              }                      
               `}
              >
                <input
                  type="checkbox"
                  className="checkbox-style"
                  checked={selectedImages.includes(image?.id)}
                  onChange={() => handleCheckboxChange(image?.id)}
                />
                <img
                  className="image"
                  loading="lazy"
                  src={image?.img}
                  alt={`Image-${index + 1}`}
                />
                <div
                  loading="lazy"
                  className={`card-default-style ${
                    selectedImages.includes(image?.id) ? "card-active" : ""
                  }`}
                ></div>
              </div>
            ))}

            <label className="image-upload-btn">
              <svg
                className="w-8 h-8"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
              </svg>
              <span className="mt-2 text-base leading-normal">Add Image</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PhotoGallery;