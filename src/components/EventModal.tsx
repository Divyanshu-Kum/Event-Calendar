import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Tag, Repeat, Trash2 } from 'lucide-react';
import { CalendarEvent, EventFormData, EventColor, EventCategory, RecurrenceType } from '../types/calendar';
import { formatDate, formatTime } from '../utils/dateUtils';

interface EventModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  event?: CalendarEvent;
  selectedDate?: Date;
  onClose: () => void;
  onSubmit: (formData: EventFormData) => void;
  onDelete?: (eventId: string) => void;
}

const initialFormData: EventFormData = {
  title: '',
  description: '',
  startDate: '',
  startTime: '09:00',
  endDate: '',
  endTime: '10:00',
  color: 'blue',
  category: 'other',
  isRecurring: false,
  recurrence: {
    type: 'daily',
    interval: 1,
    daysOfWeek: [],
  },
};

const colorOptions: { value: EventColor; label: string; class: string }[] = [
  { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
  { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
  { value: 'emerald', label: 'Emerald', class: 'bg-emerald-500' },
  { value: 'orange', label: 'Orange', class: 'bg-orange-500' },
  { value: 'red', label: 'Red', class: 'bg-red-500' },
  { value: 'yellow', label: 'Yellow', class: 'bg-yellow-500' },
  { value: 'pink', label: 'Pink', class: 'bg-pink-500' },
  { value: 'indigo', label: 'Indigo', class: 'bg-indigo-500' },
];

const categoryOptions: { value: EventCategory; label: string }[] = [
  { value: 'work', label: 'Work' },
  { value: 'personal', label: 'Personal' },
  { value: 'health', label: 'Health' },
  { value: 'social', label: 'Social' },
  { value: 'education', label: 'Education' },
  { value: 'family', label: 'Family' },
  { value: 'travel', label: 'Travel' },
  { value: 'other', label: 'Other' },
];

const recurrenceOptions: { value: RecurrenceType; label: string }[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'custom', label: 'Custom' },
];

const daysOfWeek = [
  { value: 0, label: 'Sun' },
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
];

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  mode,
  event,
  selectedDate,
  onClose,
  onSubmit,
  onDelete,
}) => {
  const [formData, setFormData] = useState<EventFormData>(initialFormData);

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && event) {
        setFormData({
          title: event.title,
          description: event.description || '',
          startDate: formatDate(event.startDate),
          startTime: formatTime(event.startDate),
          endDate: formatDate(event.endDate),
          endTime: formatTime(event.endDate),
          color: event.color,
          category: event.category,
          isRecurring: event.isRecurring,
          recurrence: event.recurrence || initialFormData.recurrence,
        });
      } else if (mode === 'create' && selectedDate) {
        const defaultEndDate = new Date(selectedDate);
        defaultEndDate.setHours(defaultEndDate.getHours() + 1);
        
        setFormData({
          ...initialFormData,
          startDate: formatDate(selectedDate),
          endDate: formatDate(selectedDate),
        });
      }
    }
  }, [isOpen, mode, event, selectedDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleDelete = () => {
    if (event && onDelete) {
      onDelete(event.id);
    }
  };

  const updateFormData = (updates: Partial<EventFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const toggleRecurrenceDayOfWeek = (day: number) => {
    const currentDays = formData.recurrence?.daysOfWeek || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];
    
    updateFormData({
      recurrence: {
        ...formData.recurrence,
        daysOfWeek: newDays,
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {mode === 'create' ? 'Create Event' : 'Edit Event'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => updateFormData({ title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter event title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => updateFormData({ description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter event description"
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} className="inline mr-1" />
                Start Date *
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => updateFormData({ startDate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock size={16} className="inline mr-1" />
                Start Time *
              </label>
              <input
                type="time"
                required
                value={formData.startTime}
                onChange={(e) => updateFormData({ startTime: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date *
              </label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => updateFormData({ endDate: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time *
              </label>
              <input
                type="time"
                required
                value={formData.endTime}
                onChange={(e) => updateFormData({ endTime: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Color and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <div className="grid grid-cols-4 gap-2">
                {colorOptions.map(color => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => updateFormData({ color: color.value })}
                    className={`
                      h-10 rounded-lg border-2 transition-all
                      ${color.class}
                      ${formData.color === color.value ? 'border-gray-800 scale-110' : 'border-transparent'}
                    `}
                    title={color.label}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag size={16} className="inline mr-1" />
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => updateFormData({ category: e.target.value as EventCategory })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categoryOptions.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Recurrence */}
          <div>
            <label className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={formData.isRecurring}
                onChange={(e) => updateFormData({ isRecurring: e.target.checked })}
                className="rounded"
              />
              <Repeat size={16} />
              <span className="text-sm font-medium text-gray-700">Recurring Event</span>
            </label>

            {formData.isRecurring && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Repeat
                  </label>
                  <select
                    value={formData.recurrence?.type}
                    onChange={(e) => updateFormData({
                      recurrence: {
                        ...formData.recurrence,
                        type: e.target.value as RecurrenceType,
                      },
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {recurrenceOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Every
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={formData.recurrence?.interval || 1}
                    onChange={(e) => updateFormData({
                      recurrence: {
                        ...formData.recurrence,
                        interval: parseInt(e.target.value),
                      },
                    })}
                    className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    {formData.recurrence?.type}(s)
                  </span>
                </div>

                {formData.recurrence?.type === 'weekly' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      On these days
                    </label>
                    <div className="flex gap-2">
                      {daysOfWeek.map(day => (
                        <button
                          key={day.value}
                          type="button"
                          onClick={() => toggleRecurrenceDayOfWeek(day.value)}
                          className={`
                            px-3 py-2 text-sm rounded-lg border transition-colors
                            ${formData.recurrence?.daysOfWeek?.includes(day.value)
                              ? 'bg-blue-500 text-white border-blue-500'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }
                          `}
                        >
                          {day.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-6">
            <div>
              {mode === 'edit' && onDelete && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                  Delete Event
                </button>
              )}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {mode === 'create' ? 'Create Event' : 'Update Event'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};