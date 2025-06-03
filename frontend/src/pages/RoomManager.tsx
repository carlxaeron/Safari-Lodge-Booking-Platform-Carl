import { useState, useEffect } from 'react';
import { roomsApi } from '../services/api';
import type { Room, ValidationError } from '../types/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function RoomManager() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<Partial<Room>>({
    name: '',
    capacity: 0,
    type: '',
    description: '',
  });

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    setIsLoading(true);
    setError('');
    setValidationErrors({});

    const response = await roomsApi.getRooms();
    if (response.error) {
      setError(response.error.message);
    } else if (response.data) {
      setRooms(response.data);
    }

    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setValidationErrors({});

    // Prepare and trim payload
    const payload = {
      name: currentRoom.name?.trim() || '',
      capacity: Number(currentRoom.capacity),
      type: currentRoom.type?.trim() || '',
      description: currentRoom.description?.trim() || '',
    };
    console.log('Submitting room payload:', payload);

    try {
      if (isEditing && currentRoom.id) {
        const response = await roomsApi.updateRoom(currentRoom.id, payload);
        if (response.error) {
          handleError(response.error);
        }
      } else {
        const response = await roomsApi.createRoom(payload);
        if (response.error) {
          handleError(response.error);
        }
      }

      if (Object.keys(validationErrors).length === 0) {
        setCurrentRoom({
          name: '',
          capacity: 0,
          type: '',
          description: '',
        });
        setIsEditing(false);
        loadRooms();
      }
    } catch {
      setError('An unexpected error occurred');
    }

    setIsLoading(false);
  };

  const handleError = (error: { message: string; errors?: ValidationError[] }) => {
    setError(error.message);
    
    if (error.errors) {
      const newValidationErrors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const field = err.path[0];
        newValidationErrors[field] = err.message;
      });
      setValidationErrors(newValidationErrors);
    }
  };

  const handleEdit = (room: Room) => {
    setCurrentRoom(room);
    setIsEditing(true);
    setValidationErrors({});
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this room?')) return;

    setIsLoading(true);
    setError('');
    setValidationErrors({});

    const response = await roomsApi.deleteRoom(id);
    if (response.error) {
      handleError(response.error);
    } else {
      loadRooms();
    }

    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {isEditing ? 'Edit Room' : 'Add New Room'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {isEditing ? 'Update room details.' : 'Add a new room to your lodge.'}
            </p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Room Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={currentRoom.name}
                    onChange={(e) => setCurrentRoom({ ...currentRoom, name: e.target.value })}
                    className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                      validationErrors.name ? 'border-red-300' : ''
                    }`}
                    required
                  />
                  {validationErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
                  )}
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                    Capacity
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    id="capacity"
                    min="1"
                    value={currentRoom.capacity}
                    onChange={(e) => setCurrentRoom({ ...currentRoom, capacity: Number(e.target.value) })}
                    className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                      validationErrors.capacity ? 'border-red-300' : ''
                    }`}
                    required
                  />
                  {validationErrors.capacity && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.capacity}</p>
                  )}
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                    Room Type
                  </label>
                  <input
                    type="text"
                    name="type"
                    id="type"
                    value={currentRoom.type}
                    onChange={(e) => setCurrentRoom({ ...currentRoom, type: e.target.value })}
                    className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                      validationErrors.type ? 'border-red-300' : ''
                    }`}
                    required
                  />
                  {validationErrors.type && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.type}</p>
                  )}
                </div>

                <div className="col-span-6">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={currentRoom.description}
                    onChange={(e) => setCurrentRoom({ ...currentRoom, description: e.target.value })}
                    className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                      validationErrors.description ? 'border-red-300' : ''
                    }`}
                  />
                  {validationErrors.description && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
                  )}
                </div>
              </div>
              <div className="mt-6 flex space-x-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <LoadingSpinner />
                      <span className="ml-2">Saving...</span>
                    </div>
                  ) : isEditing ? (
                    'Update Room'
                  ) : (
                    'Add Room'
                  )}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setCurrentRoom({
                        name: '',
                        capacity: 0,
                        type: '',
                        description: '',
                      });
                      setValidationErrors({});
                    }}
                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Rooms</h3>
          <div className="mt-4">
            {isLoading ? (
              <div className="py-8">
                <LoadingSpinner />
              </div>
            ) : rooms.length === 0 ? (
              <p className="text-gray-500">No rooms added yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Capacity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {rooms.map((room) => (
                      <tr key={room.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {room.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {room.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {room.capacity}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {room.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEdit(room)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(room.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 