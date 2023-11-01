import React from "react";
import galleryList from "./data.js";
import "./style.css";

const App = () => {
  const [images, setImages] = React.useState(galleryList);

  const [selectedImages, setSelectedImages] = React.useState([]);
  const [draggedImage, setDraggedImage] = React.useState(null);

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("text/plain", index);
    setDraggedImage(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    const newImages = [...images];
    const droppedImage = newImages[draggedImage];
    newImages.splice(draggedImage, 1);
    newImages.splice(index, 0, droppedImage);
    setImages(newImages);
    setDraggedImage(null);
  };

  const handleCheckboxChange = (id) => {
    if (selectedImages.includes(id)) {
      setSelectedImages(selectedImages.filter((imageId) => imageId !== id));
    } else {
      setSelectedImages([...selectedImages, id]);
    }
  };

  const handleDeleteSelected = () => {
    const newImages = images.filter(
      (image) => !selectedImages.includes(image.id)
    );
    setImages(newImages);
    setSelectedImages([]);
  };

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
    <main className="container mx-auto">
      <div className="h-full lg:h-[100vh] flex items-center">
      <div className="w-full lg:w-[70rem] m-auto bg-gray-200 p-10  rounded-lg ">
      
        <div className="flex justify-between pb-2">
          <div>
            {selectedImages.length > 0 ? (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedImages.length > 0 ? true : false}
                  className="w-[16px] h-[16px] mt-0.5 cursor-pointer"
                  onChange={() => setSelectedImages([])}
                />
                <p>{selectedImages.length} Files Selected</p>
              </div>
            ) : (
              <p>Image Gallery</p>
            )}
          </div>
          <div>
            <button className="text-red-500" onClick={handleDeleteSelected}>
              Delete Files
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {images.map((image, index) => (
            <div              
              key={image.id}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              draggable
              className={`${index === 0 ? 'col-span-1 md:col-span-2 lg:col-span-2 row-span-1 md:row-span-2 lg:row-span-2' : ''} bg-[#f0f7f4] shadow-lg rounded-lg relative group`}
             
            >
              
              <input
                type="checkbox"
                className="absolute left-5 top-5 w-[16px] h-[16px] z-50 cursor-pointer"
                checked={selectedImages.includes(image.id)}
                onChange={() => handleCheckboxChange(image.id)}
              />
              <img
                className="w-full h-full object-cover rounded-lg"
                src={image.img}
                alt={`Image ${index}`}
              />
              <div
                className={`${
                  selectedImages.includes(image.id)
                    ? "bg-red-400 opacity-50 visible"
                    : ""
                } bg-gray-600 opacity-0 group-hover:opacity-50 absolute inset-0 transition-all duration-500 rounded-lg z-10`}
              ></div>
            </div>
          ))}
          <label className="w-full h-full min-h-[10rem] flex flex-col justify-center items-center px-4 py-6 bg-white text-blue rounded-lg tracking-wide border border-blue cursor-pointer hover:bg-gray-400 shadow-lg transition-all duration-500">
            <svg className="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
            </svg>
            <span className="mt-2 text-base leading-normal">Add Images</span>
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

export default App;
