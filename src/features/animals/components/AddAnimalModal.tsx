import React, { useEffect } from 'react';
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { X } from 'lucide-react';
import clsx from 'clsx';

// Zod Schema matching the CSV schema requirements
const animalSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  species: z.string().min(1, 'Species is required'),
  latin_name: z.string().default('unknown'),
  category: z.string().default('unknown'),
  gender: z.string().default('unknown'),
  location: z.string().default('unknown'),
  date_of_birth: z.string().default('1900-01-01'),
  is_dob_unknown: z.boolean().default(false),
  microchip_id: z.string().optional(),
  ring_number: z.string().optional(),
  hazard_rating: z.string().default('unknown'),
  is_venomous: z.boolean().default(false),
});

type AnimalFormData = z.infer<typeof animalSchema>;

interface AddAnimalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddAnimalModal({ isOpen, onClose }: AddAnimalModalProps) {
  const form = useForm({
    defaultValues: {
      name: '',
      species: '',
      latin_name: 'unknown',
      category: 'unknown',
      gender: 'unknown',
      location: 'unknown',
      date_of_birth: '1900-01-01',
      is_dob_unknown: false,
      microchip_id: '',
      ring_number: '',
      hazard_rating: 'unknown',
      is_venomous: false,
    },
    onSubmit: async ({ value }) => {
      try {
        const validated = animalSchema.parse(value);
        console.log('Valid Form Submitted:', validated);
        onClose();
        // Will wire up PGLite in Phase 4.3
      } catch (error) {
        console.error('Validation Error:', error);
      }
    },
  });

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col font-sans text-slate-300 overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center text-slate-950 font-bold italic">
              K
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 tracking-tight">Add Animal Record</h2>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold mt-0.5">Data Entry Architecture</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <form
            id="add-animal-form"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Left Column: Basic Information */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Basic Information</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <form.Field name="name">
                  {(field) => (
                    <div className="flex flex-col gap-1.5 col-span-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Name *</label>
                      <input
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="px-3 py-2 bg-slate-950 border border-slate-700 rounded text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                        placeholder="e.g., Azula"
                      />
                    </div>
                  )}
                </form.Field>

                <form.Field name="species">
                  {(field) => (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Species *</label>
                      <input
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="px-3 py-2 bg-slate-950 border border-slate-700 rounded text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                        placeholder="e.g., Snowy Owl"
                      />
                    </div>
                  )}
                </form.Field>

                <form.Field name="latin_name">
                  {(field) => (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Latin Name</label>
                      <input
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="px-3 py-2 bg-slate-950 border border-slate-700 rounded text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                        placeholder="Bubo scandiacus"
                      />
                    </div>
                  )}
                </form.Field>

                <form.Field name="category">
                  {(field) => (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Category</label>
                      <select
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="px-3 py-2 bg-slate-950 border border-slate-700 rounded text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                      >
                        <option value="unknown">Unknown</option>
                        <option value="Owls">Owls</option>
                        <option value="Raptors">Raptors</option>
                        <option value="Mammals">Mammals</option>
                        <option value="Exotics">Exotics</option>
                      </select>
                    </div>
                  )}
                </form.Field>

                <form.Field name="gender">
                  {(field) => (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gender</label>
                      <select
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="px-3 py-2 bg-slate-950 border border-slate-700 rounded text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                      >
                        <option value="unknown">Unknown</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                  )}
                </form.Field>

                <form.Field name="location">
                  {(field) => (
                    <div className="flex flex-col gap-1.5 col-span-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Location</label>
                      <input
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="px-3 py-2 bg-slate-950 border border-slate-700 rounded text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                        placeholder="e.g., Purple Aviary 3"
                      />
                    </div>
                  )}
                </form.Field>

                <form.Subscribe selector={(state) => state.values.is_dob_unknown}>
                  {(isDobUnknown) => (
                    <form.Field name="date_of_birth">
                      {(field) => (
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Date of Birth</label>
                          <input
                            type="date"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            disabled={isDobUnknown}
                            className="px-3 py-2 bg-slate-950 border border-slate-700 rounded text-sm text-slate-200 focus:outline-none focus:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                        </div>
                      )}
                    </form.Field>
                  )}
                </form.Subscribe>

                <form.Field name="is_dob_unknown">
                  {(field) => (
                    <div className="flex flex-col gap-1.5 justify-end pb-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={field.state.value}
                          onChange={(e) => field.handleChange(e.target.checked)}
                          className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900"
                        />
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">DOB Unknown</span>
                      </label>
                    </div>
                  )}
                </form.Field>
              </div>
            </div>

            {/* Right Column: Identification & Status */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Identification & Status</h3>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <form.Field name="microchip_id">
                  {(field) => (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Microchip ID</label>
                      <input
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="px-3 py-2 bg-slate-950 border border-slate-700 rounded text-sm text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                        placeholder="Optional"
                      />
                    </div>
                  )}
                </form.Field>

                <form.Field name="ring_number">
                  {(field) => (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ring Number</label>
                      <input
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="px-3 py-2 bg-slate-950 border border-slate-700 rounded text-sm text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                        placeholder="Optional"
                      />
                    </div>
                  )}
                </form.Field>
                
                <div className="h-px bg-slate-800 my-2"></div>

                <form.Field name="hazard_rating">
                  {(field) => (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hazard Rating</label>
                      <select
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="px-3 py-2 bg-slate-950 border border-slate-700 rounded text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                      >
                        <option value="none">None</option>
                        <option value="unknown">Unknown</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  )}
                </form.Field>

                <form.Field name="is_venomous">
                  {(field) => (
                    <div className="flex flex-col gap-1.5 mt-2">
                      <label className="flex items-center gap-2 cursor-pointer p-3 bg-slate-950/50 border border-slate-800 rounded-lg hover:border-slate-600 transition-colors">
                        <input
                          type="checkbox"
                          checked={field.state.value}
                          onChange={(e) => field.handleChange(e.target.checked)}
                          className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-rose-500 focus:ring-rose-500 focus:ring-offset-slate-900"
                        />
                        <div>
                          <span className="block text-xs font-bold text-slate-300 uppercase tracking-wider">Venomous Species</span>
                          <span className="block text-[10px] text-slate-500 mt-0.5">Flag this animal as requiring venomous handling protocols.</span>
                        </div>
                      </label>
                    </div>
                  )}
                </form.Field>
              </div>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold text-slate-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="add-animal-form"
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-sm font-bold rounded shadow-lg shadow-emerald-900/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            Add Animal Record
          </button>
        </div>
      </div>
    </div>
  );
}
