import React, { useState } from "react";
import "./Add.css";
import { assets, url } from "../../assets/assets";  // ✅ fixed
import axios from "axios";
import { toast } from "react-toastify";

const Add = () => {
  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Salad",
  });

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!image) return toast("Please upload an image");
    if (!data.name || !data.description || !data.price) {
      return alert("Please fill all the fields");
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("image", image);

    const response = await axios.post(`${url}/api/food/add`, formData);
    if (response.data.success) {
      setData({ name: "", description: "", price: "", category: "Salad" });
      setImage(false);
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
    }
  };

  return (
    <div className="add">
      {/* ... rest remains the same ... */}
    </div>
  );
};

export default Add;
