import React, { useState } from 'react';
import axios from 'axios';

let API_KEY="c2825112ad30c36a123f38b1307cba69"
let API_TOKEN="2843c1cfb91be5ac03e089d3650a38de4f4ea5206098a71a0434e8a43c105e50"

const Api_Trello_Form = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dueDate: '',
    startDate: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     
      const response = await axios.post(`https://api.trello.com/1/cards?key=${API_KEY}&token=${API_TOKEN}`, {
        name: formData.name,
        desc: formData.description,
        due: formData.dueDate,
        idList: 'ghg' //name of my card in trello
      });
      console.log(response.data);
    
      setFormData({
        name: '',
        description: '',
        dueDate: '',
        startDate: ''
      });
    } catch (error) {
      console.error('Error creating Trello card:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} />
      </div>
      <div>
        <label>Description:</label>
        <textarea name="description" value={formData.description} onChange={handleChange} />
      </div>
      <div>
        <label>Due Date:</label>
        <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} />
      </div>
      <div>
        <label>Start Date:</label>
        <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default Api_Trello_Form;
