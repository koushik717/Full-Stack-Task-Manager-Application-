import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/api/tasks')
      .then(response => setTasks(response.data))
      .catch(error => console.error(error));
  }, []);

  const addTask = () => {
    axios.post('http://localhost:5000/api/tasks', { title, description, completed })
      .then(response => {
        setTasks([...tasks, response.data]);
        setTitle('');
        setDescription('');
        setCompleted(false);
      })
      .catch(error => console.error(error));
  };

  const deleteTask = (id) => {
    axios.delete(`http://localhost:5000/api/tasks/${id}`)
      .then(() => setTasks(tasks.filter(task => task._id !== id)))
      .catch(error => console.error(error));
  };

  const updateTask = (id, updates) => {
    axios.patch(`http://localhost:5000/api/tasks/${id}`, updates)
      .then(response => {
        setTasks(tasks.map(task => (task._id === id ? response.data : task)));
      })
      .catch(error => console.error(error));
  };

  return (
    <div className="App">
      <h1>Task Manager</h1>
      <div>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="Title"
        />
        <input 
          type="text" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="Description"
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <ul>
        {tasks.map(task => (
          <li key={task._id}>
            <h2>{task.title}</h2>
            <p>{task.description}</p>
            <input 
              type="checkbox" 
              checked={task.completed} 
              onChange={() => updateTask(task._id, { completed: !task.completed })}
            />
            <button onClick={() => deleteTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
