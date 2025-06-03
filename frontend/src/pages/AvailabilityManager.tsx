import { useState, useEffect } from 'react';
import { availabilityApi, roomsApi } from '../services/api';
import type { Room, Availability } from '../types/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AvailabilityManager() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<number | ''>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError('');

    const [roomsResponse, availabilitiesResponse] = await Promise.all([
      roomsApi.getRooms(),
      availabilityApi.getAvailabilities(),
    ]);

    if (roomsResponse.error) {
      setError(roomsResponse.error.message);
    } else if (roomsResponse.data) {
      setRooms(roomsResponse.data);
    }

    if (availabilitiesResponse.error) {
      setError(availabilitiesResponse.error.message);
    } else if (availabilitiesResponse.data) {
      setAvailabilities(availabilitiesResponse.data);
    }

    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom) return;

    setIsLoading(true);
    setError('');

    const response = await availabilityApi.createAvailability({
      roomId: selectedRoom,
      startDate,
      endDate,
      status: 'available',
    });

    if (response.error) {
      setError(response.error.message);
    } else {
      setStartDate('');
      setEndDate('');
      loadData();
    }

    setIsLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this availability?')) return;

    setIsLoading(true);
    setError('');

    const response = await availabilityApi.deleteAvailability(id);
    if (response.error) {
      setError(response.error.message);
    } else {
      loadData();
    }

    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Add Availability</h3>
            <p className="mt-1 text-sm text-gray-500">
              Add available dates for your rooms.
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
                  <label htmlFor="room" className="block text-sm font-medium text-gray-700">
                    Room
                  </label>
                  <select
                    id="room"
                    name="room"
                    value={selectedRoom}
                    onChange={(e) => setSelectedRoom(Number(e.target.value))}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  >
                    <option value="">Select a room</option>
                    {rooms.map((room) => (
                      <option key={room.id} value={room.id}>
                        {room.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <LoadingSpinner />
                      <span className="ml-2">Adding...</span>
                    </div>
                  ) : (
                    'Add Availability'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Current Availabilities</h3>
          <div className="mt-4">
            {isLoading ? (
              <div className="py-8">
                <LoadingSpinner />
              </div>
            ) : availabilities.length === 0 ? (
              <p className="text-gray-500">No availabilities added yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Room
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Start Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        End Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {availabilities.map((availability) => (
                      <tr key={availability.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {availability.room.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(availability.startDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(availability.endDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              availability.status === 'available'
                                ? 'bg-green-100 text-green-800'
                                : availability.status === 'booked'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {availability.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleDelete(availability.id)}
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