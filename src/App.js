import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FaTrash, FaEdit, FaTrello, FaEllipsisH } from 'react-icons/fa';


import './App.css';

const initialData = {
  lanes: {
    'lane1': {
      title: 'To do',
      items: [
        { id: '1', content: 'Task 1' }  
        
      ]
    },
    'lane2': {
      title: 'In Progress',
      items: [
        { id: '2', content: 'Task 2' }
      ]
    },
    'lane3': {
      title: 'Completed',
      items: [
        { id: '3', content: 'Task 3' }
      ]
    }
  },
  laneOrder: ['lane1', 'lane2', 'lane3']
};

const App = () => {
  const [data, setData] = useState(initialData);
  const [newTaskContent, setNewTaskContent] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskContent, setEditTaskContent] = useState('');

  const handleDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceLane = data.lanes[source.droppableId];
    const destinationLane = data.lanes[destination.droppableId];
    const draggedItem = sourceLane.items[source.index];

    sourceLane.items.splice(source.index, 1);
    destinationLane.items.splice(destination.index, 0, draggedItem);

    setData((prevState) => ({
      ...prevState,
      lanes: {
        ...prevState.lanes,
        [sourceLane.title]: sourceLane,
        [destinationLane.title]: destinationLane
      }
    }));
  };

  const handleTaskInputChange = (e) => {
    setNewTaskContent(e.target.value);
  };

  const handleAddTask = (laneId) => {
    const lane = data.lanes[laneId];
    const newTask = {
      id: Date.now().toString(),
      content: newTaskContent.trim()
    };

    if (newTask.content !== '') {
      lane.items.push(newTask);
      setData((prevState) => ({
        ...prevState,
        lanes: {
          ...prevState.lanes,
          [lane.title]: lane
        }
      }));
      setNewTaskContent('');
    }
  };

  const handleDeleteTask = (laneId, taskId) => {
    if (editTaskId === taskId) {
      setEditTaskId(null);
      setEditTaskContent('');
    }

    const lane = data.lanes[laneId];
    const updatedItems = lane.items.filter((item) => item.id !== taskId);
    lane.items = updatedItems;
    setData((prevState) => ({
      ...prevState,
      lanes: {
        ...prevState.lanes,
        [lane.title]: lane
      }
    }));
  };

  const handleEditTask = (taskId, content) => {
    setEditTaskId(taskId);
    setEditTaskContent(content);
  };

  const handleUpdateTask = (laneId, taskId) => {
    const lane = data.lanes[laneId];
    const updatedItems = lane.items.map((item) => {
      if (item.id === taskId) {
        return {
          ...item,
          content: editTaskContent.trim()
        };
      }
      return item;
    });
    lane.items = updatedItems;
    setData((prevState) => ({
      ...prevState,
      lanes: {
        ...prevState.lanes,
        [lane.title]: lane
      }
    }));
    setEditTaskId(null);
    setEditTaskContent('');
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className='head'>
      <FaTrello className="trello-icon"/>
      <h1 className='heading'>Trello Board</h1>
      </div>
      <div className="board">
        {data.laneOrder.map((laneId) => {
          const lane = data.lanes[laneId];
          return (
            <div key={laneId} className="lane">
              <div className='lane-content'>
              <h3>{lane.title}</h3>
              <FaEllipsisH className='dots'/>

              </div>
              <Droppable droppableId={laneId}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="card-list"
                  >
                    {lane.items.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="card"
                          >
                            {editTaskId === item.id ? (
                              <input
                                type="text"
                                value={editTaskContent}
                                onChange={(e) => setEditTaskContent(e.target.value)}
                                onBlur={() => handleUpdateTask(laneId, item.id)}
                                autoFocus
                              />
                            ) : (
                              <div className="task-content">
                                <div className='task-content-task'>
                                {item.content}
                                  </div>
                                  <div className='task-content-icons'>

                                <FaEdit
                                  className="edit-icon"
                                  onClick={() => handleEditTask(item.id, item.content)}
                                />
                                <FaTrash
                                  className="delete-icon"
                                  onClick={() => handleDeleteTask(laneId, item.id)}
                                />
                                  </div>
                              
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <div className="add-task-container">
                <input
                  type="text"
                  placeholder="Enter task"
                  value={newTaskContent}
                  onChange={handleTaskInputChange}
                />
                <button onClick={() => handleAddTask(laneId)}><span>&#43;</span>Add a Task</button>
              </div>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default App;
